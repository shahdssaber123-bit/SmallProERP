import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import StatusBadge from '@/components/erp/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { CRM_STAGES, LEAD_SOURCES, INTERACTION_TYPES } from '@/lib/erpData';
import { Phone, Mail, MessageSquare, Calendar, Plus, User, DollarSign } from 'lucide-react';

export default function LeadModal({ lead, isOpen, onClose, isNew = false }) {
  const { create, update, tenantData, data } = useErp();
  const { addToast } = useToast();
  const users = tenantData('users');
  const interactions = (data.interactions || []).filter(i => i.leadId === lead?.id);

  const [editing, setEditing] = useState(isNew);
  const [form, setForm] = useState(lead || { name: '', contact: '', email: '', phone: '', value: 0, stage: 'New', source: 'Website', assignedTo: '', notes: '' });
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [interactionForm, setInteractionForm] = useState({ type: 'Call', notes: '', date: new Date().toISOString().split('T')[0] });

  const handleSave = () => {
    if (!form.name || !form.contact) {
      addToast('Name and contact are required', 'warning');
      return;
    }
    if (isNew) {
      create('leads', form);
      addToast('Lead created successfully', 'success');
    } else {
      update('leads', lead.id, form);
      addToast('Lead updated', 'success');
    }
    setEditing(false);
    onClose();
  };

  const handleAddInteraction = () => {
    if (!interactionForm.notes) {
      addToast('Please add notes', 'warning');
      return;
    }
    create('interactions', { ...interactionForm, leadId: lead.id, createdBy: '' });
    addToast('Interaction added', 'success');
    setShowAddInteraction(false);
    setInteractionForm({ type: 'Call', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  if (!isOpen) return null;

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title={isNew ? 'New Lead' : lead?.name} subtitle={isNew ? 'Add a new lead' : lead?.contact} size="lg">
      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Company Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contact Person *</Label>
              <Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Value ($)</Label>
              <Input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className="h-10 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Stage</Label>
              <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CRM_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Source</Label>
              <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{LEAD_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Assigned To</Label>
              <Select value={form.assignedTo} onValueChange={v => setForm({ ...form, assignedTo: v })}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="rounded-xl min-h-[80px]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { setEditing(false); if (isNew) onClose(); }} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl bg-gradient-to-r from-primary to-primary/80">Save</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /> {lead?.email || 'N/A'}</div>
            <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /> {lead?.phone || 'N/A'}</div>
            <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-muted-foreground" /> ${(lead?.value || 0).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={lead?.stage} />
            <span className="text-xs text-muted-foreground">• Source: {lead?.source}</span>
          </div>
          {lead?.notes && <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">{lead.notes}</p>}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="rounded-xl">Edit Lead</Button>
            <Button variant="outline" size="sm" onClick={() => setShowAddInteraction(true)} className="rounded-xl gap-1"><Plus className="w-3 h-3" /> Add Interaction</Button>
          </div>
          {showAddInteraction && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Type</Label>
                  <Select value={interactionForm.type} onValueChange={v => setInteractionForm({ ...interactionForm, type: v })}>
                    <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{INTERACTION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Date</Label>
                  <Input type="date" value={interactionForm.date} onChange={e => setInteractionForm({ ...interactionForm, date: e.target.value })} className="h-9 rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Notes</Label>
                <Textarea value={interactionForm.notes} onChange={e => setInteractionForm({ ...interactionForm, notes: e.target.value })} className="rounded-xl min-h-[60px]" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddInteraction} className="rounded-xl">Save</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddInteraction(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}
          {interactions.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3">Interaction History</h4>
              <div className="space-y-2">
                {interactions.sort((a, b) => b.date.localeCompare(a.date)).map(int => (
                  <div key={int.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/30">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{int.type}</span>
                        <span className="text-[10px] text-muted-foreground">{int.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{int.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ErpModal>
  );
}