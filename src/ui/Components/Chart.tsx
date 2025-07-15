import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

export default function Chart() {
  const [bitcoinBuys, setBitcoinBuys] = useState<BitcoinBuy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buys = await window.electron.getBitcoinBuys();
        setBitcoinBuys(buys);
      } catch (error) {
        console.error("Failed to fetch Bitcoin buys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (bitcoinBuys.length === 0) {
    return <div>No Bitcoin purchase data available to display.</div>;
  }

  // Sort by date for the chart
  const sortedBuys = [...bitcoinBuys].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Create one data point per buy
  const chartData = sortedBuys.map((buy) => ({
    id: buy.id,
    date: new Date(buy.date).toLocaleDateString(),
    amountPaidUsd: buy.amountPaidUsd,
    amountReceivedSats: buy.amountReceivedSats,
    pricePerSat: buy.amountReceivedSats > 0 
      ? buy.amountPaidUsd / buy.amountReceivedSats 
      : 0,
    memo: buy.memo || ""
  }));

  return (
    <div className="chart-container">
      <h3>Bitcoin Acquisition History</h3>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis 
              type="category" 
              dataKey="date" 
              name="Date" 
              allowDuplicatedCategory={false} 
            />
            <YAxis 
              type="number" 
              dataKey="amountReceivedSats" 
              name="Sats" 
              label={{ value: 'Sats Received', angle: -90, position: 'insideLeft' }} 
            />
            <ZAxis 
              type="number" 
              dataKey="amountPaidUsd" 
              range={[60, 400]} 
              name="USD" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name, props) => {
                if (name === "Sats") return [`${value.toLocaleString()} sats`, name];
                if (name === "USD") return [`$${value.toLocaleString()}`, name];
                return [value, name];
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip" style={{ 
                      backgroundColor: '#fff', 
                      padding: '10px', 
                      border: '1px solid #ccc' 
                    }}>
                      <p><strong>Date:</strong> {data.date}</p>
                      <p><strong>Sats:</strong> {data.amountReceivedSats.toLocaleString()}</p>
                      <p><strong>USD:</strong> ${data.amountPaidUsd.toFixed(2)}</p>
                      <p><strong>Price/BTC:</strong> ${(data.pricePerSat * 100000000).toFixed(2)}</p>
                      {data.memo && <p><strong>Memo:</strong> {data.memo}</p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter 
              name="Bitcoin Purchases" 
              data={chartData} 
              fill="#f2a900" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
