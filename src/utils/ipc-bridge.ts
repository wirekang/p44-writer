import { contextBridge, ipcMain, ipcRenderer } from "electron";

export type IpcMapping = Record<string, Function>;

export function mapIpcHandle(apiKey: string, obj: any, methods: string[]) {
  methods.forEach((m) => {
    ipcMain.handle(`${apiKey}:${m}`, (e, ...args) => {
      return obj[m](...args);
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
