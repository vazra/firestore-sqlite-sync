import { v4 } from 'uuid'

export {}
declare global {
  interface Window {
    getServerSocket: () => Promise<string>
    ipcConnect: any
    IS_DEV: boolean
    uuid: typeof v4
  }
}

// handler types
export type THandlerFun = (...args: any[]) => Promise<any>
export type THandlers = {
  [x: string]: THandlerFun
}
