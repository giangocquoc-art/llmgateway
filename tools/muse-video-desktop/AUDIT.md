# Muse Video Desktop — code audit

Audit scope: `tools/muse-video-desktop/` on `feat/muse-video-desktop-bridge`.
This review covers source-level logic; no real Muse account, Windows installation, package download, or successful MP4 render was available during the review.

## Fixed in this branch

| Area | Finding | Correction |
|---|---|---|
| Account lifecycle | Re-import created duplicate Muse Web accounts | Sync updates existing account with matching label and preserves cookie expiration timestamps |
| Multi-account | One browser partition overwrote the previous sign-in | Separate persistent Electron browser partition by validated account label |
| Process lifecycle | Opening two desktop instances competed for the same worker/ports | Electron single-instance lock and focus existing window |
| Recovery | Worker failure required closing the manager | Added local worker restart and Python executable picker; restart requires confirmation to avoid silently interrupting video tasks |
| Observability | Could not distinguish gateway bind failure from worker failure | Added bridge listening status, worker error and periodic task refresh |
| Task management | No cancellation control or actionable task errors | Added task cancellation and structured error messages |
| HTTP proxy | Client cookies and hop-by-hop headers were forwarded; upstream errors could be appended to an existing response | Filtered headers, bounded upload size including chunked transfers, abort interrupted streams correctly |
| Supply chain | Python worker installed from floating `main` | Pinned Muse2API to a reviewed Git commit |
| Runtime | Electron 33 was no longer a maintained runtime | Updated to supported Electron 45.1.0; not yet built on Windows |
| Test coverage | No regression coverage for rejected authentication or request sizes | Added simulated upstream tests (gateway auth, route split, oversized body, blocked admin paths) |

## Additional remediations (current branch)

- Added expiring HMAC-signed MP4 download URLs, with tampering and unauthorized access regression cases. Signing keys remain local and are regenerated at application launch; signatures expire after 15 minutes.
- Added configurable, in-memory per-client hourly video submission guard (12/hour default), regression cases for HTTP 429 and Retry-After. This does not provide durable billing or fully inherit CLIProxy quotas.
- Added first-frame image-to-video control, input MIME and size restrictions, and a quota lookup action for each Muse account.
- Added selection and self-launch of an existing CLIProxyAPI executable, plus automatic startup on subsequent desktop launches when configured.
- Added PyInstaller Windows worker packaging and Electron extraResources; the destination PC should no longer need a separately installed Python interpreter when using the installer.
- Restricted navigation of the privileged Electron desktop window to its own file URL, preventing remote pages from inheriting the Electron preload bridge.
- Expanded Windows workflow to build and upload an installer artifact if GitHub Actions is enabled.

## Release blockers — NOT verified / NOT complete

1. **Live video [critical]**: Muse2API's browser-CDP driver must be verified with a real video-enabled Muse Web account. The presence of `POST /v1/videos` does not imply live rendering succeeds.
2. **In-app Meta sign-in [critical]**: BrowserWindow login and redirect flows, cookies, renewal, and session expiry must be validated on Windows. OAuth from Muse Code does not substitute for Muse Web credentials; embedded browser login could be restricted upstream.
3. **One-click install [high]**: The source now contains a PyInstaller + Electron portable Muse2API worker bundling pipeline, but no successful installer build or Windows smoke test has been observed. CLIProxyAPI and Chrome/Edge remain external requirements.
4. **Authentication != billing [high]**: The bridge reuses CLIProxy client keys and now applies a basic per-key hourly video submission cap. Limits persist across app restarts in a local JSON store, but do not inherit CLIProxyAPI accounting, durable quotas, billing, or concurrency. Do not sell quota-based video keys as-is.
5. **Sensitive local data [high]**: Muse2API persists session cookies locally; its raw `/v1/media` route is intentionally unauthenticated by upstream design. Keep its port on loopback and protect the Windows profile.
6. **Actual build and CI [high]**: Run `npm run check`, `npm test` and `npm run package:win` on a Windows machine with dependencies installed. The GitHub workflow is defined but no successful run was visible at audit time.
7. **End-to-end task flow [high]**: Validate sign-in -> account pool -> async task creation -> polling -> finished task -> playable MP4 download -> expiry/retry/failure states.
8. **Video result URL compatibility [medium]**: The bridge now emits 15-minute signed video URLs for no-header players; test the signed URL with actual MP4 clients and after worker restart. Unsigned media URLs still require the client key.
9. **Additional features [medium]**: There is now first-frame image-to-video and per-account quota lookup, but no durable multi-user video billing, shared CLIProxy usage analytics, background auto-updater, or bundled CLIProxy executable.

## Manual acceptance matrix

- [ ] Windows 11: clean install without Docker; install Python and Node; run setup.
- [ ] Start existing CLIProxyAPI on port 8317; select valid config; confirm chat through unified gateway port 18710.
- [ ] Fail closed when client API key missing, wrong, or revoked in CLIProxy config.
- [ ] Block client access to `/admin/*` from unified gateway; verify upload-size limits.
- [ ] Sign in to Muse Web in embedded browser; verify expected session cookies; import account and read account status/quota.
- [ ] Sign in with second account label; verify first account still works; re-sync first label without duplicates.
- [ ] Create 5-second text-to-video; confirm task advances queued -> running -> succeeded; retrieve playable MP4 using authenticated request.
- [ ] Verify a signed MP4 URL works in an actual video player without an Authorization header; reject expired/tampered links.
- [ ] Invalid / expired cookies: show user-friendly errors, never leak tokens.
- [ ] Cancel a running video; verify task status and browser resource cleanup.
- [ ] Restart during active task: confirmation appears; ensure interrupted task is marked failed.
- [ ] Stop CLIProxy: chat shows appropriate failure; video worker remains independently controllable.
- [ ] Close desktop app: bridge and child worker terminate; second instance focuses the first.
- [ ] Build `.exe` with bundled Muse2API worker on Windows; launch on a clean PC without Python and verify rendering/worker startup.
- [ ] Audit saved files and media retention under the current Windows profile.

## Recommendation

Keep PR #2 unmerged until at least the critical/high release gates above are verified. This is an experimental local desktop bridge, **not** a production-ready CLIProxyAPI fork.
