import React, { useState } from 'react'
import { myTime, fbTime } from 'vazpack'
import path from 'path'
import fs from 'fs'

// const { remote, ipcRenderer } = window.require('electron')
// const ipcRenderer = require("ipcRenderer");
// const remote = require("remote");
// const app = remote.app

// export const getDBDir = (dbname: string, dbfile: string) => {
//   const dirPath = path.join(app.getPath("userData"), "db", dbname);
//   if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
//   const dbPath = path.join(dirPath, dbfile);
//   console.log("DB_PATH: ", dbPath);
//   return dbPath;
// };

function Custom() {
  const [count, setCount] = useState(1)
  // const [dbpath, setDBPath] = useState(getDBDir("sdsd", "data.db"));

  return (
    <div className='ui container'>
      <h3>
        you shit...{' '}
        <span>
          <img src='https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-32.png' width='32' />
        </span>
        + Parkcxl{' '}
        <span>
          <img src='https://parceljs.org/assets/parcel@2x.png' width='32' />{' '}
        </span>
        + Electron{' '}
        <span>
          <img src='https://electronjs.org/images/favicon.ico' width='32' />
        </span>{' '}
        = Awesllmkmk nice manda lll! 🎉
      </h3>
      {/* <h2>dbpath: {dbpath}</h2> */}
      <h1>Counts : {count} </h1>
      <button
        onClick={() => {
          setCount((c: number) => c + 1)
        }}>
        inc
      </button>{' '}
      <br />
      <br />
      <button
        onClick={() => {
          setCount((c: number) => c - 1)
        }}>
        dec
      </button>
      <br />
      <h1>a. {myTime(new Date())}</h1>
      <h1>b. {fbTime(new Date())}</h1>
    </div>
  )
}

export default Custom
