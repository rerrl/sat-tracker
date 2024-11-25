import { useState } from "react";
import "../App.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatSats, formatUsd } from "../utils";

type BitcoinBuyEvent = {
  date: string;
  amountPaidUsd: number;
  amountReceivedSats: number;
  averagePrice: number;
};

const defaultData: BitcoinBuyEvent[] = [
  {
    date: "2021-01-01",
    amountPaidUsd: 1000,
    amountReceivedSats: 100000,
    averagePrice: 10000,
  },
  {
    date: "2021-01-02",
    amountPaidUsd: 2000,
    amountReceivedSats: 200000,
    averagePrice: 10000,
  },
  {
    date: "2021-01-03",
    amountPaidUsd: 3000,
    amountReceivedSats: 300000,
    averagePrice: 10000,
  },
  {
    date: "2021-01-04",
    amountPaidUsd: 4000,
    amountReceivedSats: 400000,
    averagePrice: 10000,
  },
];

const columnHelper = createColumnHelper<BitcoinBuyEvent>();

const columns = [
  columnHelper.accessor("date", {
    header: () => "Date",
    cell: (info) => info.cell.getValue(),
  }),
  columnHelper.accessor("amountPaidUsd", {
    header: () => "USD Paid",
    cell: (info) => formatUsd(info.cell.getValue()),
  }),
  columnHelper.accessor("amountReceivedSats", {
    header: () => "Sats Received",
    cell: (info) => formatSats(info.cell.getValue()),
  }),
  columnHelper.accessor("averagePrice", {
    header: () => "Average Price",
    cell: (info) => formatUsd(info.cell.getValue()),
  }),
];

export default function EntriesList() {
  const [data, _setData] = useState(() => [...defaultData]);
  const [isAddingBuy, setIsAddingBuy] = useState(false);
  const [buyDate, setBuyDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [buyAmountUsd, setBuyAmountUsd] = useState(0);
  const [buyAmountSats, setBuyAmountSats] = useState(0);
  const [buyMemo, setBuyMemo] = useState<null | string>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddBuyClick = () => {
    if (isAddingBuy) {
      if (buyAmountUsd === 0 || buyAmountSats === 0 || buyDate === "") {
        alert("Please enter a valid amount");
        return;
      }
      // Save the new buy
      console.log("save clicked", {
        buyAmountUsd,
        buyAmountSats,
        buyMemo,
        buyDate,
      });

      // reset the form
      setBuyDate(new Date().toISOString().split("T")[0]);
      setBuyAmountUsd(0);
      setBuyAmountSats(0);
      setBuyMemo(null);
    }

    setIsAddingBuy(!isAddingBuy);
  };

  return (
    <>
      <div className="headline-row">
        <div className="latest-entries-title">
          <p>Most Recent Buys</p>
        </div>

        <button className="new-entry" onClick={handleAddBuyClick}>
          {isAddingBuy ? "Save" : "Add Buy"}
        </button>
      </div>

      {isAddingBuy ? (
        <>
          <div className="row">
            <div className="metric-item">
              <p>Date</p>
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                onChange={(e) => setBuyDate(e.target.value)}
              />
            </div>
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
                <tr key={row.id}>
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
