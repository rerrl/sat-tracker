import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [appData, setAppData] = useState("");

  useEffect(() => {
    window.electron.loadAppData().then((data) => {
      setAppData(data);
    });

    const unsub = window.electron.subscribeStatistics((statistics) =>
      console.log(statistics)
    );
    return unsub;
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">APP DATA: {appData}</p>
    </>
  );
}

export default App;
