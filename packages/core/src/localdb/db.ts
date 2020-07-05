import sqlite3 from 'better-sqlite3'
import { SYNC_CONFIG } from '..'
import { createTables } from '.'

export const db = sqlite3(SYNC_CONFIG.dbpath, { verbose: console.log })
db.pragma('journal_mode = WAL')
// TODO : close the connection after done.

createTables()
