import net from "net";
import os from "os";
import { join } from "path";
import ipc from "node-ipc";

ipc.config.silent = true;

const SOCKET_NAME_PREFIX = "shdesk";

function isSocketTaken(name: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ipc.connectTo(name, () => {
      ipc.of[name].on("error", () => {
        ipc.disconnect(name);
        resolve(false);
      });

      ipc.of[name].on("connect", () => {
        ipc.disconnect(name);
        resolve(true);
      });
    });
  });
}

async function findOpenSocket() {
  let currentSocket = 1;
  console.log("checking", currentSocket);
  while (await isSocketTaken(SOCKET_NAME_PREFIX + currentSocket)) {
    currentSocket++;
    console.log("checking", currentSocket);
  }
  console.log("found socket", currentSocket);
  return SOCKET_NAME_PREFIX + currentSocket;
}

export default findOpenSocket;
