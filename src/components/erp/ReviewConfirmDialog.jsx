import React from 'react';
import ErpModal from './ErpModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowLeft, ReceiptText } from 'lucide-react';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return Number.isFinite(value) ? value.toLocaleString() : String(value);
  return String(value);
};

export default function ReviewConfirmDialog({
  open,
  title = 'Review & Confirm',
  subtitle = 'Please review the data before confirming.',
  sections = [],
  items = [],
  totals = [],
  action,
  confirmText = 'Confirm',
  backText = 'Back to Edit',
  loading = false,
  onBack,
  onConfirm,
}) {
  return (
    <ErpModal isOpen={open} onClose={onBack} title={title} subtitle={subtitle} size="lg">
      <div className="space-y-5">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary"><ReceiptText className="w-5 h-5" /></div>
          <div className="flex-1">
            <p className="font-heading font-bold text-base">Final review before save</p>
            <p className="text-sm text-muted-foreground mt-0.5">Nothing will be submitted until you press confirm.</p>
            {action && <Badge variant="outline" className="mt-2 rounded-lg font-mono text-[11px]">{action}</Badge>}
          </div>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="rounded-2xl border border-border/60 bg-card overflow-hidden">
            {section.title && <div className="px-4 py-3 bg-muted/40 border-b border-border/50 font-semibold text-sm">{section.title}</div>}
            <div className="divide-y divide-border/30">
              {(section.rows || []).map((row, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-1 px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{row[0]}</span>
                  <span className="font-medium break-words">{formatValue(row[1])}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border/50 font-semibold text-sm">Items</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs uppercase text-muted-foreground"><tr><th className="text-left px-4 py-2">#</th><th className="text-left px-4 py-2">Item</th><th className="text-right px-4 py-2">Qty</th><th className="text-right px-4 py-2">Unit</th><th className="text-right px-4 py-2">Total</th></tr></thead>
                <tbody className="divide-y divide-border/30">
                  {items.map((item, idx) => {
                    const qty = Number(item.quantity ?? item.qty ?? 0);
                    const unit = Number(item.unitPrice ?? item.price ?? item.cost ?? 0);
                    return <tr key={idx}><td className="px-4 py-2 text-muted-foreground">{idx + 1}</td><td className="px-4 py-2 font-medium">{item.name || item.productName || item.productId || 'Item'}</td><td className="px-4 py-2 text-right">{formatValue(qty)}</td><td className="px-4 py-2 text-right">{formatValue(unit)}</td><td className="px-4 py-2 text-right font-semibold">{formatValue(item.lineTotal ?? qty * unit)}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totals.length > 0 && <div className="rounded-2xl bg-muted/30 border border-border/50 p-4 space-y-2">{totals.map((row, i) => <div key={i} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{row[0]}</span><span className="font-bold">{formatValue(row[1])}</span></div>)}</div>}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onBack} disabled={loading} className="rounded-xl gap-1.5"><ArrowLeft className="w-4 h-4" /> {backText}</Button>
          <Button onClick={onConfirm} disabled={loading} className="rounded-xl bg-gradient-to-r from-primary to-primary/80 gap-1.5"><CheckCircle2 className="w-4 h-4" /> {loading ? 'Saving...' : confirmText}</Button>
        </div>
      </div>
    </ErpModal>
  );
}
