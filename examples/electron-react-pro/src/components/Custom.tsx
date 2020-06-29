import React, { useState } from "react";
import { myTime, fbTime } from "vazpack";

const Custom = () => {
  const [count, setCount] = useState(1);
  return (
    <div className="ui container">
      <h3>
        React{" "}
        <span>
          <img
            src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-32.png"
            width="32"
          />
        </span>
        + Parkcel{" "}
        <span>
          <img src="https://parceljs.org/assets/parcel@2x.png" width="32" />{" "}
        </span>
        + Electron{" "}
        <span>
          <img src="https://electronjs.org/images/favicon.ico" width="32" />
        </span>{" "}
        = Awesllmkmk cool madnomess lll! 🎉
      </h3>
      <h1>Count : {count} </h1>
      <button
        onClick={() => {
          setCount((c) => c + 1);
        }}
      >
        inc
      </button>{" "}
      <br />
      <br />
      <button
        onClick={() => {
          setCount((c) => c - 1);
        }}
      >
        dec
      </button>
      <br />
      <h1>a. {myTime(new Date())}</h1>
      <h1>b. {fbTime(new Date())}</h1>
    </div>
  );
};

export default Custom;
