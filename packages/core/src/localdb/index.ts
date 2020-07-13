import { Database } from 'better-sqlite3'
import { IField, ICollectionDetails, IDoc } from '..'
import { prepareDocs } from './helpers'
const SYNC_META_TIME_FIELD = 'ut'
const SYNC_META_TABLE_NAME = 'sync_meta'
// TODO : (limitation) all ids are strings  & only string and numbers supported

/* STATEMENT CRAETORS */

const st_insert = (table: string, columns: IField[]) =>
  `INSERT OR REPLACE INTO ${table} VALUES ($id, ${columns && columns.map((col) => `$${col[0]}`).join(', ')})`

const st_create = (table: string, columns: IField[]) => {
  const column_string = columns ? columns.map((col) => `, "${col[0]}" ${col[1] === 'number' ? 'INTEGER' : 'TEXT'}`).join(' ') : ''
  return `CREATE TABLE ${table} ( "id" TEXT PRIMARY KEY ${column_string})`
}

export default class LocalDB {
  db: Database
  tables: string[]
  fields: { [key: string]: IField[] }

  constructor(db: Database, collDetails: ICollectionDetails) {
    this.db = db
    this.tables = collDetails.list
    this.fields = collDetails.fields
    this._setupTables()
  }
  private _setupTables() {
    this.db.pragma('journal_mode = WAL')
    // check if table exists and have same fields
    const createIfChanged = (tablename: string, fields: IField[]) => {
      // TODO : Verify table colums here
      const stmtTableMeta = this.db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name = ?;`).get(tablename)
      console.log('kkk stmtTableMeta - resp', stmtTableMeta)
      if (!stmtTableMeta) {
        console.log(`kkk st_create(${tablename}): `, st_create(tablename, fields))
        this.db.exec(st_create(tablename, fields))
        return true
      }
      return false
    }

    console.log('creating tables, if not exist', this.tables)
    console.log('kkk watching fields :', this.fields)

    // create sync_meta table if not exist
    const isNewTable = createIfChanged(SYNC_META_TABLE_NAME, [[SYNC_META_TIME_FIELD, 'number']])
    // if the sync_meta table is newly created, instert default value
    if (isNewTable) {
      const stmtInsert = this.db.prepare(st_insert(SYNC_META_TABLE_NAME, [[SYNC_META_TIME_FIELD, 'number']]))
      this.db.transaction(() => {
        for (const aTable of this.tables) stmtInsert.run({ id: aTable, ut: 0 })
      })
    }

    // create/re-create other tables if not exist or changed.
    for (const aTable of this.tables) {
      createIfChanged(aTable, this.fields[aTable])
    }
    console.log("database exists now, if it didn't already.")
  }
  // clear all tables.
  clearLocalDatabase = () => {
    console.log('deleting all tables..')
    const tableList = this.db.prepare(`SELECT name FROM sqlite_master WHERE type='table';`).get()
    const stmtDropTable = this.db.prepare('DROP $tablename;')
    for (const tablename of tableList) {
      this.db.transaction(() => stmtDropTable.run({ tablename }))
    }
  }

  //insert/update docs to table
  upsert = (table: string, docs: IDoc[]) => {
    const CHUNK_SIZE = 500
    const columns = this.fields[table]

    // prepate the data with all fields.
    const data = prepareDocs(columns, docs)

    // if thre is the list is too large, it will be inserted in chunks of CHUNK_SIZE
    for (let i = 0, j = data.length; i < j; i += CHUNK_SIZE) {
      const docsChunk = data.slice(i, i + CHUNK_SIZE)
      console.log('kkk queryString is : ', st_insert(table, columns))
      const insert = this.db.prepare(st_insert(table, columns))
      const ddd = this.db.transaction
      this.db.transaction((data: any[]) => {
        for (const obj of data) insert.run(obj)
      })(docsChunk)
    }
  }

  // Search in a table
  search = (tablename: string, query: string, order: string[], count: number) => {
    const searchResults: IDoc[] = []
    // search in each column with priority
    for (const column of order) {
      const docs = this.db.prepare(`SELECT * FROM ${tablename} WHERE ${column} LIKE %${query}% LIMIT ${count}`).all()
      searchResults.push(...docs)
      if (searchResults.length >= count) break
    }
  }

  // readDocs from db
  readDocs = (tablename: string, count: number, skip: number) => {
    const docs = this.db.prepare(`SELECT * FROM ${tablename} LIMIT ${count} OFFSET ${skip}`).all()
    return docs
  }

  getLastUpdatedTimeFromDB = (tablename: string): number => {
    const syncmeta = this.db.prepare(`SELECT ${SYNC_META_TIME_FIELD} FROM ${SYNC_META_TABLE_NAME} WHERE id=? `).get([tablename])

    console.log(`getLastUpdatedTimeFromDB statement- ${`SELECT ${SYNC_META_TIME_FIELD} FROM ${SYNC_META_TABLE_NAME} WHERE id=? `}`)
    console.log(`getLastUpdatedTimeFromDB syncmeta- ${tablename}`, syncmeta)
    return syncmeta?.ut || 0
  }

  setLastUpdatedTimeToDB = (tablename: string, time: number) => {
    this.db
      .prepare(`INSERT OR REPLACE INTO ${SYNC_META_TABLE_NAME} VALUES ($id, $${SYNC_META_TIME_FIELD})`)
      .run({ id: tablename, [SYNC_META_TIME_FIELD]: time })
  }
}
