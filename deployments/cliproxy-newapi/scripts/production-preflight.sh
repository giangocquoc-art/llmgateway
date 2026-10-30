#!/usr/bin/env bash
# Refuse public deployment if images are mutable tags or bootstrap override is active.
set -euo pipefail
cd "$(dirname "$0")/.."
test -f .env || { echo "Missing .env" >&2; exit 1; }
for name in CLIPROXY_IMAGE NEWAPI_IMAGE POSTGRES_IMAGE REDIS_IMAGE CADDY_IMAGE; do
  if ! grep -Eq "^${name}=[A-Za-z0-9_./:-]+@sha256:[a-f0-9]{64}$" .env; then
    echo "Unpinned/missing image: ${name}; run bash scripts/pin-images.sh" >&2
    exit 1
  fi
done
bash scripts/check.sh
echo "Production preflight: pinned images and gateway config PASS"
