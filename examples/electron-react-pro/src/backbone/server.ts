import serverHandlers from "./server-handlers";
import * as ipc from "./server-ipc";

let isDev, version;

if (process.argv[2] === "--subprocess") {
  isDev = false;
  version = process.argv[3];

  let socketName = process.argv[4];
  ipc.init(socketName, serverHandlers);
} else {
  let { ipcRenderer, remote } = require("electron");
  isDev = true;
  version = remote.app.getVersion();

  ipcRenderer.on("set-socket", (event: any, { name }: any) => {
    console.log("Initializing server IPC ", name, event);
    ipc.init(name, serverHandlers);
  });
}

console.log(version, isDev);
