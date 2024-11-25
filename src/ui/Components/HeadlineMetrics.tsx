import { useEffect, useState } from "react";
import { formatSats, formatUsd } from "../utils";

export default function HeadlineMetrics({
  triggerRefresh,
}: {
  triggerRefresh: boolean;
}) {
  const [topStats, setTopStats] = useState<HeadlineStats>({
    bitcoinPrice: 0,
    totalReturn: 0,
    totalSats: 0,
    valueUsd: 0,
    averageEntry: 0,
    totalInvested: 0,
  });

  useEffect(() => {
    window.electron.getHeadlineStats().then(setTopStats);
  }, [triggerRefresh]);

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
          <p>{formatUsd(topStats.valueUsd)}</p>
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
