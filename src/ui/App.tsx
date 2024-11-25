import { useEffect } from "react";
import "./App.css";
import BitcoinBuys from "./Components/BitcoinBuys";
import HeadlineMetrics from "./Components/HeadlineMetrics";
import Divider from "./Components/Divider";

function App() {
  useEffect(() => {
    // const unsub = window.electron.subscribeStatistics((statistics) =>
    //   console.log(statistics)
    // );
    // return unsub;
  }, []);

  return (
    <div className="container">
      <h1>Sat Tracker</h1>
      <HeadlineMetrics />
      <Divider />
      <BitcoinBuys />
    </div>
  );
}

export default App;
