import { db } from './db'
import { THandlerFun } from '~/main/types'
import { getDBDir } from './path'

export const getPersons: THandlerFun = async ({}) => {
  const row = db.prepare('SELECT * FROM persons').get()
  console.log('getPersons', row)
  return JSON.stringify(row)
}

export const addPerson: THandlerFun = async ({ num }) => {
  const name = 'NewPerson-' + num
  const phone = '999' + num + num + num
  const stmt = db.prepare('INSERT INTO persons (name, phone) VALUES (?, ?)')
  const info = stmt.run(name, phone)
  return info.changes
}

export const getDB: THandlerFun = async ({}) => {
  const dbPath = getDBDir('electronreactpro', 'erp.sqlite3')

  return dbPath
}
