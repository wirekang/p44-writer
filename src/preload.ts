import { contextBridge, ipcRenderer } from "electron";
import { Io } from "./io/io";

export function makeIpcIoBridge(channelPrefix: string): Io {
  return {
    read: make(`${channelPrefix}:read`),
    readAll: make(`${channelPrefix}:readAll`),
    write: make(`${channelPrefix}:write`),
    delete: make(`${channelPrefix}:delete`),
  };
}

function make(chan: string) {
  return (...args: any[]) => ipcRenderer.invoke(chan, ...args);
}

contextBridge.exposeInMainWorld("io", makeIpcIoBridge("io"));
contextBridge.exposeInMainWorld("prod", ipcRenderer.invoke("prod"));
