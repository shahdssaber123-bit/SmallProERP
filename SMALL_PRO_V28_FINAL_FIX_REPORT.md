# Small Pro ERP V28 Final Fix Report

This V28 build continues from V27 and keeps the strong backend-connected work, but restores the old visual feeling and fixes the two bugs seen in the screenshots.

## Visible changes
- Restored a rich public Home landing page with the older Small Pro marketing/dashboard style.
- Restored Dark Mode provider and sidebar toggle.
- Restored the darker old sidebar feeling instead of the plain V26/V27 sidebar.
- Updated page headers to show V28 Old Design + Backend Fix.

## Backend bug fixes
- Quotation item/status actions now use robust ID extraction instead of relying only on `quotationId`, preventing `/undefined/items` or `/undefined/status` calls.
- Purchase Order document now calls `GET /api/purchase-orders/{id}/document` first, but if the backend rejects non-Draft POs with 400, the UI builds a formatted document from `GET /api/purchase-orders/{id}` so the Doc button still opens a useful printable view instead of throwing an error.
- Product/Supplier/Customer/Quotation/Sale/PO action endpoints now use safe ID fallback helpers.
- No `/users/all`, `/api/users`, or `/api/all` calls exist in source.

## UI/list fixes
- Select/dropdown components keep high z-index so they do not hide behind popups.
- Modals, tables, cards, inputs and selects now support dark mode styling.
- Purchase/Sales details remain backend-first and keep the rich details modals.

## Run
1. Start backend on https://localhost:7057/api
2. In the project folder run `npm install`
3. Run `npm run dev`
4. Login with your backend user.

If you want to use the included npm cache:
`npm install --cache ./_offline_npm_cache_full --prefer-offline`
