import React from 'react';
import { Loader2 } from 'lucide-react';

const cellValue = (row, key) => {
  if (!row || !key) return '';
  const value = row[key];
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export default function DataTable({ columns = [], data = [], onRowClick, emptyMessage = 'No data found.', loading = false }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card card-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.key || column.label} className={`px-4 py-3 font-semibold ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {loading ? (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="px-4 py-14 text-center text-muted-foreground">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || row.productId || row.supplierId || row.customerId || row.quotationId || row.saleId || row.purchaseOrderId || row.movementId || row.userId || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-muted/40' : 'hover:bg-muted/20'}`}
                >
                  {columns.map((column) => (
                    <td key={column.key || column.label} className={`px-4 py-3 align-top ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                      {column.render ? column.render(row, rowIndex) : cellValue(row, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
