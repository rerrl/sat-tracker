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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="headline-row">
        <div className="latest-entries-title">
          <p>Most Recent Buys</p>
        </div>
        <div className="new-entry">
          <p>Add Buy</p>
        </div>
      </div>

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </>
  );
}
