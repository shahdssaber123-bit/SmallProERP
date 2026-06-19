import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { Plus, Trash2 } from 'lucide-react';

export default function QuotationModal({ isOpen, onClose }) {
  const { tenantData, create, currentUser } = useErp();
  const { addToast } = useToast();
  const customers = tenantData('customers');
  const products = tenantData('products');

  const [form, setForm] = useState({
    customerId: '', items: [{ productId: '', qty: 1, price: 0 }], notes: '', status: 'Draft',
  });

  const getProduct = (id) => products.find(p => String(p.productId ?? p.id) === String(id));
  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', qty: 1, price: 0 }] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    const finalValue = field === 'productId' && value !== '' ? Number(value) : value;
    items[idx] = { ...items[idx], [field]: finalValue };
    if (field === 'productId') {
      const product = getProduct(finalValue);
      if (product) items[idx].price = Number(product.sellingPrice ?? product.price ?? 0);
    }
    setForm({ ...form, items });
  };

  const total = form.items.reduce((s, i) => s + (i.qty * i.price), 0);

  const handleSubmit = () => {
    if (!form.customerId || form.items.every(i => !i.productId)) {
      addToast('Please select a customer and at least one product', 'warning');
      return;
    }
    create('quotations', { ...form, total, createdBy: currentUser?.id });
    addToast('Quotation created', 'success');
    onClose();
  };

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title="New Quotation" subtitle="Create a new sales quotation" size="lg">
      <div className="space-y-5">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Customer *</Label>
          <Select value={form.customerId} onValueChange={v => setForm({ ...form, customerId: v })}>
            <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select customer" /></SelectTrigger>
            <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-xs font-medium text-muted-foreground">Line Items</Label>
            <Button variant="outline" size="sm" onClick={addItem} className="rounded-xl gap-1 h-7 text-xs">
              <Plus className="w-3 h-3" /> Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                <Select value={String(item.productId || '')} onValueChange={v => updateItem(idx, 'productId', v)}>
                  <SelectTrigger className="flex-1 h-9 rounded-lg text-sm"><SelectValue placeholder="Product" /></SelectTrigger>
                  <SelectContent>{products.map(p => <SelectItem key={p.productId ?? p.id} value={String(p.productId ?? p.id)}>{p.name} — ${Number(p.sellingPrice ?? p.price ?? 0).toFixed(2)}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" min="1" value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} className="w-20 h-9 rounded-lg text-sm text-center" />
                <Input type="number" value={item.price} onChange={e => updateItem(idx, 'price', Number(e.target.value))} className="w-24 h-9 rounded-lg text-sm" />
                <span className="text-sm font-semibold w-24 text-right">${(item.qty * item.price).toFixed(2)}</span>
                {form.items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3 pr-2">
            <span className="text-lg font-heading font-bold text-foreground">Total: ${total.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</Label>
          <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="rounded-xl min-h-[60px]" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">Create Quotation</Button>
        </div>
      </div>
    </ErpModal>
  );
}
