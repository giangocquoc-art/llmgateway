# Muse Video Manager (experimental desktop integration)

A Windows-first **Electron desktop manager** for an existing CLIProxyAPI service and a local Muse2API browser worker. It lives in an isolated folder: **it does not replace or patch CLIProxyAPI itself** and does **not** modify the LLM Gateway runtime.

## What works by design

- Desktop dashboard; no Docker.
- Routes chat and other standard `/v1/*` requests to existing CLIProxyAPI on `127.0.0.1:8317`.
- Routes `POST /v1/videos`, `GET /v1/videos/{id}`, and `/v1/media/*` to Muse2API on `127.0.0.1:18610`.
- Exposes one endpoint `http://127.0.0.1:18710/v1` using **the same client API keys** configured in CLIProxyAPI `access.api-keys` (or legacy `api-keys`).
- Launches a separate, isolated Muse Web browser window. After the user signs in with Meta, **Sync signed-in session** transfers Muse Web cookies from that app-only Electron partition to the local Muse2API worker. No manual cookie export.
- View Muse accounts, video task history, cancel tasks, and initiate text-to-video requests. Account labels maintain separate sign-in partitions, allowing more than one Muse Web account.

## Important boundaries

**CLIProxyAPI Muse Code OAuth is not Muse Web authentication.** Its tokens cannot safely be treated as Muse video credentials. This integration reuses the account-management *experience* and the CLIProxy client API keys, while Muse Web has its own interactive browser session. It does not intercept, reuse, or claim to exchange Muse Code OAuth tokens for video access.

**Video rendering and Electron in-app Meta sign-in are not verified against a live Muse account.** Muse2API's browser driver is experimental; the account, plan, and current upstream website may affect rendering. Initial tests must verify successful Meta sign-in, a usable Muse Web session, a real video task, and a playable MP4. Some identity providers restrict sign-in from embedded browsers. No bypass of upstream paywalls or access controls is implemented.

Windows packaging now builds a portable Muse2API worker with PyInstaller and bundles it in the Electron installer, so a packaged app does not require separately installing Python on the destination PC. Chrome/Edge and an existing CLIProxyAPI executable are still required. The Windows installer has not been successfully built or run in CI yet.

## Windows setup

Install Git, Python 3.10+ (recommended 3.11), Node.js LTS, and Google Chrome or Microsoft Edge. CLIProxyAPI may already be running on port 8317, or you can select its executable in the desktop app to launch it.

```powershell
cd tools\muse-video-desktop
powershell -ExecutionPolicy Bypass -File .\setup-windows.ps1
npm start
```

1. In the desktop app, select your CLIProxyAPI `config.yaml`. Its client keys authenticate video requests, with a separate locally persisted hourly submission guard; CLIProxy billing and usage accounting are not inherited.
2. Give the account a unique label, click **Sign in to Muse Web**, sign in interactively in the isolated browser window, and click **Sync signed-in session**. Use a different label for each Muse account.
3. Check the Muse worker and account status.
4. Test a video using the desktop form or the API below.

## API

```powershell
$headers = @{ Authorization = "Bearer YOUR_EXISTING_CLIPROXY_CLIENT_KEY" }
$payload = @{ prompt = "Autumn leaves falling in a gentle breeze"; duration = 5; size = "16:9" } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:18710/v1/videos -Headers $headers -Method Post -ContentType "application/json" -Body $payload
# Then GET /v1/videos/{task_id}, also with the same Authorization header.
```

For media links, send the same Authorization header if using the unified gateway.

## Security

- The bridge listens only on `127.0.0.1`, no remote exposure or permissive CORS.
- The Muse worker is local; internal auth is generated per app run, never printed.
- The GUI has `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`.
- Muse Web cookies are read only from a per-account dedicated Electron partition and sent to local Muse2API. No plaintext cookies are rendered in the UI.
- Muse2API stores account cookies in local account data; its raw `/v1/media/*` endpoint is intentionally unauthenticated and uses unguessable filenames. The desktop bridge requires CLIProxy keys for its own media route, but this does **not** protect direct access to the separate worker port. Do not expose the Muse2API port or the bridge over a public interface. Treat the application profile as sensitive: it contains a Muse Web login session.
- Muse2API media are pruned after 14 days by default, so save completed MP4s to a separate folder.
- Start with an account where you are authorized to create videos; comply with the upstream service's terms.

## Troubleshooting

- **CLIProxy offline**: Run CLIProxyAPI on `127.0.0.1:8317`.
- **0 API keys**: Select the correct CLIProxyAPI config and ensure it has `access.api-keys`.
- **Worker offline**: Run setup, confirm `.venv/Scripts/python.exe` exists and Chrome is installed.
- **Session missing**: Sign in inside the app-owned Muse window, not your normal browser, and retry Sync.
- **200 dashboard but no video**: This means the proxy runs, *not* that Muse Web video generation is supported by the connected account.

## Audit and release gates

See [AUDIT.md](AUDIT.md) for the tracked review and unresolved blockers. The initial automated gateway tests only simulate local upstream services. Passing them does **not** verify Muse OAuth or live video rendering.

```powershell
npm run check
npm test
npm run package:win
```

The manager can start an existing CLIProxyAPI executable after its path is selected. It does not bundle CLIProxyAPI. Do not offer this as a commercial multi-user gateway without implementing durable per-client accounting and limits.

## October 31 updates

- The Windows packaging command invokes build-worker.ps1, uses PyInstaller to create a portable Muse2API executable, and embeds it as an Electron extra resource. This is source-complete but not yet verified in a Windows CI build.
- Optional first-frame image-to-video is supported in the desktop form; Muse Web upstream behavior is unverified.
- Video task results are returned with 15-minute HMAC-signed media URLs. An unguessable signed URL permits a video player to fetch the MP4 without an Authorization header. An unsigned URL still requires a client key on the unified bridge.
- Video submissions have a per-key hourly guard, configurable with MUSE_VIDEO_HOURLY_LIMIT (default: 12 per hour). It is persisted under the application's local user data directory, and upstream failures are refunded; this does not implement CLIProxy per-key billing or full usage tracking.
- To start an installed CLIProxyAPI from the desktop manager, select config.yaml, select the CLIProxyAPI .exe, and click Start CLIProxy. This path is saved for subsequent launches.
