import React, { useMemo } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Search, X } from 'lucide-react';

export const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
export const date = (d) => d ? String(d).slice(0, 10) : '—';
export const idText = (v) => v === undefined || v === null || v === '' ? '—' : `#${v}`;
export const safe = (v) => v === undefined || v === null || v === '' ? '—' : String(v);

export function Button({ children, variant = 'primary', className = '', disabled, loading, type = 'button', ...props }) {
  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-700/20 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400',
    secondary: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.55)] backdrop-blur-sm transition dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_16px_45px_-34px_rgba(0,0,0,0.9)] ${className}`}>{children}</div>;
}

export function Stat({ label, value, hint, icon }) {
  return (
    <Card className="group overflow-hidden p-6 ring-1 ring-transparent hover:-translate-y-0.5 hover:ring-sky-200/60 dark:hover:ring-sky-500/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
          {hint && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
        </div>
        {icon && <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 p-3 text-blue-700 shadow-sm group-hover:scale-105 dark:from-sky-500/15 dark:to-blue-500/10 dark:text-sky-300">{icon}</div>}
      </div>
    </Card>
  );
}

export function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-sky-500/15 dark:text-sky-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[tone] || tones.slate}`}>{children || '—'}</span>;
}

export const statusTone = (s) => {
  const x = String(s || '').toLowerCase();
  if (x.includes('paid') || x.includes('won') || x.includes('received') || x.includes('accepted')) return 'green';
  if (x.includes('sent') || x.includes('opportunity') || x.includes('interested')) return 'blue';
  if (x.includes('draft') || x.includes('new')) return 'slate';
  if (x.includes('low') || x.includes('unpaid') || x.includes('overdue')) return 'amber';
  if (x.includes('lost') || x.includes('reject')) return 'red';
  return 'purple';
};

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.28),transparent_35%),linear-gradient(120deg,#071A36,#102F5F_55%,#0F766E)] p-7 text-white shadow-[0_28px_80px_-32px_rgba(8,27,61,0.95)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <img src="/small-pro-logo-dark.svg" alt="Small Pro ERP" className="h-14 w-auto drop-shadow-2xl" />
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Small Pro ERP
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-lg text-slate-200/85">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export function TypedSearch({ fields, value, onValue, type, onType, placeholder = 'Search...' }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="relative min-w-[260px] flex-1">
        <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400"
        />
      </div>
      <select
        value={type}
        onChange={(e) => onType(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold shadow-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {fields.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
    </div>
  );
}

export function useTypedFilter(rows, q, type) {
  return useMemo(() => {
    const s = String(q || '').toLowerCase().trim();
    if (!s) return rows || [];
    return (rows || []).filter((r) => String(type === 'all' ? Object.values(r || {}).join(' ') : r?.[type] ?? '').toLowerCase().includes(s));
  }, [rows, q, type]);
}

export function DataTable({ columns, rows = [], loading, error, empty = 'No data returned for this list yet.', title }) {
  if (loading) {
    return (
      <Card className="p-10">
        <div className="flex flex-col items-center justify-center gap-3 text-blue-700 dark:text-sky-300">
          <Loader2 className="h-8 w-8 animate-spin" />
          <b>Loading live data...</b>
          <span className="text-sm text-slate-500 dark:text-slate-400">Please wait while the latest records load.</span>
        </div>
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="text-lg font-black">{title}</div>
          <Badge tone="blue">{rows.length} rows</Badge>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 dark:bg-slate-950">
            <tr>
              {columns.map((c) => <th key={c.key} className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-14 text-center text-slate-500 dark:text-slate-400">
                  <div className="mx-auto max-w-md rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                    <b>No rows returned</b>
                    <p className="mt-1 text-sm">{empty}</p>
                  </div>
                </td>
              </tr>
            ) : rows.map((row, i) => (
              <tr key={row.id || row.productId || row.supplierId || row.customerId || row.quotationId || row.saleId || row.purchaseOrderId || row.interactionId || row.insightLogId || row.ocrResultId || i} className="border-t border-slate-100 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-sky-500/5">
                {columns.map((c) => <td key={c.key} className="px-5 py-4 align-top text-sm text-slate-900 dark:text-slate-100">{c.render ? c.render(row) : safe(row[c.key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function Modal({ open, title, subtitle, children, onClose, size = 'max-w-4xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className={`relative z-[91] my-8 w-full ${size} overflow-visible rounded-[2rem] bg-white shadow-2xl ring-1 ring-white/40 dark:bg-slate-900 dark:ring-slate-700`}>
        <div className="sticky top-0 z-[92] flex items-start justify-between rounded-t-[2rem] border-b border-slate-100 bg-white/95 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
            {subtitle && <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
        </div>
        <div className="relative overflow-visible p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return <label className="block"><span className="mb-1 block text-sm font-bold text-slate-500 dark:text-slate-400">{label}</span>{children}</label>;
}

export function Input({ className = '', ...props }) {
  return <input className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 ${className}`} rows={3} {...props} />;
}

export function Select({ children, className = '', ...props }) {
  return <select className={`w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/10 ${className}`} {...props}>{children}</select>;
}

export function SmartOptions({ rows, getValue, getLabel, placeholder = 'Select item', empty = 'No records found' }) {
  const safeRows = rows || [];
  return <>{placeholder && <option value="">{placeholder}</option>}{safeRows.length === 0 && <option value="" disabled>{empty}</option>}{safeRows.map((row, i) => <option key={getValue(row) || i} value={getValue(row)}>{getLabel(row)}</option>)}</>;
}

export function ReviewDialog({ open, title = 'Review before saving', items = [], onConfirm, onClose, loading }) {
  return (
    <Modal open={open} title={title} subtitle="Please review the data before confirming this action." onClose={onClose} size="max-w-xl">
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
            <span className="font-bold text-slate-500 dark:text-slate-400">{it.label}</span>
            <span className="text-right font-semibold text-slate-950 dark:text-white">{it.value ?? '—'}</span>
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function SuccessBanner({ message }) {
  return message ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">{message}</div> : null;
}

export function SyncButton({ onClick, loading }) {
  return <Button variant="secondary" loading={loading} onClick={onClick}><RefreshCw className="h-4 w-4" /> Sync</Button>;
}

export function DetailGrid({ items }) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{items.map((it) => <div key={it.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"><p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{it.label}</p><p className="mt-1 break-words text-lg font-black text-slate-950 dark:text-white">{it.value ?? '—'}</p></div>)}</div>;
}
