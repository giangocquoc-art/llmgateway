import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("museManager", {
  status: () => ipcRenderer.invoke("manager:status"),
  chooseConfig: () => ipcRenderer.invoke("manager:choose-config"),
  openLogin: () => ipcRenderer.invoke("muse:open-login"),
  syncLogin: () => ipcRenderer.invoke("muse:sync-login"),
  accounts: () => ipcRenderer.invoke("muse:accounts"),
  tasks: () => ipcRenderer.invoke("muse:tasks"),
  submitVideo: (prompt: string, duration: number, size: string) =>
    ipcRenderer.invoke("muse:submit-video", { prompt, duration, size }),
  deleteAccount: (id: string) => ipcRenderer.invoke("muse:delete-account", id),
  choosePython: () => ipcRenderer.invoke("manager:choose-python"),
  downloadMedia: (url: string) => ipcRenderer.invoke("muse:download-media", url),
  openCliManager: () => ipcRenderer.invoke("manager:open-cli")
});
