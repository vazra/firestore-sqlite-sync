import React from "react";
import { hot } from "react-hot-loader";
const finishHOT = hot(module);
import Home from "./pages/Home";
import { fdb } from "./service/firestore/app";
import { getDBDir } from "./utils";
import { SyncProvider } from "./providers/SyncProvider";
// import { ISyncConfig } from '@firestore-sqlite-sync/core'

// const syncConfig: ISyncConfig = {
//   dbpath: getDBDir('sqlite', 'sync.sqlite3'),
//   collections: {
//     // collection name and , name of fields to be synced
//     customers: [
//       { name: 'name', type: 'string' },
//       { name: 'phone', type: 'string' },
//       { name: 'address', type: 'string' },
//     ],
//     products: [
//       { name: 'name', type: 'string' },
//       { name: 'description', type: 'string' },
//     ],
//   },
// }

function App() {
  return (
    <SyncProvider fireDB={fdb}>
      <Home />
    </SyncProvider>
  );
}

export default finishHOT(App);
