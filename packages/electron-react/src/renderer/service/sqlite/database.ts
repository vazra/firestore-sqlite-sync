import knex from "knex";
import { ICollectionDetails } from "../sync/firesync";
import { getDBDir } from "../../utils";

const config = {
  client: "sqlite3",
  debug: true,
  connection: {
    filename: getDBDir("sqlite", "data.sqlite"),
    // database: "my_db",
    // user: "username",
    // password: "password",
  },
  useNullAsDefault: true,
};

export const db = knex(config);
export const TABLE_SYNC_STATUS = "sync_status";
export const createTables = (
  collections: ICollectionDetails,
  version: number = 0
) => {
  // TODO : Recreate table if versions dont match.
  const tableProms = [];
  // create sync status table
  tableProms.push(
    db.schema
      .createTable(TABLE_SYNC_STATUS, function (table) {
        // TODO : Confirm that each config will have fields obj
        // create fields for tach table
        table.string("id"); // tablename field as id
        table.bigInteger("ut").defaultTo(0); // updated time field
      })
      .then(() => {
        console.log("adding tables in ", TABLE_SYNC_STATUS);
        const tableList = [];

        for (const aTableName of collections.list)
          tableList.push({ id: aTableName });

        knex(TABLE_SYNC_STATUS).insert(tableList);
      })
  );

  // create collection tables
  for (const aTableName of collections.list) {
    tableProms.push(
      db.schema.createTable(aTableName, function (table) {
        // TODO : Confirm that each config will have fields obj
        // create fields for tach table
        for (const aField of collections.fields[aTableName]) {
          // only supporting string for now.
          table.string(aField);
        }
      })
    );
  }
  return Promise.all(tableProms);
};

// import { connect } from "trilogy";
// import { getDBDir } from "../../utils";

// const dbPath = getDBDir("sqlite", "data.sqlite");

// export const db = connect(dbPath);

// TODO :(analytics) Connection timeout should send to analytics
