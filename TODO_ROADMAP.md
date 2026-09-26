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
| # | PDF Requirement | Status | Where | Details / Verification |
|---|---|---|---|---|
| 1 | Sign up | Done | authView.js | Split-view Kraft Ledger registration |
| 2 | Log in | Done | authView.js | Operator credentials login |
| 3 | **OTP-based password reset** | Done | authView.js / store.js | 3-step flow: email -> 6-digit OTP -> new password hash |
| 4 | Redirect to dashboard after login | Done | app.js | Hash router auth redirect |
| 5 | Dashboard KPIs (total, low/out, pending receipts, pending deliveries, transfers scheduled) | Done | store.getMetrics() | Live reactive badge updates |
| 6 | Filter by document type | Done | dashboardView.js / operationsView.js | Receipts, deliveries, transfers, adjustments |
| 7 | Filter by status (Draft/Waiting/Ready/Done/Canceled) | Done | dashboardView.js / operationsView.js | Full lifecycle with Kanban and list views |
| 8 | Filter by warehouse/location | Done | productsView.js / settingsView.js | Multi-location bay mapping and breakdown |
| 9 | Filter by product category | Done | productsView.js | Real-time category selector |
| 10 | Products: create | Done | modals.js | SKU, name, category, initial location stock, UOM |
| 11 | **Products: update/edit existing** | Done | modals.js / productsView.js | Edit modal with prefilled data + confirmation delete |
| 12 | Product fields: Name/SKU/Category/Initial stock | Done | data.js / modals.js | Extended with location breakdown |
| 13 | **Unit of Measure (per product)** | Done | data.js / modals.js / all views | Selectable UOM (units, kg, liters, boxes, packs, meters) |
| 14 | Product categories | Done | data.js | Configured across hydraulics, fasteners, motors, electronics, pneumatics |
| 15 | **Reordering rules** | Done | store.js / productsView.js | Dynamic replenishment suggestion when stock <= threshold |
| 16 | Stock availability per location | Done | data.js / store.js / stockView.js | Per-bay stock mapping and free-to-use calculation |
| 17 | Receipts (incoming) | Done | operationsView.js / modals.js | Full Draft->Ready->Done lifecycle with print and cancel |
| 18 | Delivery Orders (outgoing) | Done | operationsView.js / modals.js | Stock reservations and dispatch tracking |
| 19 | **Internal Transfers** | Done | modals.js / store.js | Decrements source bay, increments destination bay, company stock invariant |
| 20 | Inventory Adjustments (recorded vs physical) | Done | modals.js | Physical cycle count with balanced/surplus/deficit ledger stamps |
| 21 | Move History | Done | operationsView.js | Grouped by reference with line items and product trail filter |
| 22 | Settings -> Warehouse | Done | settingsView.js | Warehouse entity registry and multi-bay location configurations |
| 23 | Profile Menu: My Profile | Done | modals.js | Operator credentials badge modal |
| 24 | Profile Menu: Logout | Done | modals.js / app.js | Session termination and redirect |
| 25 | Low stock alerts | Done | dashboardView.js | Dismissible terracotta priority banner when atRiskCount > 0 |
| 26 | Multi-warehouse support | Done | store.js / settingsView.js | Location assignment to parent warehouse & cross-dock shuttle tracking |
| 27 | SKU search & smart filters | Done | app.js (F2/scan) / productsView.js | Quick barcode scanner + hotkey F2 |

## 3. Implementation Status Summary

### P0 — Broken / missing core (ALL COMPLETED)
1. **Wire the Transfer action:** `open-transfer-stock` modal handles SKU, source bay, destination bay, decrements source, increments destination, and maintains total stock invariant.
2. **OTP-based password reset:** 3-step security flow in `authView.js` with `store.requestPasswordReset` and `store.verifyResetOtp`.
3. **Per-product Unit of Measure:** Configurable `uom` field across data schemas, modals, tables, and operation line items.

### P1 — Required by PDF (ALL COMPLETED)
4. **Edit / delete existing products:** In-place edit modal prefill and Kraft Ledger confirmation modal for deletions.
5. **Full status lifecycle:** DRAFT, WAITING, READY, DONE, CANCELED supported across operations with read-only locking on DONE.
6. **Location entity separate from Warehouse:** `LOCATIONS` array with `warehouseId` parent linkages, plus dedicated management in Settings.
7. **Per-location stock availability:** `locations` map on each product with expandable multi-bay breakdown in catalog.
8. **Dedicated editable Stock screen:** Direct inline on-hand quantity editing, free-to-use calculation, and bay breakdowns under `#stock`.
9. **Active low-stock alert banner:** Terracotta priority banner at top of Dashboard linking directly to low stock catalog.
10. **Move History grouped by reference:** Expandable reference cards (`REC-...`, `DEL-...`, `TRF-...`, `ADJ-...`) with color-coded quantities.
11. **List / Kanban view toggle:** Responsive view switcher on Receipts and Delivery Orders.
12. **Complete detail view:** Contact, scheduled date, responsible person, line items with inline item addition, validate, print, cancel.

### P2 — Polish / enhancements (ALL COMPLETED)
13. **Reordering rules:** Dynamic replenishment suggestions surfaced when stock drops below safety threshold.
14. **Multi-warehouse isolation:** Warehouse-scoped stock calculation helper `getWarehouseStock()` and inter-warehouse transfer tracking.
15. **In-app toast & confirm notifications:** Native `alert()` and `confirm()` calls replaced with Kraft Ledger stamp modals and banners (`showToast`, `showConfirmModal`).
16. **Password hashing:** Demo-level obfuscated hash `mockPasswordHash()` stored in credentials map without persisting plaintext.
