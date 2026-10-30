import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("museManager", {
  status: () => ipcRenderer.invoke("manager:status"),
  restartWorker: () => ipcRenderer.invoke("muse:restart-worker"),
  chooseConfig: () => ipcRenderer.invoke("manager:choose-config"),
  openLogin: (label: string) => ipcRenderer.invoke("muse:open-login", label),
  syncLogin: (label: string) => ipcRenderer.invoke("muse:sync-login", label),
  accounts: () => ipcRenderer.invoke("muse:accounts"),
  tasks: () => ipcRenderer.invoke("muse:tasks"),
  cancelTask: (id: string) => ipcRenderer.invoke("muse:cancel-task", id),
  submitVideo: (prompt: string, duration: number, size: string) =>
    ipcRenderer.invoke("muse:submit-video", { prompt, duration, size }),
  deleteAccount: (id: string) => ipcRenderer.invoke("muse:delete-account", id),
  choosePython: () => ipcRenderer.invoke("manager:choose-python"),
  downloadMedia: (url: string) => ipcRenderer.invoke("muse:download-media", url),
  openCliManager: () => ipcRenderer.invoke("manager:open-cli")
});
