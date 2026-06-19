import React from 'react';
import ErpModal from '@/components/erp/ErpModal';
import StatusBadge from '@/components/erp/StatusBadge';
import DataTable from '@/components/erp/DataTable';
import { useErp } from '@/lib/erpContext';
import { Mail, Phone, MapPin, Package, Truck, DollarSign, AlertTriangle } from 'lucide-react';
import { money, dateOnly } from '@/lib/searchUtils';

export default function SupplierModal({ supplier, isOpen, onClose }) {
  const { tenantData } = useErp();
  const purchaseOrders = tenantData('purchaseOrders').filter(po => String(po.supplierId) === String(supplier?.supplierId ?? supplier?.id));
  const products = tenantData('products').filter(p => String(p.supplierId) === String(supplier?.supplierId ?? supplier?.id));
  if (!supplier) return null;
  const totalPOValue = purchaseOrders.reduce((s, po) => s + Number(po.totalAmount || po.total || 0), 0);
  const totalStockValue = products.reduce((s, p) => s + Number(p.quantity || 0) * Number(p.purchasePrice || 0), 0);
  const lowStock = products.filter(p => p.isLowStock || Number(p.quantity) < Number(p.minimumStockLevel));
  const productColumns = [
    { key: 'code', label: 'Code', render: r => <span className="font-mono text-xs">{r.productCode}</span> },
    { key: 'name', label: 'Product', render: r => <div><p className="font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.category}</p></div> },
    { key: 'stock', label: 'Stock', render: r => <span className="font-semibold">{r.quantity}</span> },
    { key: 'min', label: 'Min', render: r => r.minimumStockLevel },
    { key: 'prices', label: 'Prices', render: r => <div><p>{money(r.purchasePrice)}</p><p className="text-xs text-muted-foreground">sell {money(r.sellingPrice)}</p></div> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.isLowStock ? 'Low Stock' : 'In Stock'} /> },
  ];
  const poColumns = [
    { key: 'poNumber', label: 'PO Number', render: r => <span className="font-mono text-xs font-semibold">{r.poNumber}</span> },
    { key: 'items', label: 'Items', render: r => r.items?.length || 0 },
    { key: 'total', label: 'Total', render: r => <span className="font-semibold">{money(r.totalAmount || r.total)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.statusText || r.status} /> },
    { key: 'date', label: 'Order Date', render: r => <span className="text-xs text-muted-foreground">{dateOnly(r.orderDate || r.createdAt)}</span> },
  ];
  return <ErpModal isOpen={isOpen} onClose={onClose} title={supplier.name} subtitle={`Supplier #${supplier.supplierId} details`} size="xl">
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border p-3"><Mail className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold break-all">{supplier.email || '—'}</p></div>
        <div className="rounded-xl border p-3"><Phone className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Phone</p><p className="font-semibold">{supplier.phone || '—'}</p></div>
        <div className="rounded-xl border p-3"><Package className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Products</p><p className="font-semibold">{products.length}</p></div>
        <div className="rounded-xl border p-3"><Truck className="w-4 h-4 text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Purchase Orders</p><p className="font-semibold">{purchaseOrders.length}</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Total PO Value</p><p className="font-heading text-xl font-bold">{money(totalPOValue)}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Supplier Stock Value</p><p className="font-heading text-xl font-bold">{money(totalStockValue)}</p></div><div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">Low Stock Items</p><p className="font-heading text-xl font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="w-5 h-5" /> {lowStock.length}</p></div></div>
      <div className="rounded-2xl border p-4"><p className="font-semibold text-sm mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address & Metadata</p><p className="text-sm text-muted-foreground">{supplier.address || '—'}</p><p className="text-xs text-muted-foreground mt-2">Created: {dateOnly(supplier.createdAt)}</p></div>
      <div><h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Linked Products</h4><DataTable columns={productColumns} data={products} emptyMessage="No products linked to this supplier." /></div>
      <div><h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Linked Purchase Orders</h4><DataTable columns={poColumns} data={purchaseOrders} emptyMessage="No purchase orders linked to this supplier." /></div>
    </div>
  </ErpModal>;
}
