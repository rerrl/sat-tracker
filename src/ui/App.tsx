import { useEffect, useState } from "react";
import "./App.css";
import BitcoinBuys from "./Components/BitcoinBuys";
import HeadlineMetrics from "./Components/HeadlineMetrics";
import Divider from "./Components/Divider";

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  useEffect(() => {
    // const unsub = window.electron.subscribeStatistics((statistics) =>
    //   console.log(statistics)
    // );
    // return unsub;
  }, []);

  return (
    <div className="container">
      <h1>Sat Tracker</h1>
      <HeadlineMetrics triggerRefresh={triggerRefresh} />
      <Divider />
      <BitcoinBuys onTableUpdate={() => setTriggerRefresh(!triggerRefresh)} />
    </div>
  );
}

export default App;
