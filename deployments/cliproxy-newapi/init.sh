#!/usr/bin/env bash
set -euo pipefail
umask 077

if [[ $# -ne 1 ]]; then
  echo "Usage: bash init.sh api.example.com" >&2
  exit 2
fi
DOMAIN="$1"
if [[ ! "$DOMAIN" =~ ^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)+$ ]]; then
  echo "Enter a valid DNS hostname (without scheme, port or path)" >&2
  exit 2
fi
if [[ -e .env || -e cliproxy/config.yaml ]]; then
  echo "Refusing to overwrite generated secrets. Back them up before changes." >&2
  exit 1
fi
command -v openssl >/dev/null || { echo "Install openssl first" >&2; exit 1; }
mkdir -p cliproxy/auths cliproxy/logs cliproxy/plugins newapi/data newapi/logs backups
PG_SECRET="$(openssl rand -hex 32)"
REDIS_SECRET="$(openssl rand -hex 32)"
SESSION_SECRET="$(openssl rand -hex 32)"
CRYPTO_SECRET="$(openssl rand -hex 32)"
INTERNAL_KEY="sk-cpa-$(openssl rand -hex 32)"

cat > .env <<ENV
API_DOMAIN=${DOMAIN}
POSTGRES_PASSWORD=${PG_SECRET}
REDIS_PASSWORD=${REDIS_SECRET}
SESSION_SECRET=${SESSION_SECRET}
CRYPTO_SECRET=${CRYPTO_SECRET}
CLIPROXY_IMAGE=eceasy/cli-proxy-api:latest
NEWAPI_IMAGE=calciumion/new-api:latest
ENV

cat > cliproxy/config.yaml <<YAML
# CLIProxyAPI v8: only New API gets this key; never distribute it to end users.
config-version: 8
server:
  host: ""
  port: 8317
management:
  allow-remote: false
  secret-key: ""
  disable-control-panel: true
access:
  api-keys:
    - "${INTERNAL_KEY}"
oauth:
  auth-dir: "/root/.cli-proxy-api"
# Configure an authorized upstream in 'api-keys' or populate oauth auth files.
# See UPSTREAM.example.yaml and the README.
YAML
chmod 600 .env cliproxy/config.yaml
echo "Created .env and cliproxy/config.yaml for ${DOMAIN}."
echo "WARNING: No upstream AI provider configured yet."
echo "New API channel: URL=http://cliproxy:8317; key=access.api-keys from cliproxy/config.yaml"
echo "Never publish .env, cliproxy/config.yaml, upstream keys or OAuth auth files."
