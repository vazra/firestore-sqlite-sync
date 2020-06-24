import React, { useEffect } from "react";
import { hot } from "react-hot-loader/root";
import Home from "./pages/Home";
import sync from "./service/sync/firesync";

function App() {
  useEffect(() => {
    console.log("Sync : Observing tables ", sync.watchingCollections);
  });
  return <Home />;
}

export default hot(App);
