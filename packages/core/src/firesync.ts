import LocalDB from './localdb'
import { IDoc } from '.'
import { Database } from 'better-sqlite3'
import { ICollectionDetails } from './types'
import FireDB, { Timestamp, IFireDB } from './firedb'
import { TABLENAME_SETTINGS, KEY_LAST_UPDATED } from './constants'
import { dataFromSnapshot } from './firedb/helpers'

// CONFIF ---> DETAILS
// settingsCollectionName : collection name to be saved in the firestore to save the last updated time.

// sample object in the settings collection
// lastUpdated : {
//   "collection1": 'timeStamp'
//   "collection2": 'timeStamp'
// }
// --- the last updated time will be updated on each update/create request in the specific collection only for selected fields.
// Note: You can either use this method or decided when you want sync your data based on how you are consuming the data, and how often it will be updated.

// sync all services
export class FireSync {
  // sync database
  lastUpdated: IDoc = {} // { [key: string]: any } = {};

  listner: () => void // TODO: (test)what if the listener creation failed once
  fireDB: FireDB
  localDB: LocalDB

  constructor(firestoreInstance: IFireDB, sqliteDB: Database, collDetails: ICollectionDetails) {
    // setting up watching collections
    // TODO : (later) add a test here to make sure that the firebase db is initiated correctly.

    // TODO : (test) make sure that default config values are overwritten, when provided in the config
    this.fireDB = new FireDB(firestoreInstance, collDetails)
    this.localDB = new LocalDB(sqliteDB, collDetails)

    // setup db for sync
    this.listner = this._createSyncListner()
  }

  // create and set a realtime listener from firestore
  private _createSyncListner() {
    // TODO : (test) check what happens if there is no internet connection when turning on the app
    // if there is a listener on the object.. remove it before adding new.
    this.listner && this.listner()

    const lastUpdatedRef = this.fireDB.db.collection(TABLENAME_SETTINGS).doc(KEY_LAST_UPDATED)

    return lastUpdatedRef.onSnapshot(async (doc) => {
      // TODO : Implement debounce for sync call

      // ignore snapshots with hasPendingWrites (as the snapshot will contain "null" for the pending write field)
      if (doc.metadata.hasPendingWrites) return
      let newDoc = dataFromSnapshot(doc)
      if (!newDoc) {
        //TODO : (test) if there is any other chance of getting this undefined when the doc actually exists on server
        console.warn('lastUpdated doc is not available n server, creating empty object... ')
        // lastUpdatedRef.set({});
        newDoc = {}
      }
      console.log('kkk new snapshot : ', newDoc)

      for (const aTable of this.localDB.tables) {
        console.log('table -', aTable, newDoc[aTable])
        const LATimeFromServer = (newDoc[aTable] && newDoc[aTable].toMillis()) || 0
        const LATimeFromLocal = this.lastUpdated[aTable] || 0

        if (!LATimeFromServer) {
          console.warn(`kkk table : ${aTable} is not availabe in the lastupdated doc from server, ${LATimeFromLocal}(local)`)
          this.lastUpdated[aTable] = 0
        } else if (LATimeFromServer > LATimeFromLocal) {
          console.log(`kkk syncing table ${aTable}..  ${LATimeFromServer}(server)  -> ${LATimeFromLocal}(local)`)
          this.lastUpdated[aTable] = LATimeFromServer
          this._syncTable(aTable)
        }
        // else {
        //   console.log(
        //     `kkk table : ${aTable} is up-to-date ${LATimeFromServer}(server) -> ${LATimeFromLocal}(local)`
        //   );
        // }
      }
    })
  }

  // calling this will check for localDB availability and re-create if any changes a
  // TODO : (analytics) add re-create count and create count as events in analytics
  // async _setupSyncDB() {
  //   const db = getDB(this.config.dbpath)
  //   await createTables(this.watchingCollections)
  //   return db
  // }

  // when something is changed call this function to sync the respective collection.
  async _syncTable(tableName: string) {
    console.log('kkk Synching >>> ', tableName)
    const luTimeFromDB = this.localDB.getLastUpdatedTimeFromDB(tableName)
    const luTimestamp = Timestamp.fromMillis(luTimeFromDB)
    // call firestore request with last updated time.
    console.log(`fetching firestore data with ut ${luTimeFromDB}`)
    this.fireDB.db
      .collection(tableName)
      .where('ut', '>', luTimestamp)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot.docs.length === 0) return // if no docs are available, return
        console.log(`fetched ${querySnapshot.docs.length} item from firestore`)

        // get add docs from the snapshot..

        const docs = querySnapshot.docs.map((doc) => dataFromSnapshot(doc)).filter((doc) => doc !== undefined) as IDoc[]

        const newLatestUpdatedTime = Math.max(...docs.map((aDoc) => aDoc?.ut?.toMillis() || 0), 0)
        console.log(
          `last updated time based on the fetched data is  ${newLatestUpdatedTime} (old was ${
            luTimeFromDB === newLatestUpdatedTime ? 'same' : luTimeFromDB
          })`
        )

        // console.log(`kkk got ${querySnapshot.docs.length} items from server , last_update (${newLatestUpdatedTime} << old-${luTimeFromDB})`)

        // saving to db with chunks of 50
        const chunk = 50
        for (let i = 0; i * chunk < docs.length; i += chunk) {
          let chunkDocs = docs.slice(i, i + chunk)
          this.localDB.upsert(tableName, chunkDocs)
        }

        this.localDB.setLastUpdatedTimeToDB(tableName, newLatestUpdatedTime)
        console.log(`saving last updated time to sqlite for table ${tableName} -> ${newLatestUpdatedTime}`)
      })
      .catch(function (error) {
        console.log('kkk Error getting documents: ', error)
      })
  }
}

// export type IFireSync = InstanceType<typeof FireSync>

export default FireSync

// TODO : (test) what will happen it multiple updates came before completing the first update?
// TODO : (test) on dev env when tested with hot-reloading in webpack, when the code in this file is changed the onSnapshot listeners were being added additionally. when that happens, the onSnapshot will be called multiple times for a single data change. check if there is any possible scenarios like this in real-word usecase.
