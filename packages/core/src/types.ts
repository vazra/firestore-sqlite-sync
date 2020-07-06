export type IField = [string, 'string' | 'number']

export type ICollectionDetails = {
  list: string[]
  fields: { [key: string]: IField[] }
}

// documents with string key
export type IDoc = { [key: string]: any }

export type ISyncConfig = {
  enabled?: boolean
  cooldownTime?: number
  updatedTimeKey?: string
  settingsCollectionName?: string // the collection name to be used in the firestore database to store the last updated time.
  dbpath: string // path to store the sqlite db with, db name
  collections: { [key: string]: IField[] }
}
