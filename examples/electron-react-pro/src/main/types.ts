import { v4 } from 'uuid'
import { Database } from 'better-sqlite3'
declare global {
  interface Window {
    getServerSocket: () => Promise<string>
    ipcConnect: any
    IS_DEV: boolean
    uuid: typeof v4
    sqlitedb: Database
  }
}

// handler types
export type THandlerFun = (...args: any[]) => Promise<any>
export type THandlers = {
  [x: string]: THandlerFun
}
