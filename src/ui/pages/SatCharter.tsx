import Chart from "../Components/Chart";

export default function SatCharter() {
  return (
    <div className="container">
      <div className="title-header">
        <h1>Sat Charter</h1>
        <p>Visualization of your Bitcoin purchases over time</p>
      </div>
      <div className="chart-container">
        <Chart />
      </div>
    </div>
  );
}
