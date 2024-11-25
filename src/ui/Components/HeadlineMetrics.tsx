import { useEffect, useState } from "react";
import { addCommas, dropDecimal, formatSats, formatUsd } from "../utils";
import BigNumber from "bignumber.js";

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

  const isInTheMoney = topStats.totalReturn >= 0;

  useEffect(() => {
    window.electron.getHeadlineStats().then(setTopStats);
  }, [triggerRefresh]);

  return (
    <div>
      <div className="row">
        <div className="metric-item neutral-blue">
          <p className="metric-title">Bitcoin Price</p>
          <p>{formatUsd(topStats.bitcoinPrice)}</p>
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Value USD</p>
          <p>{formatUsd(topStats.valueUsd)}</p>
        </div>
        <div className="metric-item bitcoin">
          <p className="metric-title">Total Sats</p>
          <p>{formatSats(topStats.totalSats)}</p>
        </div>
      </div>

      <div className="row">
        <div className="metric-item neutral-blue">
          <p className="metric-title">Average Entry</p>
          <p>{formatUsd(topStats.averageEntry)}</p>
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Total Invested</p>
          <p>{formatUsd(topStats.totalInvested)}</p>
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Total Return</p>
          <p>{formatUsd(topStats.totalReturn)}</p>
          <p>
            {isInTheMoney && topStats.totalInvested !== 0 ? "+" : ""}
            {topStats.totalInvested === 0
              ? "0"
              : dropDecimal(
                  addCommas(
                    BigNumber(topStats.totalReturn)
                      .dividedBy(topStats.totalInvested)
                      .times(100)
                      .toFixed(0)
                  )
                ) + " "}
            %
          </p>
        </div>
      </div>
    </div>
  );
}
