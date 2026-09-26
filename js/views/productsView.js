// StockSense Products & Inventory Master Catalog View (Screen 3)
import { store } from '../store.js';
import { CATEGORIES, ZONES } from '../data.js';

export function renderProductsView(container) {
  const metrics = store.getMetrics();
  const allProducts = store.getProducts();
  const isCatalogEmpty = store.state.emptyMode || allProducts.length === 0;
  const user = store.state.user || { zone: "WH-01", terminal: "TRM-9842-DX" };

  container.innerHTML = `
    <div class="flex flex-col w-full p-4 lg:p-6 space-y-4 font-body text-[#262421]">
      <!-- System Telemetry Breadcrumb Bar -->
      <div class="flex flex-wrap items-center justify-between gap-2 bg-[#faf7f0] px-4 py-2 border border-[#cfc5b4] text-[#565145] font-mono text-xs shadow-kraft">
        <div class="flex items-center gap-2">
          <span class="text-[#b84328] font-bold">#SYS_REGISTRY</span>
          <span class="text-[#cfc5b4] font-bold">/</span>
          <span class="text-[#262421] tracking-wide uppercase font-bold">INVENTORY CATALOG</span>
          <span class="text-[#cfc5b4] font-bold">//</span>
          <span class="text-[#536443] tracking-widest font-bold">MASTER SKU LEDGER</span>
        </div>
        <div class="flex items-center gap-4 font-mono">
          <span class="hidden sm:inline-block text-[#565145]">LOC: ${user.zone} [MAIN AUTOMATED DOCK]</span>
          <span class="text-[#536443] font-bold bg-[#536443]/10 px-2 py-0.5 border border-[#536443]/40">
            [INDEXED: ${allProducts.length} SKUs]
          </span>
          <span class="text-[#536443] flex items-center gap-1.5 font-bold">
            <span class="w-2 h-2 bg-[#536443]"></span>
            STREAM ACTIVE
          </span>
        </div>
      </div>

      <!-- Header Row: Title & Tactical Triggers -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#faf7f0] p-4 border border-[#cfc5b4] relative shadow-kraft">
        <!-- Perimeter Corner Crosshairs -->
        <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
        <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>

        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="font-mono text-2xl lg:text-3xl uppercase text-[#262421] font-bold tracking-tight">
              PRODUCTS &amp; INVENTORY MASTER
            </h1>
            <span class="font-mono text-xs bg-[#efe9dc] text-[#565145] px-2 py-0.5 border border-[#cfc5b4] font-bold">
              ${allProducts.length} TOTAL SKUs
            </span>
            <span class="font-mono text-xs ${metrics.atRiskCount > 0 ? 'bg-[#ffdad2]/50 text-[#b84328] border-[#b84328]/40' : 'bg-[#efe9dc] text-[#565145] border-[#cfc5b4]'} px-2 py-0.5 border flex items-center gap-1.5 font-bold">
              <span class="w-1.5 h-1.5 ${metrics.atRiskCount > 0 ? 'bg-[#b84328]' : 'bg-[#565145]'}"></span>
              ${metrics.atRiskCount} AT-RISK DETECTED
            </span>
          </div>
          <p class="font-body text-xs text-[#565145] uppercase tracking-wider font-medium">
            Centralized multi-bay telemetry, dynamic safety thresholds, and auto-dispatch replenishment triggers.
          </p>
        </div>

        <!-- Trigger Action Controls -->
        <div class="flex items-center flex-wrap gap-2">
          <!-- Toggle Prototype Mode Button -->
          <button id="btn-toggle-empty-prod" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft cursor-pointer" title="Toggle between empty and populated states">
            <span class="material-symbols-outlined text-[16px] text-[#b84328]">tune</span>
            <span>${store.state.emptyMode ? 'VIEW POPULATED' : 'SIMULATE EMPTY'}</span>
          </button>

          <button id="btn-scan-sku" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#ebe5d8] border border-[#cfc5b4] text-[#262421] font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft cursor-pointer" title="Barcode Scanner Trigger (F3)">
            <span class="font-mono text-[#b84328]">[F3]</span>
            <span class="material-symbols-outlined text-[16px] text-[#536443]">barcode_scanner</span>
            <span>SCAN SKU</span>
          </button>

          <div class="relative inline-block text-left" id="export-dropdown-wrapper">
            <button id="btn-export-manifest" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#d3e6bd]/30 border border-[#536443] text-[#536443] font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">file_download</span>
              <span>EXPORT MANIFEST</span>
              <span class="text-[#536443] text-[10px]">▼</span>
            </button>
            <div id="export-menu" class="hidden absolute right-0 mt-1 w-44 bg-white border border-[#cfc5b4] shadow-md z-30 font-mono text-xs">
              <button id="btn-export-csv" class="w-full text-left px-3 py-2 hover:bg-[#faf7f0] border-b border-[#cfc5b4]/50 cursor-pointer">
                📄 EXPORT AS CSV
              </button>
              <button id="btn-export-json" class="w-full text-left px-3 py-2 hover:bg-[#faf7f0] cursor-pointer">
                📦 EXPORT AS JSON
              </button>
            </div>
          </div>

          <button id="btn-add-product" class="flex items-center gap-1.5 px-4 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft-dark cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">add_box</span>
            <span>+ ADD PRODUCT</span>
          </button>
        </div>
      </div>

      <!-- Quick Summary / KPI Metric Rail (4 Gauge Tickets) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Card 1: Catalog SKUs -->
        <div class="bg-[#faf7f0] border border-[#cfc5b4] relative p-3 flex flex-col justify-between shadow-kraft">
          <div class="flex items-center justify-between pb-1 border-b border-dashed border-[#cfc5b4] text-[#565145] font-mono text-xs tracking-wider">
            <span class="font-bold">METRIC // REGISTRY</span>
            <span class="text-[#565145]/70 text-[11px]">${isCatalogEmpty ? '— UNINITIALIZED' : 'INDEXED'}</span>
          </div>
          <div class="pt-2 pb-1 flex items-baseline justify-between">
            <div>
              <span class="font-mono text-xs text-[#565145] font-semibold block uppercase">TOTAL CATALOG SKUs</span>
              <span class="font-mono text-3xl font-bold text-[#262421] tracking-tight">${allProducts.length}</span>
            </div>
            <span class="font-mono text-[11px] text-[#565145] bg-[#efe9dc] px-1.5 py-0.5 border border-[#cfc5b4] font-bold">
              ${allProducts.length > 0 ? 'CATALOG OK' : '— NO DATA'}
            </span>
          </div>
          <div class="w-full bg-[#e6e0d2] h-1 rounded-none overflow-hidden">
            <div class="bg-[#536443] h-full" style="width: ${Math.min(100, allProducts.length * 15)}%"></div>
          </div>
        </div>

        <!-- Card 2: Low Stock Alert -->
        <div class="bg-[#faf7f0] border border-[#cfc5b4] relative p-3 flex flex-col justify-between shadow-kraft">
          <div class="flex items-center justify-between pb-1 border-b border-dashed border-[#cfc5b4] text-[#565145] font-mono text-xs tracking-wider">
            <span class="font-bold">ALERT // AT-RISK</span>
            <span class="text-[11px] ${metrics.lowStockCount > 0 ? 'text-[#b84328] font-bold' : 'text-[#565145]/70'}">
              ${metrics.lowStockCount > 0 ? 'TRIGGER ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <div class="pt-2 pb-1 flex items-baseline justify-between">
            <div>
              <span class="font-mono text-xs text-[#565145] font-semibold block uppercase">LOW STOCK ALERT</span>
              <span class="font-mono text-3xl font-bold ${metrics.lowStockCount > 0 ? 'text-[#b84328]' : 'text-[#262421]'} tracking-tight">
                ${metrics.lowStockCount}
              </span>
            </div>
            <span class="font-mono text-[11px] ${metrics.lowStockCount > 0 ? 'text-[#b84328] bg-[#ffdad2]/30 border-[#b84328]/40' : 'text-[#565145] bg-[#efe9dc] border-[#cfc5b4]'} px-1.5 py-0.5 border font-bold">
              ${metrics.lowStockCount > 0 ? 'REORDER' : '— NONE'}
            </span>
          </div>
          <div class="w-full bg-[#e6e0d2] h-1 rounded-none overflow-hidden">
            <div class="bg-[#b84328] h-full" style="width: ${metrics.lowStockCount > 0 ? '60%' : '0%'}"></div>
          </div>
        </div>

        <!-- Card 3: Critical Zero Stock -->
        <div class="bg-[#faf7f0] border border-[#cfc5b4] relative p-3 flex flex-col justify-between shadow-kraft">
          <div class="flex items-center justify-between pb-1 border-b border-dashed border-[#cfc5b4] text-[#565145] font-mono text-xs tracking-wider">
            <span class="font-bold">CRITICAL // ZERO LVL</span>
            <span class="text-[11px] ${metrics.outOfStockCount > 0 ? 'text-[#ba1a1a] font-bold' : 'text-[#565145]/70'}">
              ${metrics.outOfStockCount > 0 ? 'DEPLETED' : 'STANDBY'}
            </span>
          </div>
          <div class="pt-2 pb-1 flex items-baseline justify-between">
            <div>
              <span class="font-mono text-xs text-[#565145] font-semibold block uppercase">CRITICAL ZERO STOCK</span>
              <span class="font-mono text-3xl font-bold ${metrics.outOfStockCount > 0 ? 'text-[#ba1a1a]' : 'text-[#262421]'} tracking-tight">
                ${String(metrics.outOfStockCount).padStart(2, '0')}
              </span>
            </div>
            <span class="font-mono text-[11px] ${metrics.outOfStockCount > 0 ? 'text-[#ba1a1a] bg-[#ffdad6] border-[#ba1a1a]/40' : 'text-[#565145] bg-[#efe9dc] border-[#cfc5b4]'} px-1.5 py-0.5 border font-bold">
              ${metrics.outOfStockCount > 0 ? 'CRITICAL' : '— NONE'}
            </span>
          </div>
          <div class="w-full bg-[#e6e0d2] h-1 rounded-none overflow-hidden">
            <div class="bg-[#ba1a1a] h-full" style="width: ${metrics.outOfStockCount > 0 ? '100%' : '0%'}"></div>
          </div>
        </div>

        <!-- Card 4: Valuation -->
        <div class="bg-[#faf7f0] border border-[#cfc5b4] relative p-3 flex flex-col justify-between shadow-kraft">
          <div class="flex items-center justify-between pb-1 border-b border-dashed border-[#cfc5b4] text-[#565145] font-mono text-xs tracking-wider">
            <span class="font-bold">FISCAL // ASSETS</span>
            <span class="text-[#565145]/70 text-[11px]">LEDGER VALUATION</span>
          </div>
          <div class="pt-2 pb-1 flex items-baseline justify-between">
            <div>
              <span class="font-mono text-xs text-[#565145] font-semibold block uppercase">TOTAL VALUATION</span>
              <span class="font-mono text-3xl font-bold text-[#262421] tracking-tight">
                $${metrics.totalValuation.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <span class="font-mono text-[11px] text-[#536443] bg-[#536443]/10 px-1.5 py-0.5 border border-[#536443]/40 font-bold">
              USD LEDGER
            </span>
          </div>
          <div class="w-full bg-[#e6e0d2] h-1 rounded-none overflow-hidden">
            <div class="bg-[#536443] h-full" style="width: 75%"></div>
          </div>
        </div>
      </div>

      <!-- Filter & Tactical Search Deck -->
      <div class="bg-[#faf7f0] border border-[#cfc5b4] p-3 space-y-3 shadow-kraft">
        <!-- Top Search & Zone Filter Bar -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-2.5 font-mono text-[#b84328] font-bold">_</span>
            <input id="productSearchInput" type="text" placeholder="SEARCH SKU, ITEM NAME, SPECIFICATION, OR BARCODE... [F2]"
              class="w-full bg-white border border-[#cfc5b4] text-[#262421] font-mono text-xs pl-7 pr-12 py-2 placeholder:text-[#565145]/60 focus:outline-none focus:border-[#b84328] rounded-none shadow-inner" />
            <span class="absolute right-2.5 top-2 font-mono text-[10px] text-[#565145] bg-[#faf7f0] px-1.5 py-0.5 border border-[#cfc5b4]">
              F2
            </span>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <select id="zoneFilterSelect" class="bg-white border border-[#cfc5b4] px-3 py-2 text-[#262421] font-mono text-xs rounded-none font-bold focus:outline-none focus:border-[#b84328] cursor-pointer">
              <option value="ALL">ALL WAREHOUSE ZONES</option>
              ${ZONES.map(z => `<option value="${z.id}">${z.id} [${z.name.split('[')[1] || z.id}</option>`).join('')}
            </select>

            <button id="btn-reset-filters" class="bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] p-2 text-[#565145] rounded-none cursor-pointer" title="Reset Filters">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
            </button>
          </div>
        </div>

        <!-- Category Filter Chips -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-dashed border-[#cfc5b4]">
          <span class="font-mono text-xs text-[#565145] uppercase mr-1 font-bold">CATEGORIES:</span>
          <button class="cat-filter-btn px-3 py-1 bg-[#b84328] text-white border border-[#b84328] font-mono text-xs uppercase rounded-none font-bold cursor-pointer" data-cat="ALL">
            ALL (${allProducts.length})
          </button>
          ${CATEGORIES.map(cat => {
            const count = allProducts.filter(p => p.category === cat).length;
            return `
              <button class="cat-filter-btn px-3 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-mono text-xs uppercase rounded-none font-bold cursor-pointer transition-colors" data-cat="${cat}">
                ${cat} (${count})
              </button>
            `;
          }).join('')}

          <div class="hidden xl:flex items-center ml-auto gap-1">
            <span class="font-mono text-xs text-[#565145] uppercase mr-1 font-bold">STATUS:</span>
            <button class="status-prod-filter-btn px-2 py-0.5 bg-[#faf7f0] text-[#b84328] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer" data-status="ALL">
              ALL
            </button>
            <button class="status-prod-filter-btn px-2 py-0.5 bg-white text-[#565145] hover:text-[#536443] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer" data-status="IN_STOCK">
              IN STOCK (${allProducts.filter(p => p.status === 'IN_STOCK').length})
            </button>
            <button class="status-prod-filter-btn px-2 py-0.5 bg-white text-[#565145] hover:text-[#b84328] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer" data-status="LOW">
              LOW (${metrics.lowStockCount})
            </button>
            <button class="status-prod-filter-btn px-2 py-0.5 bg-white text-[#565145] hover:text-[#ba1a1a] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer" data-status="OUT">
              OUT (${metrics.outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      <!-- Master Inventory Ledger Table Container -->
      <div class="bg-[#faf7f0] border border-[#cfc5b4] relative overflow-hidden shadow-kraft">
        <span class="absolute top-1 left-1 text-[8px] font-mono text-[#8c716b] font-bold">+</span>
        <span class="absolute top-1 right-1 text-[8px] font-mono text-[#8c716b] font-bold">+</span>
        <span class="absolute bottom-1 left-1 text-[8px] font-mono text-[#8c716b] font-bold">+</span>
        <span class="absolute bottom-1 right-1 text-[8px] font-mono text-[#8c716b] font-bold">+</span>

        <div class="flex flex-wrap items-center justify-between px-4 py-2 bg-[#efe9dc] border-b border-dashed border-[#cfc5b4] font-mono text-xs text-[#565145]">
          <div class="flex items-center gap-4">
            <span>CATALOG REVISION: <strong class="text-[#262421]">REV-2.4-AUTOLIVE</strong></span>
            <span>AUDIT FREQUENCY: <strong class="text-[#536443]">CONTINUOUS TELEMETRY</strong></span>
            <span class="hidden md:inline">INDEX REFRESH: <strong class="text-[#262421]">SYNCED REALTIME</strong></span>
          </div>
          <div class="flex items-center gap-2 text-[#565145]">
            <span>LEDGER SORT: <strong class="text-[#262421]">SKU (A-Z)</strong></span>
            <span>•</span>
            <span>VIEWPORT: EXPANDED</span>
          </div>
        </div>

        <div id="catalog-content-container">
          ${isCatalogEmpty ? renderEmptyCatalogHtml() : renderProductsTableHtml(allProducts)}
        </div>

        <div class="flex flex-wrap items-center justify-between px-4 py-2 bg-[#efe9dc] border-t border-dashed border-[#cfc5b4] font-mono text-xs text-[#565145]">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-2 h-2 bg-[#536443]"></span>
              BUFFER CAPACITY: 88.4%
            </span>
            <span class="hidden sm:flex items-center gap-1.5">
              <span class="inline-block w-2 h-2 bg-[#536443]"></span>
              REPLENISHMENT TRIGGERS: AUTOMATED
            </span>
          </div>
          <div class="flex items-center gap-1 text-[#565145] font-bold">
            <span class="material-symbols-outlined text-[14px]">tune</span>
            <span>THRESHOLD AUTO-RULES: ENFORCED</span>
          </div>
        </div>
      </div>

      <!-- Terminal Pagination & Footer Console Strip -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#faf7f0] px-4 py-2 border border-[#cfc5b4] font-mono text-xs shadow-kraft">
        <div class="flex items-center gap-4 text-[#565145]">
          <span>SHOWING <strong id="catalog-visible-count" class="text-[#262421]">${allProducts.length}</strong> OF <strong class="text-[#262421]">${allProducts.length}</strong> ITEMS</span>
          <span class="text-[#cfc5b4]">|</span>
          <span>FILTER: <span id="catalog-filter-summary" class="text-[#262421] font-bold">ALL / ALL</span></span>
          <span class="hidden md:inline text-[#cfc5b4]">|</span>
          <span class="hidden md:inline">CATALOG: <span class="text-[#536443] font-bold">ACTIVE</span></span>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 bg-white border border-[#cfc5b4] text-[#565145] hover:text-[#262421] font-mono text-xs uppercase font-bold cursor-pointer">[PREV]</button>
          <div class="px-3 py-1 bg-white border border-[#cfc5b4] text-[#565145] font-mono text-xs font-bold">
            PAGE <span class="text-[#262421] font-bold">01</span> / 01
          </div>
          <button class="px-3 py-1 bg-white border border-[#cfc5b4] text-[#565145] hover:text-[#262421] font-mono text-xs uppercase font-bold cursor-pointer">[NEXT]</button>
        </div>
      </div>
    </div>
  `;

  initProductsEvents(container);
}

function renderEmptyCatalogHtml() {
  return `
    <div class="py-16 px-4 flex flex-col items-center justify-center text-center relative bg-white">
      <div class="absolute top-6 right-8 pointer-events-none transform rotate-[-4deg] border-2 border-dashed border-[#b84328]/60 px-3 py-1 text-[#b84328] font-mono uppercase text-xs font-bold tracking-widest bg-[#b84328]/5">
        MANIFEST : UNVERIFIED
      </div>
      <div class="relative mb-6 flex items-center justify-center">
        <div class="w-24 h-24 border-2 border-dashed border-[#cfc5b4] bg-white flex items-center justify-center relative shadow-kraft">
          <span class="absolute -top-1 -left-1 text-[10px] font-mono text-[#b84328] font-bold">+</span>
          <span class="absolute -top-1 -right-1 text-[10px] font-mono text-[#b84328] font-bold">+</span>
          <span class="absolute -bottom-1 -left-1 text-[10px] font-mono text-[#b84328] font-bold">+</span>
          <span class="absolute -bottom-1 -right-1 text-[10px] font-mono text-[#b84328] font-bold">+</span>
          <svg class="w-12 h-12 text-[#565145]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect height="16" width="18" x="3" y="4"></rect><line x1="3" x2="21" y1="4" y2="20"></line><line x1="21" x2="3" y1="4" y2="20"></line><line x1="3" x2="21" y1="12" y2="12"></line><line x1="12" x2="12" y1="4" y2="20"></line></svg>
        </div>
        <div class="absolute -bottom-2.5 px-2 py-0.5 bg-[#ebe5d8] border border-[#cfc5b4] text-[10px] font-mono text-[#565145] font-bold tracking-wider">
          STATUS: NIL
        </div>
      </div>
      <h2 class="font-mono text-2xl font-bold uppercase text-[#262421] tracking-wider mb-2">
        NO PRODUCTS ADDED YET
      </h2>
      <p class="font-body text-sm text-[#565145] max-w-md mb-6 font-medium">
        Your warehouse catalog is empty. Register your initial inventory items or import a product manifest to begin stock tracking.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <button id="btn-empty-add-prod" class="flex items-center gap-1.5 px-5 py-2.5 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft-dark cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">add_box</span>
          <span>+ ADD YOUR FIRST PRODUCT</span>
        </button>
        <button id="btn-empty-import" class="flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-[#ebe5d8] border border-[#cfc5b4] text-[#262421] font-mono text-xs font-bold uppercase transition-colors rounded-none shadow-kraft cursor-pointer">
          <span class="material-symbols-outlined text-[16px] text-[#536443]">file_download</span>
          <span>IMPORT MANIFEST</span>
        </button>
      </div>
    </div>
  `;
}

function renderProductsTableHtml(products) {
  return `
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border-collapse">
        <thead>
          <tr class="border-b border-[#cfc5b4] bg-[#faf7f0] text-[#565145]">
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">SKU // BARCODE</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">PRODUCT SPECIFICATION</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">CATEGORY</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">LOCATION</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-right">STOCK / SAFETY</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-center">STATUS</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-right">VALUATION</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-right">MANAGE</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#cfc5b4]/50">
          ${products.map(p => {
            const statusBadge = p.status === 'IN_STOCK' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                                p.status === 'LOW' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
                                'text-[#ba1a1a] border-[#ba1a1a]/40 bg-[#ffdad6]';
            const statusLabel = p.status === 'IN_STOCK' ? 'IN STOCK' : p.status === 'LOW' ? 'LOW STOCK' : 'OUT OF STOCK';
            const totalVal = p.stock * p.unitCost;

            return `
              <tr class="hover:bg-[#faf7f0] transition-colors product-table-row" 
                  data-sku="${p.sku.toLowerCase()}" 
                  data-name="${p.name.toLowerCase()}" 
                  data-cat="${p.category}" 
                  data-zone="${p.zone}" 
                  data-status="${p.status}">
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="font-bold text-[#b84328]">${p.sku}</div>
                  <div class="text-[10px] text-[#8c716b] flex items-center gap-1 font-mono">
                    <span class="material-symbols-outlined text-[12px]">barcode</span>
                    <span>${p.barcode}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-bold text-[#262421] max-w-sm">${p.name}</div>
                  <div class="font-body text-[11px] text-[#565145] truncate max-w-xs">${p.spec}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="px-2 py-0.5 bg-[#efe9dc] text-[#565145] border border-[#cfc5b4] text-[10px] font-bold uppercase">
                    ${p.category}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="font-bold text-[#262421]">${p.zone}</div>
                  <div class="text-[10px] text-[#536443] font-bold">${p.bin}</div>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="font-bold text-sm ${p.stock <= p.safetyThreshold ? 'text-[#b84328]' : 'text-[#262421]'}">
                    ${p.stock} <span class="text-[10px] text-[#8c716b]">UNITS</span>
                  </div>
                  <div class="text-[10px] text-[#8c716b]">MIN: ${p.safetyThreshold}</div>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="inline-block px-2 py-0.5 text-[10px] font-bold border ${statusBadge} uppercase tracking-wider">
                    ${statusLabel}
                  </span>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="font-bold text-[#262421]">$${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div class="text-[10px] text-[#8c716b]">@ $${p.unitCost.toFixed(2)}/ea</div>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1">
                    <button class="btn-adjust-stock px-2 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] text-[10px] font-bold uppercase cursor-pointer" data-sku="${p.sku}" title="Adjust stock level">
                      ADJUST
                    </button>
                    <button class="btn-transfer-stock px-2 py-1 bg-[#536443] hover:bg-[#3b4c2d] text-white text-[10px] font-bold uppercase cursor-pointer" data-sku="${p.sku}" title="Transfer bay">
                      TRANSFER
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function initProductsEvents(container) {
  // Empty mode toggle
  const toggleBtn = container.querySelector('#btn-toggle-empty-prod');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      store.toggleEmptyMode();
      renderProductsView(container);
    });
  }

  // Add Product modal trigger
  const addBtn = container.querySelector('#btn-add-product');
  const emptyAddBtn = container.querySelector('#btn-empty-add-prod');
  const triggerAdd = () => {
    window.dispatchEvent(new CustomEvent('open-add-product'));
  };
  if (addBtn) addBtn.addEventListener('click', triggerAdd);
  if (emptyAddBtn) emptyAddBtn.addEventListener('click', triggerAdd);

  // Scan SKU hotkey & trigger
  const scanBtn = container.querySelector('#btn-scan-sku');
  const searchInput = container.querySelector('#productSearchInput');
  if (scanBtn && searchInput) {
    scanBtn.addEventListener('click', () => {
      searchInput.focus();
      searchInput.placeholder = "POINT SCANNER AT SKU BARCODE...";
      setTimeout(() => {
        searchInput.placeholder = "SEARCH SKU, ITEM NAME, SPECIFICATION, OR BARCODE... [F2]";
      }, 3000);
    });
  }

  // Export dropdown
  const exportBtn = container.querySelector('#btn-export-manifest');
  const exportMenu = container.querySelector('#export-menu');
  const exportCsv = container.querySelector('#btn-export-csv');
  const exportJson = container.querySelector('#btn-export-json');

  if (exportBtn && exportMenu) {
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      exportMenu.classList.add('hidden');
    });

    exportCsv.addEventListener('click', () => {
      downloadManifestCSV();
      exportMenu.classList.add('hidden');
    });

    exportJson.addEventListener('click', () => {
      downloadManifestJSON();
      exportMenu.classList.add('hidden');
    });
  }

  // Filters logic
  const catButtons = container.querySelectorAll('.cat-filter-btn');
  const statusButtons = container.querySelectorAll('.status-prod-filter-btn');
  const zoneSelect = container.querySelector('#zoneFilterSelect');
  const resetBtn = container.querySelector('#btn-reset-filters');
  const visibleCount = container.querySelector('#catalog-visible-count');
  const filterSummary = container.querySelector('#catalog-filter-summary');

  let currentCat = 'ALL';
  let currentStatus = 'ALL';
  let currentZone = 'ALL';

  function applyProductFilters() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const rows = container.querySelectorAll('.product-table-row');
    let visible = 0;

    rows.forEach(row => {
      const sku = row.getAttribute('data-sku') || '';
      const name = row.getAttribute('data-name') || '';
      const cat = row.getAttribute('data-cat') || '';
      const zone = row.getAttribute('data-zone') || '';
      const status = row.getAttribute('data-status') || '';

      const matchCat = (currentCat === 'ALL' || cat === currentCat);
      const matchStatus = (currentStatus === 'ALL' || status === currentStatus);
      const matchZone = (currentZone === 'ALL' || zone === currentZone);
      const matchSearch = (!query || sku.includes(query) || name.includes(query));

      if (matchCat && matchStatus && matchZone && matchSearch) {
        row.style.display = '';
        visible++;
      } else {
        row.style.display = 'none';
      }
    });

    if (visibleCount) visibleCount.textContent = visible;
    if (filterSummary) {
      filterSummary.textContent = `${currentCat} / ${currentStatus} / ${currentZone}`;
    }
  }

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.className = "cat-filter-btn px-3 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-mono text-xs uppercase rounded-none font-bold cursor-pointer transition-colors";
      });
      btn.className = "cat-filter-btn px-3 py-1 bg-[#b84328] text-white border border-[#b84328] font-mono text-xs uppercase rounded-none font-bold cursor-pointer";
      currentCat = btn.getAttribute('data-cat') || 'ALL';
      applyProductFilters();
    });
  });

  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => {
        b.className = "status-prod-filter-btn px-2 py-0.5 bg-white text-[#565145] hover:text-[#536443] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer";
      });
      btn.className = "status-prod-filter-btn px-2 py-0.5 bg-[#faf7f0] text-[#b84328] text-xs font-mono border border-[#cfc5b4] font-bold cursor-pointer";
      currentStatus = btn.getAttribute('data-status') || 'ALL';
      applyProductFilters();
    });
  });

  if (zoneSelect) {
    zoneSelect.addEventListener('change', () => {
      currentZone = zoneSelect.value;
      applyProductFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyProductFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCat = 'ALL';
      currentStatus = 'ALL';
      currentZone = 'ALL';
      if (searchInput) searchInput.value = '';
      if (zoneSelect) zoneSelect.value = 'ALL';
      catButtons[0]?.click();
      statusButtons[0]?.click();
      applyProductFilters();
    });
  }

  // Adjust stock handler
  container.querySelectorAll('.btn-adjust-stock').forEach(btn => {
    btn.addEventListener('click', () => {
      const sku = btn.getAttribute('data-sku');
      window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { sku } }));
    });
  });

  // Transfer handler
  container.querySelectorAll('.btn-transfer-stock').forEach(btn => {
    btn.addEventListener('click', () => {
      const sku = btn.getAttribute('data-sku');
      window.dispatchEvent(new CustomEvent('open-transfer-stock', { detail: { sku } }));
    });
  });
}

function downloadManifestCSV() {
  const prods = store.getProducts();
  const headers = ['SKU', 'Name', 'Category', 'Zone', 'Bin', 'Stock', 'SafetyThreshold', 'UnitCost', 'Status', 'Barcode', 'Spec'];
  const rows = prods.map(p => [
    p.sku,
    `"${p.name.replace(/"/g, '""')}"`,
    p.category,
    p.zone,
    p.bin,
    p.stock,
    p.safetyThreshold,
    p.unitCost,
    p.status,
    p.barcode,
    `"${p.spec.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `StockSense_Master_Catalog_${new Date().toISOString().substring(0, 10)}.csv`;
  a.click();
}

function downloadManifestJSON() {
  const prods = store.getProducts();
  const jsonContent = JSON.stringify({
    system: "StockSense Release 2.4",
    exportedAt: new Date().toISOString(),
    totalSkus: prods.length,
    products: prods
  }, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `StockSense_Manifest_${new Date().toISOString().substring(0, 10)}.json`;
  a.click();
}
