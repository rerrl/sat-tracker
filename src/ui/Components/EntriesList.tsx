import "../App.css";

export default function EntriesList() {
  const entries = [
    {
      id: 1,
      date: "2021-09-01",
      side: "buy",
      asset: "BTC",
      quantity: 0.004,
      amount: 100,
    },
    {
      id: 2,
      date: "2021-09-02",
      side: "buy",
      asset: "BTC",
      quantity: 0.003,
      amount: 100,
    },
    {
      id: 3,
      date: "2021-09-03",
      side: "sell",
      asset: "BTC",
      quantity: 0.002,
      amount: 100,
    },
    {
      id: 4,
      date: "2021-09-04",
      side: "buy",
      asset: "BTC",
      quantity: 0.001,
      amount: 100,
    },
    {
      id: 5,
      date: "2021-09-05",
      side: "sell",
      asset: "BTC",
      quantity: 0.001,
      amount: 100,
    },
  ];

  return (
    <>
      <div className="headline-row">
        <div className="latest-entries-title">
          <p>Latest Entries</p>
        </div>
        <div className="new-entry">
          <p>New Entry</p>
        </div>
      </div>

      <div className="entries">
        {entries.map((entry) => (
          <ol className="entries-row" key={entry.id}>
            <li>{entry.date}</li>
            <li>{entry.side}</li>
            <li>{entry.asset}</li>
            <li>{entry.quantity}</li>
            <li>{entry.amount}</li>
          </ol>
        ))}
      </div>
    </>
  );
}
