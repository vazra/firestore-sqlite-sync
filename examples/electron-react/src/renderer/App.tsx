import React from 'react'
import Home from './components/Home'
import './custom.css'
import { SyncProvider } from '@firestore-sqlite-sync/react'
import { fdb } from './firestore'
import { ICollectionDetails, IField } from '@firestore-sqlite-sync/core'

function App() {
  const watchingCollections: ICollectionDetails = {
    list: ['customers', 'products'],
    fields: {
      customers: [
        ['name', 'string'],
        ['address', 'string'],
        ['phone', 'string'],
      ],
      products: [['pid', 'string']],
    },
  }

  return (
    <SyncProvider fireDB={fdb} sqliteDB={window.sqlitedb} collectionDetails={watchingCollections}>
      <Home />
    </SyncProvider>
  )
}
export default App
