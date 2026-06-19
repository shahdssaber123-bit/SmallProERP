# Small Pro ERP V29 - Old Design + Real Backend Fix

## What changed visibly
- Restored a classic Small Pro landing/home page with the old module-card feeling.
- Restored dark mode toggle on Home and Sidebar.
- Kept the dark left sidebar / old ERP layout instead of the radical dashboard-only look.

## Bugs fixed from the screenshots
- Fixed quotation add-item/status bugs caused by missing/unsafe IDs.
- Quotation create now always sends the required `QuotationNumber` expected by the backend DTO.
- Quotation status now uses `PATCH /api/quotations/{id}/status` with `{ Status }` and refuses malformed IDs before sending bad URLs.
- Quotation add item now uses `POST /api/quotations/{id}/items` with `{ ProductId, Quantity }` and reloads fresh details after success.
- Purchase document no longer triggers backend 400 for non-Draft purchase orders. For non-Draft POs it fetches `GET /api/purchase-orders/{id}` and builds the printable document from the details response.
- Removed runtime legacy calls to `/users/all`, `/api/users`, and `/api/all`.

## Backend contract kept
- AI generate: `POST /api/insights/generate` with `InsightType`, `FromDate`, `ToDate`.
- OCR upload: `POST /api/ocr/upload` with multipart field name `image`.
- Dashboard uses real dashboard child endpoints, not raw `/dashboard`.
- Supplier details: `GET /api/suppliers/{id}/details`.
- Purchase document: `GET /api/purchase-orders/{id}/document` only when safe; otherwise fallback from by-id details.

## Verification performed
- `npm install` completed.
- `npm run build` completed successfully.
- Static grep found no `/users/all`, `/api/users`, or `/api/all` in runtime source/build.
- Windows `.cmd` wrappers were added under `node_modules/.bin` and the archive is created with dereferenced symlinks to avoid the previous Windows tar extraction errors.
