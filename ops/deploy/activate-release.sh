#!/usr/bin/env bash

set -Eeuo pipefail

# shellcheck source=ops/deploy/lib/common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/lib/common.sh"

validate_active_release() { 
  OLD_RELEASE="$(realpath -e -- "$CURRENT")" ||
    fail "Não foi possível identificar a release ativa."

  [[ "$OLD_RELEASE" == "$RELEASES_ROOT/"* ]] ||
    fail "A release ativa está fora do diretório releases."
}

validate_new_release() {
  is_root_controlled_directory "$RELEASES_ROOT" ||
    fail "Diretório releases possui permissões inseguras."

  is_root_controlled_directory "$NEW_RELEASE" ||
    fail "Nova release não é controlada pelo root."

  is_regular_file "$NEW_RELEASE/.release-sha" ||
    fail "Identificador da release ausente ou inválido."

  [[ "$(< "$NEW_RELEASE/.release-sha")" == "$DEPLOY_SHA" ]] ||
    fail "O identificador da release não corresponde ao SHA."

  is_nonempty_file "$NEW_RELEASE/dist/src/infra/config/main.js" ||
    fail "Entrypoint da API ausente ou inválido."

  [[ "$NEW_RELEASE" != "$OLD_RELEASE" ]] ||
    fail "A release solicitada já está ativa."
}

lock_activation() {
  local lock_file="$DEPLOY_ROOT/.activate.lock"

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

  exec 9>"$lock_file" ||
    fail "Não foi possível abrir o arquivo de lock."

  flock -n 9 ||
    fail "Outra ativação está em andamento."
}

switch_current() {
  local target="$1"
  local temp_dir
  local temp_link

  temp_dir="$(mktemp -d "$DEPLOY_ROOT/.activate.XXXXXX")" ||
    return 1

  temp_link="$temp_dir/current"

  if ! ln -s -- "$target" "$temp_link"; then
    rmdir -- "$temp_dir" || true
    return 1
  fi

  if ! mv -Tf -- "$temp_link" "$CURRENT"; then
    rm -f -- "$temp_link"
    rmdir -- "$temp_dir" || true
    return 1
  fi

  rmdir -- "$temp_dir" ||
    log "AVISO: não foi possível limpar o diretório temporário."

  log "Current atualizado para: $target"
}

rollback_release() {
  log "Iniciando rollback para a release anterior..."

  switch_current "$OLD_RELEASE" || {
    log "ERRO: não foi possível restaurar current."
    return 1
  }

  systemctl restart controle-financeiro-api.service || {
    log "ERRO: falha ao reiniciar a API anterior."
    return 1
  }

  check_health || {
    log "ERRO: API anterior não ficou saudável."
    return 1
  }

  log "Rollback concluído com sucesso."
  return 0
}

check_health() {
  local attempt
  local status
  local url="http://127.0.0.1:3000/health"
  local max_attempts=15

  log "Verificando a saúde da API..."

  for ((attempt = 1; attempt <= max_attempts; attempt++)); do
    status="$(
      curl --silent \
        --output /dev/null \
        --write-out '%{http_code}' \
        --connect-timeout 2 \
        --max-time 5 \
        "$url"
    )" || status="000"

    if [[ "$status" == "200" ]] &&
       systemctl is-active --quiet controle-financeiro-api.service; then
      log "Health check aprovado."
      return 0
    fi

    log "Tentativa $attempt/$max_attempts: HTTP $status"
    sleep 2
  done

  log "ERRO: API não ficou saudável."
  return 1
}

check_database_before_activation() {
  log "Verificando conexão com o PostgreSQL..."

  if systemd-run \
    --wait \
    --collect \
    --pipe \
    -p "Type=exec" \
    -p "RuntimeMaxSec=30s" \
    -p "User=controle-api" \
    -p "Group=controle-api" \
    -p "WorkingDirectory=$NEW_RELEASE" \
    -p "EnvironmentFile=/run/controle-financeiro-api/app.env" \
    /usr/bin/node "$NEW_RELEASE/node_modules/typeorm/cli.js" \
      query 'SELECT 1;' \
      -d "$NEW_RELEASE/dist/typeorm/data-source.js"
  then
    log "Conexão com PostgreSQL: OK"
    return 0
  fi

  log "Falha na conexão com PostgreSQL."
  return 1
}

handle_activation_exit() {
  local exit_status=$?
  local current_target

  trap - EXIT
  trap '' HUP INT TERM

  if [[ "$exit_status" -eq 0 ]]; then
    return 0
  fi

  current_target="$(readlink "$CURRENT")" ||
    current_target=""

  if [[ "$current_target" != "$NEW_RELEASE" ]]; then
    log "Ativação interrompida sem alterar current."
    exit "$exit_status"
  fi

  log "Ativação interrompida. Iniciando recuperação..."

  if ! rollback_release; then
    log "ERRO CRÍTICO: rollback automático falhou."
    log "Intervenção manual necessária."
  fi

  exit "$exit_status"
}

activate_release() {
  log "Iniciando ativação da release ${DEPLOY_SHA:0:12}..."

  check_database_before_activation ||
    fail "Banco indisponível. Ativação cancelada."

  trap handle_activation_exit EXIT
  trap 'exit 129' HUP
  trap 'exit 130' INT
  trap 'exit 143' TERM

  switch_current "$NEW_RELEASE" ||
    fail "Não foi possível trocar current."

  systemctl restart controle-financeiro-api.service ||
    fail "Não foi possível reiniciar a nova API."

  check_health ||
    fail "Nova API não passou no health check."

  trap - EXIT HUP INT TERM

  log "Release ${DEPLOY_SHA:0:12} ativada com sucesso."
}

main() {
  local DEPLOY_SHA="${1:-}"
  local DEPLOY_ROOT="/opt/controle-financeiro-deploy"
  local RELEASES_ROOT="$DEPLOY_ROOT/releases"
  local CURRENT="$DEPLOY_ROOT/current"
  local NEW_RELEASE
  local OLD_RELEASE

  validate_root
  validate_sha "$DEPLOY_SHA"

  NEW_RELEASE="$RELEASES_ROOT/$DEPLOY_SHA"

  lock_activation

  validate_symlink "$CURRENT"
  validate_active_release
  validate_new_release

  echo "Release anterior: $OLD_RELEASE"
  echo "Nova release: $NEW_RELEASE"
  echo "Pré-validação da ativação concluída."

  activate_release
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi