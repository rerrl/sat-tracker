import Chart from "../Components/Chart";

interface SatCharterProps {
  hideBalances: boolean;
}

export default function SatCharter({ hideBalances }: SatCharterProps) {
  return (
    <div className="container" style={{ width: "100%", padding: "0" }}>
      <div className="title-header">
        <h1>Sat Charter</h1>
        <p>Visualization of your Bitcoin purchases over time</p>
      </div>
      <div className="chart-container" style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
        <Chart hideBalances={hideBalances} />
      </div>
    </div>
  );
}
