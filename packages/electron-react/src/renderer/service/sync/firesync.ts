import {
  createTables,
  db,
  insertDataToTable,
  getLastUpdatedTimeFromDB,
  saveLastUpdatedTimeToDB,
} from "./sqlite";
import Knex from "knex";
import { IFireDB, Timestamp, dataFromSnapshot } from "./firestore";
import { ISyncConfig, ICollectionDetails, IDoc } from "./types";
import { DOC_NAME_LAST_UPDATED, CNAME_SETTINGS } from "./constants";

const DEFAULT_SYNC_CONFIG: ISyncConfig = {
  enabled: true,
  dbpath: "./sync.sqlite",
  updatedTimeKey: "ut",
  cooldownTime: 10000, // time in milliseconds between sync the same collection
  collections: {},
};

// sample object in the settings collection
// lastUpdated : {
//   "collection1": 'timeStamp'
//   "collection2": 'timeStamp'
// }
// --- the last updated time will be updated on each update/create request in the specific collection only for selected fields.
// Note: You can either use this method or decided when you want sync your data based on how you are consuming the data, and how often it will be updated.

// sync all services
class Sync {
  // configurations
  config: ISyncConfig;
  // sync database
  db: Promise<Knex<any, unknown[]>>;

  watchingCollections: ICollectionDetails;

  lastUpdated: IDoc = {}; // { [key: string]: any } = {};

  listner: () => void; // TODO: (test)what if the listener creation failed once
  firedb: IFireDB;

  constructor(config: ISyncConfig, firedb: IFireDB) {
    // setting up watching collections
    // TODO : (later) add a test here to make sure that the firebase db is initiated correctly.

    // TODO : (test) make sure that default config values are overwritten, when provided in the config
    this.config = { ...DEFAULT_SYNC_CONFIG, ...config };
    this.firedb = firedb;

    // fetching watching collections from config
    this.watchingCollections = {
      list: Object.keys(this.config.collections),
      fields: this.config.collections,
    };

    // setup db for sync
    this.db = this._setupSyncDB();
    this.listner = this._createSyncListner();
  }

  // create and set a realtime listener from firestore
  private _createSyncListner() {
    // TODO : (test) check what happens if there is no internet connection when turning on the app
    // if there is a listener on the object.. remove it before adding new.
    this.listner && this.listner();

    const lastUpdatedRef = this.firedb
      .collection(this.config.settingsCollectionName || CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED);

    return lastUpdatedRef.onSnapshot(async (doc) => {
      // TODO : Implement debounce for sync call

      // ignore snapshots with hasPendingWrites (as the snapshot will contain "null" for the pending write field)
      if (doc.metadata.hasPendingWrites) return;
      let newDoc = dataFromSnapshot(doc);
      if (!newDoc) {
        //TODO : (test) if there is any other chance of getting this undefined when the doc actually exists on server
        console.warn(
          "lastUpdated doc is not available n server, creating empty object... "
        );
        // lastUpdatedRef.set({});
        newDoc = {};
      }
      console.log("kkk new snapshot : ", newDoc);

      for (const aTable of this.watchingCollections.list) {
        const LATimeFromServer = newDoc[aTable]?.toMillis() || 0;
        const LATimeFromLocal = this.lastUpdated[aTable] || 0;

        if (!LATimeFromServer) {
          console.warn(
            `kkk table : ${aTable} is not availabe in the lastupdated doc from server, ${LATimeFromLocal}(local)`
          );
          this.lastUpdated[aTable] = 0;
        } else if (LATimeFromServer > LATimeFromLocal) {
          console.log(
            `kkk syncing table ${aTable}..  ${LATimeFromServer}(server)  -> ${LATimeFromLocal}(local)`
          );
          this.lastUpdated[aTable] = LATimeFromServer;
          this._syncTable(aTable);
        }
        // else {
        //   console.log(
        //     `kkk table : ${aTable} is up-to-date ${LATimeFromServer}(server) -> ${LATimeFromLocal}(local)`
        //   );
        // }
      }
    });
  }

  // calling this will check for localDB availability and re-create if any changes a
  // TODO : (analytics) add re-create count and create count as events in analytics
  async _setupSyncDB() {
    await createTables(this.watchingCollections);
    return db;
  }

  // when something is changed call this function to sync the respective collection.
  async _syncTable(tableName: string) {
    console.log("kkk START SYNC >>> ", tableName);
    const luTimeFromDB = await getLastUpdatedTimeFromDB(this.db, tableName);
    const luTimestamp = Timestamp.fromMillis(luTimeFromDB);
    // call firestore request with last updated time.
    this.firedb
      .collection(tableName)
      .where("ut", ">", luTimestamp)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot.docs.length === 0) return; // if no docs are available, return

        // get add docs from the snapshot..

        const docs = querySnapshot.docs.map((doc) => dataFromSnapshot(doc));

        const newLatestUpdatedTime = Math.max(
          ...docs.map((aDoc) => aDoc?.ut?.toMillis() || 0),
          0
        );
        console.log(
          `kkk got ${querySnapshot.docs.length} items from server , last_update (${newLatestUpdatedTime} << old-${luTimeFromDB})`
        );

        // saving to db with chunks of 50
        const chunk = 50;
        for (let i = 0; i * chunk < docs.length; i += chunk) {
          let chunkDocs = docs.slice(i, i + chunk);
          insertDataToTable(
            this.db,
            tableName,
            chunkDocs,
            this.watchingCollections
          );
        }

        saveLastUpdatedTimeToDB(this.db, tableName, newLatestUpdatedTime);
      })
      .catch(function (error) {
        console.log("kkk Error getting documents: ", error);
      });
  }
}

let sync: Sync;

export const initSync = (config: ISyncConfig, firedb: IFireDB) => {
  // don't re-initiate the sync, if doing so make sure to remove all listeners from the previous sync.
  if (!sync) sync = new Sync(config, firedb);
  else console.warn("Sync is already initialized, returning the old sync");
  return sync;
};

export type ISync = InstanceType<typeof Sync>;

// TODO : (test) what will happen it multiple updates came before completing the first update?
// TODO : (test) on dev env when tested with hot-reloading in webpack, when the code in this file is changed the onSnapshot listeners were being added additionally. when that happens, the onSnapshot will be called multiple times for a single data change. check if there is any possible scenarios like this in real-word usecase.
