import React, { useState } from 'react';
import ErpModal from '@/components/erp/ErpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose }) {
  const { tenantData, create, remove } = useErp();
  const { addToast } = useToast();
  const categories = tenantData('categories');
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if (!newCat.trim()) return;
    create('categories', { name: newCat.trim() });
    addToast('Category added', 'success');
    setNewCat('');
  };

  const handleDelete = (id) => {
    remove('categories', id);
    addToast('Category removed', 'info');
  };

  return (
    <ErpModal isOpen={isOpen} onClose={onClose} title="Manage Categories" size="sm">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" className="h-10 rounded-xl" onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <Button onClick={handleAdd} className="rounded-xl h-10 shrink-0"><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" /> {cat.name}
              </span>
              <button onClick={() => handleDelete(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ErpModal>
  );
}