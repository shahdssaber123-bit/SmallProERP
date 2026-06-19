import React, { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { QUOTATION_STATUS, useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { Badge, Button, DataTable, DetailGrid, ErrorBanner, Field, Input, Modal, PageHeader, ReviewDialog, Select, SyncButton, Textarea, TypedSearch, date, idText, money, statusTone, useTypedFilter } from '@/components/erp/ErpKit';

function QuotationForm({ products, customers, onSave, onClose }) {
  const [customerId, setCustomerId] = useState(''); const [tax, setTax] = useState(0); const [validUntil, setValidUntil] = useState(''); const [items, setItems] = useState([{ ProductId: '', Quantity: 1 }]); const [review, setReview] = useState(false); const [err, setErr] = useState('');
  const setItem = (i, patch) => setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const submit = async () => { const body = { CustomerId: Number(customerId), TaxAmount: Number(tax), QuotationDate: new Date().toISOString(), ValidUntil: validUntil || null, Items: items.filter((x) => x.ProductId).map((x) => ({ ProductId: Number(x.ProductId), Quantity: Number(x.Quantity) })) }; const res = await onSave(body); if (res.success) onClose(); else setErr(res.error); };
  return <><ErrorBanner message={err} /><Field label="Customer *"><Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">Select customer</option>{customers.map((c) => <option key={c.customerId} value={c.customerId}>{c.name} — {c.company}</option>)}</Select></Field><div className="mt-5 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/70"><h3 className="mb-3 font-black">Line Items</h3>{items.map((it, i) => <div key={i} className="mb-3 grid gap-3 md:grid-cols-4"><Select value={it.ProductId} onChange={(e) => setItem(i, { ProductId: e.target.value })}><option value="">Product</option>{products.map((p) => <option key={p.productId} value={p.productId}>{p.productCode} — {p.name} — {money(p.sellingPrice)}</option>)}</Select><Input type="number" value={it.Quantity} onChange={(e) => setItem(i, { Quantity: e.target.value })} /><Button variant="secondary" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>Remove</Button></div>)}<Button variant="secondary" onClick={() => setItems([...items, { ProductId: '', Quantity: 1 }])}>Add Item</Button></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Tax Amount"><Input type="number" value={tax} onChange={(e) => setTax(e.target.value)} /></Field><Field label="Valid Until"><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></Field></div><div className="mt-6 flex justify-end"><Button onClick={() => setReview(true)}>Review Quotation</Button></div><ReviewDialog open={review} onClose={() => setReview(false)} onConfirm={submit} items={[{ label: 'Customer ID', value: customerId }, { label: 'Items', value: items.filter((x) => x.ProductId).length }, { label: 'Tax', value: money(tax) }]} /></>;
}
function AddQuoteItem({ products, quotation, onAdd, onAdded }) {
  const [productId, setProductId] = useState(''); const [quantity, setQuantity] = useState(1); const [unitPrice, setUnitPrice] = useState(''); const [err, setErr] = useState('');
  const add = async () => { setErr(''); if (!quotation?.quotationId && !quotation?.id) { setErr('Quotation ID is missing. Close and reopen Details from the list.'); return; } if (!productId) { setErr('Please select a product first.'); return; } const selectedProduct = products.find((p) => Number(p.productId) === Number(productId)); const price = Number(unitPrice || selectedProduct?.sellingPrice || 0); if (price <= 0) { setErr('Unit price is required. Choose a product with selling price or type a unit price.'); return; } const res = await onAdd(quotation, { ProductId: Number(productId), Quantity: Number(quantity), UnitPrice: price }); if (res.success) { setProductId(''); setQuantity(1); setUnitPrice(''); await onAdded?.(); } else setErr(res.error); };
  return <div className="mt-6 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900/70"><h3 className="mb-3 font-black">Add Item to Quotation</h3><ErrorBanner message={err} /><div className="grid gap-3 md:grid-cols-4"><Select value={productId} onChange={(e) => { const pid = e.target.value; setProductId(pid); const p = products.find((row) => Number(row.productId) === Number(pid)); setUnitPrice(p?.sellingPrice || ''); }}><option value="">Product</option>{products.map((p) => <option key={p.productId} value={p.productId}>{p.productCode} — {p.name}</option>)}</Select><Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /><Input type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Unit price" /><Button onClick={add}>Add</Button></div></div>;
}

function LineItemsTable({ rows = [] }) {
  return <DataTable rows={rows} columns={[
    { key: 'productCode', label: 'Code' },
    { key: 'productName', label: 'Product' },
    { key: 'quantity', label: 'Qty' },
    { key: 'unitPrice', label: 'Unit', render: (r) => money(r.unitPrice) },
    { key: 'lineTotal', label: 'Total', render: (r) => money(r.lineTotal) }
  ]} />;
}

function PrintableSalesDocument({ type, record }) {
  const isQuote = type === 'quote';
  const title = isQuote ? 'Quotation' : 'Invoice';
  const number = isQuote ? record?.quotationNumber : record?.invoiceNumber;
  const dateLabel = isQuote ? 'Quotation Date' : 'Invoice Date';
  const dateValue = isQuote ? record?.quotationDate : record?.invoiceDate;
  return (
    <div id={`${type}-print-doc`} className="mt-6 rounded-3xl border bg-white p-8 text-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <img src="/small-pro-logo-transparent.png" alt="Small Pro ERP" className="h-14 w-auto" />
          <div>
            <h2 className="text-4xl font-black">{title}</h2>
            <p className="text-slate-500">Small Pro ERP</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><b>{title} #:</b> {number || '—'}</p>
          <p><b>{dateLabel}:</b> {date(dateValue)}</p>
          {isQuote ? <p><b>Valid Until:</b> {date(record?.validUntil)}</p> : <p><b>Due Date:</b> {date(record?.dueDate)}</p>}
          <p><b>Status:</b> {record?.statusName || (record?.isPaid ? 'Paid' : 'Unpaid') || '—'}</p>
        </div>
      </div>
      <div className="my-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <h3 className="font-black">Customer</h3>
          <p>{record?.customerName || '—'}</p>
          <p>{record?.customerCompany || '—'}</p>
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-black">Summary</h3>
          <p>Subtotal: {money(record?.subtotal)}</p>
          <p>Tax: {money(record?.taxAmount)}</p>
          <p className="text-2xl font-black">Total: {money(record?.totalAmount)}</p>
        </div>
      </div>
      <LineItemsTable rows={record?.items || []} />
      {record?.notes && <div className="mt-6 rounded-2xl border p-4"><h3 className="font-black">Notes</h3><p>{record.notes}</p></div>}
      <div className="mt-8 flex justify-end">
        <Button onClick={() => window.print()}><Printer className="h-4 w-4" /> Print {title}</Button>
      </div>
    </div>
  );
}


const getQuoteStatusName = (quote) => String(quote?.statusName || quote?.statusText || '').trim().toLowerCase();
const isDraftQuotation = (quote) => getQuoteStatusName(quote) === 'draft' || Number(quote?.statusId ?? quote?.status) === 1;

export default function Sales() {
  const { data, loading, errors, syncAllSystemData, saveQuotation, deleteQuotation, changeQuotationStatus, addQuotationItem, removeQuotationItem, convertQuotation, getQuotationDetails, getSaleDetails, markSalePaid } = useErp();
  const [tab, setTab] = useState('quotations'); const [q, setQ] = useState(''); const [type, setType] = useState('all'); const [modal, setModal] = useState(null); const [selected, setSelected] = useState(null); const [err, setErr] = useState('');
  const { addToast } = useToast();
  const quotes = useTypedFilter(data.quotations, q, type); const sales = useTypedFilter(data.sales, q, type);
  const showQuote = async (r) => { const fresh = await getQuotationDetails(r); setSelected(fresh); setModal({ mode: 'quoteDetails' }); };
  const showSale = async (r) => { const fresh = await getSaleDetails(r); setSelected(fresh); setModal({ mode: 'saleDetails' }); };
  const reloadQuote = async (quote = selected) => { if (!quote) return; const fresh = await getQuotationDetails(quote); setSelected(fresh); return fresh; };
  const changeStatus = async (quote, status) => { setErr(''); const res = await changeQuotationStatus(quote, Number(status)); if (!res.success) { setErr(res.error); addToast(res.error, 'error'); } else { await reloadQuote(quote); addToast('Quotation status updated.', 'success'); } };
  const isAccepted = (quote) => String(quote?.statusName || quote?.statusText || '').toLowerCase() === 'accepted' || Number(quote?.statusId ?? quote?.status) === 3;
  const convert = async (quote) => { if (!isAccepted(quote)) { const msg='Convert to invoice is allowed only when status is Accepted.'; setErr(msg); addToast(msg, 'warning'); return; } const res = await convertQuotation(quote); if (!res.success) { setErr(res.error); addToast(res.error, 'error'); } else { addToast('Quotation converted to invoice.', 'success'); setModal(null); } };
  const handleDeleteQuotation = async (quote) => {
    if (!isDraftQuotation(quote)) {
      const msg = 'Only draft quotations can be deleted.';
      setErr(msg);
      addToast(msg, 'warning');
      return;
    }
    if (!window.confirm('Delete draft quotation?')) return;
    const res = await deleteQuotation(quote);
    if (!res?.success && res?.error) {
      setErr(res.error);
      addToast(res.error, 'error');
    } else {
      addToast('Draft quotation deleted.', 'success');
    }
  };
  return <div><PageHeader title="Sales" subtitle="Quotations, invoices, printable documents and details" actions={<><SyncButton loading={loading.global} onClick={syncAllSystemData} /><Button onClick={() => setModal({ mode: 'newQuote' })}><Plus className="h-4 w-4" /> Quotation</Button></>} />
    <ErrorBanner message={err} /><div className="grid gap-5 md:grid-cols-3"><button type="button" onClick={() => { setTab('quotations'); setType('all'); setQ(''); }} className="rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"><p className="text-slate-500">Total Quoted</p><b className="text-3xl">{money(data.quotations.reduce((s, r) => s + Number(r.totalAmount || 0), 0))}</b><span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-sky-500/10 dark:text-sky-300">Open quotations list</span></button><button type="button" onClick={() => { setTab('sales'); setType('all'); setQ(''); }} className="rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"><p className="text-slate-500">Total Invoiced</p><b className="text-3xl">{money(data.sales.reduce((s, r) => s + Number(r.totalAmount || 0), 0))}</b><span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-sky-500/10 dark:text-sky-300">Open invoices list</span></button><button type="button" onClick={() => { setTab('sales'); setType('statusName'); setQ('Paid'); }} className="rounded-3xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900"><p className="text-slate-500">Collected</p><b className="text-3xl">{money(data.sales.filter((s) => s.isPaid).reduce((a, r) => a + Number(r.totalAmount || 0), 0))}</b><span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Filter paid sales</span></button></div>
    <div className="my-5 flex gap-2"><Button variant={tab === 'quotations' ? 'primary' : 'secondary'} onClick={() => setTab('quotations')}>Quotations</Button><Button variant={tab === 'sales' ? 'primary' : 'secondary'} onClick={() => setTab('sales')}>Sales / Invoices</Button></div><TypedSearch value={q} onValue={setQ} type={type} onType={setType} fields={[{ value: 'all', label: 'All Fields' }, { value: 'quotationNumber', label: 'Quotation #' }, { value: 'invoiceNumber', label: 'Invoice #' }, { value: 'customerName', label: 'Customer' }, { value: 'statusName', label: 'Status' }]} />
    {tab === 'quotations' && <div className="mt-5"><DataTable loading={loading.quotations} error={errors.quotations} rows={quotes} columns={[{ key: 'quotationId', label: 'ID', render: (r) => idText(r.quotationId) }, { key: 'quotationNumber', label: 'Quotation' }, { key: 'customerName', label: 'Customer' }, { key: 'itemCount', label: 'Items' }, { key: 'totalAmount', label: 'Total', render: (r) => money(r.totalAmount) }, { key: 'statusName', label: 'Status', render: (r) => <Badge tone={statusTone(r.statusName)}>{r.statusName}</Badge> }, { key: 'quotationDate', label: 'Date', render: (r) => date(r.quotationDate) }, { key: 'actions', label: 'Actions', render: (r) => <div className="flex gap-2"><Button variant="secondary" onClick={() => showQuote(r)}>Details</Button>{isDraftQuotation(r) && <Button variant="danger" onClick={() => handleDeleteQuotation(r)}>Delete</Button>}</div> }]} /></div>}
    {tab === 'sales' && <div className="mt-5"><DataTable loading={loading.sales} error={errors.sales} rows={sales} columns={[{ key: 'saleId', label: 'ID', render: (r) => idText(r.saleId) }, { key: 'invoiceNumber', label: 'Invoice' }, { key: 'customerName', label: 'Customer' }, { key: 'itemCount', label: 'Items' }, { key: 'totalAmount', label: 'Total', render: (r) => money(r.totalAmount) }, { key: 'statusName', label: 'Status', render: (r) => <Badge tone={statusTone(r.statusName)}>{r.statusName}</Badge> }, { key: 'invoiceDate', label: 'Date', render: (r) => date(r.invoiceDate) }, { key: 'actions', label: 'Actions', render: (r) => <div className="flex gap-2"><Button variant="secondary" onClick={() => showSale(r)}>Details</Button>{!r.isPaid && <Button variant="success" onClick={() => markSalePaid(r, { IsPaid: true })}>Mark Paid</Button>}</div> }]} /></div>}
    <Modal open={modal?.mode === 'newQuote'} title="New Quotation" subtitle="Create quotation" onClose={() => setModal(null)} size="max-w-5xl"><QuotationForm products={data.products} customers={data.customers} onSave={saveQuotation} onClose={() => setModal(null)} /></Modal>
    <Modal open={modal?.mode === 'quoteDetails'} title={selected?.quotationNumber || 'Quotation'} subtitle="Customer info, status, line items, totals and dates" onClose={() => setModal(null)} size="max-w-6xl"><DetailGrid items={[{ label: 'ID', value: idText(selected?.quotationId) }, { label: 'Customer', value: selected?.customerName }, { label: 'Company', value: selected?.customerCompany }, { label: 'Subtotal', value: money(selected?.subtotal) }, { label: 'Tax', value: money(selected?.taxAmount) }, { label: 'Total', value: money(selected?.totalAmount) }, { label: 'Date', value: date(selected?.quotationDate) }, { label: 'Valid Until', value: date(selected?.validUntil) }]} /><div className="mt-6 grid gap-4 md:grid-cols-3"><Field label="Status"><Select value={selected?.statusId || 1} onChange={(e) => changeStatus(selected, e.target.value)}>{QUOTATION_STATUS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field><div className="flex items-end"><Button disabled={!isAccepted(selected)} onClick={() => convert(selected)}>Convert to Invoice</Button></div></div><AddQuoteItem products={data.products} quotation={selected || {}} onAdd={addQuotationItem} onAdded={() => reloadQuote(selected)} /><h3 className="mt-6 mb-3 font-black">Line Items</h3><DataTable rows={selected?.items || []} columns={[{ key: 'productCode', label: 'Code' }, { key: 'productName', label: 'Product' }, { key: 'quantity', label: 'Qty' }, { key: 'unitPrice', label: 'Unit', render: (r) => money(r.unitPrice) }, { key: 'lineTotal', label: 'Total', render: (r) => money(r.lineTotal) }, { key: 'actions', label: 'Actions', render: (r) => <Button variant="danger" onClick={async () => { const res = await removeQuotationItem(selected, r); if (res.success) { await reloadQuote(selected); addToast('Item removed.', 'success'); } else { setErr(res.error); addToast(res.error, 'error'); } }}>Remove</Button> }]} /><PrintableSalesDocument type="quote" record={selected} /></Modal>
    <Modal open={modal?.mode === 'saleDetails'} title={selected?.invoiceNumber || 'Invoice'} subtitle="Invoice customer, status, items, totals and payment" onClose={() => setModal(null)} size="max-w-6xl"><DetailGrid items={[{ label: 'ID', value: idText(selected?.saleId) }, { label: 'Customer', value: selected?.customerName }, { label: 'Quotation ID', value: idText(selected?.quotationId) }, { label: 'Total', value: money(selected?.totalAmount) }, { label: 'Paid', value: selected?.isPaid ? 'Yes' : 'No' }, { label: 'Payment Method', value: selected?.paymentMethod }, { label: 'Invoice Date', value: date(selected?.invoiceDate) }, { label: 'Due Date', value: date(selected?.dueDate) }]} /><h3 className="mt-6 mb-3 font-black">Sale Items</h3><LineItemsTable rows={selected?.items || []} /><PrintableSalesDocument type="invoice" record={selected} /></Modal>
  </div>;
}
