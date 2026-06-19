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

export default function CreatePOModal({ isOpen, onClose, onSave }) {
  const { tenantData } = useErp();
  const { addToast } = useToast();
  const suppliers = tenantData('suppliers');
  const products = tenantData('products');
  const [form, setForm] = useState({ supplierId: '', items: [{ productId: '', quantity: 1, unitPrice: 0, name: '' }], notes: '' });
  const getProduct = (id) => products.find(p => String(p.productId ?? p.id) === String(id));
  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1, unitPrice: 0, name: '' }] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx, field, value) => { const items = [...form.items]; items[idx] = { ...items[idx], [field]: value }; if (field === 'productId') { const product = getProduct(value); if (product) { items[idx].unitPrice = Number(product.purchasePrice ?? product.cost ?? 0); items[idx].name = product.name; } } setForm({ ...form, items }); };
  const total = form.items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0);
  const handleSubmit = () => { const valid = form.items.filter(i => i.productId && Number(i.quantity) > 0); if (!form.supplierId) { addToast('Supplier is required', 'warning'); return; } if (!valid.length) { addToast('Add at least one valid product line', 'warning'); return; } onSave?.({ ...form, supplierId: Number(form.supplierId), items: valid.map(i => ({ ...i, productId: Number(i.productId), quantity: Number(i.quantity), unitPrice: Number(i.unitPrice), lineTotal: Number(i.quantity) * Number(i.unitPrice) })) }); };
  return <ErpModal isOpen={isOpen} onClose={onClose} title="New Purchase Order" subtitle="Supplier, line items and notes" size="lg"><div className="space-y-5"><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Supplier *</Label><Select value={String(form.supplierId)} onValueChange={v => setForm({ ...form, supplierId: v })}><SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent>{suppliers.map(s => <SelectItem key={s.supplierId ?? s.id} value={String(s.supplierId ?? s.id)}>{s.name} — ID {s.supplierId ?? s.id}</SelectItem>)}</SelectContent></Select></div><div><div className="flex items-center justify-between mb-3"><Label className="text-xs font-medium text-muted-foreground">Line Items</Label><Button variant="outline" size="sm" onClick={addItem} className="rounded-xl gap-1 h-7 text-xs"><Plus className="w-3 h-3" /> Add</Button></div><div className="space-y-2">{form.items.map((item, idx) => <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30"><Select value={String(item.productId || '')} onValueChange={v => updateItem(idx, 'productId', v)}><SelectTrigger className="flex-1 h-9 rounded-lg text-sm"><SelectValue placeholder="Product" /></SelectTrigger><SelectContent>{products.map(p => <SelectItem key={p.productId ?? p.id} value={String(p.productId ?? p.id)}>{p.name} — ID {p.productId ?? p.id}</SelectItem>)}</SelectContent></Select><Input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="w-20 h-9 rounded-lg text-sm text-center" /><Input type="number" step="0.01" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} className="w-24 h-9 rounded-lg text-sm" /><span className="text-sm font-semibold w-24 text-right">${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}</span>{form.items.length > 1 && <button onClick={() => removeItem(idx)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>}</div>)}</div><div className="flex justify-end mt-3"><span className="text-lg font-heading font-bold">Total: ${total.toFixed(2)}</span></div></div><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="rounded-xl min-h-[60px]" /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button><Button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">Review PO</Button></div></div></ErpModal>;
}
