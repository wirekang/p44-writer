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

export function mapIpcInvoke(apiKey: string, methods: string[]) {
  const o: any = {};
  methods.forEach((m) => {
    o[m] = (...args: any) => {
      console.log("[invoke]", apiKey, m, args);
      return ipcRenderer.invoke(`${apiKey}:${m}`, ...args);
    };
  });

  contextBridge.exposeInMainWorld(apiKey, o);
}
