import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { PAYMENT_METHODS } from '@/lib/erpData';

export default function PaymentModal({ invoice, isOpen, onClose }) {
  const { create, update, tenantData, currentUser } = useErp();
  const { addToast } = useToast();
  const products = tenantData('products');
  const remaining = invoice ? invoice.total - (invoice.paid || 0) : 0;

  const [form, setForm] = useState({
    amount: remaining,
    method: 'Wire Transfer',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const findProduct = (id) => products.find(p => String(p.productId ?? p.id) === String(id) || String(p.id) === String(id));

  const handleSubmit = () => {
    if (form.amount <= 0 || form.amount > remaining) {
      addToast('Invalid payment amount', 'warning');
      return;
    }

    create('payments', { ...form, invoiceId: invoice.id, createdBy: currentUser?.id });

    const newPaid = (invoice.paid || 0) + form.amount;
    const newStatus = newPaid >= invoice.total ? 'Paid' : 'Partial';
    update('invoices', invoice.id, { paid: newPaid, status: newStatus });

    if (newStatus === 'Paid') {
      invoice.items?.forEach(item => {
        const product = findProduct(item.productId);
        if (product) {
          const currentQty = Number(product.quantity ?? product.stock ?? 0);
          const newQty = Math.max(0, currentQty - item.qty);
          update('products', product.id ?? product.productId, { quantity: newQty, stock: newQty });
          create('movements', {
            productId: product.productId ?? item.productId,
            productCode: product.productCode,
            productName: product.name,
            movementType: 2,
            movementTypeText: 'Sale',
            type: 'OUT',
            quantity: item.qty,
            qty: item.qty,
            referenceNumber: invoice.id.slice(0, 8),
            movementDate: form.date,
            notes: `Sale - Invoice ${invoice.id.slice(0, 8)}`,
            reason: `Sale - Invoice ${invoice.id.slice(0, 8)}`,
            createdBy: currentUser?.id,
          });
        }
      });
    }

    addToast(`Payment of $${form.amount.toLocaleString()} recorded`, 'success');
    onClose();
  };

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title="Record Payment" subtitle={`Outstanding: $${remaining.toFixed(2)}`}>
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount *</Label>
          <Input type="number" min="0.01" max={remaining} step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className="h-10 rounded-xl" />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Payment Method</Label>
          <Select value={form.method} onValueChange={v => setForm({ ...form, method: v })}>
            <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-10 rounded-xl" />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</Label>
          <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="rounded-xl min-h-[60px]" placeholder="Payment reference, notes..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">Record Payment</Button>
        </div>
      </div>
    </ErpModal>
  );
}
