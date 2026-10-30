#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."
mkdir -p backups
file="backups/gateway-$(date -u +%Y%m%dT%H%M%SZ).dump"
temp="${file}.partial"
trap 'rm -f "$temp"' EXIT
docker compose exec -T postgres sh -ec 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > "$temp"
test -s "$temp"
mv "$temp" "$file"
trap - EXIT
echo "Saved PostgreSQL dump to $file (local only)."
echo "Also back up .env, cliproxy/config.yaml and cliproxy/auths securely."
echo "Encrypt and copy backups off the VPS; test restoration periodically."
