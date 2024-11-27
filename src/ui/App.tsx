import "./App.css";
import { useState } from "react";
import BitcoinBuys from "./Components/BitcoinBuys";
import HeadlineMetrics from "./Components/HeadlineMetrics";
import Divider from "./Components/Divider";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function App() {
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  return (
    <div className="container">
      <div className="title-header">
        <h1>Sat Tracker</h1>
        <div
          className="eye-logos clickable"
          onClick={() => {
            setHideBalances(!hideBalances);
          }}
        >
          {hideBalances ? <IoEyeOutline /> : <IoEyeOffOutline />}
        </div>
      </div>
      <HeadlineMetrics
        triggerRefresh={triggerRefresh}
        hideBalances={hideBalances}
      />
      <Divider />
      <BitcoinBuys
        hideBalances={hideBalances}
        onTableUpdate={() => setTriggerRefresh(!triggerRefresh)}
      />
    </div>
  );
}

export default App;
