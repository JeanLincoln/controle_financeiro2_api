#!/usr/bin/env bash

set -Eeuo pipefail

# shellcheck source=ops/deploy/lib/common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/lib/common.sh"

CANDIDATE=""
ARTIFACT_DIR=""

validate_artifact_bucket_file() {
  local FILE_MODE

  is_regular_file "$ARTIFACT_BUCKET_FILE" ||
    fail "Configuração do bucket ausente ou inválida."

  is_owned_by_root "$ARTIFACT_BUCKET_FILE" ||
    fail "Configuração do bucket não pertence ao root."

  FILE_MODE="$(stat -c '%a' -- "$ARTIFACT_BUCKET_FILE")"

  (( (8#$FILE_MODE & 022) == 0 )) ||
    fail "Configuração do bucket permite escrita a terceiros."

  ARTIFACT_BUCKET="$(< "$ARTIFACT_BUCKET_FILE")"

  [[ "$ARTIFACT_BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] ||
    fail "Nome do bucket inválido."
}

validate_staging_and_release() {
  is_real_directory "$SOURCE" ||
    fail "Staging não encontrado ou inválido."

  is_path_available "$DESTINATION" ||
    fail "Release já existe."

  is_root_controlled_directory "$RELEASES_ROOT" ||
    fail "Diretório releases possui propriedade ou permissões inseguras."
}

validate_staging_inputs() {
  is_regular_file "$SOURCE/package.json" ||
    fail "package.json ausente ou inválido no staging."

  is_regular_file "$SOURCE/pnpm-lock.yaml" ||
    fail "pnpm-lock.yaml ausente ou inválido no staging."

  is_real_directory "$SOURCE/node_modules" ||
    fail "node_modules ausente ou inválido no staging."
}

get_actual_sha() {
  local sha

  sha="$(
    runuser -u controle-deploy -- \
      git -C "$SOURCE" rev-parse HEAD
  )" || fail "Falha ao executar o Git."

  [[ -n "$sha" ]] ||
    fail "O Git retornou um SHA vazio."

  printf '%s\n' "$sha"
}

validate_staging_sha(){
  [[ "$ACTUAL_SHA" == "$DEPLOY_SHA" ]] ||
    fail "O staging não corresponde ao SHA solicitado."
}

validate_directory_entry_types() {
  local directory="$1"
  local unexpected_file

  unexpected_file="$(
    find "$directory" \
      ! -type f \
      ! -type d \
      ! -type l \
      -print -quit
  )" || fail "Falha ao inspecionar: $directory"

  [[ -z "$unexpected_file" ]] ||
    fail "Tipo de arquivo não permitido: $unexpected_file"
}

lock_publication() {
  local lock_file="$DEPLOY_ROOT/.publish.lock"

  command -v flock >/dev/null ||
    fail "flock não está disponível."

  is_root_controlled_directory "$DEPLOY_ROOT" ||
    fail "Diretório de deploy possui permissões inseguras."

  [[ ! -L "$lock_file" ]] ||
    fail "Arquivo de lock não pode ser um symlink."

  if [[ -e "$lock_file" ]]; then
    is_regular_file "$lock_file" ||
      fail "Arquivo de lock inválido."

    is_owned_by_root "$lock_file" ||
      fail "Arquivo de lock não pertence ao root."
  fi

  exec 9>"$lock_file" ||
    fail "Não foi possível abrir o arquivo de lock."

  flock -n 9 ||
    fail "Outra publicação está em andamento."
}

cleanup_candidate() {
  if [[ -n "${CANDIDATE:-}" && -d "$CANDIDATE" ]]; then
    rm -rf -- "$CANDIDATE"
  fi
}

cleanup_artifact_dir() {
  [[ -n "${ARTIFACT_DIR:-}" ]] || return 0

  case "$ARTIFACT_DIR" in
    /var/tmp/cf-artifact.??????)
      runuser -u controle-deploy -- \
        rm -rf -- "$ARTIFACT_DIR"
      ;;
    *)
      echo "AVISO: caminho temporário inesperado: $ARTIFACT_DIR" >&2
      return 1
      ;;
  esac
}

cleanup_on_exit() {
  local original_status="$?"

  trap - EXIT

  cleanup_artifact_dir ||
    echo "AVISO: falha ao limpar artifact temporário." >&2

  cleanup_candidate ||
    echo "AVISO: falha ao limpar release temporária." >&2

  exit "$original_status"
}

handle_temporary_incoming_release(){
  umask 077

  CANDIDATE="$(
    mktemp -d "$RELEASES_ROOT/.incoming-${DEPLOY_SHA}.XXXXXX"
  )"
}

validate_staging_tracked_changes(){
  TRACKED_CHANGES="$(
    runuser -u controle-deploy -- \
      git -C "$SOURCE" status --porcelain=v1 --untracked-files=no
  )" || fail "Não foi possível verificar o staging."

  [[ -z "$TRACKED_CHANGES" ]] ||
    fail "Staging possui alterações em arquivos rastreados."
}

copy_production_files() {
  log "Copiando arquivos de produção"

  cp -a --no-preserve=ownership --reflink=never -- \
    "$SOURCE/node_modules" \
    "$SOURCE/package.json" \
    "$SOURCE/pnpm-lock.yaml" \
    "$CANDIDATE/" ||
    fail "Não foi possível copiar os arquivos de produção."
}

validate_copied_git_files() {
  local tracked
  local copied_file
  local expected_file

  for tracked in package.json pnpm-lock.yaml; do
    copied_file="$CANDIDATE/$tracked"
    expected_file="$CANDIDATE/.expected-$tracked"

    is_regular_file "$copied_file" ||
      fail "Arquivo copiado inválido: $tracked"

    runuser -u controle-deploy -- \
      git -C "$SOURCE" show "${DEPLOY_SHA}:${tracked}" \
      > "$expected_file" ||
      fail "Não foi possível obter $tracked do commit."

    cmp -s -- "$expected_file" "$copied_file" ||
      fail "$tracked não corresponde ao commit solicitado."

    rm -f -- "$expected_file"
  done

  log "package.json e pnpm-lock.yaml correspondem ao commit."
}

download_s3_artifacts() {
  log "Baixando artifact do S3"

  ARTIFACT_DIR="$(
    runuser -u controle-deploy -- \
      mktemp -d /var/tmp/cf-artifact.XXXXXX
  )" || fail "Não foi possível criar o diretório temporário."

  for file in dist.tar.gz dist.tar.gz.sha256; do
    runuser -u controle-deploy -- \
      aws s3 cp \
        "s3://${ARTIFACT_BUCKET}/backend/releases/${DEPLOY_SHA}/${file}" \
        "$ARTIFACT_DIR/$file" \
        --region "$AWS_REGION" \
        --only-show-errors ||
      fail "Falha no download: $file"
  done

  runuser -u controle-deploy -- \
    bash -c '
      cd "$1" || exit 1
      sha256sum -c dist.tar.gz.sha256
    ' _ "$ARTIFACT_DIR" ||
    fail "Artifact não passou na verificação SHA-256."

  log "Artifact baixado e verificado."
}

validate_artifact_archive() {
  local archive="$ARTIFACT_DIR/dist.tar.gz"

  log "Validando os caminhos do artifact"

  tar -tzf "$archive" |
    awk '
      $0 !~ /^\.\// || $0 ~ /(^|\/)\.\.(\/|$)/ {
        print "Caminho inesperado: " $0 > "/dev/stderr"
        invalid = 1
      }

      END {
        exit invalid
      }
    ' || fail "O artifact contém caminhos inválidos."

  log "Validando os tipos de arquivo do artifact"

  tar -tvzf "$archive" |
    awk '
      {
        type = substr($1, 1, 1)

        if (type != "-" && type != "d") {
          print "Entrada inesperada: " $0 > "/dev/stderr"
          invalid = 1
        }
      }

      END {
        exit invalid
      }
    ' || fail "O artifact contém tipos de arquivo não permitidos."

  log "Estrutura do artifact validada."
}

extract_compiled_javascript() {
  local extracted_dist="$ARTIFACT_DIR/dist"

  log "Extraindo JavaScript compilado como controle-deploy"

  runuser -u controle-deploy -- \
    mkdir -m 700 -- "$extracted_dist" ||
    fail "Não foi possível criar o diretório de extração."

  runuser -u controle-deploy -- \
    tar -xzf "$ARTIFACT_DIR/dist.tar.gz" \
      -C "$extracted_dist" \
      --no-same-owner \
      --no-same-permissions ||
    fail "Falha ao extrair o artifact."

  runuser -u controle-deploy -- \
    test -s "$extracted_dist/src/infra/config/main.js" ||
    fail "Entrypoint compilado não encontrado."

  runuser -u controle-deploy -- \
    test -s "$extracted_dist/typeorm/data-source.js" ||
    fail "DataSource compilado não encontrado."

  log "JavaScript compilado extraído com sucesso."
}

promote_compiled_dist() {
  local source_dist="$ARTIFACT_DIR/dist"
  local target_dist="$CANDIDATE/dist"

  log "Copiando dist para a release temporária"

  is_real_directory "$source_dist" ||
    fail "Diretório dist extraído é inválido."

  is_path_available "$target_dist" ||
    fail "O destino dist já existe."

  cp -a --no-preserve=ownership --reflink=never -- \
    "$source_dist" \
    "$target_dist" ||
    fail "Não foi possível copiar o dist."

  log "Dist copiado para a release temporária."
}

check_symbolic_links_before_publication() {
  local link
  local target
  local resolved
  local links_file

  links_file="$(mktemp "$CANDIDATE/.links.XXXXXX")" ||
    fail "Não foi possível criar a lista de links."

  find "$CANDIDATE" -type l -print0 > "$links_file" ||
    fail "Não foi possível listar os links simbólicos."

  while IFS= read -r -d '' link; do
    target="$(readlink -- "$link")" ||
      fail "Não foi possível ler o link: $link"

    [[ "$target" != /* ]] ||
      fail "Link absoluto não permitido: $link"

    resolved="$(realpath -e -- "$link")" ||
      fail "Link inválido ou quebrado: $link"

    case "$resolved" in
      "$CANDIDATE"|"$CANDIDATE"/*)
        ;;
      *)
        fail "Link aponta para fora da release: $link"
        ;;
    esac
  done < "$links_file"

  rm -f -- "$links_file"

  log "Links simbólicos validados."
}

check_essential_files(){
  is_nonempty_file "$CANDIDATE/dist/src/infra/config/main.js" ||
    fail "Entrypoint NestJS ausente."

  is_nonempty_file "$CANDIDATE/dist/typeorm/data-source.js" ||
    fail "DataSource compilado ausente."
}

prepare_release_publication(){
  printf '%s\n' "$DEPLOY_SHA" > "$CANDIDATE/.release-sha"

  chown -hR root:root -- "$CANDIDATE"

  chmod -R u=rwX,go=rX -- "$CANDIDATE"
}

validate_release_runtime() {
  log "Validando dependências da release como controle-api"

  runuser -u controle-api -- \
    /usr/bin/node -e '
      const bcrypt = require(process.argv[1]);

      const password = "teste-local";
      const hash = bcrypt.hashSync(password, 4);

      if (!bcrypt.compareSync(password, hash)) {
        process.exit(1);
      }

      console.log("bcrypt: OK");
    ' "$CANDIDATE/node_modules/bcrypt" ||
    fail "O bcrypt não funciona na release preparada."

  log "Teste de dependências concluído."
}

publish(){
  log "Publicando release sem ativação"

  mv -T -- "$CANDIDATE" "$DESTINATION"

  log "Release ${DEPLOY_SHA:0:12} publicada."
  log "O symlink current não foi modificado."
}


main() {
  local DEPLOY_SHA="${1:-}"

  local DEPLOY_ROOT="/opt/controle-financeiro-deploy"
  local STAGING_ROOT="$DEPLOY_ROOT/staging"
  local RELEASES_ROOT="$DEPLOY_ROOT/releases"
  local AWS_REGION="sa-east-1"
  local ARTIFACT_BUCKET_FILE="/etc/controle-financeiro-deploy/artifact-bucket"

  local SOURCE
  local DESTINATION
  local ACTUAL_SHA
  local ARTIFACT_BUCKET

  validate_root
  trap cleanup_on_exit EXIT
  validate_sha "$DEPLOY_SHA"

  SOURCE="$STAGING_ROOT/$DEPLOY_SHA"
  DESTINATION="$RELEASES_ROOT/$DEPLOY_SHA"

  validate_artifact_bucket_file
  validate_staging_and_release
  validate_staging_inputs

  ACTUAL_SHA="$(get_actual_sha)" ||
    fail "Não foi possível obter o SHA do staging."

  validate_staging_sha

  validate_commit_ancestor "controle-deploy" "$SOURCE" "$DEPLOY_SHA" "origin/main"

  lock_publication

  log "Pré-validação concluída para ${DEPLOY_SHA:0:12}"

  handle_temporary_incoming_release
  validate_staging_tracked_changes


  validate_directory_entry_types "$SOURCE/node_modules"
  copy_production_files
  validate_directory_entry_types "$CANDIDATE/node_modules"
  validate_copied_git_files

  download_s3_artifacts
  validate_artifact_archive
  extract_compiled_javascript
  promote_compiled_dist
  check_symbolic_links_before_publication
  check_essential_files

  prepare_release_publication
  validate_release_runtime
  publish
}

main "$@"