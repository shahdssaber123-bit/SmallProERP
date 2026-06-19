import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7057/api"
).replace(/\/$/, "");
const TOKEN_KEY = "smallpro_system_token";
const USER_KEY = "smallpro_system_user";
const ep = {
  auth: "/Auth",
  products: "/products",
  suppliers: "/suppliers",
  purchaseOrders: "/purchase-orders",
  movements: "/inventory/movements",
  stockAdjust: "/products/adjust-stock",
  customers: "/customers",
  interactions: "/customerinteractions",
  quotations: "/quotations",
  sales: "/sales",
  dashboard: "/dashboard",
  insights: "/insights",
  ocr: "/ocr",
};
export const CUSTOMER_STATUS = [
  { id: 1, key: "NewLead", name: "New Lead" },
  { id: 2, key: "Interested", name: "Interested" },
  { id: 3, key: "Opportunity", name: "Opportunity" },
  { id: 4, key: "Won", name: "Won" },
  { id: 5, key: "Lost", name: "Lost" },
];
export const QUOTATION_STATUS = [
  { id: 1, key: "Draft", name: "Draft" },
  { id: 2, key: "Sent", name: "Sent" },
  { id: 3, key: "Accepted", name: "Accepted" },
  { id: 4, key: "Rejected", name: "Rejected" },
];
export const PO_STATUS = [
  { id: 1, key: "Draft", name: "Draft" },
  { id: 2, key: "Sent", name: "Sent" },
  { id: 3, key: "Received", name: "Received" },
];
const permissions = {
  Admin: [
    "dashboard",
    "crm",
    "sales",
    "inventory",
    "purchase",
    "users",
    "ai",
    "subscription",
  ],
  Manager: ["dashboard", "inventory", "ai", "subscription"],
  Manger: ["dashboard", "inventory", "ai", "subscription"],
  Salesperson: ["sales", "crm", "inventory", "ai", "subscription"],
  "Sales Person": ["sales", "crm", "inventory", "ai", "subscription"],
  Sales: ["sales", "crm", "inventory", "ai", "subscription"],
  InventoryManager: ["purchase", "inventory", "subscription"],
  InvManager: ["purchase", "inventory", "subscription"],
  "Inventory Manager": ["purchase", "inventory", "subscription"],
  "Inv manger": ["purchase", "inventory", "subscription"],
};
const roleModules = (role) =>
  permissions[role] ||
  permissions[String(role || "").replace(/\s+/g, "")] ||
  permissions.Admin;
const emptyData = {
  products: [],
  suppliers: [],
  customers: [],
  interactions: [],
  purchaseOrders: [],
  movements: [],
  quotations: [],
  sales: [],
  insights: [],
  ocrResults: [],
  dashboard: {},
  users: [],
};

const fallbackData = {
  suppliers: [
    {
      id: 1,
      supplierId: 1,
      name: "Digital Wholesale",
      email: "sales@digital-wholesale.com",
      phone: "+20 100 220 4455",
      address: "Cairo, Egypt",
      productCount: 3,
      purchaseOrderCount: 2,
      createdAt: "2026-04-12",
    },
    {
      id: 2,
      supplierId: 2,
      name: "OfficePro Supply",
      email: "orders@officepro.com",
      phone: "+20 100 335 7788",
      address: "Giza, Egypt",
      productCount: 2,
      purchaseOrderCount: 1,
      createdAt: "2026-04-16",
    },
    {
      id: 3,
      supplierId: 3,
      name: "Smart Tech Import",
      email: "hello@smarttech.com",
      phone: "+20 111 902 2211",
      address: "Alexandria, Egypt",
      productCount: 2,
      purchaseOrderCount: 1,
      createdAt: "2026-04-21",
    },
  ],
  products: [
    {
      id: 1,
      productId: 1,
      productCode: "ERP-LIC-STD",
      name: "ERP Suite License",
      description: "Annual Small Pro ERP license",
      category: "Software",
      quantity: 42,
      minimumStockLevel: 10,
      purchasePrice: 80,
      sellingPrice: 149.99,
      profitMargin: 69.99,
      supplierId: 1,
      supplierName: "Digital Wholesale",
      isLowStock: false,
      stockDeficit: 0,
      createdAt: "2026-04-12",
      updatedAt: "2026-04-29",
    },
    {
      id: 2,
      productId: 2,
      productCode: "KEY-MECH-01",
      name: "Mechanical Keyboard",
      description: "Premium keyboard",
      category: "Accessories",
      quantity: 18,
      minimumStockLevel: 8,
      purchasePrice: 45,
      sellingPrice: 89.99,
      profitMargin: 44.99,
      supplierId: 2,
      supplierName: "OfficePro Supply",
      isLowStock: false,
      stockDeficit: 0,
      createdAt: "2026-04-14",
      updatedAt: "2026-04-29",
    },
    {
      id: 3,
      productId: 3,
      productCode: "MON-4K-27",
      name: '4K Monitor 27"',
      description: "27 inch 4K monitor",
      category: "Electronics",
      quantity: 8,
      minimumStockLevel: 12,
      purchasePrice: 260,
      sellingPrice: 449.99,
      profitMargin: 189.99,
      supplierId: 1,
      supplierName: "Digital Wholesale",
      isLowStock: true,
      stockDeficit: 4,
      createdAt: "2026-04-14",
      updatedAt: "2026-04-29",
    },
    {
      id: 4,
      productId: 4,
      productCode: "MSE-WL-02",
      name: "Wireless Mouse",
      description: "Compact wireless mouse",
      category: "Accessories",
      quantity: 6,
      minimumStockLevel: 15,
      purchasePrice: 15,
      sellingPrice: 32.5,
      profitMargin: 17.5,
      supplierId: 2,
      supplierName: "OfficePro Supply",
      isLowStock: true,
      stockDeficit: 9,
      createdAt: "2026-04-20",
      updatedAt: "2026-04-30",
    },
    {
      id: 5,
      productId: 5,
      productCode: "LAP-PRO-14",
      name: 'Business Laptop 14"',
      description: "Lightweight business laptop",
      category: "Electronics",
      quantity: 14,
      minimumStockLevel: 6,
      purchasePrice: 520,
      sellingPrice: 899,
      profitMargin: 379,
      supplierId: 3,
      supplierName: "Smart Tech Import",
      isLowStock: false,
      stockDeficit: 0,
      createdAt: "2026-04-23",
      updatedAt: "2026-04-30",
    },
  ],
  customers: [
    {
      id: 1,
      customerId: 1,
      name: "Bob Smith",
      company: "Built LLC",
      email: "bob@built.example",
      phone: "+20 100 111 2222",
      status: "NewLead",
      statusId: 1,
      createdAt: "2026-04-28",
    },
    {
      id: 2,
      customerId: 2,
      name: "Carol White",
      company: "DesignHub",
      email: "carol@designhub.example",
      phone: "+20 100 333 4444",
      status: "Won",
      statusId: 4,
      createdAt: "2026-04-21",
    },
    {
      id: 3,
      customerId: 3,
      name: "David Brown",
      company: "MarketPro",
      email: "david@marketpro.example",
      phone: "+20 100 555 6666",
      status: "Opportunity",
      statusId: 3,
      createdAt: "2026-04-30",
    },
    {
      id: 4,
      customerId: 4,
      name: "Frank Miller",
      company: "LogiMove Ltd.",
      email: "frank@logimove.example",
      phone: "+20 100 777 8888",
      status: "Interested",
      statusId: 2,
      createdAt: "2026-04-29",
    },
    {
      id: 5,
      customerId: 5,
      name: "Isla Turner",
      company: "EduLearn Academy",
      email: "isla@edulearn.example",
      phone: "+20 100 999 0000",
      status: "Lost",
      statusId: 5,
      createdAt: "2026-04-26",
    },
  ],
  interactions: [
    {
      id: 1,
      interactionId: 1,
      customerId: 1,
      type: "Call",
      typeName: "Call",
      description: "Initial requirements call.",
      notes: "Initial requirements call.",
      interactionDate: "2026-04-28",
    },
    {
      id: 2,
      interactionId: 2,
      customerId: 3,
      type: "Meeting",
      typeName: "Meeting",
      description: "Product demo completed.",
      notes: "Product demo completed.",
      interactionDate: "2026-04-30",
    },
  ],
  purchaseOrders: [
    {
      id: 1,
      purchaseOrderId: 1,
      poNumber: "PO-2026-0001",
      supplierId: 1,
      supplierName: "Digital Wholesale",
      totalAmount: 2600,
      status: "Sent",
      statusName: "Sent",
      statusText: "Sent",
      orderDate: "2026-04-14",
      createdAt: "2026-04-14",
      notes: "Monitor replenishment",
      items: [
        {
          purchaseOrderItemId: 1,
          productId: 3,
          productCode: "MON-4K-27",
          productName: '4K Monitor 27"',
          quantity: 10,
          unitPrice: 260,
          lineTotal: 2600,
        },
      ],
    },
    {
      id: 2,
      purchaseOrderId: 2,
      poNumber: "PO-2026-0002",
      supplierId: 2,
      supplierName: "OfficePro Supply",
      totalAmount: 675,
      status: "Received",
      statusName: "Received",
      statusText: "Received",
      orderDate: "2026-04-20",
      receivedDate: "2026-04-27",
      createdAt: "2026-04-20",
      notes: "Accessories restock",
      items: [
        {
          purchaseOrderItemId: 2,
          productId: 2,
          productCode: "KEY-MECH-01",
          productName: "Mechanical Keyboard",
          quantity: 15,
          unitPrice: 45,
          lineTotal: 675,
        },
      ],
    },
    {
      id: 3,
      purchaseOrderId: 3,
      poNumber: "PO-2026-0003",
      supplierId: 3,
      supplierName: "Smart Tech Import",
      totalAmount: 1560,
      status: "Draft",
      statusName: "Draft",
      statusText: "Draft",
      orderDate: "2026-04-30",
      createdAt: "2026-04-30",
      notes: "Laptop safety stock",
      items: [
        {
          purchaseOrderItemId: 3,
          productId: 5,
          productCode: "LAP-PRO-14",
          productName: 'Business Laptop 14"',
          quantity: 3,
          unitPrice: 520,
          lineTotal: 1560,
        },
      ],
    },
  ],
  movements: [
    {
      id: 1,
      movementId: 1,
      productId: 3,
      productCode: "MON-4K-27",
      productName: '4K Monitor 27"',
      movementTypeText: "Purchase",
      quantity: 10,
      referenceNumber: "PO-2026-0001",
      movementDate: "2026-04-14",
      notes: "Received purchase order stock.",
    },
    {
      id: 2,
      movementId: 2,
      productId: 2,
      productCode: "KEY-MECH-01",
      productName: "Mechanical Keyboard",
      movementTypeText: "Purchase",
      quantity: 15,
      referenceNumber: "PO-2026-0002",
      movementDate: "2026-04-27",
      notes: "Accessories stock received.",
    },
    {
      id: 3,
      movementId: 3,
      productId: 1,
      productCode: "ERP-LIC-STD",
      productName: "ERP Suite License",
      movementTypeText: "Sale",
      quantity: 20,
      referenceNumber: "INV-20260429-230748",
      movementDate: "2026-04-29",
      notes: "Invoice fulfillment.",
    },
  ],
  quotations: [
    {
      id: 1,
      quotationId: 1,
      quotationNumber: "Q-2026-0001",
      customerId: 1,
      customerName: "Bob Smith",
      totalAmount: 6999.85,
      status: "Sent",
      statusName: "Sent",
      createdAt: "2026-04-19",
      items: [
        {
          productId: 1,
          productName: "ERP Suite License",
          quantity: 10,
          unitPrice: 149.99,
        },
        {
          productId: 2,
          productName: "Mechanical Keyboard",
          quantity: 5,
          unitPrice: 89.99,
        },
      ],
    },
    {
      id: 2,
      quotationId: 2,
      quotationNumber: "Q-2026-0002",
      customerId: 2,
      customerName: "Carol White",
      totalAmount: 10649.43,
      status: "Accepted",
      statusName: "Accepted",
      createdAt: "2026-04-21",
      items: [
        {
          productId: 3,
          productName: '4K Monitor 27"',
          quantity: 12,
          unitPrice: 449.99,
        },
        {
          productId: 1,
          productName: "ERP Suite License",
          quantity: 20,
          unitPrice: 149.99,
        },
        {
          productId: 2,
          productName: "Mechanical Keyboard",
          quantity: 25,
          unitPrice: 89.99,
        },
      ],
    },
    {
      id: 3,
      quotationId: 3,
      quotationNumber: "Q-20260430-41901",
      customerId: 3,
      customerName: "David Brown",
      totalAmount: 363.96,
      status: "Sent",
      statusName: "Sent",
      createdAt: "2026-04-30",
      items: [
        {
          productId: 2,
          productName: "Mechanical Keyboard",
          quantity: 4,
          unitPrice: 89.99,
        },
      ],
    },
  ],
  sales: [
    {
      id: 1,
      saleId: 1,
      invoiceNumber: "INV-20260422-091245",
      customerId: 2,
      customerName: "Carol White",
      quotationId: 2,
      totalAmount: 6713.59,
      isPaid: true,
      statusName: "Paid",
      invoiceDate: "2026-04-22",
      dueDate: "2026-05-22",
      paymentMethod: "Wire Transfer",
      items: [
        {
          productId: 1,
          productName: "ERP Suite License",
          quantity: 20,
          unitPrice: 149.99,
        },
        {
          productId: 2,
          productName: "Mechanical Keyboard",
          quantity: 15,
          unitPrice: 89.99,
        },
      ],
    },
    {
      id: 2,
      saleId: 2,
      invoiceNumber: "INV-20260429-230748",
      customerId: 2,
      customerName: "Carol White",
      quotationId: 2,
      totalAmount: 10599.96,
      isPaid: false,
      statusName: "Unpaid",
      invoiceDate: "2026-04-29",
      dueDate: "2026-05-29",
      paymentMethod: "Cash",
      items: [
        {
          productId: 3,
          productName: '4K Monitor 27"',
          quantity: 12,
          unitPrice: 449.99,
        },
        {
          productId: 1,
          productName: "ERP Suite License",
          quantity: 20,
          unitPrice: 149.99,
        },
        {
          productId: 2,
          productName: "Mechanical Keyboard",
          quantity: 25,
          unitPrice: 89.99,
        },
      ],
    },
  ],
  insights: [
    {
      id: 1,
      insightLogId: 1,
      insightType: "Sales",
      title: "Revenue momentum",
      summary:
        "Collected revenue is strong while one high-value invoice remains open.",
      confidenceScore: 0.91,
      createdAt: "2026-04-30",
    },
    {
      id: 2,
      insightLogId: 2,
      insightType: "Inventory",
      title: "Low stock watchlist",
      summary: "4K Monitor and Wireless Mouse need replenishment soon.",
      confidenceScore: 0.88,
      createdAt: "2026-04-30",
    },
  ],
  ocrResults: [
    {
      id: 1,
      ocrResultId: 1,
      fileName: "purchase-receipt.png",
      extractedText: "PO-2026-0002 received",
      confidenceScore: 0.9,
      createdAt: "2026-04-30",
    },
  ],
  dashboard: {},
  users: [],
};
const fallbackRows = (key) =>
  fallbackData[key]
    ? fallbackData[key].map((x) => ({ ...x, _fallback: true }))
    : [];
const Ctx = createContext(null);
const lowerFirst = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);
const normKeys = (v) =>
  Array.isArray(v)
    ? v.map(normKeys)
    : v && typeof v === "object" && !(v instanceof File)
      ? Object.fromEntries(
          Object.entries(v).map(([k, val]) => [lowerFirst(k), normKeys(val)]),
        )
      : v;
const unwrap = (p) => {
  const x = normKeys(p);
  if (Array.isArray(x) || !x || typeof x !== "object") return x;
  if (x.data && typeof x.data === "object" && !Array.isArray(x.data))
    return x.data;
  return x;
};
const arr = (p) => {
  const x = normKeys(p);
  if (Array.isArray(x)) return x;
  if (!x || typeof x !== "object") return [];
  if (Array.isArray(x.data)) return x.data;
  if (
    Array.isArray(x.items) &&
    !("quotationId" in x) &&
    !("purchaseOrderId" in x) &&
    !("saleId" in x) &&
    !("supplierId" in x)
  )
    return x.items;
  if (Array.isArray(x.results)) return x.results;
  if (Array.isArray(x.value)) return x.value;
  return [x];
};
const num = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (d) =>
  new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const statusId = (v, list) => {
  if (typeof v === "number") return v;
  const s = String(v || "")
    .replace(/\s+/g, "")
    .toLowerCase();
  return (
    list.find(
      (x) =>
        x.key.toLowerCase() === s ||
        x.name.replace(/\s+/g, "").toLowerCase() === s,
    )?.id || list[0].id
  );
};
const statusName = (v, list) =>
  list.find((x) => x.id === Number(v))?.key ||
  list.find((x) => x.key === v || x.name === v)?.key ||
  String(v || list[0].key);
const firstDefined = (...vals) =>
  vals.find((v) => v !== undefined && v !== null && v !== "");
const productIdOf = (r = {}) =>
  firstDefined(r.productId, r.id, r.productID, r.ProductId);
const supplierIdOf = (r = {}) =>
  firstDefined(r.supplierId, r.id, r.supplierID, r.SupplierId);
const customerIdOf = (r = {}) =>
  firstDefined(r.customerId, r.id, r.customerID, r.CustomerId);
const quotationIdOf = (r = {}) =>
  firstDefined(r.quotationId, r.id, r.quoteId, r.quotationID, r.QuotationId);
const saleIdOf = (r = {}) =>
  firstDefined(r.saleId, r.id, r.invoiceId, r.saleID, r.SaleId);
const purchaseOrderIdOf = (r = {}) =>
  firstDefined(
    r.purchaseOrderId,
    r.id,
    r.poId,
    r.purchaseOrderID,
    r.PurchaseOrderId,
  );
const itemIdOf = (r = {}) =>
  firstDefined(
    r.quotationItemId,
    r.itemId,
    r.id,
    r.quotationItemID,
    r.QuotationItemId,
  );
const ensureId = (value, label) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0)
    throw new Error(
      `${label} is missing. Please reopen Details from the list and try again.`,
    );
  return id;
};
const quotationNumber = () =>
  `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-5)}`;
const notify = (message, type = "info") => {
  if (typeof window !== "undefined" && message) {
    window.dispatchEvent(
      new CustomEvent("smallpro-toast", { detail: { message, type } }),
    );
  }
};
const userMessageForLoadError = (key, error) => {
  if (error?.status === 401 || error?.status === 403) return null;
  return error?.message || `Could not load ${key}.`;
};

const buildPoDocument = (po = {}) => ({
  companyName: po.companyName || "Small Pro",
  poNumber: po.poNumber || po.pONumber || "",
  orderDate: po.orderDate,
  expectedDeliveryDate:
    po.expectedDeliveryDate ||
    (po.orderDate
      ? new Date(new Date(po.orderDate).getTime() + 14 * 86400000).toISOString()
      : null),
  supplierName: po.supplierName,
  supplierEmail: po.supplierEmail,
  supplierPhone: po.supplierPhone,
  supplierAddress: po.supplierAddress,
  items: (po.items || []).map((it, i) => ({
    itemNumber: i + 1,
    productCode: it.productCode,
    productName: it.productName,
    productDescription: it.productDescription,
    quantity: num(it.quantity),
    unitPrice: num(it.unitPrice),
    lineTotal: num(it.lineTotal ?? num(it.quantity) * num(it.unitPrice)),
    notes: it.notes,
  })),
  totalAmount: num(po.totalAmount),
  totalItems: num(po.totalItems ?? (po.items || []).length),
  totalQuantity: num(
    po.totalQuantity ??
      (po.items || []).reduce((sum, it) => sum + num(it.quantity), 0),
  ),
  notes: po.notes,
  paymentTerms: po.paymentTerms || "Net 30",
});

export function ErpProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || "",
  );
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const setLoad = useCallback(
    (k, v) => setLoading((p) => ({ ...p, [k]: v })),
    [],
  );
  const setErr = useCallback(
    (k, v) => setErrors((p) => ({ ...p, [k]: v || null })),
    [],
  );
  const request = useCallback(
    async (path, options = {}) => {
      const url = path.startsWith("http")
        ? path
        : `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;
      const isForm = options.body instanceof FormData;
      const headers = {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      };
      const t = token || localStorage.getItem(TOKEN_KEY);
      if (t) headers.Authorization = `Bearer ${t}`;
      const res = await fetch(url, { ...options, headers });
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = text;
      }
      if (!res.ok) {
        const msg =
          typeof json === "string"
            ? json
            : json?.message ||
              json?.title ||
              json?.error ||
              (json?.errors
                ? Object.values(json.errors).flat().join(" | ")
                : `HTTP ${res.status}`);
        const e = new Error(msg);
        e.status = res.status;
        e.payload = json;
        throw e;
      }
      return normKeys(json);
    },
    [token],
  );
  const action = useCallback(async (fn, refresh = []) => {
    try {
      const r = await fn();
      await Promise.allSettled(refresh.map((x) => x()));
      notify("Action completed successfully.", "success");
      return { success: true, data: normKeys(r) };
    } catch (e) {
      notify(
        e.message ||
          "Action failed. Please review the highlighted fields and try again.",
        "error",
      );
      return { success: false, error: e.message, status: e.status };
    }
  }, []);
  const list = useCallback(
    async (key, path, normalizer) => {
      setLoad(key, true);
      setErr(key, null);
      try {
        let rows = arr(await request(path)).map(normalizer);
        
        setData((p) => ({ ...p, [key]: rows }));
        return rows;
      } catch (e) {
        const friendly = userMessageForLoadError(key, e);
        setErr(key, friendly);
        const rows = fallbackRows(key).map(normalizer);
        if (rows.length) setData((p) => ({ ...p, [key]: rows }));
        return rows;
      } finally {
        setLoad(key, false);
      }
    },
    [request, setErr, setLoad],
  );

  const normalizeSupplier = useCallback(
    (s = {}) => ({
      ...s,
      id: supplierIdOf(s),
      supplierId: supplierIdOf(s),
      name: s.name || "",
      productCount: num(s.productCount ?? s.products?.length),
      purchaseOrderCount: num(s.purchaseOrderCount ?? s.purchaseOrders?.length),
    }),
    [],
  );
  const normalizeProduct = useCallback(
    (p = {}) => ({
      ...p,
      id: productIdOf(p),
      productId: productIdOf(p),
      productCode: p.productCode || p.code || "",
      name: p.name || p.productName || "",
      quantity: num(p.quantity),
      minimumStockLevel: num(p.minimumStockLevel),
      purchasePrice: num(p.purchasePrice),
      sellingPrice: num(p.sellingPrice),
      profitMargin: num(
        p.profitMargin ?? num(p.sellingPrice) - num(p.purchasePrice),
      ),
      isLowStock: Boolean(
        p.isLowStock ?? num(p.quantity) < num(p.minimumStockLevel),
      ),
      stockDeficit: num(
        p.stockDeficit ??
          Math.max(0, num(p.minimumStockLevel) - num(p.quantity)),
      ),
    }),
    [],
  );
  const normalizeCustomer = useCallback(
    (c = {}) => ({
      ...c,
      id: customerIdOf(c),
      customerId: customerIdOf(c),
      name: c.name || "",
      status: statusName(c.statusName || c.status || 1, CUSTOMER_STATUS),
      statusId: statusId(c.statusName || c.status || 1, CUSTOMER_STATUS),
    }),
    [],
  );
  const normalizeInteraction = useCallback(
    (i = {}) => ({
      ...i,
      id: i.interactionId ?? i.id,
      interactionId: i.interactionId ?? i.id,
      type: i.typeName || i.type || "Note",
      notes: i.description || i.notes || "",
      description: i.description || i.notes || "",
      date: i.interactionDate || i.createdAt || i.date,
    }),
    [],
  );
  const normalizeMovement = useCallback(
    (m = {}) => ({
      ...m,
      id: m.movementId ?? m.id,
      movementId: m.movementId ?? m.id,
      productName: m.productName || "",
      movementTypeText: m.movementTypeText || m.movementType || m.type || "",
      quantity: num(m.quantity),
      movementDate: m.movementDate || m.createdAt || m.date,
    }),
    [],
  );
  const normalizePO = useCallback((po = {}) => {
    const items = (po.items || []).map((it) => ({
      ...it,
      quantity: num(it.quantity),
      unitPrice: num(it.unitPrice),
      lineTotal: num(it.lineTotal ?? num(it.quantity) * num(it.unitPrice)),
    }));
    return {
      ...po,
      id: purchaseOrderIdOf(po),
      purchaseOrderId: purchaseOrderIdOf(po),
      poNumber: po.poNumber || po.pONumber || "",
      statusName: po.statusText || statusName(po.status || 1, PO_STATUS),
      items,
      totalAmount: num(
        po.totalAmount ?? items.reduce((s, it) => s + it.lineTotal, 0),
      ),
      totalItems: num(po.totalItems ?? items.length),
      totalQuantity: num(
        po.totalQuantity ?? items.reduce((s, it) => s + it.quantity, 0),
      ),
    };
  }, []);
  const normalizeQuotation = useCallback((q = {}) => {
    const items = (q.items || []).map((it) => ({
      ...it,
      id: itemIdOf(it),
      quotationItemId: itemIdOf(it),
      quantity: num(it.quantity),
      unitPrice: num(it.unitPrice),
      lineTotal: num(it.lineTotal ?? num(it.quantity) * num(it.unitPrice)),
    }));
    const id = quotationIdOf(q);
    return {
      ...q,
      id,
      quotationId: id,
      statusName: q.statusName || statusName(q.status || 1, QUOTATION_STATUS),
      statusId: statusId(q.statusName || q.status || 1, QUOTATION_STATUS),
      items,
      itemCount: num(q.itemCount ?? items.length),
      subtotal: num(q.subtotal),
      taxAmount: num(q.taxAmount),
      totalAmount: num(
        q.totalAmount ??
          items.reduce((s, it) => s + it.lineTotal, 0) + num(q.taxAmount),
      ),
    };
  }, []);
  const normalizeSale = useCallback((s = {}) => {
    const items = (s.items || []).map((it) => ({
      ...it,
      quantity: num(it.quantity),
      unitPrice: num(it.unitPrice),
      lineTotal: num(it.lineTotal ?? num(it.quantity) * num(it.unitPrice)),
    }));
    return {
      ...s,
      id: saleIdOf(s),
      saleId: saleIdOf(s),
      items,
      itemCount: num(s.itemCount ?? items.length),
      subtotal: num(s.subtotal),
      taxAmount: num(s.taxAmount),
      totalAmount: num(
        s.totalAmount ??
          items.reduce((a, it) => a + it.lineTotal, 0) + num(s.taxAmount),
      ),
      statusName: s.isPaid ? "Paid" : "Unpaid",
    };
  }, []);
  const normalizeInsight = useCallback(
    (x = {}) => ({
      ...x,
      id: x.insightLogId ?? x.id,
      insightLogId: x.insightLogId ?? x.id,
      insightType: x.insightType || "Full",
      insightText: x.insightText || "",
      metrics: x.metrics || null,
    }),
    [],
  );
  const normalizeOcr = useCallback(
    (x = {}) => ({
      ...x,
      id: x.ocrResultId ?? x.id,
      ocrResultId: x.ocrResultId ?? x.id,
      rawText: x.rawText || "",
      extractedData: x.extractedData || null,
    }),
    [],
  );

  const syncSuppliers = useCallback(
    () => list("suppliers", ep.suppliers, normalizeSupplier),
    [list, normalizeSupplier],
  );
  const syncProducts = useCallback(
    () => list("products", ep.products, normalizeProduct),
    [list, normalizeProduct],
  );
  const syncCustomers = useCallback(
    () => list("customers", ep.customers, normalizeCustomer),
    [list, normalizeCustomer],
  );
  const syncInteractions = useCallback(
    () => list("interactions", ep.interactions, normalizeInteraction),
    [list, normalizeInteraction],
  );
  const syncPurchaseOrders = useCallback(
    () => list("purchaseOrders", ep.purchaseOrders, normalizePO),
    [list, normalizePO],
  );
  const syncMovements = useCallback(
    () => list("movements", ep.movements, normalizeMovement),
    [list, normalizeMovement],
  );
  const syncQuotations = useCallback(
    () => list("quotations", ep.quotations, normalizeQuotation),
    [list, normalizeQuotation],
  );
  const syncSales = useCallback(
    () => list("sales", ep.sales, normalizeSale),
    [list, normalizeSale],
  );
  const syncInsights = useCallback(
    () => list("insights", ep.insights, normalizeInsight),
    [list, normalizeInsight],
  );
  const syncOcr = useCallback(
    () => list("ocrResults", ep.ocr, normalizeOcr),
    [list, normalizeOcr],
  );
  const syncUsers = useCallback(async () => {
    try {
      const rows = arr(await request(`${ep.auth}/users`));
      setData((p) => ({ ...p, users: rows }));
      return rows;
    } catch {
      const rows = currentUser ? [currentUser] : [];
      setData((p) => ({ ...p, users: rows }));
      return rows;
    }
  }, [currentUser, request]);
  const syncDashboard = useCallback(async () => {
    setLoad("dashboard", true);
    setErr("dashboard", null);
    const calls = [
      "inventory-overview",
      "purchase-orders-overview",
      "suppliers-overview",
      "low-stock-alerts",
      "recent-activities",
      "inventory-by-category",
      "purchase-trends",
      "top-suppliers",
      "top-products",
      "movements-by-type",
      "sales-overview",
      "top-customers",
      "sales-trends",
      "crm-pipeline",
      "recent-invoices",
      "sales-comparison",
      "best-selling-products",
    ];
    const out = {};
    await Promise.all(
      calls.map(async (name) => {
        const key = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        try {
          out[key] = unwrap(await request(`${ep.dashboard}/${name}`));
        } catch (e) {
          out[key] = { error: e.message };
        }
      }),
    );
setData((p) => ({
  ...p,
  dashboard: out,
}));
    setLoad("dashboard", false);
    return out;
  }, [
    request,
    setLoad,
    setErr,
    normalizeProduct,
    normalizeSupplier,
    normalizeCustomer,
    normalizePO,
    normalizeMovement,
    normalizeQuotation,
    normalizeSale,
    normalizeInsight,
    normalizeOcr,
  ]);
  const syncAllSystemData = useCallback(async () => {
    setLoad("global", true);
    try {
      const mods = roleModules(currentUser?.role);
      const can = (m) => mods.includes(m);
      const jobs = new Map();
      const add = (name, fn) => jobs.set(name, fn);
      if (can("dashboard")) add("dashboard", syncDashboard);
      if (can("inventory")) {
        add("suppliers", syncSuppliers);
        add("products", syncProducts);
        add("movements", syncMovements);
      }
      if (can("purchase")) {
        add("suppliers", syncSuppliers);
        add("products", syncProducts);
        add("purchaseOrders", syncPurchaseOrders);
      }
      if (can("crm")) {
        add("customers", syncCustomers);
        add("interactions", syncInteractions);
        add("quotations", syncQuotations);
      }
      if (can("sales")) {
        add("customers", syncCustomers);
        add("products", syncProducts);
        add("quotations", syncQuotations);
        add("sales", syncSales);
      }
      if (can("ai")) {
        add("insights", syncInsights);
        add("ocr", syncOcr);
      }
      if (can("users")) add("users", syncUsers);
      await Promise.allSettled([...jobs.values()].map((fn) => fn()));
      setLastSyncAt(new Date().toLocaleString());
      notify("Sync completed successfully.", "success");
    } finally {
      setLoad("global", false);
    }
  }, [
    currentUser,
    syncSuppliers,
    syncProducts,
    syncCustomers,
    syncInteractions,
    syncPurchaseOrders,
    syncMovements,
    syncQuotations,
    syncSales,
    syncInsights,
    syncOcr,
    syncDashboard,
    syncUsers,
    setLoad,
  ]);
  useEffect(() => {
    if (token) syncAllSystemData();
  }, [token]);

  const login = useCallback(
    async (username, password) => {
      setLoad("global", true);
      try {
        const a = await request(`${ep.auth}/login`, {
          method: "POST",
          body: JSON.stringify({ Username: username, Password: password }),
        });
        const user = {
          token: a.token,
          userId: a.userId,
          username: a.username,
          fullName: a.fullName,
          email: a.email,
          role: a.role,
          tenantId: a.tenantId,
          companyName: a.companyName,
        };
        localStorage.setItem(TOKEN_KEY, a.token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        setToken(a.token);
        setCurrentUser(user);
        notify(
          `Welcome back, ${user.fullName || user.username || "User"}.`,
          "success",
        );
        return { success: true, user };
      } catch (e) {
        notify(
          e.message || "Login failed. Please check your credentials.",
          "error",
        );
        throw e;
      } finally {
        setLoad("global", false);
      }
    },
    [request, setLoad],
  );
  const logout = useCallback(async () => {
    try {
      await request(`${ep.auth}/logout`, { method: "POST" });
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setCurrentUser(null);
    setData(emptyData);
    notify("Signed out successfully.", "info");
  }, [request]);
  const registerTenant = useCallback(
    (p) =>
      request(`${ep.auth}/register-tenant`, {
        method: "POST",
        body: JSON.stringify(p),
      }),
    [request],
  );
  const registerUser = useCallback(
    (p) =>
      request(`${ep.auth}/register-user`, {
        method: "POST",
        body: JSON.stringify(p),
      }),
    [request],
  );
  const resetPassword = useCallback(
    (p) =>
      request(`${ep.auth}/reset-password`, {
        method: "POST",
        body: JSON.stringify(p),
      }),
    [request],
  );

  const getProductDetails = useCallback(
    async (r) => {
      try {
        return normalizeProduct(
          unwrap(await request(`${ep.products}/${productIdOf(r)}`)),
        );
      } catch {
        return normalizeProduct(
          r ||
            fallbackRows("products").find(
              (p) => Number(p.productId) === Number(productIdOf(r)),
            ) ||
            {},
        );
      }
    },
    [request, normalizeProduct],
  );
  const getSupplierDetails = useCallback(
    async (r) =>
      normalizeSupplier(
        unwrap(await request(`${ep.suppliers}/${supplierIdOf(r)}/details`)),
      ),
    [request, normalizeSupplier],
  );
  const getCustomerDetails = useCallback(
    async (r) =>
      normalizeCustomer(
        unwrap(await request(`${ep.customers}/${customerIdOf(r)}`)),
      ),
    [request, normalizeCustomer],
  );
  const getQuotationDetails = useCallback(
    async (r) =>
      normalizeQuotation(
        unwrap(await request(`${ep.quotations}/${quotationIdOf(r)}`)),
      ),
    [request, normalizeQuotation],
  );
  const getSaleDetails = useCallback(
    async (r) =>
      normalizeSale(unwrap(await request(`${ep.sales}/${saleIdOf(r)}`))),
    [request, normalizeSale],
  );
  const getPurchaseOrderDetails = useCallback(
    async (r) =>
      normalizePO(
        unwrap(await request(`${ep.purchaseOrders}/${purchaseOrderIdOf(r)}`)),
      ),
    [request, normalizePO],
  );
  const getPurchaseOrderDocument = useCallback(
    async (r) => {
      const id = ensureId(purchaseOrderIdOf(r), "Purchase order ID");
      const currentStatus = String(
        r?.statusName || r?.statusText || "",
      ).toLowerCase();
      if (currentStatus && currentStatus !== "draft") {
        const po = normalizePO(
          unwrap(await request(`${ep.purchaseOrders}/${id}`)),
        );
        const fallback = buildPoDocument(po);
        fallback.systemDocumentUnavailable =
          "This print view is shown from the purchase order details.";
        return fallback;
      }
      try {
        return unwrap(await request(`${ep.purchaseOrders}/${id}/document`));
      } catch (e) {
        const po = normalizePO(
          unwrap(await request(`${ep.purchaseOrders}/${id}`)),
        );
        const fallback = buildPoDocument(po);
        fallback.systemDocumentUnavailable =
          "This print view is shown from the purchase order details.";
        return fallback;
      }
    },
    [request, normalizePO],
  );
  const getInsightDetails = useCallback(
    async (r) =>
      normalizeInsight(
        unwrap(await request(`${ep.insights}/${r.insightLogId}`)),
      ),
    [request, normalizeInsight],
  );
  const getOcrDetails = useCallback(
    async (r) =>
      normalizeOcr(unwrap(await request(`${ep.ocr}/${r.ocrResultId}`))),
    [request, normalizeOcr],
  );

  const saveProduct = useCallback(
    (p, e) =>
      action(
        () =>
          request(e ? `${ep.products}/${productIdOf(e)}` : ep.products, {
            method: e ? "PUT" : "POST",
            body: JSON.stringify(p),
          }),
        [syncProducts, syncMovements, syncDashboard],
      ),
    [action, request, syncProducts, syncMovements, syncDashboard],
  );
  const deleteProduct = useCallback(
    (p) =>
      action(
        () => request(`${ep.products}/${productIdOf(p)}`, { method: "DELETE" }),
        [syncProducts, syncMovements, syncDashboard],
      ),
    [action, request, syncProducts, syncMovements, syncDashboard],
  );
  const adjustStock = useCallback(
    (p) =>
      action(
        () =>
          request(ep.stockAdjust, { method: "POST", body: JSON.stringify(p) }),
        [syncProducts, syncMovements, syncDashboard],
      ),
    [action, request, syncProducts, syncMovements, syncDashboard],
  );
  const saveSupplier = useCallback(
    (p, e) =>
      action(
        () =>
          request(e ? `${ep.suppliers}/${supplierIdOf(e)}` : ep.suppliers, {
            method: e ? "PUT" : "POST",
            body: JSON.stringify(p),
          }),
        [syncSuppliers, syncProducts, syncPurchaseOrders, syncDashboard],
      ),
    [
      action,
      request,
      syncSuppliers,
      syncProducts,
      syncPurchaseOrders,
      syncDashboard,
    ],
  );
  const deleteSupplier = useCallback(
    (s) =>
      action(
        () =>
          request(`${ep.suppliers}/${supplierIdOf(s)}`, { method: "DELETE" }),
        [syncSuppliers, syncProducts, syncPurchaseOrders, syncDashboard],
      ),
    [
      action,
      request,
      syncSuppliers,
      syncProducts,
      syncPurchaseOrders,
      syncDashboard,
    ],
  );
  const saveCustomer = useCallback(
    (p, e) =>
      action(
        () =>
          request(e ? `${ep.customers}/${customerIdOf(e)}` : ep.customers, {
            method: e ? "PUT" : "POST",
            body: JSON.stringify(p),
          }),
        [syncCustomers, syncDashboard],
      ),
    [action, request, syncCustomers, syncDashboard],
  );
  const deleteCustomer = useCallback(
    (c) =>
      action(
        () =>
          request(`${ep.customers}/${customerIdOf(c)}`, { method: "DELETE" }),
        [syncCustomers, syncDashboard],
      ),
    [action, request, syncCustomers, syncDashboard],
  );
  const changeCustomerStatus = useCallback(
    (c, s) =>
      action(
        () =>
          request(`${ep.customers}/${customerIdOf(c)}/status`, {
            method: "PATCH",
            body: JSON.stringify({ Status: statusId(s, CUSTOMER_STATUS) }),
          }),
        [syncCustomers, syncDashboard],
      ),
    [action, request, syncCustomers, syncDashboard],
  );
  const saveInteraction = useCallback(
    (p, e) => {
      const b = {
        CustomerId: Number(p.CustomerId),
        UserId: p.UserId ?? null,
        InteractionDate: p.InteractionDate || new Date().toISOString(),
        Type: Number(p.Type ?? p.InteractionType ?? 5),
        Description: p.Description ?? p.Notes ?? "",
      };
      return action(
        () =>
          request(
            e ? `${ep.interactions}/${e.interactionId}` : ep.interactions,
            { method: e ? "PUT" : "POST", body: JSON.stringify(b) },
          ),
        [syncInteractions, syncDashboard],
      );
    },
    [action, request, syncInteractions, syncDashboard],
  );
  const deleteInteraction = useCallback(
    (i) =>
      action(
        () =>
          request(`${ep.interactions}/${i.interactionId ?? i.id}`, {
            method: "DELETE",
          }),
        [syncInteractions, syncDashboard],
      ),
    [action, request, syncInteractions, syncDashboard],
  );
  const savePurchaseOrder = useCallback(
    (p, e) =>
      action(
        () =>
          request(
            e
              ? `${ep.purchaseOrders}/${purchaseOrderIdOf(e)}`
              : ep.purchaseOrders,
            { method: e ? "PUT" : "POST", body: JSON.stringify(p) },
          ),
        [syncPurchaseOrders, syncProducts, syncMovements, syncDashboard],
      ),
    [
      action,
      request,
      syncPurchaseOrders,
      syncProducts,
      syncMovements,
      syncDashboard,
    ],
  );
  const sendPurchaseOrder = useCallback(
    (po) =>
      action(
        () =>
          request(`${ep.purchaseOrders}/${purchaseOrderIdOf(po)}/send`, {
            method: "POST",
          }),
        [syncPurchaseOrders, syncDashboard],
      ),
    [action, request, syncPurchaseOrders, syncDashboard],
  );
  const receivePurchaseOrder = useCallback(
    (po, notes = "") =>
      action(
        () =>
          request(`${ep.purchaseOrders}/${purchaseOrderIdOf(po)}/receive`, {
            method: "POST",
            body: JSON.stringify({ Notes: notes }),
          }),
        [syncPurchaseOrders, syncProducts, syncMovements, syncDashboard],
      ),
    [
      action,
      request,
      syncPurchaseOrders,
      syncProducts,
      syncMovements,
      syncDashboard,
    ],
  );
  const deletePurchaseOrder = useCallback(
    (po) =>
      action(
        () =>
          request(`${ep.purchaseOrders}/${purchaseOrderIdOf(po)}`, {
            method: "DELETE",
          }),
        [syncPurchaseOrders, syncDashboard],
      ),
    [action, request, syncPurchaseOrders, syncDashboard],
  );
  const saveQuotation = useCallback(
    (p, e) =>
      action(() => {
        const body = {
          ...p,
          QuotationNumber:
            p.QuotationNumber || p.quotationNumber || quotationNumber(),
        };
        return request(
          e
            ? `${ep.quotations}/${ensureId(quotationIdOf(e), "Quotation ID")}`
            : ep.quotations,
          { method: e ? "PUT" : "POST", body: JSON.stringify(body) },
        );
      }, [syncQuotations, syncDashboard]),
    [action, request, syncQuotations, syncDashboard],
  );
  const deleteQuotation = useCallback(
    (q) =>
      action(
        () =>
          request(
            `${ep.quotations}/${ensureId(quotationIdOf(q), "Quotation ID")}`,
            { method: "DELETE" },
          ),
        [syncQuotations, syncDashboard],
      ),
    [action, request, syncQuotations, syncDashboard],
  );
  const changeQuotationStatus = useCallback(
    (q, s) =>
      action(
        () =>
          request(
            `${ep.quotations}/${ensureId(quotationIdOf(q), "Quotation ID")}/status`,
            {
              method: "PATCH",
              body: JSON.stringify({ Status: statusId(s, QUOTATION_STATUS) }),
            },
          ),
        [syncQuotations, syncDashboard],
      ),
    [action, request, syncQuotations, syncDashboard],
  );
  const addQuotationItem = useCallback(
    (q, item) =>
      action(
        () =>
          request(
            `${ep.quotations}/${ensureId(quotationIdOf(q), "Quotation ID")}/items`,
            {
              method: "POST",
              body: JSON.stringify({
                QuotationId: ensureId(quotationIdOf(q), "Quotation ID"),
                ProductId: ensureId(item.ProductId, "Product ID"),
                Quantity: Math.max(1, Number(item.Quantity) || 1),
                UnitPrice: Number(item.UnitPrice ?? item.unitPrice ?? 0),
              }),
            },
          ),
        [syncQuotations, syncDashboard],
      ),
    [action, request, syncQuotations, syncDashboard],
  );
  const removeQuotationItem = useCallback(
    (q, item) =>
      action(
        () =>
          request(
            `${ep.quotations}/${ensureId(quotationIdOf(q), "Quotation ID")}/items/${ensureId(itemIdOf(item), "Quotation item ID")}`,
            { method: "DELETE" },
          ),
        [syncQuotations, syncDashboard],
      ),
    [action, request, syncQuotations, syncDashboard],
  );
  const convertQuotation = useCallback(
    (q, p = {}) =>
      action(
        () =>
          request(
            `${ep.quotations}/${ensureId(quotationIdOf(q), "Quotation ID")}/convert`,
            {
              method: "POST",
              body: JSON.stringify({
                InvoiceDate: p.InvoiceDate || today(),
                DueDate: p.DueDate || plusDays(30),
                PaymentMethod: p.PaymentMethod || "Cash",
                PaymentNotes: p.PaymentNotes || "",
              }),
            },
          ),
        [syncQuotations, syncSales, syncProducts, syncMovements, syncDashboard],
      ),
    [
      action,
      request,
      syncQuotations,
      syncSales,
      syncProducts,
      syncMovements,
      syncDashboard,
    ],
  );
  const saveSale = useCallback(
    (p, e) =>
      action(
        () =>
          request(e ? `${ep.sales}/${saleIdOf(e)}` : ep.sales, {
            method: e ? "PUT" : "POST",
            body: JSON.stringify(p),
          }),
        [syncSales, syncDashboard],
      ),
    [action, request, syncSales, syncDashboard],
  );
  const markSalePaid = useCallback(
    (s, p = {}) =>
      action(
        () =>
          request(`${ep.sales}/${saleIdOf(s)}/paid`, {
            method: "PATCH",
            body: JSON.stringify({
              IsPaid: Boolean(p.IsPaid ?? true),
              PaidDate: p.PaidDate || today(),
              PaymentMethod: p.PaymentMethod || s.paymentMethod || "Cash",
              PaymentNotes: p.PaymentNotes || "",
            }),
          }),
        [syncSales, syncDashboard],
      ),
    [action, request, syncSales, syncDashboard],
  );
  const generateInsight = useCallback(
    (p = {}) =>
      action(
        () =>
          request(`${ep.insights}/generate`, {
            method: "POST",
            body: JSON.stringify({
              InsightType: p.InsightType || "Full",
              FromDate: p.FromDate || null,
              ToDate: p.ToDate || null,
            }),
          }),
        [syncInsights, syncDashboard],
      ),
    [action, request, syncInsights, syncDashboard],
  );
  const uploadOcr = useCallback(
    (file) =>
      action(() => {
        const f = new FormData();
        f.append("image", file);
        return request(`${ep.ocr}/upload`, { method: "POST", body: f });
      }, [syncOcr]),
    [action, request, syncOcr],
  );
  const hasPermission = useCallback(
    (m) => !currentUser || roleModules(currentUser.role).includes(m),
    [currentUser],
  );
  const value = useMemo(
    () => ({
      API_BASE,
      action: ep,
      currentUser,
      token,
      data,
      loading,
      errors,
      lastSyncAt,
      request,
      login,
      logout,
      registerTenant,
      registerUser,
      resetPassword,
      hasPermission,
      syncAllSystemData,
      syncProducts,
      syncSuppliers,
      syncCustomers,
      syncInteractions,
      syncPurchaseOrders,
      syncMovements,
      syncQuotations,
      syncSales,
      syncInsights,
      syncOcr,
      syncDashboard,
      getProductDetails,
      getSupplierDetails,
      getCustomerDetails,
      getQuotationDetails,
      getSaleDetails,
      getPurchaseOrderDetails,
      getPurchaseOrderDocument,
      getInsightDetails,
      getOcrDetails,
      saveProduct,
      deleteProduct,
      adjustStock,
      saveSupplier,
      deleteSupplier,
      saveCustomer,
      deleteCustomer,
      changeCustomerStatus,
      saveInteraction,
      deleteInteraction,
      savePurchaseOrder,
      sendPurchaseOrder,
      receivePurchaseOrder,
      deletePurchaseOrder,
      saveQuotation,
      deleteQuotation,
      changeQuotationStatus,
      addQuotationItem,
      removeQuotationItem,
      convertQuotation,
      saveSale,
      markSalePaid,
      generateInsight,
      uploadOcr,
    }),
    [
      currentUser,
      token,
      data,
      loading,
      errors,
      lastSyncAt,
      request,
      login,
      logout,
      registerTenant,
      registerUser,
      resetPassword,
      hasPermission,
      syncAllSystemData,
      syncProducts,
      syncSuppliers,
      syncCustomers,
      syncInteractions,
      syncPurchaseOrders,
      syncMovements,
      syncQuotations,
      syncSales,
      syncInsights,
      syncOcr,
      syncDashboard,
      getProductDetails,
      getSupplierDetails,
      getCustomerDetails,
      getQuotationDetails,
      getSaleDetails,
      getPurchaseOrderDetails,
      getPurchaseOrderDocument,
      getInsightDetails,
      getOcrDetails,
      saveProduct,
      deleteProduct,
      adjustStock,
      saveSupplier,
      deleteSupplier,
      saveCustomer,
      deleteCustomer,
      changeCustomerStatus,
      saveInteraction,
      deleteInteraction,
      savePurchaseOrder,
      sendPurchaseOrder,
      receivePurchaseOrder,
      deletePurchaseOrder,
      saveQuotation,
      deleteQuotation,
      changeQuotationStatus,
      addQuotationItem,
      removeQuotationItem,
      convertQuotation,
      saveSale,
      markSalePaid,
      generateInsight,
      uploadOcr,
    ],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useErp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useErp must be used inside ErpProvider");
  return c;
};
