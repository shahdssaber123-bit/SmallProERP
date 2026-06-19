# SmallPro ERP V35 - Full Backend + Home/Register + Deep Details Fix

## Build verification
- `vite build` completed successfully in this package.
- Production output generated in `dist/`.

## Major fixes included
- Restored and redesigned HOME page.
- Added real REGISTER page at `/register` using `POST /api/Auth/register-tenant`.
- Updated visible version labels to V35, so the UI proves the new version is loaded.
- Fixed the generic unwrap issue so objects with `items` are not incorrectly converted into arrays.
- Removed fake/invalid runtime calls such as `/api/users`, `/api/users/all`, `/api/all`, and a generic `/api/dashboard` call.
- Dashboard uses separate backend dashboard endpoints.
- Users page shows the current authenticated backend user and clearly explains that the backend does not expose a users-list endpoint.
- Quotation Add Item sends `QuotationId`, `ProductId`, `Quantity`, and `UnitPrice`.
- Convert button enables when quotation status is Accepted / statusText Accepted / status enum 3.
- Purchase Order document merges backend document and PO details so it does not open empty when one response is partial.
- Purchase actions are status-gated: document only for Draft, send only for Draft, receive only for Sent.
- CRM Kanban uses backend customers and status enum mapping.
- AI Insight generation uses `{ InsightType, FromDate, ToDate }` on `POST /api/insights/generate`.
- OCR upload uses multipart field name `image` on `POST /api/ocr/upload`.
- Mobile burger menu added for responsive sidebar.
- Review confirmation popups are included for key create/update/action flows.

## How to run
1. Start the .NET backend at `https://localhost:7057/api`.
2. Open this folder.
3. Run `RUN_WINDOWS.bat`, or run:
   ```bash
   npm install
   npm run dev
   ```

## If Windows extraction or node_modules causes issues
Run `RUN_WINDOWS_CLEAN_INSTALL.bat` or manually:
```bat
rmdir /s /q node_modules
npm install
npm run dev
```
