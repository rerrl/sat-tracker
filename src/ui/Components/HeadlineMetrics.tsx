import { useState } from "react";
import { formatSats, formatUsd } from "../utils";

export default function HeadlineMetrics() {
  const [topStats, setTopStats] = useState({
    bitcoinPrice: 97824,
    totalReturn: 205012,
    totalSats: 213541001154,
    valueUSD: 205015.51,
    averageEntry: 52152,
    totalInvested: 100000,
  });

  return (
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
  );
}
