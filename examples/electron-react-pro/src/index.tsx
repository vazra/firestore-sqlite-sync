import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ChildComponent } from "./child";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ backgroundColor: "white" }}>
      <h1>Hello Feeast Refresh!</h1>
      <p>Count {count}. It preserves state!</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <ChildComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// import React from "react";
// import ReactDOM from "react-dom";
// import "semantic-ui-css/semantic.min.css";
// import App from "./App";

// ReactDOM.render(<App />, document.getElementById("root"));
