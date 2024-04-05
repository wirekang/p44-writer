import { app, BrowserWindow, Menu } from "electron";
import { MemoryIo } from "./io/memory-io";
import { mapIpcHandle } from "./utils/ipc-bridge";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

if (app.isPackaged) {
  Menu.setApplicationMenu(null);
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

mapIpcHandle({
  "value:prod": () => app.isPackaged,
  "io:read": io.read.bind(io),
  "io:readAll": io.readAll.bind(io),
  "io:write": io.write.bind(io),
  "io:delete": io.delete.bind(io),
  "io:dump": io.dump.bind(io),
});

app.on("ready", onReady);
app.on("window-all-closed", app.quit.bind(app));
