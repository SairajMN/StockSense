# StockSense — Completion Roadmap (Requirements vs. Implementation)

Source of requirements: `StockSense.pdf` (CoreInventory — modular Inventory Management System).
This document compares the PDF spec against the current `js/` implementation and lists
everything that still must be done to consider the project complete.

Legend: Done · Partial · Not started

## 1. Architecture (current state)
Pure front-end ES-module SPA, no build step, persisted in `localStorage`.
- `index.html` — shell, Tailwind CDN + Kraft Ledger theme
- `js/app.js` — hash router + app shell + nav
- `js/store.js` — reactive store (products, movements, metrics, auth)
- `js/data.js` — seed SKUs, movements, zones, categories
- `js/modals.js` — Add Product, Stock Movement, Cycle Count, Profile
- `js/views/*` — auth, dashboard, products, operations, settings

## 2. Requirement-by-requirement status
| # | PDF Requirement | Status | Where | Gap / To-do |
|---|---|---|---|---|
| 1 | Sign up | Done | authView.js | — |
| 2 | Log in | Done | authView.js | — |
| 3 | **OTP-based password reset** | Not started | — | Build forgot-password -> email OTP -> set-new-password flow |
| 4 | Redirect to dashboard after login | Done | app.js | — |
| 5 | Dashboard KPIs (total, low/out, pending receipts, pending deliveries, transfers scheduled) | Done | store.getMetrics() | — |
| 6 | Filter by document type | Done | dashboardView.js | — |
| 7 | Filter by status (Draft/Waiting/Ready/Done/Canceled) | Partial | dashboardView.js | Only Waiting/Ready/Done exist; add Draft + Canceled |
| 8 | Filter by warehouse/location | Done | productsView.js | — |
| 9 | Filter by product category | Done | productsView.js | — |
| 10 | Products: create | Done | modals.js | — |
| 11 | **Products: update/edit existing** | Not started | — | Add edit/delete product action |
| 12 | Product fields: Name/SKU/Category/Initial stock | Done | data.js/modals.js | — |
| 13 | **Unit of Measure (per product)** | Not started | — | Add `uom` field; stop hardcoding "UNITS" |
| 14 | Product categories | Done | data.js | — |
| 15 | **Reordering rules** | Not started | — | Auto-replenishment suggestion when below threshold |
| 16 | Stock availability per location | Partial | data.js | Single zone/bin only; support multi-location |
| 17 | Receipts (incoming) | Done | operationsView.js/modals.js | — |
| 18 | Delivery Orders (outgoing) | Done | operationsView.js/modals.js | — |
| 19 | **Internal Transfers** | Partial | productsView/app.js | Button fires `open-transfer-stock` with NO handler; transfer never moves stock between bins/zones |
| 20 | Inventory Adjustments (recorded vs physical) | Done | cycle-count modal | — |
| 21 | Move History | Partial | operationsView.js | Flat audit list; not filterable per product/SKU |
| 22 | Settings -> Warehouse | Done | settingsView.js | — |
| 23 | Profile Menu: My Profile | Done | modals.js | — |
| 24 | Profile Menu: Logout | Done | modals.js | — |
| 25 | Low stock alerts | Partial | dashboardView.js | Badges only; add banner/active alert |
| 26 | Multi-warehouse support | Partial | store.js | Zone switch only; no true per-warehouse stock |
| 27 | SKU search & smart filters | Done | app.js (F2/scan) | — |

## 3. Prioritized to-do for completion

### P0 — Broken / missing core (must fix)
1. **Wire the Transfer action.** In `app.js` register `window.addEventListener('open-transfer-stock', ...)` and implement `openTransferStockModal()` in `modals.js` that:
   - selects SKU + source zone/bin + destination zone/bin + qty,
   - decrements source and increments destination stock (currently transfers do nothing to stock).
2. **OTP-based password reset** (PDF explicitly requires it):
   - Add "Forgot password?" to `authView.js`,
   - `store.requestPasswordReset(email)` -> generate 6-digit OTP (mock/console/email),
   - `store.verifyResetOtp(email, code, newPassword)`.
3. **Per-product Unit of Measure.** Add `uom` to product schema + Add Product form; use `prod.uom` instead of `"UNITS"` in movement logging and templates.

### P1 — Required by PDF, currently partial
4. **Edit / delete existing products** (PDF: "Create/update products").
5. **Full status lifecycle:** add `DRAFT` and `CANCELED`; provide actions Draft->Waiting->Ready->Done and Cancel, applied to receipts/deliveries/transfers.
6. **Per-location stock availability** — model stock as a map of `location -> qty` instead of a single number.
7. **Active low-stock alert banner** on the dashboard when `atRiskCount > 0`.
8. **Move History linked per product** — clicking a product shows its movement trail.

### P2 — Polish / nice-to-have
9. **Reordering rules** UI (auto-suggest reorder qty when below threshold).
10. **True multi-warehouse** stock isolation and cross-warehouse transfer totals.
11. Replace `alert()`/`confirm()` with in-app toast notifications.
12. Persist password hash (currently not stored — demo only).

## 4. Summary
Core UI, dashboard KPIs, products catalog, receipts/deliveries/adjustments, filters, search,
profile and settings are complete. The remaining work to fully satisfy the PDF spec is:
OTP password reset, working internal transfers, per-product unit of measure, product edit,
the Draft/Canceled status lifecycle, per-location stock, and active low-stock alerting.
