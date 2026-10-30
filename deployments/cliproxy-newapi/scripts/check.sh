#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
for script in init.sh scripts/check.sh scripts/backup.sh scripts/smoke.sh; do bash -n "$script"; done
for binary in openssl python3; do command -v "$binary" >/dev/null || { echo "$binary required" >&2; exit 1; }; done
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp init.sh compose.yaml compose.bootstrap.yaml Caddyfile "$tmp/"
(
  cd "$tmp"
  bash init.sh api.example.com >/dev/null
  test -s .env && test -s cliproxy/config.yaml
  grep -q '^config-version: 8$' cliproxy/config.yaml
  grep -q '^  secret-key: ""$' cliproxy/config.yaml
  grep -q '^access:$' cliproxy/config.yaml
  if bash init.sh api.example.com >/dev/null 2>&1; then echo "Secrets overwritten" >&2; exit 1; fi
  if bash init.sh 'https://invalid.hostname' >/dev/null 2>&1; then echo "Bad hostname accepted" >&2; exit 1; fi
)
if ! grep -q 'TRUSTED_PROXIES: "172.30.44.10"' compose.yaml || ! grep -q 'ipv4_address: 172.30.44.10' compose.yaml; then echo "Proxy address/trust missing" >&2; exit 1; fi
if command -v docker >/dev/null && docker compose version >/dev/null 2>&1; then
  (cd "$tmp"; docker compose -f compose.yaml config --format json > production.json; docker compose -f compose.yaml -f compose.bootstrap.yaml config --format json > bootstrap.json)
  python3 - "$tmp/production.json" "$tmp/bootstrap.json" <<'PY'
import json,sys
with open(sys.argv[1]) as f: prod=json.load(f)
with open(sys.argv[2]) as f: boot=json.load(f)
services=prod["services"]
assert set(services)=={"caddy","new-api","cliproxy","postgres","redis"}
assert all(not val.get("ports") for k,val in services.items() if k!="caddy"), "Private ports exposed"
caddy=services["caddy"]
assert {int(x["published"]) for x in caddy["ports"]}=={80,443}, "Unexpected public port"
assert caddy["networks"]["private"]["ipv4_address"]==services["new-api"]["environment"]["TRUSTED_PROXIES"]
assert services["new-api"]["environment"]["SESSION_COOKIE_SECURE"]=="true"
assert services["new-api"]["environment"]["SESSION_COOKIE_TRUSTED_URL"].startswith("https://")
b=boot["services"]
assert b["new-api"]["environment"]["SESSION_COOKIE_SECURE"]=="false"
assert b["new-api"]["environment"]["SESSION_COOKIE_TRUSTED_URL"]==""
assert b["new-api"]["ports"]==[{"mode":"ingress","target":3000,"published":"3000","protocol":"tcp","host_ip":"127.0.0.1"}] or (len(b["new-api"]["ports"])==1 and str(b["new-api"]["ports"][0]["published"])=="3000" and b["new-api"]["ports"][0]["host_ip"]=="127.0.0.1")
assert prod["networks"]["private"]["ipam"]["config"][0]["subnet"]=="172.30.44.0/24"
print("Compose production and bootstrap checks passed")
PY
else
  echo "Docker not installed; CI/VM required for Compose runtime validation"
fi
echo "Static checks: PASS"
