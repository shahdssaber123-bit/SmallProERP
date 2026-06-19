import React from 'react';
import ErpModal from '@/components/erp/ErpModal';
import StatusBadge from '@/components/erp/StatusBadge';
import { Button } from '@/components/ui/button';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { FileText, ArrowRight, User, Calendar } from 'lucide-react';

export default function QuotationDetailModal({ quotation, isOpen, onClose, onConvert }) {
  const { tenantData, update } = useErp();
  const { addToast } = useToast();
  const customers = tenantData('customers');
  const products = tenantData('products');
  const invoices = tenantData('invoices');

  const customer = customers.find(c => c.id === quotation?.customerId);
  const getProductName = (id) => products.find(p => String(p.productId ?? p.id) === String(id) || String(p.id) === String(id))?.name || 'Unknown';
  const alreadyInvoiced = invoices.some(i => i.quotationId === quotation?.id);

  const markSent = () => {
    update('quotations', quotation.id, { status: 'Sent' });
    addToast('Quotation marked as sent', 'success');
    onClose();
  };

  const markRejected = () => {
    update('quotations', quotation.id, { status: 'Rejected' });
    addToast('Quotation marked as rejected', 'info');
    onClose();
  };

  if (!quotation) return null;

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title={`Quotation`} subtitle={`${quotation.id.slice(0, 12)} · ${customer?.name || 'Unknown'}`} size="lg">
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Customer</p>
            <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><User className="w-3.5 h-3.5 text-muted-foreground" /> {customer?.name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</p>
            <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {quotation.createdAt}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</p>
            <div className="mt-1"><StatusBadge status={quotation.status} /></div>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Line Items</p>
          <div className="space-y-2">
            {quotation.items.map((item, idx) => (
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
          <div className="flex justify-end mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-heading font-bold text-foreground">${quotation.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">{quotation.notes}</p>
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-border/50">
          {quotation.status === 'Draft' && (
            <Button variant="outline" size="sm" onClick={markSent} className="rounded-xl">Mark as Sent</Button>
          )}
          {(quotation.status === 'Sent') && (
            <Button variant="outline" size="sm" onClick={markRejected} className="rounded-xl text-destructive border-destructive/40 hover:bg-destructive/5">Reject</Button>
          )}
          {!alreadyInvoiced && quotation.status !== 'Rejected' && quotation.status !== 'Accepted' && (
            <Button size="sm" onClick={() => onConvert(quotation)} className="rounded-xl gap-1.5 bg-gradient-to-r from-primary to-primary/80">
              <ArrowRight className="w-3.5 h-3.5" /> Convert to Invoice
            </Button>
          )}
          {alreadyInvoiced && (
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-xl">Invoice already exists</span>
          )}
        </div>
      </div>
    </ErpModal>
  );
}