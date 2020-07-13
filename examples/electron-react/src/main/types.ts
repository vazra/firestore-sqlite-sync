import { Database } from 'better-sqlite3'
declare global {
  interface Window {
    IS_DEV: boolean
    sqlitedb: Database
  }
}
