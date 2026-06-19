# Small Pro ERP V24 real fix report

This version was rebuilt from the uploaded frontend and aligned with the uploaded .NET API controller/DTO source.

## Critical fixes
- Removed old QueryClientProvider/Toaster imports that required packages not used by this backend-only build.
- Base44/tracking references are not used by the app entrypoint/config.
- `/api/users`, `/api/dashboard`, `/api/all` are not called.
- Dashboard now calls the real segmented dashboard endpoints under `/api/dashboard/*`.
- OCR upload uses `multipart/form-data` with field name `image`, matching `Upload(IFormFile image)`.
- AI generate uses `{ InsightType, FromDate, ToDate }`, matching `GenerateInsightRequestDto`.
- CRM interaction creation now sends `{ CustomerId, UserId, InteractionDate, Type, Description }`, matching the backend DTO.
- CRM status uses `PATCH /api/customers/{id}/status` with numeric `{ Status }`.
- Quotation status uses `PATCH /api/quotations/{id}/status` with numeric `{ Status }`.
- Quotation convert uses `POST /api/quotations/{id}/convert` and is guarded for Accepted only.
- Purchase document uses `GET /api/purchase-orders/{id}/document` and renders a document with print button.
- Supplier details uses `GET /api/suppliers/{id}/details` and renders products, purchase orders, totals and stock summary.
- Product details uses fresh `GET /api/products/{id}` and renders supplier, stock, low-stock, movements, quotations/sales/PO usage.

## Dropdown/list fixes
- Modal z-index was raised from normal z-50 to z-[9000]+.
- Selects inside modals use z-[10000] so lists do not render behind popups.
- Empty backend selector lists now show disabled "No backend records found" style options where applicable.
- Search Type Selector remains available on the main lists.

## Verification performed here
- Static import/syntax bundle check with esbuild passed.
- Grep check found no active Base44 / apps-null / analytics tracking imports.
- Live calls to https://localhost:7057/api cannot be performed from this container because that localhost exists on the user's machine only.
