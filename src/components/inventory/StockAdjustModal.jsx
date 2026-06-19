import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';

export default function StockAdjustModal({ product, isOpen, onClose, onSave }) {
  const { adjustStock } = useErp();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    adjustmentQuantity: 1,
    reason: 'Manual adjustment',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const currentQty = Number(product?.quantity ?? product?.stock ?? 0);
  const newQty = currentQty + Number(form.adjustmentQuantity || 0);

  const handleSubmit = async () => {
    if (form.adjustmentQuantity === '' || Number(form.adjustmentQuantity) === 0) {
      addToast('Adjustment quantity is required', 'warning');
      return;
    }
    if (!form.reason || form.reason.trim().length < 5 || form.reason.trim().length > 500) {
      addToast('Reason must be between 5 and 500 characters', 'warning');
      return;
    }
    if (form.notes.length > 500) {
      addToast('Notes cannot exceed 500 characters', 'warning');
      return;
    }
    if (newQty < 0) {
      addToast(`Adjustment would result in negative stock. Current: ${currentQty}, Adjustment: ${form.adjustmentQuantity}`, 'error');
      return;
    }

    const payload = {
      productId: product.productId,
      adjustmentQuantity: Number(form.adjustmentQuantity),
      reason: form.reason.trim(),
      notes: form.notes.trim(),
    };
    if (onSave) {
      onSave(payload);
      return;
    }
    setSaving(true);
    const result = await adjustStock(product, payload);
    setSaving(false);

    if (!result.success) {
      addToast(result.error, 'error');
      return;
    }
    addToast(result.message || 'Stock adjusted successfully', 'success');
    onClose();
  };

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title="Adjust Stock" subtitle={`${product?.name} — Current: ${currentQty} units`}>
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Adjustment summary</p>
          <p className="text-xs font-mono text-muted-foreground">productId, adjustmentQuantity, reason, notes</p>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product ID *</Label>
          <Input value={product?.productId ?? ''} disabled className="h-10 rounded-xl bg-muted" />
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adjustment Quantity *</Label>
          <Input
            type="number"
            value={form.adjustmentQuantity}
            onChange={e => setForm({ ...form, adjustmentQuantity: e.target.value === '' ? '' : Number(e.target.value) })}
            placeholder="Use positive or negative number, e.g. 10 or -5"
            className="h-10 rounded-xl"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Positive increases stock. Negative decreases stock.</p>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reason *</Label>
          <Input
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            placeholder="Reason must be between 5 and 500 characters"
            className="h-10 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</Label>
          <Textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes, max 500 characters"
            className="rounded-xl min-h-[70px]"
          />
          <p className="text-[11px] text-muted-foreground mt-1">{form.notes.length}/500</p>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">New stock level:</span>
          <span className={`font-bold text-base ${newQty < 0 ? 'text-red-500' : Number(form.adjustmentQuantity || 0) >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {newQty < 0 ? 'Invalid' : `${newQty} units`}
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">{saving ? 'Applying...' : 'Apply Adjustment'}</Button>
        </div>
      </div>
    </ErpModal>
  );
}
