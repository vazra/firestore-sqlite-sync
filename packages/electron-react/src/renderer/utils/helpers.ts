import path from "path";
import fs from "fs";

const remote = require("electron").remote;
const app = remote.app;

export const getDBDir = (dbname: string, dbfile: string) => {
  const dirPath = path.join(app.getPath("userData"), "db", dbname);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  const dbPath = path.join(dirPath, dbfile);
  console.log("DB_PATH: ", dbPath);
  return dbPath;
};

export function promiseProgress(
  proms: Promise<any>[],
  progress_cb: (x: number) => void
) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}

// helper function that starts performance - time measurement
export const timeStart = () => {
  return performance.now();
};

// helper function  to end and print  - time measurement
export const timeEnd = (timeStart: number, funName: string) => {
  var t1 = performance.now();
  console.log(`fun: ${funName} took ${(t1 - timeStart).toFixed(2)}ms`);
  return +(t1 - timeStart).toFixed(2);
};
export const kkk = "";
