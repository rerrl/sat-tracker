import { useEffect, useState } from "react";
import "../App.css";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatSats, formatToLocalDateTime } from "../utils";

interface BalanceEventsProps {
  hideBalances: boolean;
}

export default function BalanceEvents({ hideBalances }: BalanceEventsProps) {
  const [data, setData] = useState<BalanceChangeEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [amountSats, setAmountSats] = useState(0);
  const [valueCents, setValueCents] = useState<number | null>(null);
  const [type, setType] = useState<'buy' | 'sell' | 'fee'>('buy');
  const [memo, setMemo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const columnHelper = createColumnHelper<BalanceChangeEvent>();

  const columns = [
    columnHelper.accessor("createdAt", {
      header: () => "Date",
      cell: (info) => new Date(info.cell.getValue()).toISOString().split("T")[0],
    }),
    columnHelper.accessor("type", {
      header: () => "Type",
      cell: (info) => {
        const type = info.cell.getValue();
        const isPositive = type === 'buy';
        const isNegative = ['sell', 'fee'].includes(type);
        return (
          <span className={isPositive ? 'positive' : isNegative ? 'negative' : ''}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor("valueCents", {
      header: () => "Value (USD)",
      cell: (info) => {
        const cents = info.cell.getValue();
        return cents ? `$${(cents / 100).toFixed(2)}` : '-';
      },
    }),
    columnHelper.accessor("amountSats", {
      header: () => "Amount",
      cell: (info) => formatSats(info.cell.getValue()),
    }),
    columnHelper.accessor("memo", {
      header: () => "Memo",
      cell: (info) => info.cell.getValue() || '-',
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const loadEvents = async (page: number = 1) => {
    const result = await window.electron.getBalanceChangeEvents(page, 20);
    setData(result.events);
    setCurrentPage(page);
    setTotalPages(result.totalPages);
    setTotal(result.total);
  };

  const handleAddEvent = async () => {
    if (isAddingEvent) {
      if (amountSats === 0) {
        alert("Please enter a valid amount");
        return;
      }

      await window.electron.createBalanceChangeEvent(
        amountSats,
        valueCents,
        type,
        memo || null
      );

      // Reload the first page to show the new event
      await loadEvents(1);
      setIsAddingEvent(false);
      setAmountSats(0);
      setValueCents(null);
      setType('buy');
      setMemo('');
    } else {
      setIsAddingEvent(true);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <>
      <div className="headline-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div className="latest-entries-title">
          <p>{isAddingEvent ? "Add Balance Event" : `Balance Events (${total} total)`}</p>
        </div>

        <div className="recent-buys-buttons" style={{ marginLeft: "20px" }}>
          {isAddingEvent ? (
            <button
              className="new-entry"
              onClick={() => {
                setIsAddingEvent(false);
                setAmountSats(0);
                setValueCents(null);
                setType('buy');
                setMemo('');
              }}
            >
              Cancel
            </button>
          ) : null}
          <button className="new-entry" onClick={handleAddEvent}>
            {isAddingEvent ? "Save" : "Add Event"}
          </button>
        </div>
      </div>

      {isAddingEvent ? (
        <>
          <div className="row">
            <div className="metric-item">
              <p>Type</p>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as 'buy' | 'sell' | 'fee')}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
                <option value="fee">Fee</option>
              </select>
            </div>
            <div className="metric-item">
              <p>Amount (sats)</p>
              <input
                type="number"
                value={amountSats}
                onChange={(e) => setAmountSats(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="row">
            <div className="metric-item">
              <p>Value (USD, optional)</p>
              <input
                type="number"
                step="0.01"
                value={valueCents ? (valueCents / 100).toFixed(2) : ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setValueCents(isNaN(value) ? null : Math.round(value * 100));
                }}
                placeholder="0.00"
              />
            </div>
            <div className="metric-item">
              <p>Memo (optional)</p>
              <input 
                type="text" 
                value={memo}
                onChange={(e) => setMemo(e.target.value)} 
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
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        hideBalances ? "-" : cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
              <button 
                onClick={() => loadEvents(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => loadEvents(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          
          <div className="h-4" />
        </div>
      )}
    </>
  );
}
