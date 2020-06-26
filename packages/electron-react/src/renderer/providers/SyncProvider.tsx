import React, { useEffect, useContext } from "react";
import { IFireDB, ISync, ISyncConfig, initSync } from "../service/sync";

type ContextProps = {
  sync: ISync | undefined;
};

const SyncContext = React.createContext<ContextProps>({ sync: undefined });

function useSync() {
  const syncObj = useContext(SyncContext);
  return syncObj.sync;
}

interface ISyncProvider {
  config: ISyncConfig;
  fireDB: IFireDB;
  children: React.ReactNode;
}

const SyncProvider = ({ config, fireDB, children }: ISyncProvider) => {
  const [sync, setSync] = React.useState<ISync | undefined>(undefined);

  useEffect(() => {
    //TODO : (test) if the config is changed, will it re-initialize
    const newSyncObj = initSync(config, fireDB);
    setSync(newSyncObj);
    console.log("kkk Sync : Initializing ");
  }, [config, fireDB]);

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
