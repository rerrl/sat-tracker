import { useEffect, useState } from "react";
// import BigNumber from "bignumber.js";
import "../App.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatSats, formatToLocalDateTime } from "../utils";

export default function BitcoinBuys() {
  const [data, setData] = useState<BitcoinDeduction[]>([]);
  const [isAddingDeduction, setIsAddingDeduction] = useState(false);
  const [deductAmountSats, setDeductAmountSats] = useState(0);
  const [deductMemo, setDeductMemo] = useState<null | string>(null);
  const [deductionDate, setDeductionDate] = useState<Date>(new Date());
  const [editId, setEditId] = useState<null | number>(null);

  const columnHelper = createColumnHelper<BitcoinDeduction>();

  const columns = [
    columnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => info.cell.getValue().toISOString().split("T")[0],
    }),
    columnHelper.accessor("amountSats", {
      header: () => "Amount",
      cell: (info) => formatSats(info.cell.getValue()),
    }),
    columnHelper.accessor("memo", {
      header: () => "Memo",
      cell: (info) => info.cell.getValue(),
    }),
    {
      id: "delete",
      header: () => "Edit",
      cell: ({ row }: { row: { original: BitcoinDeduction } }) => {
        return (
          <button
            className={editId === row.original.id ? "negative" : ""}
            onClick={async () => {
              if (editId === row.original.id) {
                console.log("deleting deduction");
                await window.electron.deleteBitcoinDeduction(row.original.id);
                const newData = data.filter(
                  (buy) => buy.id !== row.original.id
                );
                setData(newData);
                // onTableUpdate();
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

  const handleAddDeduction = async () => {
    if (isAddingDeduction) {
      if (deductAmountSats === 0 || !deductionDate) {
        alert("Please enter a valid amount");
        return;
      }

      // save the new deduction event
      const newDeduction = await window.electron.saveBitcoinDeduction(
        deductionDate,
        deductAmountSats,
        deductMemo
      );

      const newData = [...data, newDeduction].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      setData(newData);
      // onTableUpdate();
    } else {
      setDeductionDate(new Date());
      setDeductAmountSats(0);
      setDeductMemo(null);
    }

    setIsAddingDeduction(!isAddingDeduction);
  };

  useEffect(() => {
    window.electron.getBitcoinDeductions().then((data) => {
      setData(data);
    });
  }, []);

  // only keep editId in state for 2 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEditId(null);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [editId]);

  return (
    <>
      <div className="headline-row">
        <div className="latest-entries-title">
          <p>{isAddingDeduction ? "Add Deduction" : "Recent Deductions"}</p>
        </div>

        <div className="recent-buys-buttons">
          {isAddingDeduction ? (
            <button
              className="new-entry"
              onClick={() => setIsAddingDeduction(!isAddingDeduction)}
            >
              Cancel
            </button>
          ) : null}
          <button className="new-entry" onClick={handleAddDeduction}>
            {isAddingDeduction ? "Save" : "Add Deduction"}
          </button>
        </div>
      </div>

      {isAddingDeduction ? (
        <>
          <div className="row">
            <div className="metric-item">
              <p>Date</p>
              <input
                type="datetime-local"
                value={formatToLocalDateTime(deductionDate)}
                onChange={(e) => {
                  setDeductionDate(new Date(e.target.value));
                }}
              />
            </div>
            <div className="metric-item">
              <p>Sats to deduct</p>
              <input
                type="number"
                onChange={(e) =>
                  setDeductAmountSats(parseFloat(e.target.value))
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="metric-item">
              <p>Memo (optional)</p>
              <input
                type="text"
                maxLength={40}
                onChange={(e) => setDeductMemo(e.target.value)}
              />
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
