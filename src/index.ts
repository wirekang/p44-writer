import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { MemoryIo } from "./io/memory-io";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

Menu.setApplicationMenu(null);
if (app.isPackaged) {
}

const onReady = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

const io = new MemoryIo();

ipcMain.handle("prod", () => app.isPackaged);
ipcMain.handle("io:read", (e, ...args) => {
  return call(io, io.read, args);
});
ipcMain.handle("io:readAll", (e, ...args) => {
  return call(io, io.readAll, args);
});
ipcMain.handle("io:write", (e, ...args) => {
  return call(io, io.write, args);
});
ipcMain.handle("io:delete", (e, ...args) => {
  return call(io, io.delete, args);
});

app.on("ready", onReady);
app.on("window-all-closed", app.quit.bind(app));

function call(t: any, f: Function, args: any) {
  return f.apply(t, args);
}
