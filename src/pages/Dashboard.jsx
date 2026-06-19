import React, { useMemo } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Download,
  FileText,
  Package,
  PieChart as PieChartIcon,
  Printer,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useErp } from '@/lib/erpContext';
import { Badge, Button, Card, DataTable, PageHeader, Stat, SyncButton, money } from '@/components/erp/ErpKit';

const sum = (rows, key) => (rows || []).reduce((s, r) => s + Number(r?.[key] || 0), 0);
const ok = (x) => x && !x.error;

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];

function asDate(value) {
  return String(value || new Date().toISOString()).slice(0, 10);
}

function moneyTooltip(value) {
  return money(value);
}

function ChartShell({ title, subtitle, icon, children, empty = false }) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 dark:bg-sky-500/10 dark:text-sky-300">
          {icon || <BarChart3 className="h-5 w-5" />}
        </div>
      </div>

      <div style={{ width: '100%', height: 360, minHeight: 360 }} className="p-4">
        {empty ? (
          <div className="grid h-full place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No live database data returned for this chart yet
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}

function ReportTile({ label, value, hint, tone = 'blue' }) {
  const map = {
    blue: 'bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300',
    green: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300',
    red: 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300',
    purple: 'bg-purple-50 text-purple-800 dark:bg-purple-500/10 dark:text-purple-300',
  };
  return (
    <div className={`rounded-3xl p-5 ${map[tone] || map.blue}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-3 text-3xl font-black">{value}</p>
      {hint && <p className="mt-1 text-xs font-bold opacity-70">{hint}</p>}
    </div>
  );
}

function groupSalesByDate(sales = []) {
  const map = new Map();
  sales.forEach((s) => {
    const key = asDate(s.invoiceDate || s.createdAt);
    map.set(key, (map.get(key) || 0) + Number(s.totalAmount || 0));
  });

  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([date, revenue]) => ({ date, revenue }));
}

function buildInventoryByCategory(products = []) {
  const map = new Map();
  products.forEach((p) => {
    const category = p.category || 'Uncategorized';
    const current = Number(p.quantity || p.stock || 0);
    const value = current * Number(p.purchasePrice || p.cost || 0);
    const old = map.get(category) || { category, quantity: 0, value: 0 };
    map.set(category, { category, quantity: old.quantity + current, value: old.value + value });
  });
  return [...map.values()].sort((a, b) => b.quantity - a.quantity);
}

function buildTopCustomers(sales = []) {
  const map = new Map();
  sales.forEach((s) => {
    const name = s.customerName || 'Unknown Customer';
    map.set(name, (map.get(name) || 0) + Number(s.totalAmount || 0));
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([customer, revenue]) => ({ customer, revenue }));
}

function buildTopProducts(products = [], sales = []) {
  const map = new Map();

  sales.forEach((sale) => {
    const items = sale.items || sale.saleItems || [];
    items.forEach((item) => {
      const name = item.productName || item.name || `Product ${item.productId || ''}`.trim();
      map.set(name, (map.get(name) || 0) + Number(item.quantity || item.qty || 0));
    });
  });

  if (!map.size) {
    products.forEach((p) => {
      map.set(p.name || 'Product', Number(p.quantity || p.stock || 0));
    });
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([product, quantity]) => ({ product, quantity }));
}

function buildMovements(movements = []) {
  const map = new Map();
  movements.forEach((m) => {
    const type = m.movementTypeText || m.type || 'Movement';
    map.set(type, (map.get(type) || 0) + Number(m.quantity || m.qty || 0));
  });
  return [...map.entries()].map(([type, quantity]) => ({ type, quantity }));
}

function printReport() {
  window.print();
}

export default function Dashboard() {
  const { data, loading, errors, syncAllSystemData } = useErp();

  const salesOverview = ok(data.dashboard?.salesOverview) ? data.dashboard.salesOverview : {};
  const inventoryOverview = ok(data.dashboard?.inventoryOverview) ? data.dashboard.inventoryOverview : {};
  const poOverview = ok(data.dashboard?.purchaseOrdersOverview) ? data.dashboard.purchaseOrdersOverview : {};
  const supplierOverview = ok(data.dashboard?.suppliersOverview) ? data.dashboard.suppliersOverview : {};

  const sales = data.sales || [];
  const products = data.products || [];
  const suppliers = data.suppliers || [];
  const customers = data.customers || [];
  const purchaseOrders = data.purchaseOrders || [];
  const quotations = data.quotations || [];
  const movements = data.movements || [];

  const revenue = salesOverview.totalRevenue ?? sum(sales, 'totalAmount');
  const collected = salesOverview.collectedRevenue ?? sum(sales.filter((s) => s.isPaid), 'totalAmount');
  const outstanding = salesOverview.outstandingAmount ?? Math.max(0, revenue - collected);
  const inventoryValue =
    inventoryOverview.totalInventoryValue ??
    products.reduce((s, p) => s + Number(p.quantity || p.stock || 0) * Number(p.purchasePrice || p.cost || 0), 0);

  const saleLineItems = sales.flatMap((sale) => (sale.items || sale.saleItems || []).map((item) => ({ ...item, sale })));
  const profitFromSales = saleLineItems.reduce((total, item) => {
    const product = products.find((p) => String(p.productId ?? p.id) === String(item.productId) || String(p.name || '').toLowerCase() === String(item.productName || item.name || '').toLowerCase());
    const qty = Number(item.quantity || item.qty || 0);
    const unitPrice = Number(item.unitPrice || item.sellingPrice || product?.sellingPrice || product?.price || 0);
    const unitCost = Number(item.purchasePrice || item.cost || product?.purchasePrice || product?.cost || 0);
    return total + Math.max(0, unitPrice - unitCost) * qty;
  }, 0);
  const inventoryProfitPotential = products.reduce((total, p) => {
    const qty = Number(p.quantity || p.stock || 0);
    const sell = Number(p.sellingPrice || p.price || 0);
    const cost = Number(p.purchasePrice || p.cost || 0);
    return total + Math.max(0, sell - cost) * qty;
  }, 0);
  const grossProfit = profitFromSales || inventoryProfitPotential;
  const profitBase = profitFromSales ? revenue : products.reduce((total, p) => total + Number(p.sellingPrice || p.price || 0) * Number(p.quantity || p.stock || 0), 0);
  const profitMargin = profitBase > 0 ? Math.round((grossProfit / profitBase) * 100) : 0;

  const lowStockProducts = products.filter((p) => p.isLowStock || Number(p.quantity || p.stock || 0) < Number(p.minimumStockLevel || p.minStock || 0));
  const paidSales = sales.filter((s) => s.isPaid || String(s.statusName || '').toLowerCase() === 'paid');
  const unpaidSales = sales.filter((s) => !s.isPaid && String(s.statusName || '').toLowerCase() !== 'paid');
  const systemIssues = Object.values(errors || {}).filter(Boolean).length;

  const salesTrend = useMemo(() => groupSalesByDate(sales), [sales]);
  const inventoryByCategory = useMemo(() => buildInventoryByCategory(products), [products]);
  const topCustomers = useMemo(() => buildTopCustomers(sales), [sales]);
  const topProducts = useMemo(() => buildTopProducts(products, sales), [products, sales]);
  const movementTypes = useMemo(() => buildMovements(movements), [movements]);

  const crmPipeline = useMemo(() => ['NewLead', 'Interested', 'Opportunity', 'Won', 'Lost'].map((stage) => ({
    stage,
    customers: customers.filter((c) => c.status === stage).length,
  })), [customers]);

  const poStatus = useMemo(() => ['Draft', 'Sent', 'Received'].map((status) => ({
    status,
    orders: purchaseOrders.filter((p) => (p.statusName || p.statusText) === status).length,
  })).filter((x) => x.orders > 0), [purchaseOrders]);

  const quotationStatus = useMemo(() => ['Draft', 'Sent', 'Accepted', 'Rejected'].map((status) => ({
    status,
    count: quotations.filter((q) => (q.statusName || q.statusText) === status).length,
  })).filter((x) => x.count > 0), [quotations]);

  const invoiceSplit = [
    { status: 'Paid', count: paidSales.length },
    { status: 'Unpaid', count: unpaidSales.length },
  ].filter((x) => x.count > 0);

  const healthRows = [
    { id: 'products', module: 'Products', records: products.length, status: errors.products ? 'Needs attention' : 'Healthy' },
    { id: 'suppliers', module: 'Suppliers', records: suppliers.length, status: errors.suppliers ? 'Needs attention' : 'Healthy' },
    { id: 'customers', module: 'Customers', records: customers.length, status: errors.customers ? 'Needs attention' : 'Healthy' },
    { id: 'quotations', module: 'Quotations', records: quotations.length, status: errors.quotations ? 'Needs attention' : 'Healthy' },
    { id: 'sales', module: 'Sales invoices', records: sales.length, status: errors.sales ? 'Needs attention' : 'Healthy' },
    { id: 'purchase-orders', module: 'Purchase orders', records: purchaseOrders.length, status: errors.purchaseOrders ? 'Needs attention' : 'Healthy' },
    { id: 'movements', module: 'Inventory movements', records: movements.length, status: errors.movements ? 'Needs attention' : 'Healthy' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Live database executive control center with charts, reports, KPIs, sales, inventory, purchasing, CRM, and payment health."
        actions={
          <>
            <Button variant="secondary" onClick={printReport}>
              <Printer className="h-4 w-4" /> Print / Save PDF
            </Button>
            <Button variant="secondary" onClick={printReport}>
              <Download className="h-4 w-4" /> Export Report
            </Button>
            <SyncButton loading={loading.global} onClick={syncAllSystemData} />
          </>
        }
      />

      <Card
        className="relative overflow-hidden border border-slate-200 p-8 shadow-sm"
        style={{
          background:
            'linear-gradient(135deg, #f8fbff 0%, #eef7ff 55%, #edfdf7 100%)',
        }}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative grid gap-7 xl:grid-cols-[1.35fr_1fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/70 border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 shadow-lg">
              <FileText className="h-4 w-4" /> Live Database Report
            </div>
            <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Business Performance Command Center
            </h2>
            <p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-slate-600">
              Real-time ERP report for revenue, gross profit, inventory value, customers, suppliers, invoices, purchase orders, low-stock risks, and operational health.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Gross Profit</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{money(grossProfit)}</p>
              </div>
              <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Profit Margin</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{profitMargin}%</p>
              </div>
              <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">Outstanding</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{money(outstanding)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ReportTile label="Live Records" value={products.length + suppliers.length + customers.length + sales.length + purchaseOrders.length} hint="ERP database rows" />
            <ReportTile label="Gross Profit" value={money(grossProfit)} hint={`${profitMargin}% margin`} tone="green" />
            <ReportTile label="Low Stock" value={lowStockProducts.length} hint="Needs restocking" tone={lowStockProducts.length ? 'amber' : 'green'} />
            <ReportTile label="Issues" value={systemIssues} hint="API/module errors" tone={systemIssues ? 'red' : 'green'} />
          </div>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Total Revenue" value={money(revenue)} hint={`${sales.length} sales invoices`} icon={<DollarSign />} />
        <Stat label="Gross Profit" value={money(grossProfit)} hint={`${profitMargin}% estimated margin`} icon={<TrendingUp />} />
        <Stat label="Collected Revenue" value={money(collected)} hint={`${paidSales.length} paid invoices`} icon={<CheckCircle2 />} />
        <Stat label="Outstanding" value={money(outstanding)} hint={`${unpaidSales.length} unpaid invoices`} icon={<ShoppingCart />} />
        <Stat label="Inventory Value" value={money(inventoryValue)} hint={`${products.length} products`} icon={<Package />} />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={products.length} hint={`${inventoryOverview.lowStockProducts ?? lowStockProducts.length} low stock`} icon={<Package />} />
        <Stat label="Suppliers" value={supplierOverview.totalSuppliers ?? suppliers.length} hint={`${poOverview.sentOrders ?? purchaseOrders.filter((p) => p.statusName === 'Sent').length} sent POs`} icon={<Users />} />
        <Stat label="Customers" value={customers.length} hint="CRM records" icon={<Users />} />
        <Stat label="System Health" value={systemIssues ? 'Review' : 'Healthy'} hint={`${systemIssues} issue(s)`} icon={<AlertTriangle />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartShell title="Sales Revenue Trend" subtitle="Real sales revenue grouped by invoice date" icon={<TrendingUp className="h-5 w-5" />} empty={!salesTrend.length}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="revenueGradientV3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip formatter={moneyTooltip} contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fill="url(#revenueGradientV3)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Inventory by Category" subtitle="Live product quantities grouped by category" icon={<Package className="h-5 w-5" />} empty={!inventoryByCategory.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar name="Quantity" dataKey="quantity" radius={[14, 14, 0, 0]}>
                {inventoryByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Top Customers by Revenue" subtitle="Highest customer contribution from sales invoices" icon={<Users className="h-5 w-5" />} empty={!topCustomers.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCustomers} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="customer" width={120} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip formatter={moneyTooltip} contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar name="Revenue" dataKey="revenue" fill="#8b5cf6" radius={[0, 14, 14, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Best Selling Products" subtitle="Sold quantities or current stock fallback" icon={<BarChart3 className="h-5 w-5" />} empty={!topProducts.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="product" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar name="Quantity" dataKey="quantity" fill="#06b6d4" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="CRM Pipeline" subtitle="Customers distributed by CRM status" icon={<Users className="h-5 w-5" />} empty={!crmPipeline.some((r) => r.customers)}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crmPipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="stage" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar name="Customers" dataKey="customers" fill="#10b981" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Invoice Payment Split" subtitle="Paid versus unpaid invoices" icon={<PieChartIcon className="h-5 w-5" />} empty={!invoiceSplit.length}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={invoiceSplit} dataKey="count" nameKey="status" innerRadius={75} outerRadius={125} paddingAngle={6} label={({ status, count }) => `${status}: ${count}`}>
                {invoiceSplit.map((row, i) => <Cell key={row.status} fill={row.status === 'Paid' ? '#10b981' : COLORS[(i + 3) % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Purchase Order Status" subtitle="Purchasing workflow status distribution" icon={<ShoppingCart className="h-5 w-5" />} empty={!poStatus.length}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={poStatus} dataKey="orders" nameKey="status" innerRadius={75} outerRadius={125} paddingAngle={6} label={({ status, orders }) => `${status}: ${orders}`}>
                {poStatus.map((_, i) => <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Quotation Status" subtitle="Draft, sent, accepted, rejected quotation flow" icon={<FileText className="h-5 w-5" />} empty={!quotationStatus.length}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotationStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar name="Quotations" dataKey="count" fill="#f59e0b" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell title="Inventory Movements by Type" subtitle="Stock movement quantities by operation type" icon={<RefreshCw className="h-5 w-5" />} empty={!movementTypes.length}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={movementTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.32)" />
              <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 18, border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line type="monotone" name="Quantity" dataKey="quantity" stroke="#ef4444" strokeWidth={4} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-slate-900">Executive Written Report</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Auto-generated business reading</p>
            </div>
            <Badge tone={systemIssues ? 'amber' : 'green'}>{systemIssues ? 'Review needed' : 'Healthy'}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ReportTile label="Revenue" value={money(revenue)} />
            <ReportTile label="Gross Profit" value={money(grossProfit)} hint={`${profitMargin}% margin`} tone="green" />
            <ReportTile label="Outstanding" value={money(outstanding)} tone={outstanding ? 'amber' : 'green'} />
            <ReportTile label="Inventory" value={money(inventoryValue)} tone="purple" />
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            The ERP database currently contains {products.length} products, {suppliers.length} suppliers, {customers.length} customers, {purchaseOrders.length} purchase orders, {quotations.length} quotations, and {sales.length} sales invoices.
            Total sales revenue is {money(revenue)}, with {money(collected)} collected and {money(outstanding)} still outstanding. Estimated gross profit is {money(grossProfit)} with a {profitMargin}% margin. Inventory value is estimated at {money(inventoryValue)}, while {lowStockProducts.length} products require stock review.
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Low Stock Watchlist"
          rows={lowStockProducts.slice(0, 10)}
          empty="No low-stock products found."
          columns={[
            { key: 'name', label: 'Product' },
            { key: 'category', label: 'Category' },
            { key: 'quantity', label: 'Qty' },
            { key: 'minimumStockLevel', label: 'Min Stock' },
            { key: 'stockDeficit', label: 'Deficit' },
            { key: 'status', label: 'Status', render: () => <Badge tone="amber">Low Stock</Badge> },
          ]}
        />

        <DataTable
          title="Operational Health"
          rows={healthRows}
          columns={[
            { key: 'module', label: 'Module' },
            { key: 'records', label: 'Records' },
            { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'Healthy' ? 'green' : 'amber'}>{r.status}</Badge> },
          ]}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Recent Purchase Orders"
          rows={purchaseOrders.slice(0, 10)}
          empty="No purchase orders returned from database."
          columns={[
            { key: 'purchaseOrderNumber', label: 'PO Number' },
            { key: 'supplierName', label: 'Supplier' },
            { key: 'orderDate', label: 'Date' },
            { key: 'totalAmount', label: 'Total', render: (r) => money(r.totalAmount) },
            { key: 'statusName', label: 'Status', render: (r) => <Badge tone="blue">{r.statusName || r.statusText}</Badge> },
          ]}
        />

        <DataTable
          title="Recent Invoices"
          loading={loading.sales}
          rows={sales.slice(0, 10)}
          empty="No invoices returned from database."
          columns={[
            { key: 'invoiceNumber', label: 'Invoice' },
            { key: 'customerName', label: 'Customer' },
            { key: 'invoiceDate', label: 'Date' },
            { key: 'totalAmount', label: 'Total', render: (r) => money(r.totalAmount) },
            { key: 'statusName', label: 'Status', render: (r) => <Badge tone={r.isPaid ? 'green' : 'amber'}>{r.statusName || (r.isPaid ? 'Paid' : 'Unpaid')}</Badge> },
          ]}
        />
      </section>

      <style>{`
        @media print {
          body { background: white !important; }
          nav, aside, header button, .no-print { display: none !important; }
          .recharts-wrapper, .recharts-surface { overflow: visible !important; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
