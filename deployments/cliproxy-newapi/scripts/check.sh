#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

for script in init.sh scripts/check.sh scripts/backup.sh scripts/smoke.sh; do
  bash -n "$script"
done

command -v openssl >/dev/null || { echo "openssl is required" >&2; exit 1; }

# Validate secret creation without polluting the repo.
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp init.sh "$tmp/init.sh"
(
  cd "$tmp"
  bash init.sh api.example.com >/dev/null
  test -s .env && test -s cliproxy/config.yaml
  grep -q 'config-version: 8' cliproxy/config.yaml
  grep -q 'secret-key: ""' cliproxy/config.yaml
  grep -q 'access:' cliproxy/config.yaml
  if bash init.sh api.example.com >/dev/null 2>&1; then
    echo "ERROR: init.sh overwrote secrets" >&2
    exit 1
  fi
)

if command -v docker >/dev/null && docker compose version >/dev/null 2>&1; then
  cp compose.yaml Caddyfile "$tmp/"
  ( cd "$tmp"; docker compose config -q )
  echo "Docker Compose validation: OK"
else
  echo "Docker not available: skipped Compose semantic validation"
fi

# Reject newly-added files accidentally containing placeholder real secrets.
if grep -Eq 'ports:[[:space:]]*\[.*(8317|3000|5432|6379)' compose.yaml; then
  echo "ERROR: an internal port appears published" >&2
  exit 1
fi
echo "Bash and initialization checks: OK"
