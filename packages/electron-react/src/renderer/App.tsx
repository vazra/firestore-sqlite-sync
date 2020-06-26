import React from "react";
import { hot } from "react-hot-loader/root";
import Home from "./pages/Home";
import { ISyncConfig } from "./service/sync";
import { fdb } from "./service/firestore/app";
import { getDBDir } from "./utils";
import { SyncProvider } from "./providers/SyncProvider";

const syncConfig: ISyncConfig = {
  dbpath: getDBDir("sqlite", "sync.sqlite3"),
  collections: {
    // collection name and , name of fields to be synced
    customers: [
      { name: "name", type: "string" },
      { name: "phone", type: "string" },
      { name: "address", type: "string" },
    ],
    products: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
    ],
  },
};

function App() {
  return (
    <SyncProvider config={syncConfig} fireDB={fdb}>
      <Home />
    </SyncProvider>
  );
}

export default hot(App);
