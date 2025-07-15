import { useState, useEffect } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import HeadlineMetrics from "../Components/HeadlineMetrics";
import BitcoinBuys from "../Components/BitcoinBuys";
import Divider from "../Components/Divider";
import BitcoinDeductions from "../Components/BitcoinDeductions";

enum Screen {
  ACQUISITIONS,
  DEDUCTIONS,
}

export default function SatTracker() {
  const [hideBalances, setHideBalances] = useState(false);
  const [screen, setScreen] = useState<Screen>(Screen.ACQUISITIONS);

  useEffect(() => {
    const handleBlur = () => {
      setHideBalances(true);
    };

    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

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
        hideBalances={hideBalances}
      />
      <Divider />
      <div className="tabs">
        <button
          className={screen === Screen.ACQUISITIONS ? "active" : ""}
          onClick={() => setScreen(Screen.ACQUISITIONS)}
        >
          Acquisitions
        </button>
        <button
          className={screen === Screen.DEDUCTIONS ? "active" : ""}
          onClick={() => setScreen(Screen.DEDUCTIONS)}
        >
          Deductions
        </button>
      </div>
      {screen === Screen.ACQUISITIONS ? (
        <BitcoinBuys
          hideBalances={hideBalances}
        />
      ) : (
        <BitcoinDeductions />
      )}
    </div>
  );
}
