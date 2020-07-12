import { IFireDB } from '../firestore'
import { IDoc, ISync } from '..'
import { TABLENAME_SETTINGS, KEY_LAST_UPDATED, KEY_UPDATED_TIME } from '../constants'
import firebase from 'firebase/app'
import 'firebase/firestore'

const serverTime = firebase.firestore.FieldValue.serverTimestamp
export const Timestamp = firebase.firestore.Timestamp

export default class FireDB {
  db: IFireDB
  constructor(firestoreDB: IFireDB) {
    this.db = firestoreDB
  }

  updateWithSync = async (sync: ISync, collectionId: string, docId: string, data: IDoc) => {
    try {
      await this.db
        .collection(collectionId)
        .doc(docId)
        .update({ ...data, [KEY_UPDATED_TIME]: serverTime() })

      await this.db
        .collection(TABLENAME_SETTINGS)
        .doc(KEY_LAST_UPDATED)
        .update({ [collectionId]: serverTime() })
      Promise.resolve()
    } catch (err) {
      console.log('Err in updateWithSync')
      console.warn(err)
      Promise.reject(err)
    }
  }

  insertWithSync = async (sync: ISync, collectionId: string, data: IDoc) => {
    try {
      await this.db.collection(collectionId).add({
        [KEY_UPDATED_TIME]: serverTime(),
        ...data,
      })

      await this.db
        .collection(TABLENAME_SETTINGS)
        .doc(KEY_LAST_UPDATED)
        .update({ [collectionId]: serverTime() })
      Promise.resolve()
    } catch (err) {
      console.warn(err)
      Promise.reject(err)
    }
  }
}
