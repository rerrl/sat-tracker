import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ChartProps {
  hideBalances: boolean;
}

export default function Chart({ hideBalances }: ChartProps) {
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

  // Sort by date (oldest first)
  const sortedBuys = [...bitcoinBuys].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate cumulative sat holdings for each transaction
  const chartData = [];
  let runningTotal = 0;

  sortedBuys.forEach((buy, index) => {
    runningTotal += buy.amountReceivedSats;
    chartData.push({
      index: index + 1, // Transaction number (1-based)
      totalSats: runningTotal,
      newSats: buy.amountReceivedSats,
      date: new Date(buy.date).toLocaleDateString(),
      timestamp: new Date(buy.date).getTime(), // Use timestamp for x-axis positioning
      memo: buy.memo || undefined,
      amountPaidUsd: buy.amountPaidUsd
    });
  });

  return (
    <div className="chart-container" style={{ width: "100%" }}>
      <h3>Total Bitcoin Holdings Over Time</h3>
      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => {
                return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
              }}
              label={{ value: 'Date', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              label={{ value: 'Total Sats', angle: -90, position: 'insideLeft', offset: -15 }} 
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Total Sats") return [value.toLocaleString() + " sats", "Total"];
                return [value, name];
              }}
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip" style={{ 
                      backgroundColor: '#2a2a2a', 
                      color: '#ffffff',
                      padding: '10px', 
                      border: '1px solid #444',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      <p><strong>Transaction:</strong> #{data.index}</p>
                      <p><strong>Date:</strong> {data.date}</p>
                      <p><strong>Total Sats:</strong> {hideBalances ? "****" : data.totalSats.toLocaleString()}</p>
                      <p><strong>New Sats:</strong> {hideBalances ? "****" : "+" + data.newSats.toLocaleString()}</p>
                      <p><strong>Amount Paid:</strong> {hideBalances ? "$****" : "$" + data.amountPaidUsd.toFixed(2)}</p>
                      {data.memo && <p><strong>Memo:</strong> {data.memo}</p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line 
              type="monotone" 
              dataKey="totalSats" 
              stroke="#f2a900" 
              name="Total Sats" 
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
