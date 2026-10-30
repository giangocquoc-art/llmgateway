import { app, BrowserWindow, dialog, ipcMain, session, shell } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { join } from "node:path";
import { createGateway, BRIDGE_PORT, MUSE_PORT, CLI_PORT, readClientKeys } from "./bridge";

type Settings = { cliConfig: string; pythonPath: string };
const internalKey = randomBytes(32).toString("hex");
const partition = "persist:muse-web";
let mainWindow: BrowserWindow;
let loginWindow: BrowserWindow | undefined;
let worker: ChildProcessWithoutNullStreams | undefined;
let workerError = "";
let settings: Settings = { cliConfig: "", pythonPath: "" };

function storePath(): string { return join(app.getPath("userData"), "settings.json"); }
function loadSettings(): void {
  try {
    const json: unknown = JSON.parse(readFileSync(storePath(), "utf8"));
    if (json && typeof json === "object") {
      const raw = json as Partial<Settings>;
      settings = {
        cliConfig: typeof raw.cliConfig === "string" ? raw.cliConfig : "",
        pythonPath: typeof raw.pythonPath === "string" ? raw.pythonPath : ""
      };
    }
  } catch (error) {
    if (existsSync(storePath())) workerError = `Settings could not be read: ${String(error)}`;
  }
}
function saveSettings(): void {
  writeFileSync(storePath(), JSON.stringify(settings, null, 2), { mode: 0o600 });
}

function chromePath(): string {
  const roots = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA]
    .filter((value): value is string => Boolean(value));
  const candidates = roots.flatMap((root) => [
    join(root, "Google", "Chrome", "Application", "chrome.exe"),
    join(root, "Microsoft", "Edge", "Application", "msedge.exe")
  ]);
  return candidates.find(existsSync) ?? "";
}

function pythonPath(): string {
  if (settings.pythonPath) return settings.pythonPath;
  const base = app.isPackaged ? join(process.resourcesPath, "muse-worker") :
    join(__dirname, "..", ".venv");
  return join(base, "Scripts", "python.exe");
}

function startWorker(): void {
  const executable = pythonPath();
  if (!existsSync(executable)) {
    workerError = "Python worker missing. Run setup-windows.ps1 first.";
    return;
  }
  const dataDir = join(app.getPath("userData"), "muse2api-data");
  mkdirSync(dataDir, { recursive: true });
  const browser = chromePath();
  if (!browser) {
    workerError = "Chrome/Edge not found. Install Chrome or Edge.";
    return;
  }
  workerError = "";
  worker = spawn(executable, ["-m", "muse2api"], {
    cwd: dataDir, windowsHide: true,
    env: {
      ...process.env,
      MUSE2API_DRIVER: "browser",
      MUSE2API_HOST: "127.0.0.1",
      MUSE2API_PORT: String(MUSE_PORT),
      MUSE2API_API_KEY: internalKey,
      MUSE2API_ADMIN_KEY: internalKey,
      MUSE2API_CHROMIUM_PATH: browser,
      MUSE2API_HEADLESS: "false",
      MUSE2API_DATA_DIR: dataDir,
      MUSE2API_PUBLIC_BASE: `http://127.0.0.1:${BRIDGE_PORT}`
    }
  });
  worker.on("error", (err) => { workerError = err.message; });
  worker.on("exit", (code) => { workerError = `Muse2API worker stopped (code ${code})`; worker = undefined; });
  // Never print stdout/stderr: upstream logging may contain sensitive browser state.
  worker.stdout.resume();
  worker.stderr.resume();
}

async function museFetch(endpoint: string, method = "GET", body?: object): Promise<any> {
  const response = await fetch(`http://127.0.0.1:${MUSE_PORT}${endpoint}`, {
    method,
    headers: { authorization: `Bearer ${internalKey}`, ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(180000)
  });
  let result: unknown;
  try { result = await response.json(); } catch { throw new Error(`Muse worker HTTP ${response.status}`); }
  if (!response.ok) throw new Error(`Muse worker HTTP ${response.status}: ${JSON.stringify(result).slice(0, 300)}`);
  return result;
}

function openLogin(): void {
  if (loginWindow && !loginWindow.isDestroyed()) { loginWindow.focus(); return; }
  loginWindow = new BrowserWindow({
    parent: mainWindow, width: 1200, height: 840,
    title: "Sign in to Muse Web",
    webPreferences: { partition, nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  loginWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const origin = new URL(url);
      if (origin.protocol !== "https:") return { action: "deny" };
      return { action: "allow", overrideBrowserWindowOptions: {
        webPreferences: { partition, nodeIntegration: false, contextIsolation: true, sandbox: true }
      } };
    } catch { return { action: "deny" }; }
  });
  void loginWindow.loadURL("https://muse.ai");
}

async function syncLogin(): Promise<object> {
  // Reads only the dedicated Muse browser partition, never the user's normal Chrome profile.
  const cookies = await session.fromPartition(partition).cookies.get({ url: "https://muse.ai" });
  const jar = Object.fromEntries(cookies.map(({ name, value }) => [name, value]));
  if (!jar.hatch_sess || !jar.hatch_native_auth_device) {
    throw new Error("Muse Web login not found. Sign in inside the Muse window first.");
  }
  return museFetch("/admin/accounts", "POST", { label: "Muse Web", cookies: jar });
}

function makeWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1220, height: 860, minWidth: 850, minHeight: 620,
    backgroundColor: "#0b1020", title: "Muse Video Manager",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  void mainWindow.loadFile(join(__dirname, "..", "ui", "index.html"));
}

app.whenReady().then(() => {
  loadSettings();
  const bridge = createGateway(() => settings.cliConfig, internalKey);
  bridge.on("error", (err) => { workerError = `Bridge startup failed: ${err.message}`; });
  bridge.listen(BRIDGE_PORT, "127.0.0.1");
  startWorker();
  makeWindow();

  ipcMain.handle("manager:status", async () => {
    let museOnline = false;
    try { await museFetch("/admin/status"); museOnline = true; } catch { /* worker offline */ }
    let cliOnline = false;
    try {
      const response = await fetch(`http://127.0.0.1:${CLI_PORT}/v1/models`, { signal: AbortSignal.timeout(2000) });
      cliOnline = response.status > 0;
    } catch { /* CLIProxy not running */ }
    let keyCount = 0;
    try { keyCount = readClientKeys(settings.cliConfig).length; } catch { /* config missing */ }
    return { museOnline, cliOnline, keyCount, cliConfig: settings.cliConfig, workerError,
      endpoint: `http://127.0.0.1:${BRIDGE_PORT}/v1` };
  });
  ipcMain.handle("manager:choose-config", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"], filters: [{ name: "YAML", extensions: ["yaml", "yml"] }]
    });
    if (result.canceled || !result.filePaths[0]) return null;
    // Refuse to accept a path unless this really looks like a CLIProxy configuration.
    const keys = readClientKeys(result.filePaths[0]);
    if (!keys.length) throw new Error("No access.api-keys found in this YAML file");
    settings.cliConfig = result.filePaths[0];
    saveSettings();
    return { cliConfig: settings.cliConfig, keyCount: keys.length };
  });
  ipcMain.handle("manager:choose-python", async () => {
    const selected = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"], filters: [{ name: "Python interpreter", extensions: ["exe"] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return null;
    settings.pythonPath = selected.filePaths[0];
    saveSettings();
    workerError = "Restart the manager to apply the new worker path.";
    return settings.pythonPath;
  });
  ipcMain.handle("muse:download-media", async (_event, raw: unknown) => {
    if (typeof raw !== "string") throw new Error("Invalid media URL");
    let url: URL;
    try { url = new URL(raw); } catch { throw new Error("Invalid media URL"); }
    if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" ||
      url.port !== String(BRIDGE_PORT) || !/^\/v1\/media\/[a-zA-Z0-9_.-]+$/.test(url.pathname)) {
      throw new Error("Only Muse media from the local gateway can be downloaded");
    }
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: url.pathname.split("/").pop() || "video.mp4",
      filters: [{ name: "Video", extensions: ["mp4"] }, { name: "All files", extensions: ["*"] }]
    });
    if (result.canceled || !result.filePath) return;
    const response = await fetch(`http://127.0.0.1:${MUSE_PORT}${url.pathname}`, {
      headers: { Authorization: `Bearer ${internalKey}` },
      signal: AbortSignal.timeout(300000)
    });
    if (!response.ok || !response.body) throw new Error(`Media download failed: HTTP ${response.status}`);
    await pipeline(
      Readable.fromWeb(response.body as unknown as import("node:stream/web").ReadableStream),
      createWriteStream(result.filePath, { mode: 0o600 })
    );
  });
  ipcMain.handle("manager:open-cli", () => shell.openExternal(`http://127.0.0.1:${CLI_PORT}/management.html`));
  ipcMain.handle("muse:open-login", () => { openLogin(); return true; });
  ipcMain.handle("muse:sync-login", syncLogin);
  ipcMain.handle("muse:accounts", () => museFetch("/admin/accounts"));
  ipcMain.handle("muse:tasks", () => museFetch("/admin/tasks?limit=30"));
  ipcMain.handle("muse:delete-account", (_event, id: unknown) => {
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error("Invalid account ID");
    return museFetch(`/admin/accounts/${encodeURIComponent(id)}`, "DELETE");
  });
  ipcMain.handle("muse:submit-video", (_event, input: unknown) => {
    const data = input as { prompt?: unknown; duration?: unknown; size?: unknown } | null;
    const prompt = data?.prompt;
    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 4000) throw new Error("Prompt must be 1–4000 characters");
    const duration = data?.duration;
    const size = data?.size;
    if (duration !== 5 && duration !== 10) throw new Error("Unsupported duration");
    if (size !== "16:9" && size !== "9:16" && size !== "1:1") throw new Error("Unsupported aspect ratio");
    return museFetch("/v1/videos", "POST", { prompt, duration, size });
  });
});
app.on("before-quit", () => { worker?.kill(); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
