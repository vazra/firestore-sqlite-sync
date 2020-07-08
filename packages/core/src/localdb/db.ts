console.warn('Intializing db')

import { SYNC_CONFIG } from '../config'

export const db = require('better-sqlite3')(SYNC_CONFIG.dbpath, { verbose: console.log })

db.pragma('journal_mode = WAL')
// TODO : close the connection after done.
