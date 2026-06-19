import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/lib/toastContext';

export default function AddSupplierModal({ isOpen, onClose, supplier = null, onSave }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: supplier?.name || '', email: supplier?.email || '', phone: supplier?.phone || '', address: supplier?.address || '' });
  const handleSubmit = () => {
    if (!form.name) { addToast('Supplier name is required', 'warning'); return; }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) { addToast('Invalid email format', 'warning'); return; }
    if (form.email.length > 100) { addToast('Email cannot exceed 100 characters', 'warning'); return; }
    if (form.phone.length > 20) { addToast('Phone cannot exceed 20 characters', 'warning'); return; }
    if (form.address.length > 500) { addToast('Address cannot exceed 500 characters', 'warning'); return; }
    onSave?.(form, supplier);
  };
  return <ErpModal isOpen={isOpen} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Add Supplier'} subtitle="Supplier details">
    <div className="space-y-4"><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Supplier Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10 rounded-xl" /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10 rounded-xl" /></div><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 rounded-xl" /></div></div><div><Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address</Label><Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="rounded-xl min-h-[70px]" /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button><Button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">Review</Button></div></div>
  </ErpModal>;
}
