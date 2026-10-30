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
  ( cd "$tmp"; docker compose config --format json > compose-rendered.json )
  python3 - "$tmp/compose-rendered.json" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    data = json.load(f)
services = data["services"]
for name, service in services.items():
    if name != "caddy" and service.get("ports"):
        raise SystemExit("ERROR: internal service publishes ports: " + name)
published = {int(p["published"]) for p in services["caddy"].get("ports", [])}
if not {80,443}.issubset(published):
    raise SystemExit("ERROR: Caddy must publish 80 and 443")
print("Docker Compose and isolated ports: OK")
PY
else
  echo "Docker not available: skipped Compose semantic validation"
fi

echo "Bash and initialization checks: OK"
