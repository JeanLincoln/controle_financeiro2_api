#!/usr/bin/env bash

set -Eeuo pipefail

# shellcheck source=ops/deploy/lib/common.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/lib/common.sh"


ensure_worktree() {
  local worktrees
  local actual_sha

  log "Validando worktree..."

  worktrees="$(git -C "$APP_REPO" worktree list --porcelain)" ||
    fail "Não foi possível consultar os worktrees."

  if grep -Fxq "worktree $RELEASE_DIR" <<< "$worktrees"; then
    is_real_directory "$RELEASE_DIR" ||
      fail "Worktree registrado não é um diretório válido."

    actual_sha="$(git -C "$RELEASE_DIR" rev-parse HEAD)" ||
      fail "Não foi possível consultar o commit do worktree."

    [[ "$actual_sha" == "$DEPLOY_SHA" ]] ||
      fail "Worktree aponta para outro commit."

    log "Worktree existente e válido."
    return 0
  fi

  is_path_available "$RELEASE_DIR" ||
    fail "Diretório existe, mas não está registrado como worktree."

  git -C "$APP_REPO" worktree add \
    --detach \
    "$RELEASE_DIR" \
    "$DEPLOY_SHA" ||
    fail "Falha ao criar o worktree."

  log "Worktree criado com sucesso."
}

install_dependencies(){
  log "Instalando dependências de produção..."

  cd "$RELEASE_DIR"

  NODE_ENV=production pnpm install \
    --prod \
    --frozen-lockfile \
    --network-concurrency=4

  is_real_directory "$RELEASE_DIR/node_modules" ||
    fail "Diretório node_modules não foi criado corretamente."

  log "Dependências instaladas!"
}

main(){
  local DEPLOY_SHA="${1:-}"
  local APP_REPO="/opt/controle-financeiro-api"
  local DEPLOY_ROOT="/opt/controle-financeiro-deploy"
  local STAGING_DIR="$DEPLOY_ROOT/staging"

  validate_sha "$DEPLOY_SHA"

  RELEASE_DIR="$STAGING_DIR/$DEPLOY_SHA"

  log "Preparando release ${DEPLOY_SHA:0:12}"
  log "Buscando referências da main..."
  git -C "$APP_REPO" fetch origin main
  log "Validando commit..."
  git -C "$APP_REPO" cat-file -e "${DEPLOY_SHA}^{commit}"

  validate_commit_ancestor "controle-deploy" "$APP_REPO" "$DEPLOY_SHA" "origin/main"

  ensure_worktree
  install_dependencies

  log "Release ${DEPLOY_SHA:0:12} preparada com sucesso."

  echo "RELEASE_DIR=$RELEASE_DIR"
}

main "$@"