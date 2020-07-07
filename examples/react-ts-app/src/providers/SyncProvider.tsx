import React, { useEffect, useContext } from "react";
import { IFireDB, ISync, ISyncConfig, initSync } from "@firestore-sqlite-sync/core";

type ContextProps = {
  sync: ISync | undefined;
};

const SyncContext = React.createContext<ContextProps>({ sync: undefined });

function useSync() {
  const syncObj = useContext(SyncContext);
  return syncObj.sync;
}

interface ISyncProvider {
  fireDB: IFireDB;
  children: React.ReactNode;
}

const SyncProvider = ({ fireDB, children }: ISyncProvider) => {
  const [sync, setSync] = React.useState<ISync | undefined>(undefined);

  useEffect(() => {
    //TODO : (test) if the config is changed, will it re-initialize
    const newSyncObj = initSync(fireDB);
    setSync(newSyncObj);
    console.log("kkk Sync : Initializing ");
  }, [fireDB]);

  return (
    <SyncContext.Provider
      value={{
        sync: sync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export { useSync, SyncProvider };
