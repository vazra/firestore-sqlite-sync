import React from 'react'
// import Navbar from './components/Navbar'
// import Custom from './components/Custom'
import Home from './components/Home'
import './custom.css'
// import { BackboneProvider } from './providers/BackboneProvider'
// import IPCTest from './components/IPCTest'
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
    // <BackboneProvider>
    <SyncProvider fireDB={fdb} sqliteDB={window.sqlitedb} collectionDetails={watchingCollections}>
      {/* <Navbar /> */}
      {/* <IPCTest /> */}
      <Home />
      {/* <Custom /> */}
    </SyncProvider>
    // </BackboneProvider>
  )
}
export default App

// if (module.hot) {
//   module.hot.accept();
// }
