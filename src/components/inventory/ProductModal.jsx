import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';

function productToForm(product) {
  return {
    productCode: product?.productCode ?? product?.sku ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    quantity: product?.quantity ?? product?.stock ?? 0,
    minimumStockLevel: product?.minimumStockLevel ?? product?.minStock ?? 0,
    purchasePrice: product?.purchasePrice ?? product?.cost ?? 0,
    sellingPrice: product?.sellingPrice ?? product?.price ?? 0,
    supplierId: product?.supplierId == null ? '' : String(product.supplierId),
  };
}

export default function ProductModal({ product, isOpen, onClose, isNew = !product, onSave }) {
  const { tenantData, saveProduct } = useErp();
  const { addToast } = useToast();
  const categories = tenantData('categories');
  const suppliers = tenantData('suppliers');

  const [form, setForm] = useState(productToForm(product));
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.productCode || !form.name) {
      addToast('Product code and name are required', 'warning');
      return;
    }
    if (Number(form.sellingPrice) < Number(form.purchasePrice)) {
      addToast('Selling price cannot be less than purchase price.', 'error');
      return;
    }
    if (form.supplierId === '') {
      addToast('Supplier is required', 'warning');
      return;
    }

    const payload = {
      ...form,
      supplierId: Number(form.supplierId),
      quantity: Number(form.quantity),
      minimumStockLevel: Number(form.minimumStockLevel),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
    };
    if (onSave) {
      onSave(payload, isNew ? null : product);
      return;
    }
    setSaving(true);
    const result = await saveProduct(payload, isNew ? null : product);
    setSaving(false);

    if (!result.success) {
      addToast(result.error, 'error');
      return;
    }
    addToast(isNew ? 'Product created' : 'Product updated', 'success');
    onClose();
  };

  const profitMargin = Number(form.sellingPrice || 0) - Number(form.purchasePrice || 0);
  const stockDeficit = Number(form.quantity || 0) < Number(form.minimumStockLevel || 0)
    ? Number(form.minimumStockLevel || 0) - Number(form.quantity || 0)
    : 0;

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title={isNew ? 'New Product' : 'Edit Product'} subtitle="Product details" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product Code *</Label>
            <Input value={form.productCode} onChange={e => updateField('productCode', e.target.value)} disabled={!isNew} placeholder="PO085" className="h-10 rounded-xl" />
            {!isNew && <p className="text-[11px] text-muted-foreground mt-1">Product code cannot be changed while editing.</p>}
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product Name *</Label>
            <Input value={form.name} onChange={e => updateField('name', e.target.value)} className="h-10 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</Label>
            <Select value={form.category} onValueChange={v => updateField('category', v)}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Supplier ID *</Label>
            <div className="grid grid-cols-1 gap-2">
              <Input
                type="number"
                min="1"
                value={form.supplierId}
                onChange={e => updateField('supplierId', e.target.value)}
                placeholder="Supplier ID, e.g. 5"
                className="h-10 rounded-xl"
              />
              {suppliers.length > 0 && (
                <Select value={String(form.supplierId)} onValueChange={v => updateField('supplierId', v)}>
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Choose from local suppliers" /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.supplierId ?? s.id} value={String(s.supplierId ?? s.id)}>{s.name} — ID {s.supplierId ?? s.id}</SelectItem>)}</SelectContent>
                </Select>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Choose an existing supplier for this product.</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quantity</Label>
            <Input type="number" min="0" value={form.quantity} onChange={e => updateField('quantity', Number(e.target.value))} className="h-10 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Minimum Stock Level</Label>
            <Input type="number" min="0" value={form.minimumStockLevel} onChange={e => updateField('minimumStockLevel', Number(e.target.value))} className="h-10 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Purchase Price</Label>
            <Input type="number" min="0" step="0.01" value={form.purchasePrice} onChange={e => updateField('purchasePrice', Number(e.target.value))} className="h-10 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Selling Price</Label>
            <Input type="number" min="0" step="0.01" value={form.sellingPrice} onChange={e => updateField('sellingPrice', Number(e.target.value))} className="h-10 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[11px] uppercase text-muted-foreground font-semibold">Profit Margin</p>
            <p className={`font-heading font-bold ${profitMargin < 0 ? 'text-red-500' : 'text-emerald-600'}`}>${profitMargin.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[11px] uppercase text-muted-foreground font-semibold">Low Stock</p>
            <p className={`font-heading font-bold ${stockDeficit > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{stockDeficit > 0 ? 'Yes' : 'No'}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
            <p className="text-[11px] uppercase text-muted-foreground font-semibold">Stock Deficit</p>
            <p className="font-heading font-bold">{stockDeficit}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</Label>
          <Textarea value={form.description} onChange={e => updateField('description', e.target.value)} className="rounded-xl min-h-[70px]" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">{saving ? 'Saving...' : isNew ? 'Create' : 'Update'}</Button>
        </div>
      </div>
    </ErpModal>
  );
}
