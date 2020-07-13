import { ipcRenderer } from 'electron'
import isDev from 'electron-is-dev'
import { config, connectTo, of } from 'node-ipc'
import { v4 as uuidv4 } from 'uuid'
import { db } from './sqlite/db'

let resolveSocketPromise: { (arg0: any): void; (value?: unknown): void }
let socketPromise = new Promise((resolve) => {
  resolveSocketPromise = resolve
})

const getServerSocket = () => {
  return socketPromise as Promise<string>
}

ipcRenderer.on('set-socket', (event, { name }) => {
  resolveSocketPromise(name)
})

const ipcConnect = (id: string, func: (arg0: any) => void) => {
  config.silent = true
  connectTo(id, () => {
    func(of[id])
  })
}

window.IS_DEV = isDev
window.getServerSocket = getServerSocket
window.ipcConnect = ipcConnect
window.sqlitedb = db

window.uuid = uuidv4
