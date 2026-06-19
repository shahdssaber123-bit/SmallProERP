# Small Pro ERP Backend Integration Notes

This build is backend-only. The frontend reads and writes business data through the .NET API at `VITE_API_BASE_URL` and does not ship seeded/mock business records.

Expected local API:

```env
VITE_USE_BACKEND=true
VITE_API_BASE_URL=https://localhost:7057/api
```

Important connected modules:

- Auth login/logout/register tenant/register user/reset password.
- Products, low stock, stock adjustment, inventory movements.
- Suppliers and supplier detail relationships.
- Purchase orders, send/receive actions, and formatted purchase order document print view.
- Customers/CRM, customer interactions, and drag/drop Kanban stage changes.
- Quotations, quotation items, status updates, and Accepted-only conversion to invoice.
- Sales/invoices and mark-paid action.
- Dashboard API plus calculated cards from backend-loaded SQL data.
- AI insights and OCR upload via `/insights` and `/ocr` endpoints.

All create/action flows open a review confirmation popup before sending the request.
