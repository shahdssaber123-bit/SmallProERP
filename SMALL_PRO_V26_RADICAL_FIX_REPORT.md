# Small Pro ERP V26 Radical Backend Fix

This build is visibly different from the failed versions:

- Dashboard shows a green V26 backend contract banner and a Backend Contract Monitor.
- No frontend code calls `/api/users/all`, `/api/users`, `/api/dashboard` root, or `/api/all`.
- Dashboard reads the real split Swagger endpoints under `/api/dashboard/*`.
- AI Generate sends the exact DTO: `{ InsightType, FromDate, ToDate }`.
- OCR upload sends multipart field name `image`.
- CRM Kanban uses backend customers and PATCH `/api/customers/{id}/status`.
- Quotation details use backend details, item add/remove endpoints, status PATCH, and accepted-only convert.
- Supplier details use GET `/api/suppliers/{id}/details` with products and POs.
- Purchase document uses GET `/api/purchase-orders/{id}/document` and renders a printable document.
- Dropdown/modal z-index was raised so select lists do not render behind popups.
- Lists show live backend row counts and strong loading/error states.

Run:

```bash
npm install
npm run dev
```

Backend expected at `https://localhost:7057/api`.
