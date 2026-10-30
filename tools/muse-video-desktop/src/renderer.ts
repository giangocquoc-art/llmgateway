type Status = { museOnline: boolean; cliOnline: boolean; keyCount: number; cliConfig: string; workerError: string; endpoint: string };
type Account = { id: string; label: string; status: string; enabled: boolean };
type Task = { id: string; status: string; result?: { url?: string }; error?: string };
type Manager = {
  status(): Promise<Status>;
  chooseConfig(): Promise<{ cliConfig: string; keyCount: number } | null>;
  openLogin(): Promise<void>;
  syncLogin(): Promise<object>;
  accounts(): Promise<{ data: Account[] }>;
  tasks(): Promise<{ data: Task[] }>;
  submitVideo(prompt: string, duration: number, size: string): Promise<{ id: string; status: string }>;
  deleteAccount(id: string): Promise<object>;
  openCliManager(): Promise<void>;
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
async function refresh(): Promise<void> {
  const status = await api.status();
  element("muse-status").textContent = status.museOnline ? "Online" : "Offline";
  element("cli-status").textContent = status.cliOnline ? "Reachable" : "Offline";
  element("key-count").textContent = String(status.keyCount);
  element("config-path").textContent = status.cliConfig || "Select a CLIProxy config.yaml to share client keys";
  element("endpoint").textContent = status.endpoint;
  element("worker-error").textContent = status.workerError;
  if (!status.museOnline) return;
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
    const item = textNode("div", `${task.id} · ${task.status}${task.error ? " · " + task.error : ""}`);
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
    taskList.append(item);
  }
  if (!tasks.data.length) taskList.textContent = "No video tasks.";
}
element("choose-config").addEventListener("click", () => void execute(async () => {
  await api.chooseConfig();
  await refresh();
}, "CLIProxy settings updated"));
element("cli-manager").addEventListener("click", () => void execute(() => api.openCliManager(), "Opened CLIProxy manager"));
element("login").addEventListener("click", () => void execute(() => api.openLogin(), "Muse Web sign-in window opened"));
element("sync").addEventListener("click", () => void execute(async () => {
  await api.syncLogin();
  await refresh();
}, "Muse Web session imported"));
element("refresh").addEventListener("click", () => void execute(refresh, "Refreshed"));
element("create-video").addEventListener("click", () => void execute(async () => {
  const prompt = (element("prompt") as HTMLTextAreaElement).value;
  const duration = Number((element("duration") as HTMLSelectElement).value);
  const size = (element("size") as HTMLSelectElement).value;
  const task = await api.submitVideo(prompt, duration, size);
  await refresh();
}, "Task submitted. Refresh tasks to view progress."));
void execute(refresh, "Manager ready");
