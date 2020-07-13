'use strict'
import Database from 'better-sqlite3'
import { getDBDir } from './path'

// connect to database (will create if it doesn't exist

const dbPath = getDBDir('electronreactpro', 'erp.sqlite3')

const db = new Database(dbPath)

export { db }
