import React, { useState } from "react";

export const ChildComponent = () => {
  const [count, setCount] = useState(0);
  return (
    <p>
      Child momo kok state: {count}{" "}
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </p>
  );
};
