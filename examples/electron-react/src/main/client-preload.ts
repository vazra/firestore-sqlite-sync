import { ipcRenderer } from 'electron'
import isDev from 'electron-is-dev'
import { db } from './sqlite/db'

window.IS_DEV = isDev
window.sqlitedb = db
