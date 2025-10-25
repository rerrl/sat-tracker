import { useState } from "react";
import HeadlineMetrics from "../Components/HeadlineMetrics";
import BitcoinBuys from "../Components/BitcoinBuys";
import Divider from "../Components/Divider";
import BitcoinDeductions from "../Components/BitcoinDeductions";
import BalanceEvents from "../Components/BalanceEvents";

enum Screen {
  BALANCE_EVENTS,
  ACQUISITIONS,
  DEDUCTIONS,
}

interface SatTrackerProps {
  hideBalances: boolean;
}

export default function SatTracker({ hideBalances }: SatTrackerProps) {
  const [screen, setScreen] = useState<Screen>(Screen.BALANCE_EVENTS);

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
          className={screen === Screen.BALANCE_EVENTS ? "active" : ""}
          onClick={() => setScreen(Screen.BALANCE_EVENTS)}
        >
          Balance Events
        </button>
        <button
          className={screen === Screen.ACQUISITIONS ? "active" : ""}
          onClick={() => setScreen(Screen.ACQUISITIONS)}
        >
          Acquisitions (Legacy)
        </button>
        <button
          className={screen === Screen.DEDUCTIONS ? "active" : ""}
          onClick={() => setScreen(Screen.DEDUCTIONS)}
        >
          Deductions (Legacy)
        </button>
      </div>
      {screen === Screen.BALANCE_EVENTS ? (
        <BalanceEvents hideBalances={hideBalances} />
      ) : screen === Screen.ACQUISITIONS ? (
        <BitcoinBuys
          hideBalances={hideBalances}
          isLegacyMode={true}
        />
      ) : (
        <BitcoinDeductions isLegacyMode={true} />
      )}
    </div>
  );
}
