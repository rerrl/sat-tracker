import { useEffect, useState } from "react";
import { addCommas, dropDecimal, formatSats, formatUsd } from "../utils";
import BigNumber from "bignumber.js";

export default function HeadlineMetrics({
  hideBalances,
}: {
  hideBalances: boolean;
}) {
  const [showInBitcoin, setShowInBitcoin] = useState(false);
  const [topStats, setTopStats] = useState<HeadlineStats>({
    bitcoinPrice: 0,
    totalReturn: 0,
    totalSats: 0,
    valueUsd: 0,
    averageEntry: 0,
    totalInvested: 0,
  });
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [manualPrice, setManualPrice] = useState("");

  const isInTheMoney = topStats.totalReturn >= 0;

  const toggleBitcoin = () => {
    setShowInBitcoin(!showInBitcoin);
  };

  useEffect(() => {
    window.electron.getHeadlineStats().then(setTopStats);

    const unsub = window.electron.subscribeHeadlineMetrics(() => {
      window.electron.getHeadlineStats().then(setTopStats);
    });
    return unsub;
  }, []);

  return (
    <div>
      <div className="row">
        <div 
          className="metric-item neutral-blue clickable"
          onClick={() => {
            setIsEditingPrice(true);
            setManualPrice(topStats.bitcoinPrice.toString());
          }}
        >
          <p className="metric-title">Bitcoin Price</p>
          {isEditingPrice ? (
            <input
              type="number"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              onBlur={async () => {
                const newPrice = parseFloat(manualPrice) || 0;
                setTopStats(prev => ({
                  ...prev,
                  bitcoinPrice: newPrice
                }));
                await window.electron.saveManualBitcoinPrice(newPrice);
                setIsEditingPrice(false);
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const newPrice = parseFloat(manualPrice) || 0;
                  setTopStats(prev => ({
                    ...prev,
                    bitcoinPrice: newPrice
                  }));
                  await window.electron.saveManualBitcoinPrice(newPrice);
                  setIsEditingPrice(false);
                }
              }}
              autoFocus
              className="price-input"
            />
          ) : (
            <p>{formatUsd(topStats.bitcoinPrice)}</p>
          )}
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Value USD</p>
          <p>{formatUsd(hideBalances ? 0 : topStats.valueUsd)}</p>
        </div>
        <div onClick={toggleBitcoin} className="metric-item bitcoin clickable">
          <p className="metric-title">
            {showInBitcoin ? "Total Bitcoin" : "Total Sats"}
          </p>
          <p>
            {hideBalances
              ? 0
              : showInBitcoin
              ? BigNumber(topStats.totalSats)
                  .dividedBy(100000000)
                  .decimalPlaces(8)
                  .toNumber()
              : formatSats(topStats.totalSats)}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="metric-item neutral-blue">
          <p className="metric-title">Avg Acquisition</p>
          <p>{formatUsd(hideBalances ? 0 : topStats.averageEntry)}</p>
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Total Invested</p>
          <p>{formatUsd(hideBalances ? 0 : topStats.totalInvested)}</p>
        </div>
        <div
          className={`metric-item ${isInTheMoney ? "positive" : "negative"}`}
        >
          <p className="metric-title">Total Return</p>
          <p>{formatUsd(hideBalances ? 0 : topStats.totalReturn)}</p>
          <p>
            {isInTheMoney && topStats.totalInvested !== 0 ? "+" : ""}
            {topStats.totalInvested === 0 || hideBalances
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
