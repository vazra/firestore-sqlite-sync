import knex from "knex";
import { getDBDir } from "../../../utils";
import { IField, ICollectionDetails } from "../types";
export const TABLE_SYNC_STATUS = "sync_status";

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: getDBDir("sqlite", "data.sqlite"),
  },
  // debug: true,
  useNullAsDefault: true,
};

export const db = knex(knexConfig);

const _createIfNotExists = async (
  tableName: string,
  fields: IField[],
  onCreate?: Function
) => {
  try {
    const exists = await db.schema.hasTable(tableName);

    console.log(
      `kkk checking table - ${tableName} ${exists ? "does" : "do not"} exist`,
      tableName
    );
    if (!exists) {
      await db.schema.createTable(tableName, function (table) {
        // TODO : Confirm that each config will have fields obj
        // create fields for tach table
        for (const aField of fields) {
          // only supporting string for now.
          switch (aField.type) {
            case "number":
              // for all number columns default value is setting to 0
              table.bigInteger(aField.name);
              break;
            default:
              table.string(aField.name);
              break;
          }
        }
        table.string("id").primary().unique();
      });
      onCreate && (await onCreate());
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createTables = async (
  collections: ICollectionDetails,
  version: number = 0
) => {
  // TODO : Recreate table if versions don't match.
  const tableProms: Promise<any>[] = [];

  const syncTableFields: IField[] = [{ name: "ut", type: "number" }];

  // create sync status table
  tableProms.push(
    _createIfNotExists(TABLE_SYNC_STATUS, syncTableFields, async () => {
      const tableList = [];

      for (const aTableName of collections.list)
        tableList.push({ id: aTableName, ut: 0 });
      console.log("Adding initial data to sync table", tableList);
      const inserted = await db(TABLE_SYNC_STATUS).insert(tableList);
      console.log("kkk inserted", inserted);
      return inserted;
    })
  );

  // create collection tables
  console.log("kkk Creating Tables... ");
  for (const aTableName of collections.list) {
    tableProms.push(
      _createIfNotExists(aTableName, collections.fields[aTableName])
    );
  }
  return Promise.all(tableProms);
};

// TODO :(analytics) Connection timeout should send to analytics
