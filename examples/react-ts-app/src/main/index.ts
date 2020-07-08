import { app, BrowserWindow } from "electron";
import { fork, ChildProcess } from "child_process";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
declare const BACKBONE_WINDOW_WEBPACK_ENTRY: any;
// import db from "@firestore-sqlite-sync/core";
import isDev from "electron-is-dev";
import findOpenSocket from "./find-open-socket";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
let serverProcess: ChildProcess;

const createWindow = (socketName: string) => {
  // console.log("DB is ", db);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("did-finish-load : mainWindow.webContents.send :", mainWindow.webContents.send);
    console.log("did-finish-load : socketName :", socketName);
    mainWindow.webContents.send("set-socket", {
      name: socketName,
    });
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

function createBackgroundWindow(socketName: string) {
  const serverWin = new BrowserWindow({
    x: 500,
    y: 300,
    width: 700,
    height: 500,
    show: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  serverWin.loadURL(BACKBONE_WINDOW_WEBPACK_ENTRY);

  serverWin.webContents.on("did-finish-load", () => {
    serverWin.webContents.send("set-socket", { name: socketName });
  });
  serverWin.webContents.openDevTools();
}

function createBackgroundProcess(socketName: string) {
  serverProcess = fork(__dirname + "/index.js", ["--subprocess", app.getVersion(), socketName]);

  serverProcess.on("message", (msg) => {
    console.log(msg);
  });
}

const createWindowsWithSocket = async () => {
  const serverSocket = await findOpenSocket();
  console.log("KKKKKKKKKK createWindowsWithSocket: ", serverSocket);

  createWindow(serverSocket);

  if (isDev) {
    createBackgroundWindow(serverSocket);
  } else {
    createBackgroundProcess(serverSocket);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindowsWithSocket);

//createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindowsWithSocket();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
