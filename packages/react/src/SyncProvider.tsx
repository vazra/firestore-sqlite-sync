import React, { useEffect, useContext } from 'react'
import { FireSync, ICollectionDetails } from '@firestore-sqlite-sync/core'
import { IFireDB } from '@firestore-sqlite-sync/core/lib/cjs/firedb'
import Database from 'better-sqlite3'

type ContextProps = {
  sync: FireSync | undefined
}

const SyncContext = React.createContext<ContextProps>({ sync: undefined })

function useSync() {
  const syncObj = useContext(SyncContext)
  return syncObj.sync
}

interface ISyncProvider {
  fireDB: IFireDB
  sqliteDB: Database
  collectionDetails: ICollectionDetails
  children: React.ReactNode
}

const SyncProvider = ({ fireDB, sqliteDB, collectionDetails, children }: ISyncProvider) => {
  const [sync, setSync] = React.useState<FireSync | undefined>(undefined)

  useEffect(() => {
    //TODO : (test) if the config is changed, will it re-initialize
    const syncObj = new FireSync(fireDB, sqliteDB, collectionDetails)
    setSync(syncObj)
    console.log('kkk Sync : Initializing ')
  }, [fireDB, sqliteDB])

  return (
    <SyncContext.Provider
      value={{
        sync: sync,
      }}>
      {children}
    </SyncContext.Provider>
  )
}

export { useSync, SyncProvider }
