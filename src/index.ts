import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { mapIpcHandle } from "./utils/ipc-bridge";
import { SqliteP44Api } from "./api/sqlitep44api";
import { METHODS } from "./api/p44-api";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

Menu.setApplicationMenu(null);

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

const p44api = new SqliteP44Api("main.db");

ipcMain.handle("value:prod", () => app.isPackaged);
mapIpcHandle("p44Api", p44api, METHODS);

app.on("ready", onReady);
app.on("window-all-closed", app.quit.bind(app));
