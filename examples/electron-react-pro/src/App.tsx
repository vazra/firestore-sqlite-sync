import React from "react";
import Navbar from "./components/Navbar";
import Custom from "./components/Custom";
import "./custom.css";

function App() {
  return (
    <div>
      <Navbar />
      <Custom />
    </div>
  );
}
export default App;

// if (module.hot) {
//   module.hot.accept();
// }
