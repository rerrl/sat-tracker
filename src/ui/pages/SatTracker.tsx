import { useState } from "react";
import HeadlineMetrics from "../Components/HeadlineMetrics";
import BitcoinBuys from "../Components/BitcoinBuys";
import Divider from "../Components/Divider";
import BitcoinDeductions from "../Components/BitcoinDeductions";

enum Screen {
  ACQUISITIONS,
  DEDUCTIONS,
}

interface SatTrackerProps {
  hideBalances: boolean;
}

export default function SatTracker({ hideBalances }: SatTrackerProps) {
  const [screen, setScreen] = useState<Screen>(Screen.ACQUISITIONS);

  return (
    <div className="container">
      <div className="title-header">
        <h1>Sat Tracker</h1>
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
