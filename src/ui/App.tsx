import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import EntriesList from "./Components/EntriesList";

function App() {
  const [count, setCount] = useState(0);
  const [appData, setAppData] = useState("");
  const [topStats, setTopStats] = useState({
    bitcoinPrice: 97824,
    totalReturn: 205012,
    totalSats: 213541001154,
    valueUSD: 205015.51,
    averageEntry: 52152,
    totalInvested: 100000,
  });

  useEffect(() => {
    // window.electron.loadAppData().then((data) => {
    //   setAppData(data);
    // });
    // const unsub = window.electron.subscribeStatistics((statistics) =>
    //   console.log(statistics)
    // );
    // return unsub;
  }, []);

  const formatUsd = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatSats = (value: number) => {
    // add commas to the number and drop the decimal
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container">
      <div>
        <div className="row">
          <div className="metric-item">
            <p>Bitcoin Price</p>
            <p>{formatUsd(topStats.bitcoinPrice)}</p>
          </div>
          <div className="metric-item">
            <p>Total Return</p>
            <p>{formatUsd(topStats.totalReturn)}</p>
          </div>
          <div className="metric-item">
            <p>Total Sats</p>
            <p>{formatSats(topStats.totalSats)}</p>
          </div>
        </div>

        <div className="row">
          <div className="metric-item">
            <p>Value USD</p>
            <p>{formatUsd(topStats.valueUSD)}</p>
          </div>
          <div className="metric-item">
            <p>Average Entry</p>
            <p>{formatUsd(topStats.averageEntry)}</p>
          </div>
          <div className="metric-item">
            <p>Total Invested</p>
            <p>{formatUsd(topStats.totalInvested)}</p>
          </div>
        </div>
      </div>
      <EntriesList />
    </div>
  );
}

export default App;
