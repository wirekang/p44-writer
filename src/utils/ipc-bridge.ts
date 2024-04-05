import { contextBridge, ipcMain, ipcRenderer } from "electron";

export type IpcMapping = Record<string, Function>;

export function mapIpcHandle(m: IpcMapping) {
  Object.entries(m).forEach(([chan, f]) => {
    ipcMain.handle(chan, (e, ...args) => {
      console.log("[handle]", chan, args);
      return f(...args);
    });
  });
}

export function mapIpcInvoke(
  apiKey: string,
  methodChannels: Record<string, string>,
) {
  const o: any = {};
  Object.entries(methodChannels).forEach(([m, c]) => {
    o[m] = (...args: any) => {
      console.log("[invoke]", m, c, args);
      return ipcRenderer.invoke(c, ...args);
    };
  });

  contextBridge.exposeInMainWorld(apiKey, o);
}
