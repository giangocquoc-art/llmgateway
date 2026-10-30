# CLIProxyAPI + New API — Ubuntu/Debian VPS

**Purpose:** run a self-hosted, multi-user OpenAI-compatible endpoint with individual New API tokens, quotas, model access policies and usage tracking. This folder is an **independent deployment stack** inside the existing `llmgateway` repo; it does not replace or configure the original app.

**Architecture:** Clients → HTTPS Caddy → New API → CLIProxyAPI → authorized provider. PostgreSQL stores users/quotas, Redis supports shared state/rate-limit functionality. Only Caddy publishes 80/443; CLIProxyAPI management is disabled.

> ⚠️ This is a **deployment starter**, not a deployed service. You still need a VPS, DNS, an authorized AI upstream, gateway initialization, and end-to-end tests. Never resell or redistribute OAuth/subscription access unless your provider agreement permits it. New API quota does not create additional upstream capacity.

## 1. Prerequisites

- Ubuntu/Debian with Docker Engine and Compose plugin (official docs: https://docs.docker.com/engine/install/ubuntu/ and https://docs.docker.com/engine/install/debian/).
- DNS A record for `api.example.com` pointing at your VPS IPv4. Valid AAAA record only when IPv6 is configured. Inbound TCP 80/443 for automatic HTTPS; preserve SSH. 443/UDP optional.
- At least one upstream AI API account/key that permits your intended traffic and sharing.
- Recommended initial VM: 2 vCPU / 4 GB RAM / 30 GB disk. Real concurrency depends on upstream rate limits.

## 2. Clone only this deployment folder (avoid the large parent repo)

```bash
git clone --filter=blob:none --no-checkout --single-branch -b feat/cliproxy-newapi-vps https://github.com/giangocquoc-art/llmgateway.git
cd llmgateway
git sparse-checkout init --cone
git sparse-checkout set deployments/cliproxy-newapi
git checkout
cd deployments/cliproxy-newapi
```

If the feature branch is merged into `main`, clone `main` instead.

## 3. Configure HTTPS and secrets

```bash
sudo apt-get update && sudo apt-get install -y openssl curl
bash init.sh api.example.com     # CHANGE domain; script refuses to overwrite generated secrets
docker compose config -q
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=100 caddy new-api cliproxy postgres redis
```

`init.sh` generates `.env` (DB, Redis, session & crypto secrets) and `cliproxy/config.yaml` (one private **internal CLIProxy key**). These files and OAuth credentials must never be committed. The image variables in `.env` initially reference `latest` for setup; **pin reviewed image versions/digests before real production traffic**.

Open `https://api.example.com` and complete New API administrator setup. Protect the root account, turn off public signups until rollout, configure 2FA where possible and set conservative global/per-token rate limits. If TLS is unavailable, verify A/AAAA records, port 80/443 and `docker compose logs caddy`.

> No direct ports for New API (3000), CLIProxyAPI (8317), PostgreSQL (5432), or Redis (6379). Docker published ports can bypass UFW expectations. Inspect `docker compose ps` and `ss -lntup`.

## 4. Add a legitimate model upstream to CLIProxyAPI

A freshly initialized stack has **no upstream models** and cannot answer requests.

For an authorized OpenAI-compatible upstream, append the root `api-keys` provider mapping illustrated in `UPSTREAM.example.yaml` to `cliproxy/config.yaml`. Replace the model ID, provider URL and upstream secret. Do **not** publish the secret or confuse `access.api-keys` (internal client authentication) with root `api-keys` (upstream credentials). Then:

```bash
docker compose restart cliproxy
docker compose logs --tail=50 cliproxy
```

For OAuth credentials, use a supported, provider-authorized flow and store auth material only in `cliproxy/auths/`. The CLIProxyAPI management API is deliberately disabled. Official docs: https://cliproxyapi.gh.miniasp.com/configuration/options.html and https://cliproxyapi.gh.miniasp.com/configuration/provider/openai-compatibility.html.

## 5. Add the private channel in New API

Admin dashboard → Channels → Add Channel:

| Setting | Value |
|---|---|
| Name | `Internal-CLIProxyAPI` |
| Type | OpenAI compatible |
| Base URL | `http://cliproxy:8317` (some channel types expect `/v1`; confirm via Channel Test) |
| API Key | Single value from `cliproxy/config.yaml` under `access.api-keys` |
| Models | Exact models/aliases listed by CLIProxyAPI |
| Group | `default` |

Check Channel Test with a model that actually exists. Set model pricing/ratios and reject unsupported model routes **before issuing users keys**. The New API dashboard and its public API are different from CLIProxyAPI's internal key and source credentials.

## 6. Individual keys and quotas

For each user:
1. Create a **New API** user account and key/token; do not give anyone the CLIProxyAPI internal key.
2. Set a finite quota, expiry, allowed models and groups.
3. Check token usage logs and global rate limits; enforce an upstream budget guard.
4. Test exhausted quota, revoked keys, disallowed models, unauthorized requests and streaming.
5. For *monthly replenishment*, configure a supported scheduled subscription/reset mechanism; a fixed lifetime token quota does **not** reset by itself.

Important: New API's quota is a **billing unit dependent on configured model pricing**, not a raw count of generated tokens or guaranteed upstream USD. Reconcile measured upstream spending with New API accounting, especially when a provider omits usage data, streaming ends unexpectedly, or a request is retried.

## 7. Smoke test

```bash
PUBLIC_API=https://api.example.com bash scripts/smoke.sh YOUR_MODEL
```

This securely prompts for a key, then tests model discovery and one chat request. Also manually verify a missing/invalid key gives a 401/403 and that exhausted quota is rejected; review usage records. Do not paste secrets into logs or public GitHub issues. Passing these tests alone is not a production security certification.

## 8. Operations & backup

```bash
docker compose ps
docker compose logs --tail=100 new-api cliproxy
bash scripts/backup.sh
bash scripts/check.sh
```

Backups: `scripts/backup.sh` writes a timestamped PostgreSQL custom-format dump to ignored `backups/`. Store encrypted backup files **off-VPS**, and separately back up `.env`, `cliproxy/config.yaml`, `cliproxy/auths/` and necessary persistent app data; verify restoring them on a staging machine. Redis AOF is not a substitute for SQL backups.

Before exposure to multiple users: pin image digests, verify quota and logging accuracy with streaming and retries, configure alerting on upstream spending and disk space, prohibit public signup by default, and restrict admin accounts. `TRUSTED_PROXIES=none` is intentionally conservative: IP-based user rate-limiting requires explicit trusted proxy configuration after you confirm Caddy's Docker network address. Never trust arbitrary client-supplied forwarded headers.

## 9. References

- CLIProxyAPI Docker: https://github.com/router-for-me/CLIProxyAPI/blob/main/docker-compose.yml
- CLIProxyAPI v8 options: https://cliproxyapi.gh.miniasp.com/configuration/options.html
- New API Docker reference: https://github.com/QuantumNous/new-api/blob/main/docker-compose.yml
- New API README: https://github.com/QuantumNous/new-api
- Docker install: https://docs.docker.com/engine/install/ubuntu/
