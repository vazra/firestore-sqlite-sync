import { timeStamp } from "console";
import { fdb } from "../firestore/app";
import { createTables, db, TABLE_SYNC_STATUS } from "../sqlite/database";
export const CNAME_CUSTOMERS = "customers";
export const CNAME_SETTINGS = "settings";
import Knex from "knex";
import { dataFromSnapshot } from "../firestore/helpers";

const DEFAULT_SYNC_CONFIG = {
  enabled: true,
  cooldownTime: 10000, // time in milliseconds between sync the same collection
  collections: {
    // collection name and , name of fields to be synced
    customer: ["name", "phone", "address"],
    products: ["name", "description"],
  },
};

// sample object in the settings collection
// lastUpdated : {
//   "collection1": 'timeStamp'
//   "collection2": 'timeStamp'
// }
// --- the last updated time will be updated on each udpate/create request in the specific collection only for selected fields.
// Note: You can either use this method or decied when you want sync your data based on how you are consuming the data, and how often it will be udpated.

export type ICollectionDetails = {
  list: string[];
  fields: { [key: string]: string[] };
};

// sync all services
class Sync {
  // configurations
  config = DEFAULT_SYNC_CONFIG;
  // sync database
  db: Promise<Knex<any, unknown[]>>;

  watchingCollections: ICollectionDetails;

  lastUpdated: Map<string, any> = new Map(); // { [key: string]: any } = {};

  listner: () => void; // TODO: (test)what if the listner creation failed once

  constructor() {
    // setup db for synx
    this.listner = this._createSyncListner();

    // setting up watching collections
    this.watchingCollections = {
      list: Object.keys(this.config.collections),
      fields: this.config.collections,
    };
    this.db = this.setupSyncDB(this.watchingCollections);
  }

  // create and set a realtime listner from firestore
  private _createSyncListner() {
    // check last up
    return fdb
      .collection(CNAME_SETTINGS)
      .doc("lastUpdated")
      .onSnapshot((doc) => {
        // TODO : Implement deboubse for sync call
        const newDoc: Map<string, any> = dataFromSnapshot(doc) || new Map();

        for (const aTable of this.watchingCollections.list) {
          if (!newDoc.get(aTable)) {
            console.warn(
              `table : ${aTable} is not availabe in the lastupdated doc from server`
            );
            this.lastUpdated.set(aTable, 0);
          } else if (newDoc.get(aTable) > this.lastUpdated.get(aTable)) {
            this.lastUpdated.set(aTable, 0);
            this._syncTable(aTable);
          } else {
            console.log(
              `table : ${aTable} is uptodate ${newDoc.get(
                aTable
              )} -> ${this.lastUpdated.get(aTable)}`
            );
          }
        }
      });
  }

  // calling this will check for localDB availability and re-create if any changes a
  // TODO : (analytics) add re-create count and create count as events in analytics
  async setupSyncDB(collection: ICollectionDetails) {
    await createTables(collection);
    return db;
  }

  // filter doc of a specific table
  _filterDoc(doc: Map<string, any>, tableName: string) {
    const newDoc = new Map();
    for (const aField of this.watchingCollections.fields[tableName]) {
      newDoc.set(aField, doc.get(aField));
    }
    return newDoc;
  }

  // when something is changed call this function to sync the respective collection.
  _syncTable(tableName: string) {
    const lastUpdatedTime = 0; // get from db
    // call firestore request with last udpataed time.
    fdb
      .collection(tableName)
      .where("ut", ">", lastUpdatedTime)
      .get()
      .then(async (querySnapshot) => {
        // get add docs from the snapshot
        const docs = querySnapshot.docs.map((doc) => dataFromSnapshot(doc));

        const newLatestUpdatedTime = Math.max(
          ...docs.map((o) => o.get("ut")),
          0
        );

        console.log("newLatestUpdatedTime :", newLatestUpdatedTime);

        const localdb = await this.db;

        // saving to db with chunks of 50
        const chunk = 50;
        for (let i = 0; i * chunk < docs.length; i += chunk) {
          let chunkDocs = docs.slice(i, i + chunk);
          // select only observing fields
          chunkDocs = chunkDocs.map((aDoc) => this._filterDoc(aDoc, tableName));
          localdb(tableName).insert(chunkDocs);
        }

        // save the latest updated time to db
        localdb(TABLE_SYNC_STATUS).update({
          id: tableName,
          ut: newLatestUpdatedTime,
        });

        // save the docs to db
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }
}

const sync = new Sync();

export default sync;

// TODO : (test) what will happen the sync fu
