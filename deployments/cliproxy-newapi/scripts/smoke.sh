#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 2 ]]; then
  echo "Usage: PUBLIC_API=https://api.example.com bash scripts/smoke.sh MODEL_NAME NEW_API_USER_KEY" >&2
  exit 2
fi
: "${PUBLIC_API:?Set PUBLIC_API=https://api.example.com}"
model="$1"
key="$2"
curl --fail-with-body --silent --show-error "${PUBLIC_API%/}/v1/models" \
  -H "Authorization: Bearer $key"
printf '\n'
curl --fail-with-body --silent --show-error "${PUBLIC_API%/}/v1/chat/completions" \
  -H "Authorization: Bearer $key" \
  -H 'Content-Type: application/json' \
  --data "$(printf '{"model":"%s","messages":[{"role":"user","content":"ping"}]}' "$model")"
printf '\n'
