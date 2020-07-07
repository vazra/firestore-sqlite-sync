import { db } from './db'
import { Statement } from 'better-sqlite3'
import { WatchingCollections } from '../config'
import { IField, IDoc } from '..'
const SYNC_META_TIME_FIELD = 'ut'
const SYNC_META_TABLE_NAME = 'sync_meta'

// TODO : (limitation) all ids are strings  & only string and numbers supported

/* STATEMENTS */
// insert into table
const st_table_list = `SELECT name FROM sqlite_master WHERE type='table';`

const st_meta = `SELECT name FROM sqlite_master WHERE type='table' and name = ?;`

const st_read_all = `SELECT * FROM $tablename LIMIT $count OFFSET $skip`

// const st_read = `SELECT * FROM $tablename WHERE $table='$query' LIMIT $count OFFSET $skip`

const st_search = `SELECT * FROM $tablename WHERE $column LIKE %$query% LIMIT $count`

const st_insert = (table: string, columns: IField[]) =>
  `INSERT OR REPLACE INTO ${table} VALUES (id, ${columns && columns.map((col) => `$${col[0]}`).join(', ')})`

const st_insert_ut = `INSERT OR REPLACE INTO ${SYNC_META_TABLE_NAME} VALUES (id, ${SYNC_META_TIME_FIELD})`
const st_read_ut = `SELECT ${SYNC_META_TIME_FIELD} FROM ${SYNC_META_TABLE_NAME} WHERE id='$collection' `

const st_create = (table: string, columns: IField[]) =>
  `CREATE TABLE ${table} ( "id" TEXT PRIMARY KEY${
    columns && columns.map((col) => `"${col[0]}" ${col[1] === 'number' ? 'INTEGER' : 'TEXT'}`).join(', ')
  })`

/* HELPERS */

// check if table exists and have same fields
const createIfChanged = (tablename: string, fields: IField[]) => {
  // TODO : Verify table colums here
  const stmtTableMeta = db.prepare(st_meta).get(tablename)
  console.log('kkk stmtTableMeta - resp', stmtTableMeta)
  if (!stmtTableMeta) {
    db.exec(st_create(tablename, fields))
    return true
  }
  return false
}

// returns a trasation function with the statement given as param
const multiTransaction = (statement: Statement<any[]>) => {
  // TODO : validate structure of the data
  return db.transaction((data: any[]) => {
    for (const obj of data) statement.run(obj)
  })
}

// creates list of documents that can be inserted to db using the prepared statements
const prepareDocs = (fields: IField[], data: IDoc[]) => {
  const preparedList = []
  for (const aDoc of data) {
    const newDoc: IDoc = {}

    if (!!aDoc['id']) newDoc['id'] = aDoc['id']
    else continue // if id is not availabe skip the doc

    for (const aField of fields) {
      newDoc[aField[0]] = aDoc[aField[0]] || '' // TODO (test) : should this be null or ''
    }
    preparedList.push(newDoc)
  }
  return preparedList
}

/* DB Actions */

// this will create tables if not exist, or if the structure is changed.
export const createTables = () => {
  console.log('creating tables, if not exist')
  console.log('kkk WatchingCollections :', WatchingCollections)

  // create sync_meta table if not exist
  const isNewTable = createIfChanged(SYNC_META_TABLE_NAME, [[SYNC_META_TIME_FIELD, 'number']])
  // if the sync_meta table is newly created, instert default value
  if (isNewTable) {
    const stmtInsert = db.prepare(st_insert(SYNC_META_TABLE_NAME, [[SYNC_META_TIME_FIELD, 'number']]))
    db.transaction(() => {
      for (const aTable of WatchingCollections.list) stmtInsert.run({ id: aTable, ut: 0 })
    })
  }

  // create/re-create other tables if not exist or changed.
  for (const aTable of WatchingCollections.list) {
    createIfChanged(aTable, WatchingCollections.fields[aTable])
  }
  console.log("database exists now, if it didn't already.")
}

// clear all tables.
export const resetDB = () => {
  const tableList = db.prepare(st_table_list).get()
  const stmtDropTable = db.prepare('DROP $tablename;')
  for (const tablename of tableList) {
    db.transaction(() => stmtDropTable.run({ tablename }))
  }
}

//insert/update docs to table
export const upsertDocs = (table: string, docs: IDoc[]) => {
  const CHUNK_SIZE = 500
  const columns = WatchingCollections.fields[table]

  // prepate the data with all fields.
  const data = prepareDocs(columns, docs)

  // if thre is the list is too large, it will be inserted in chunks of CHUNK_SIZE
  for (let i = 0, j = data.length; i < j; i += CHUNK_SIZE) {
    const docsChunk = data.slice(i, i + CHUNK_SIZE)
    console.log('kkk queryString is : ', st_insert(table, columns))
    const insert = db.prepare(st_insert(table, columns))
    multiTransaction(insert)(docsChunk)
  }
}

// readDocs from db
export const readDocs = (tablename: string, count: number, skip: number) => {
  const docs = db.prepare(st_read_all).all({ tablename, count, skip })
  return docs
}

// Search in a table
export const search = (tablename: string, query: string, order: string[], count: number) => {
  const searchResults: IDoc[] = []
  // search in each column with priority
  for (const column of order) {
    const docs = db.prepare(st_search).all({ tablename, column, query, count })
    searchResults.push(...docs)
    if (searchResults.length >= count) break
  }
}

export const getLastUpdatedTimeFromDB = (collection: string): number => {
  const { ut } = db.prepare(st_read_ut).get({ collection })
  return ut || 0
}

export const setLastUpdatedTimeToDB = (collection: string, time: number) => {
  db.prepare(st_insert_ut).run({ id: collection, [SYNC_META_TIME_FIELD]: time })
}

createTables() // TODO (test) - check when and howmany times this is called.
