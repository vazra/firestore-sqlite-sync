'use strict'
import Database from 'better-sqlite3'

// connect to database (will create if it doesn't exist
const db = new Database('whatever.xxx')

// check to see if we already initialized this database
let stmt = db.prepare(`SELECT name
    FROM sqlite_master
    WHERE
        type='table' and name='persons'
    ;`)
let row = stmt.get()
if (row === undefined) {
  console.log('WARNING: database appears empty; initializing it.')
  const sqlInit = `
        CREATE TABLE "persons" (
            "name"	TEXT,
            "phone"	TEXT,
            "id"	INTEGER,
            PRIMARY KEY("id")
        );

        INSERT INTO "persons"("name","phone","id") VALUES ("vazra","999");
        INSERT INTO "persons"("name","phone","id") VALUES ("vazra1","999111");
        INSERT INTO "persons"("name","phone","id") VALUES ("vazra2","999222");

        `
  db.exec(sqlInit)
}

console.log("database exists now, if it didn't already.")

export { db }
