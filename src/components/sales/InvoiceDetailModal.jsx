import React from 'react';
import ErpModal from '@/components/erp/ErpModal';
import StatusBadge from '@/components/erp/StatusBadge';
import { Button } from '@/components/ui/button';
import { useErp } from '@/lib/erpContext';
import { CreditCard, FileText, User, Calendar, DollarSign } from 'lucide-react';

export default function InvoiceDetailModal({ invoice, isOpen, onClose, onPay }) {
  const { tenantData } = useErp();
  const customers = tenantData('customers');
  const products = tenantData('products');
  const payments = tenantData('payments');

  const customer = customers.find(c => c.id === invoice?.customerId);
  const getProductName = (id) => products.find(p => String(p.productId ?? p.id) === String(id) || String(p.id) === String(id))?.name || 'Unknown';
  const invoicePayments = payments.filter(p => p.invoiceId === invoice?.id);
  const remaining = invoice ? invoice.total - (invoice.paid || 0) : 0;

  if (!invoice) return null;

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title="Invoice" subtitle={`${invoice.id.slice(0, 12)} · ${customer?.name || 'Unknown'}`} size="lg">
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Customer</p>
            <p className="text-sm font-semibold mt-0.5">{customer?.name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Due Date</p>
            <p className="text-sm font-semibold mt-0.5">{invoice.dueDate || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</p>
            <div className="mt-1"><StatusBadge status={invoice.status} /></div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Remaining</p>
            <p className={`text-sm font-bold mt-0.5 ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Line Items</p>
          <div className="space-y-2">
            {invoice.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{getProductName(item.productId)}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} × {item.qty}</p>
                  </div>
                </div>
                <span className="font-semibold text-sm">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-base font-bold mt-0.5">${invoice.total.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-200/50 text-center">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider">Paid</p>
              <p className="text-base font-bold text-emerald-600 mt-0.5">${(invoice.paid || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-200/50 text-center">
              <p className="text-[10px] text-amber-600 uppercase tracking-wider">Remaining</p>
              <p className="text-base font-bold text-amber-600 mt-0.5">${remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {invoicePayments.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment History</p>
            <div className="space-y-2">
              {invoicePayments.map(pay => (
                <div key={pay.id} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-200/30">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">${pay.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{pay.method} · {pay.date}</p>
                    </div>
                  </div>
                  {pay.notes && <p className="text-xs text-muted-foreground max-w-[160px] truncate">{pay.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Close</Button>
          {invoice.status !== 'Paid' && (
            <Button onClick={() => onPay(invoice)} className="rounded-xl gap-1.5 bg-gradient-to-r from-primary to-primary/80">
              <CreditCard className="w-3.5 h-3.5" /> Record Payment
            </Button>
          )}
        </div>
      </div>
    </ErpModal>
  );
}