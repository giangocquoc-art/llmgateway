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
  openCliManager: () => ipcRenderer.invoke("manager:open-cli")
});
