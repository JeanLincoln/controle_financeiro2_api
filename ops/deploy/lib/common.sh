#!/usr/bin/env bash

fail() {
  echo "ERRO: $1" >&2
  exit 1
}

log() {
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $1"
}

is_regular_file() {
  local path="$1"
  [[ -f "$path" && ! -L "$path" ]]
}

is_real_directory() {
  local path="$1"
  [[ -d "$path" && ! -L "$path" ]]
}

is_path_available() {
  local path="$1"
  [[ ! -e "$path" && ! -L "$path" ]]
}

is_nonempty_file() {
  local path="$1"
  [[ -f "$path" && -s "$path" && ! -L "$path" ]]
}

is_owned_by_root() {
  local owner_uid

  owner_uid="$(stat -c '%u' -- "$1")" || return 1

  [[ "$owner_uid" == "0" ]]
}

is_root_controlled_directory() {
  local path="$1"
  local mode

  is_real_directory "$path" || return 1

  [[ "$(stat -c '%u:%g' -- "$path")" == "0:0" ]] ||
    return 1

  mode="$(stat -c '%a' -- "$path")" || return 1

  (( (8#$mode & 022) == 0 ))
}

validate_root(){
  [[ "$EUID" -eq 0 ]] ||
    fail "Este launcher exige root."
}

validate_sha() {
  local sha="${1:-}"

  [[ "$sha" =~ ^[0-9a-f]{40}$ ]] ||
    fail "Informe um SHA Git válido."
}

validate_symlink() {
  local symlink="$1"

  [[ -L "$symlink" ]] ||
    fail "Link simbólico não encontrado: $symlink"
}

validate_commit_ancestor() {
  local git_user="$1"
  local repo="$2"
  local sha="$3"
  local branch="$4"

  if [[ "$(id -un)" == "$git_user" ]]; then
    git -C "$repo" \
      merge-base --is-ancestor "$sha" "$branch" ||
      fail "Commit não pertence ao histórico de $branch."

    return 0
  fi

  [[ "$EUID" -eq 0 ]] ||
    fail "Somente root pode executar Git como $git_user."

  runuser -u "$git_user" -- \
    git -C "$repo" \
    merge-base --is-ancestor "$sha" "$branch" ||
    fail "Falha ao validar commit como $git_user."
}
