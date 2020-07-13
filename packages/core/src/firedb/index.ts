import { IDoc } from '..'
import { TABLENAME_SETTINGS, KEY_LAST_UPDATED, KEY_UPDATED_TIME } from '../constants'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { IField, ICollectionDetails } from '../types'

const serverTime = firebase.firestore.FieldValue.serverTimestamp
export const Timestamp = firebase.firestore.Timestamp
export type IFireDB = firebase.firestore.Firestore

export default class FireDB {
  db: IFireDB
  collections: string[]
  fields: { [key: string]: IField[] }
  constructor(firestoreDB: IFireDB, collDetails: ICollectionDetails) {
    this.db = firestoreDB
    this.collections = collDetails.list
    this.fields = collDetails.fields
  }

  // add last updated time if any field being updated is in the watch list.
  _addLastUpdatedTime = async (collectionId: string, data: IDoc) => {
    // check if the update object has any watching key
    const isWatching = this.fields[collectionId]?.some((item) => data.hasOwnProperty(item[0]))
    // TODO(enhancement) : support deep updates, now only one level update is supported.

    if (isWatching) {
      console.log('this update needs sqlite update... ')
      await this.db
        .collection(TABLENAME_SETTINGS)
        .doc(KEY_LAST_UPDATED)
        .update({ [collectionId]: serverTime() })
    }
  }

  updateWithSync = async (collectionId: string, docId: string, data: IDoc) => {
    try {
      await this.db
        .collection(collectionId)
        .doc(docId)
        .update({ ...data, [KEY_UPDATED_TIME]: serverTime() })

      await this._addLastUpdatedTime(collectionId, data)

      Promise.resolve()
    } catch (err) {
      console.log('Err in updateWithSync')
      console.warn(err)
      Promise.reject(err)
    }
  }

  insertWithSync = async (collectionId: string, data: IDoc) => {
    try {
      await this.db.collection(collectionId).add({
        [KEY_UPDATED_TIME]: serverTime(),
        ...data,
      })
      await this._addLastUpdatedTime(collectionId, data)

      Promise.resolve()
    } catch (err) {
      console.warn(err)
      Promise.reject(err)
    }
  }
}

export * from './helpers'
