#!/usr/bin/env bash

set -Eeuo pipefail

# shellcheck source=ops/deploy/lib/common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/lib/common.sh"

lock_deploy() {
  local lock_file="$DEPLOY_ROOT/.deploy.lock"

  command -v flock >/dev/null ||
    fail "flock não está disponível."

  is_root_controlled_directory "$DEPLOY_ROOT" ||
    fail "Diretório de deploy possui permissões inseguras."

  if [[ -e "$lock_file" || -L "$lock_file" ]]; then
    is_regular_file "$lock_file" ||
      fail "Arquivo de lock inválido."

    is_owned_by_root "$lock_file" ||
      fail "Arquivo de lock não pertence ao root."
  fi

  exec 8>"$lock_file" ||
    fail "Não foi possível abrir o lock do deploy."

  flock -n 8 ||
    fail "Outro deploy está em andamento."
}

prepare_release() {
  local sha="$1"
  local script="$SCRIPT_DIR/prepare-release.sh"

  is_regular_file "$script" ||
    fail "Script de preparação não encontrado ou inválido."

  log "Preparando release ${sha:0:12}..."

  runuser -u controle-deploy -- \
    /usr/bin/bash "$script" "$sha" ||
    fail "Falha na preparação da release."

  log "Preparação concluída."
}

publish_release() {
  local sha="$1"
  local script="$SCRIPT_DIR/publish-release.sh"

  is_regular_file "$script" ||
    fail "Script de publicação não encontrado ou inválido."

  is_owned_by_root "$script" ||
    fail "Script de publicação não pertence ao root."

  log "Publicando release ${sha:0:12}..."

  /usr/bin/bash "$script" "$sha" ||
    fail "Falha na publicação da release."

  log "Publicação concluída."
}

run_migrations() {
  local sha="$1"
  local release="$DEPLOY_ROOT/releases/$sha"
  local cli="$release/node_modules/typeorm/cli.js"
  local data_source="$release/dist/typeorm/data-source.js"

  is_root_controlled_directory "$release" ||
    fail "Release não é controlada pelo root."

  is_nonempty_file "$cli" ||
    fail "CLI do TypeORM ausente ou inválida."

  is_nonempty_file "$data_source" ||
    fail "DataSource compilado ausente ou inválido."

  log "Executando migrations da release ${sha:0:12}..."

  systemd-run \
    --wait \
    --collect \
    --pipe \
    -p "Type=exec" \
    -p "RuntimeMaxSec=300s" \
    -p "User=controle-api" \
    -p "Group=controle-api" \
    -p "WorkingDirectory=$release" \
    -p "EnvironmentFile=/run/controle-financeiro-api/app.env" \
    /usr/bin/node "$cli" \
      migration:run \
      -d "$data_source" ||
    fail "Falha na execução das migrations."

  log "Migrations concluídas."
}

activate_published_release() {
  local sha="$1"
  local script="$SCRIPT_DIR/activate-release.sh"

  is_regular_file "$script" ||
    fail "Script de ativação não encontrado ou inválido."

  is_owned_by_root "$script" ||
    fail "Script de ativação não pertence ao root."

  log "Ativando release ${sha:0:12}..."

  /usr/bin/bash "$script" "$sha" ||
    fail "Falha na ativação da release."

  log "Ativação concluída."
}

ensure_published_release() {
  local sha="$1"
  local release="$DEPLOY_ROOT/releases/$sha"

  if is_path_available "$release"; then
    log "Release ainda não publicada. Preparando..."

    prepare_release "$sha"
    publish_release "$sha"

    return 0
  fi

  log "Release já existe. Validando..."

  is_root_controlled_directory "$release" ||
    fail "Release existente possui permissões inválidas."

  is_regular_file "$release/.release-sha" ||
    fail "Identificador da release ausente ou inválido."

  [[ "$(< "$release/.release-sha")" == "$sha" ]] ||
    fail "Identificador não corresponde ao SHA solicitado."

  is_nonempty_file "$release/dist/src/infra/config/main.js" ||
    fail "Entrypoint NestJS ausente ou inválido."

  is_nonempty_file "$release/dist/typeorm/data-source.js" ||
    fail "DataSource compilado ausente ou inválido."

  is_nonempty_file "$release/node_modules/typeorm/cli.js" ||
    fail "CLI do TypeORM ausente ou inválida."

  log "Release existente validada. Reutilizando."
}

is_release_already_active() {
  local sha="$1"
  local release="$DEPLOY_ROOT/releases/$sha"
  local current="$DEPLOY_ROOT/current"
  local main_pid
  local process_dir

  validate_symlink "$current"

  [[ "$(readlink -- "$current")" == "$release" ]] ||
    return 1

  log "Release já apontada por current. Validando execução..."

  systemctl is-active --quiet controle-financeiro-api.service ||
    fail "Release já está em current, mas o serviço está inativo."

  main_pid="$(
    systemctl show controle-financeiro-api.service \
      -p MainPID --value
  )" || fail "Não foi possível consultar o PID da API."

  [[ "$main_pid" =~ ^[1-9][0-9]*$ ]] ||
    fail "PID principal da API é inválido."

  process_dir="$(readlink -f -- "/proc/$main_pid/cwd")" ||
    fail "Não foi possível identificar o diretório do processo."

  [[ "$process_dir" == "$release" ]] ||
    fail "Current aponta para a release, mas o Node executa outra versão."

  curl --silent \
    --show-error \
    --fail \
    --output /dev/null \
    --connect-timeout 2 \
    --max-time 5 \
    http://127.0.0.1:3000/health ||
    fail "Release já está ativa, mas não passou no health check."

  log "Release ${sha:0:12} já está ativa e saudável."

  return 0
}

main() {
  local DEPLOY_SHA="${1:-}"
  local DEPLOY_ROOT="/opt/controle-financeiro-deploy"
  local SCRIPT_DIR

  validate_root
  validate_sha "$DEPLOY_SHA"

  SCRIPT_DIR="$(
    cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P
  )" || fail "Não foi possível identificar o diretório dos scripts."

  lock_deploy

  log "Iniciando deploy da release ${DEPLOY_SHA:0:12}..."

  ensure_published_release "$DEPLOY_SHA"
  
  if is_release_already_active "$DEPLOY_SHA"; then
    log "Deploy já concluído anteriormente."
    return 0
  fi
  
  run_migrations "$DEPLOY_SHA"
  activate_published_release "$DEPLOY_SHA"

  log "Deploy da release ${DEPLOY_SHA:0:12} concluído."
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
