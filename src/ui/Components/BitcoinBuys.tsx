import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import "../App.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatSats, formatUsd } from "../utils";

export default function BitcoinBuys({
  onTableUpdate,
}: {
  onTableUpdate: () => void;
}) {
  const [data, setData] = useState<BitcoinBuy[]>([]);
  const [isAddingBuy, setIsAddingBuy] = useState(false);
  const [buyAmountUsd, setBuyAmountUsd] = useState(0);
  const [buyAmountSats, setBuyAmountSats] = useState(0);
  const [buyMemo, setBuyMemo] = useState<null | string>(null);
  const [buyDate, setBuyDate] = useState<Date>(new Date());
  const [editId, setEditId] = useState<null | number>(null);

  const columnHelper = createColumnHelper<BitcoinBuy>();

  const columns = [
    columnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => info.cell.getValue().toISOString().split("T")[0],
    }),
    columnHelper.accessor("amountPaidUsd", {
      header: () => "USD Paid",
      cell: (info) => formatUsd(info.cell.getValue()),
    }),
    columnHelper.accessor("amountReceivedSats", {
      header: () => "Sats Received",
      cell: (info) => formatSats(info.cell.getValue()),
    }),
    {
      id: "averagePrice",
      header: () => "Average Price per BTC",
      cell: ({ row }: { row: { original: BitcoinBuy } }) => {
        const amountPaidUsd = row.original.amountPaidUsd;
        const amountReceivedSats = row.original.amountReceivedSats;
        const amountReceivedBitcoin =
          BigNumber(amountReceivedSats).dividedBy(100_000_000);
        const averagePricePerBitcoin = BigNumber(amountPaidUsd).dividedBy(
          amountReceivedBitcoin
        );

        return formatUsd(averagePricePerBitcoin.toNumber());
      },
    },
    {
      id: "delete",
      header: () => "Edit",
      cell: ({ row }: { row: { original: BitcoinBuy } }) => {
        return (
          <button
            className={editId === row.original.id ? "negative" : ""}
            onClick={async () => {
              if (editId === row.original.id) {
                await window.electron.deleteBitcoinBuy(row.original.id);
                const newData = data.filter(
                  (buy) => buy.id !== row.original.id
                );
                setData(newData);
                onTableUpdate();
              }

              setEditId(row.original.id);
            }}
          >
            {editId === row.original.id ? "Del" : "Edit"}
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getLocaleDateString = (buyDate: Date) => {
    const localeDate = buyDate.toLocaleDateString().split("/").join("-");
    const [month, day, year] = localeDate.split("-");

    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = (date: Date) => {
    // get local time in 24 hour format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleAddBuyClick = async () => {
    if (isAddingBuy) {
      if (buyAmountUsd === 0 || buyAmountSats === 0 || !buyDate) {
        alert("Please enter a valid amount");
        return;
      }

      // save the buy
      const newBuy = await window.electron.saveBitcoinBuy(
        buyDate,
        buyAmountUsd,
        buyAmountSats,
        buyMemo
      );

      const newData = [...data, newBuy].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      setData(newData);
      onTableUpdate();
    } else {
      setBuyDate(new Date());
      setBuyAmountUsd(0);
      setBuyAmountSats(0);
      setBuyMemo(null);
    }

    setIsAddingBuy(!isAddingBuy);
  };

  useEffect(() => {
    window.electron.getBitcoinBuys().then((data) => {
      setData(data);
    });
  }, []);

  // only keep editId in state for 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEditId(null);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [editId]);

  return (
    <>
      <div className="headline-row">
        <div className="latest-entries-title">
          <p>Most Recent Buys</p>
        </div>

        <div className="recent-buys-buttons">
          {isAddingBuy ? (
            <button
              className="new-entry"
              onClick={() => setIsAddingBuy(!isAddingBuy)}
            >
              Cancel
            </button>
          ) : null}
          <button className="new-entry" onClick={handleAddBuyClick}>
            {isAddingBuy ? "Save" : "Add Buy"}
          </button>
        </div>
      </div>

      {isAddingBuy ? (
        <>
          <div className="row">
            <div className="metric-item">
              <p>USD Spent</p>
              <input
                type="number"
                onChange={(e) => setBuyAmountUsd(parseFloat(e.target.value))}
              />
            </div>
            <div className="metric-item">
              <p>Sats Received</p>
              <input
                type="number"
                onChange={(e) => setBuyAmountSats(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="row">
            <div className="metric-item">
              <p>Date</p>
              <input
                type="datetime-local"
                value={`${getLocaleDateString(buyDate)}T${getLocalTimeString(
                  buyDate
                )}`}
                onChange={(e) => {
                  setBuyDate(new Date(e.target.value));
                }}
              />
            </div>
            <div className="metric-item">
              <p>Memo (optional)</p>
              <input type="text" onChange={(e) => setBuyMemo(e.target.value)} />
            </div>
          </div>
        </>
      ) : (
        <div className="p-2">
          <table className="table-bordered">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  className={editId === row.original.id ? "neutral-blue" : ""}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="h-4" />
        </div>
      )}
    </>
  );
}
