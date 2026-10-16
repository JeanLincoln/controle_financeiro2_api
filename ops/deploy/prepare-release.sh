#!/usr/bin/env bash

set -Eeuo pipefail

APP_REPO="/opt/controle-financeiro-api"
DEPLOY_ROOT="/opt/controle-financeiro-deploy"
STAGING_DIR="$DEPLOY_ROOT/staging"

DEPLOY_SHA="${1:-}"

log() {
  echo
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $1"
}

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo "Erro: informe um commit SHA Git válido com 40 caracteres."
  exit 1
fi

RELEASE_DIR="$STAGING_DIR/$DEPLOY_SHA"

log "Preparando release ${DEPLOY_SHA:0:12}"

log "Buscando referências da main"

git -C "$APP_REPO" fetch origin main

log "Validando commit"

git -C "$APP_REPO" cat-file -e "${DEPLOY_SHA}^{commit}"

if ! git -C "$APP_REPO" merge-base --is-ancestor \
  "$DEPLOY_SHA" origin/main
then
  echo "Erro: commit não pertence ao histórico da origin/main."
  exit 1
fi

log "Validando worktree"

if git -C "$APP_REPO" worktree list --porcelain \
  | grep -Fxq "worktree $RELEASE_DIR"
then
  log "Worktree já existe."
else
  if [[ -e "$RELEASE_DIR" ]]; then
    echo "Erro: $RELEASE_DIR existe mas não está registrado como worktree."
    exit 1
  fi

  git -C "$APP_REPO" \
    worktree add \
    --detach \
    "$RELEASE_DIR" \
    "$DEPLOY_SHA"
fi

log "Instalando dependências"

cd "$RELEASE_DIR"

pnpm install --frozen-lockfile

log "Gerando build"

pnpm build

MAIN_FILE="$RELEASE_DIR/dist/src/infra/config/main.js"

if [[ ! -f "$MAIN_FILE" ]]; then
  echo "Erro: build não gerou $MAIN_FILE"
  exit 1
fi

log "Release ${DEPLOY_SHA:0:12} preparada com sucesso."

echo "RELEASE_DIR=$RELEASE_DIR"