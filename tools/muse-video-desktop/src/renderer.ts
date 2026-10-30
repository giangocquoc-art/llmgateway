type Status = { museOnline: boolean; cliOnline: boolean; bridgeOnline: boolean; cliExecutable: string; keyCount: number; cliConfig: string; workerError: string; endpoint: string };
type Account = { id: string; label: string; status: string; enabled: boolean };
type Task = { id: string; status: string; result?: { url?: string }; error?: { message?: string } | string };
type Manager = {
  status(): Promise<Status>;
  restartWorker(): Promise<{ started: boolean; cancelled?: boolean; error: string }>;
  chooseConfig(): Promise<{ cliConfig: string; keyCount: number } | null>;
  chooseCli(): Promise<string | null>;
  startCli(): Promise<{ running: boolean; note: string }>;
  openLogin(label: string): Promise<void>;
  syncLogin(label: string): Promise<object>;
  accounts(): Promise<{ data: Account[] }>;
  tasks(): Promise<{ data: Task[] }>;
  cancelTask(id: string): Promise<object>;
  submitVideo(prompt: string, duration: number, size: string, image?: string): Promise<{ id: string; status: string }>;
  deleteAccount(id: string): Promise<object>;
  openCliManager(): Promise<void>;
  choosePython(): Promise<string | null>;
  downloadMedia(url: string): Promise<void>;
};
interface Window { museManager: Manager }
const api = window.museManager;
const element = (id: string): HTMLElement => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element: ${id}`);
  return node;
};
function output(message: string, problem = false): void {
  const node = element("message");
  node.textContent = message;
  node.className = problem ? "message error" : "message";
}
async function execute(action: () => Promise<unknown>, done = "Done"): Promise<void> {
  try { await action(); output(done); } catch (error) { output(String(error), true); }
}
function textNode(tag: string, value: string): HTMLElement {
  const el = document.createElement(tag);
  el.textContent = value;
  return el;
}
let refreshPending = false;
async function refresh(): Promise<void> {
  if (refreshPending) return;
  refreshPending = true;
  try {
  const status = await api.status();
  element("muse-status").textContent = status.museOnline ? "Online" : "Offline";
  element("cli-status").textContent = status.cliOnline ? "Reachable" : "Offline";
  element("bridge-status").textContent = status.bridgeOnline ? "Listening" : "Offline";
  element("key-count").textContent = String(status.keyCount);
  element("config-path").textContent = status.cliConfig || "Select a CLIProxy config.yaml to share client keys";
  element("cli-path").textContent = status.cliExecutable || "CLIProxy executable not selected";
  element("endpoint").textContent = status.endpoint;
  element("worker-error").textContent = status.workerError;
  if (!status.museOnline) {
    element("accounts").textContent = "Muse worker offline.";
    element("tasks").textContent = "Muse worker offline.";
    return;
  }
  const [accounts, tasks] = await Promise.all([api.accounts(), api.tasks()]);
  const accountList = element("accounts");
  accountList.replaceChildren();
  for (const a of accounts.data) {
    const item = textNode("div", `${a.label} · ${a.status} · ${a.enabled ? "enabled" : "disabled"}`);
    item.className = "item";
    const remove = textNode("button", "Remove") as HTMLButtonElement;
    remove.className = "secondary";
    remove.addEventListener("click", () => void execute(async () => {
      await api.deleteAccount(a.id);
      await refresh();
    }, "Account removed"));
    item.append(remove);
    accountList.append(item);
  }
  if (!accounts.data.length) accountList.textContent = "No Muse Web accounts yet.";
  const taskList = element("tasks");
  taskList.replaceChildren();
  for (const task of tasks.data) {
    const detail = task.error && typeof task.error === "object"
      ? ((task.error as { message?: string }).message ?? "Task failed") : (task.error ?? "");
    const item = textNode("div", `${task.id} · ${task.status}${detail ? " · " + detail : ""}`);
    item.className = "item";
    if (task.result?.url) {
      const link = document.createElement("a");
      // Only allow the loopback bridge media link.
      try {
        const target = new URL(task.result.url);
        if (target.hostname === "127.0.0.1" && target.port === "18710" && target.pathname.startsWith("/v1/media/")) {
          link.href = "#tasks-section";
          link.textContent = "Download MP4";
          link.addEventListener("click", (event) => {
            event.preventDefault();
            void execute(() => api.downloadMedia(target.href), "Video downloaded");
          });
          item.append(link);
        }
      } catch { /* invalid URL */ }
    }
    if (task.status === "running" || task.status === "queued") {
      const cancel = textNode("button", "Cancel") as HTMLButtonElement;
      cancel.className = "secondary";
      cancel.addEventListener("click", () => void execute(async () => {
        await api.cancelTask(task.id);
        await refresh();
      }, "Task cancellation requested"));
      item.append(cancel);
    }
    taskList.append(item);
  }
  if (!tasks.data.length) taskList.textContent = "No video tasks.";
  } finally { refreshPending = false; }
}
element("restart-worker").addEventListener("click", () => void execute(async () => {
  const result = await api.restartWorker();
  await refresh();
  if (result.cancelled) throw new Error("Restart cancelled");
  if (!result.started) throw new Error(result.error || "Worker failed to start");
}, "Worker launch requested"));
element("choose-python").addEventListener("click", () => void execute(async () => {
  await api.choosePython();
  await refresh();
}, "Python path updated; restart app to apply"));
element("choose-cli").addEventListener("click", () => void execute(async () => {
  await api.chooseCli();
  await refresh();
}, "CLIProxy executable selected"));
element("start-cli").addEventListener("click", () => void execute(async () => {
  const response = await api.startCli();
  output(response.note);
  await refresh();
}, "CLIProxy startup requested"));
element("choose-config").addEventListener("click", () => void execute(async () => {
  await api.chooseConfig();
  await refresh();
}, "CLIProxy settings updated"));
element("cli-manager").addEventListener("click", () => void execute(() => api.openCliManager(), "Opened CLIProxy manager"));
element("login").addEventListener("click", () => void execute(() => api.openLogin((element("account-label") as HTMLInputElement).value), "Muse Web sign-in window opened"));
element("sync").addEventListener("click", () => void execute(async () => {
  await api.syncLogin((element("account-label") as HTMLInputElement).value);
  await refresh();
}, "Muse Web session imported"));
element("refresh").addEventListener("click", () => void execute(refresh, "Refreshed"));
element("create-video").addEventListener("click", () => void execute(async () => {
  const prompt = (element("prompt") as HTMLTextAreaElement).value;
  const duration = Number((element("duration") as HTMLSelectElement).value);
  const size = (element("size") as HTMLSelectElement).value;
  const imageInput = element("image") as HTMLInputElement;
  const file = imageInput.files?.item(0);
  let image: string | undefined;
  if (file) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Unsupported reference image");
    if (file.size > 10 * 1024 * 1024) throw new Error("Reference image must be under 10MB");
    image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string"
        ? resolve(reader.result) : reject(new Error("Could not read image"));
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(file);
    });
  }
  await api.submitVideo(prompt, duration, size, image);
  await refresh();
}, "Task submitted. Refresh tasks to view progress."));
void execute(refresh, "Manager ready");
setInterval(() => { void refresh().catch((error: unknown) => output(String(error), true)); }, 15000);
