import { contextBridge, ipcRenderer } from "electron";
import { mapIpcInvoke } from "./utils/ipc-bridge";

mapIpcInvoke("io", {
  read: "io:read",
  readAll: "io:readAll",
  write: "io:write",
  delete: "io:delete",
});

contextBridge.exposeInMainWorld("prod", ipcRenderer.invoke("prod"));
