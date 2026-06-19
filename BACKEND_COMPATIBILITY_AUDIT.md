# Small Pro ERP Backend Compatibility Audit

This version was updated against the backend notes shared for:

- Auth tenant registration/login
- User registration
- Auth reset password
- Auth logout
- Products
- Inventory movements
- Stock adjustment
- Suppliers
- Supplier details
- Purchase orders
- Purchase order document generation

## Auth

Implemented frontend DTOs:

- `POST /api/Auth/register-tenant`: `companyName`, `companyEmail`, `companyPhone`, `adminUsername`, `adminEmail`, `adminPassword`, `adminFullName`
- `POST /api/Auth/login`: `username`, `password`; stores `token`, `userId`, `username`, `fullName`, `email`, `role`, `tenantId`, `companyName`
- `POST /api/Auth/reset-password`: Admin-only UI in Users page, sends `username`, `newPassword`
- `POST /api/Auth/logout`: called in backend mode; client token/session is always removed because JWT logout is client-side critical

## Users

The user form now includes backend-required `phoneNumber`. Reset password is available for Admin users.

## Products

Product UI/data uses backend DTO names:

- `productId`, `productCode`, `name`, `description`, `category`, `quantity`, `minimumStockLevel`, `purchasePrice`, `sellingPrice`, `profitMargin`, `supplierId`, `supplierName`, `isLowStock`, `stockDeficit`, `createdAt`, `updatedAt`

Create sends the backend create body. Update intentionally does not send `productCode`, matching the backend update snippet.

## Inventory Movements

Movement UI/data uses:

- `movementId`, `productId`, `productCode`, `productName`, `movementType`, `movementTypeText`, `quantity`, `referenceNumber`, `movementDate`, `notes`

Type filters use text values: `Purchase`, `Sale`, `Adjustment`.

Date range Apply works in local mode and backend mode.

## Stock Adjustment

Adjustment sends:

- `productId`, `adjustmentQuantity`, `reason`, `notes`

Local validation covers reason and negative-stock behavior.

## Suppliers

Supplier UI/data uses backend DTO:

- `supplierId`, `name`, `email`, `phone`, `address`, `productCount`, `purchaseOrderCount`, `createdAt`

The old frontend `contact` field was removed from supplier create/edit forms and is never sent to backend.

Supplier details modal shows backend details response:

- linked products
- linked purchase orders
- `totalProductsSupplied`
- `totalPurchaseOrders`
- `totalAmountSpent`

## Purchase Orders

Purchase order UI/data uses backend DTO:

- `purchaseOrderId`, `poNumber`, `supplierId`, `supplierName`, `totalAmount`, `status`, `statusText`, `orderDate`, `receivedDate`, `createdAt`, `notes`, `items`, `totalItems`, `totalQuantity`

Item DTO uses:

- `purchaseOrderItemId`, `productId`, `productCode`, `productName`, `productDescription`, `quantity`, `unitPrice`, `lineTotal`

Create sends only:

- `supplierId`, `items[{ productId, quantity, unitPrice }]`, `notes`

Actions implemented:

- Send Draft PO
- Receive Sent PO with `{ notes }`
- Delete Draft PO
- View/print PO document

## UI Fixes

- Select/dropdown popovers now use a higher z-index so lists show above modals and overlays.
- Purchase and Inventory sync buttons are safe in local mode.
- Dashboard PO totals/statuses use backend-compatible `totalAmount` and `statusText`.

## Remaining backend dependency

Dashboard backend endpoints were not provided yet, so Dashboard still computes from frontend collections. It is field-compatible with the backend DTOs received so far.
