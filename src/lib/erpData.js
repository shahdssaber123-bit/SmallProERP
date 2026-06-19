
const STORAGE_KEY = 'smallpro_erp_data';

export const CRM_STAGES = ['NewLead', 'Interested', 'Opportunity', 'Won', 'Lost'];
export const LEAD_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Trade Show', 'Email Campaign', 'Other'];
export const INTERACTION_TYPES = ['Call', 'Email', 'Meeting', 'WhatsApp', 'Note'];
export const PO_STATUSES = ['Draft', 'Sent', 'Received'];
export const QUOTATION_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected'];
export const INVOICE_STATUSES = ['Unpaid', 'Paid'];
export const USER_ROLES = ['Admin', 'Manager', 'Salesperson', 'InventoryManager'];
export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Wire Transfer', 'Check', 'Other'];
export const MOVEMENT_TYPES = ['Purchase', 'Sale', 'Adjustment'];

export function genId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const dateOnly = (value) => {
  if (!value) return new Date().toISOString().split('T')[0];
  return String(value).split('T')[0];
};

const nextNumericId = (items, key) => (items || []).reduce((max, item) => Math.max(max, toNumber(item?.[key], 0)), 0) + 1;

export function normalizeUserRecord(user, options = {}) {
  if (!user) return user;
  const userId = user.userId ?? (typeof user.id === 'number' ? user.id : options.nextId ?? 0);
  const role = user.role === 'Inventory Manager' ? 'InventoryManager' : (user.role || 'Salesperson');
  return {
    ...user,
    id: user.id && typeof user.id === 'string' ? user.id : (userId ? `u${userId}` : genId('u')),
    userId,
    tenantId: user.tenantId ?? options.tenantId ?? 't1',
    fullName: user.fullName ?? user.name ?? '',
    email: user.email ?? '',
    username: user.username ?? user.email ?? '',
    phoneNumber: user.phoneNumber ?? user.phone ?? '',
    role,
    createdAt: user.createdAt ?? new Date().toISOString(),
  };
}

export function normalizeSupplierRecord(supplier) {
  if (!supplier) return supplier;
  const supplierId = supplier.supplierId ?? (typeof supplier.id === 'number' ? supplier.id : 0);
  return {
    ...supplier,
    id: supplier.id && typeof supplier.id === 'string' ? supplier.id : (supplierId ? `s${supplierId}` : genId('s')),
    supplierId,
    name: supplier.name ?? '',
    email: supplier.email ?? '',
    phone: supplier.phone ?? '',
    address: supplier.address ?? '',
    productCount: toNumber(supplier.productCount, 0),
    purchaseOrderCount: toNumber(supplier.purchaseOrderCount, 0),
    createdAt: supplier.createdAt ?? new Date().toISOString(),
  };
}

export function normalizeProductRecord(product, options = {}) {
  if (!product) return product;
  const productId = product.productId ?? (typeof product.id === 'number' ? product.id : options.nextId ?? 0);
  const quantity = toNumber(product.quantity ?? product.stock, 0);
  const minimumStockLevel = toNumber(product.minimumStockLevel ?? product.minStock, 0);
  const purchasePrice = toNumber(product.purchasePrice ?? product.cost, 0);
  const sellingPrice = toNumber(product.sellingPrice ?? product.price, 0);
  const supplier = (options.suppliers || []).find(s => String(s.supplierId ?? s.id) === String(product.supplierId));
  return {
    ...product,
    id: product.id && typeof product.id === 'string' ? product.id : (productId ? `p${productId}` : genId('p')),
    productId,
    tenantId: product.tenantId ?? options.tenantId ?? 't1',
    productCode: product.productCode ?? product.sku ?? '',
    sku: product.productCode ?? product.sku ?? '',
    name: product.name ?? '',
    description: product.description ?? '',
    category: product.category ?? '',
    quantity,
    stock: quantity,
    minimumStockLevel,
    minStock: minimumStockLevel,
    purchasePrice,
    cost: purchasePrice,
    sellingPrice,
    price: sellingPrice,
    profitMargin: product.profitMargin ?? sellingPrice - purchasePrice,
    supplierId: product.supplierId ?? null,
    supplierName: product.supplierName ?? supplier?.name ?? '',
    isLowStock: product.isLowStock ?? quantity < minimumStockLevel,
    stockDeficit: product.stockDeficit ?? (quantity < minimumStockLevel ? minimumStockLevel - quantity : 0),
    createdAt: product.createdAt ?? new Date().toISOString(),
    updatedAt: product.updatedAt ?? product.createdAt ?? new Date().toISOString(),
  };
}

export function normalizeMovementRecord(movement, options = {}) {
  if (!movement) return movement;
  const products = options.products || [];
  const movementId = movement.movementId ?? (typeof movement.id === 'number' ? movement.id : options.nextId ?? 0);
  const product = products.find(p => String(p.productId ?? p.id) === String(movement.productId));
  const movementTypeText = movement.movementTypeText ?? (movement.type === 'IN' ? 'Purchase' : movement.type === 'OUT' ? 'Sale' : movement.movementType ?? 'Adjustment');
  const quantity = Math.abs(toNumber(movement.quantity ?? movement.qty, 0));
  const movementDate = movement.movementDate ?? movement.date ?? new Date().toISOString();
  return {
    ...movement,
    id: movement.id && typeof movement.id === 'string' ? movement.id : (movementId ? `m${movementId}` : genId('m')),
    movementId,
    tenantId: movement.tenantId ?? options.tenantId ?? 't1',
    productId: movement.productId,
    productCode: movement.productCode ?? product?.productCode ?? '',
    productName: movement.productName ?? product?.name ?? '',
    movementType: movement.movementType,
    movementTypeText,
    type: movementTypeText === 'Sale' ? 'OUT' : 'IN',
    quantity,
    qty: quantity,
    referenceNumber: movement.referenceNumber ?? '',
    movementDate,
    date: dateOnly(movementDate),
    notes: movement.notes ?? movement.reason ?? '',
    reason: movement.reason ?? movement.notes ?? '',
    createdBy: movement.createdBy,
  };
}

const emptyData = () => ({
  tenants: [],
  users: [],
  customers: [],
  leads: [],
  interactions: [],
  categories: [],
  products: [],
  suppliers: [],
  quotations: [],
  invoices: [],
  payments: [],
  purchaseOrders: [],
  movements: [],
  aiInsights: [],
  ocrResults: [],
});

function migrateData(data) {
  const base = { ...emptyData(), ...(data || {}) };
  const tenantId = base.tenants?.[0]?.id ?? 't1';
  const suppliers = (base.suppliers || []).map(normalizeSupplierRecord);
  const products = (base.products || []).map((product, index) => normalizeProductRecord(product, { tenantId: product.tenantId ?? tenantId, suppliers, nextId: index + 1 }));
  const users = (base.users || []).map((user, index) => normalizeUserRecord(user, { tenantId: user.tenantId ?? tenantId, nextId: index + 1 }));
  const movements = (base.movements || []).map((movement, index) => normalizeMovementRecord(movement, { tenantId: movement.tenantId ?? tenantId, products, nextId: index + 1 }));
  return { ...base, users, suppliers, products, movements };
}

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const fresh = emptyData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const parsed = JSON.parse(stored);
    const migrated = migrateData(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    const fresh = emptyData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrateData(data)));
}

export function resetData() {
  const fresh = emptyData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export function getNextNumericId(items, key) {
  return nextNumericId(items, key);
}
