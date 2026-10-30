#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: PUBLIC_API=https://api.example.com bash scripts/smoke.sh MODEL_NAME" >&2
  exit 2
fi
: "${PUBLIC_API:?Set PUBLIC_API=https://api.example.com}"
model="$1"
if [[ -z "${NEW_API_USER_KEY:-}" ]]; then
  read -rsp 'Enter New API user key (input hidden): ' NEW_API_USER_KEY
  echo >&2
fi
if [[ -z "${NEW_API_USER_KEY:-}" ]]; then
  echo "API key cannot be empty" >&2
  exit 2
fi
curl --fail-with-body --silent --show-error "${PUBLIC_API%/}/v1/models" \
  -H "Authorization: Bearer $NEW_API_USER_KEY"
printf '\n'
curl --fail-with-body --silent --show-error "${PUBLIC_API%/}/v1/chat/completions" \
  -H "Authorization: Bearer $NEW_API_USER_KEY" \
  -H 'Content-Type: application/json' \
  --data "$(printf '{"model":"%s","messages":[{"role":"user","content":"ping"}]}' "$model")"
printf '\n'
