// StockSense Warehouse Operations Command Deck View (Screen 1)
import { store } from '../store.js';

export function renderDashboardView(container) {
  const metrics = store.getMetrics();
  const allMovements = store.getMovements();
  const isStateEmpty = store.state.emptyMode || allMovements.length === 0;
  const user = store.state.user || {
    name: "OPERATOR",
    badgeId: "OP-0000",
    zone: "WH-01",
    terminal: "TRM-9842-DX",
    shift: "ALPHA-02 [06:00-14:30]"
  };

  container.innerHTML = `
    <div class="flex flex-col w-full p-4 lg:p-6 gap-6 font-body text-[#262421]">
      <!-- Operational Header / Manifest Status Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-5 py-3 border border-[#cfc5b4] relative shadow-sm">
        <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#8c716b] select-none font-bold">+</span>
        <span class="absolute -top-1.5 -right-1.5 text-[10px] font-mono text-[#8c716b] select-none font-bold">+</span>
        <span class="absolute -bottom-1.5 -left-1.5 text-[10px] font-mono text-[#8c716b] select-none font-bold">+</span>
        <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#8c716b] select-none font-bold">+</span>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5 font-mono text-xs bg-[#faf7f0] px-3 py-1 border border-[#cfc5b4]">
            <span class="inline-block w-2 h-2 ${isStateEmpty ? 'bg-[#b84328]' : 'bg-[#536443]'}"></span>
            <span class="text-[#262421] uppercase tracking-wider font-bold">TERMINAL // ${user.terminal}</span>
            <span class="text-[#565145] font-bold ml-1">[ZONE ${user.zone}]</span>
          </div>
          <div class="flex items-center gap-1.5 font-mono text-[11px] tracking-wider px-3 py-1 bg-[#efe9dc] text-[#58413c] border border-dashed border-[#cfc5b4]">
            <span class="text-[#b84328] font-bold">TELEMETRY:</span>
            <span class="text-[#262421] font-medium">${isStateEmpty ? 'AWAITING ENTRY' : 'STREAM SYNCHRONIZED'}</span>
            <span class="text-[#cfc5b4] mx-1">|</span>
            <span class="text-[#262421] font-bold">${metrics.totalSkus} SKUs REGISTERED</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Toggle Prototype Mode Button (Empty vs Populated) -->
          <button id="btn-toggle-empty" class="flex items-center gap-1 px-3 py-1.5 bg-[#faf7f0] hover:bg-[#efe9dc] text-[#565145] border border-[#cfc5b4] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer" title="Switch between Stitch Empty Prototype and Populated Live State">
            <span class="material-symbols-outlined text-[16px] text-[#b84328]">tune</span>
            <span class="font-bold">${store.state.emptyMode ? 'VIEW POPULATED' : 'SIMULATE EMPTY'}</span>
          </button>

          <button id="btn-cycle-count" class="flex items-center gap-1 px-3 py-1.5 bg-[#faf7f0] text-[#565145] hover:text-[#b84328] border border-[#cfc5b4] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="square"></path></svg>
            <span class="font-bold">CYCLE COUNT</span>
          </button>

          <button id="btn-log-mov" class="flex items-center gap-1 px-4 py-1.5 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase tracking-wider border border-[#b84328] shadow-sm cursor-pointer">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="square"></path></svg>
            <span>+ ADD PRODUCT</span>
          </button>
        </div>
      </div>

      <!-- Top Row: 5 Compact KPI Cards (Shipping Tally Ticket Style) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Card 1: Active SKUs -->
        <div class="relative bg-white p-4 border border-[#cfc5b4] flex flex-col justify-between group hover:border-[#8c716b] transition-colors shadow-sm">
          <div class="flex items-center justify-between text-[#565145] border-b border-dashed border-[#cfc5b4] pb-1.5 mb-2 font-mono text-[11px]">
            <span class="text-[#262421] uppercase tracking-wider font-bold">TOTAL ACTIVE SKUS</span>
            <span class="text-[10px] text-[#565145] border border-[#cfc5b4] px-1 bg-[#faf7f0]">TAG #01</span>
          </div>
          <div class="my-1.5">
            <div class="font-mono text-3xl text-[#262421] font-bold tracking-tight">${metrics.totalSkus}</div>
          </div>
          <div class="flex items-center justify-between font-mono text-xs pt-1.5 border-t border-dashed border-[#cfc5b4]">
            <span class="${metrics.totalSkus > 0 ? 'text-[#536443]' : 'text-[#8c716b]'} font-bold">
              ${metrics.totalSkus > 0 ? '● ACTIVE REPO' : '— NO DATA'}
            </span>
            <span class="text-[#8c716b] uppercase text-[10px] font-bold">CATALOG</span>
          </div>
        </div>

        <!-- Card 2: Low Stock -->
        <div class="relative bg-white p-4 border border-[#cfc5b4] flex flex-col justify-between group hover:border-[#8c716b] transition-colors shadow-sm">
          <div class="flex items-center justify-between text-[#565145] border-b border-dashed border-[#cfc5b4] pb-1.5 mb-2 font-mono text-[11px]">
            <span class="text-[#262421] uppercase tracking-wider font-bold">LOW / OUT OF STOCK</span>
            <span class="text-[10px] ${metrics.atRiskCount > 0 ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' : 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20'} font-bold border px-1">
              ${metrics.atRiskCount > 0 ? 'ALERT // ' + metrics.atRiskCount : 'CLEAR // 0'}
            </span>
          </div>
          <div class="my-1.5">
            <div class="font-mono text-3xl ${metrics.atRiskCount > 0 ? 'text-[#b84328]' : 'text-[#262421]'} font-bold tracking-tight">
              ${metrics.atRiskCount} <span class="font-mono text-xs text-[#565145] font-bold">SKUs</span>
            </div>
          </div>
          <div class="flex items-center justify-between font-mono text-xs pt-1.5 border-t border-dashed border-[#cfc5b4]">
            <span class="${metrics.atRiskCount > 0 ? 'text-[#b84328]' : 'text-[#536443]'} font-bold">
              ${metrics.outOfStockCount} CRITICAL
            </span>
            <span class="text-[#565145] uppercase text-[10px] font-bold">THRESH: DYNAMIC</span>
          </div>
        </div>

        <!-- Card 3: Pending Receipts -->
        <div class="relative bg-white p-4 border border-[#cfc5b4] flex flex-col justify-between group hover:border-[#8c716b] transition-colors shadow-sm">
          <div class="flex items-center justify-between text-[#565145] border-b border-dashed border-[#cfc5b4] pb-1.5 mb-2 font-mono text-[11px]">
            <span class="text-[#262421] uppercase tracking-wider font-bold">PENDING RECEIPTS</span>
            <span class="text-[10px] text-[#565145] border border-[#cfc5b4] px-1 bg-[#faf7f0]">
              ${metrics.pendingReceipts > 0 ? 'ACTIVE DOCK' : 'NO INBOUND'}
            </span>
          </div>
          <div class="my-1.5">
            <div class="font-mono text-3xl text-[#262421] font-bold tracking-tight">
              ${metrics.pendingReceipts} <span class="font-mono text-xs text-[#565145] font-bold">SHIPMENTS</span>
            </div>
          </div>
          <div class="flex items-center justify-between font-mono text-xs pt-1.5 border-t border-dashed border-[#cfc5b4]">
            <span class="text-[#565145] font-medium">${metrics.pendingReceipts > 0 ? 'BAY 01 INTAKE' : '0 BAYS ACTIVE'}</span>
            <span class="text-[#565145] uppercase text-[10px] font-bold">QUEUE: ${String(metrics.pendingReceipts).padStart(2, '0')}</span>
          </div>
        </div>

        <!-- Card 4: Outgoing Deliveries -->
        <div class="relative bg-white p-4 border border-[#cfc5b4] flex flex-col justify-between group hover:border-[#8c716b] transition-colors shadow-sm">
          <div class="flex items-center justify-between text-[#565145] border-b border-dashed border-[#cfc5b4] pb-1.5 mb-2 font-mono text-[11px]">
            <span class="text-[#262421] uppercase tracking-wider font-bold">OUTGOING DISPATCH</span>
            <span class="text-[10px] text-[#565145] border border-[#cfc5b4] px-1 bg-[#faf7f0]">
              ${metrics.pendingDispatches > 0 ? 'DISPATCH QUEUE' : 'NO ORDERS'}
            </span>
          </div>
          <div class="my-1.5">
            <div class="font-mono text-3xl text-[#262421] font-bold tracking-tight">
              ${metrics.pendingDispatches} <span class="font-mono text-xs text-[#565145] font-bold">ORDERS</span>
            </div>
          </div>
          <div class="flex items-center justify-between font-mono text-xs pt-1.5 border-t border-dashed border-[#cfc5b4]">
            <span class="text-[#565145] font-medium">${metrics.pendingDispatches > 0 ? 'STAGED PICKUP' : '0 STAGED'}</span>
            <span class="text-[#565145] uppercase text-[10px] font-bold">DEPOT A</span>
          </div>
        </div>

        <!-- Card 5: Transfers -->
        <div class="relative bg-white p-4 border border-[#cfc5b4] flex flex-col justify-between group hover:border-[#8c716b] transition-colors shadow-sm">
          <div class="flex items-center justify-between text-[#565145] border-b border-dashed border-[#cfc5b4] pb-1.5 mb-2 font-mono text-[11px]">
            <span class="text-[#262421] uppercase tracking-wider font-bold">SCHEDULED TRANSFERS</span>
            <span class="text-[10px] text-[#536443] font-bold border border-[#536443]/40 px-1 bg-[#d3e6bd]/20">STANDBY</span>
          </div>
          <div class="my-1.5">
            <div class="font-mono text-3xl text-[#262421] font-bold tracking-tight">
              ${metrics.scheduledTransfers} <span class="font-mono text-xs text-[#565145] font-bold">BAYS</span>
            </div>
          </div>
          <div class="flex items-center justify-between font-mono text-xs pt-1.5 border-t border-dashed border-[#cfc5b4]">
            <span class="text-[#565145] font-semibold">${metrics.scheduledTransfers > 0 ? 'CROSS-DOCK ACTIVE' : 'NONE SCHEDULED'}</span>
            <span class="text-[#565145] uppercase text-[10px] font-bold">BAY RUN</span>
          </div>
        </div>
      </div>

      <!-- Operational Filter Bar Module (Cardstock Tag Style) -->
      <div class="bg-[#efe9dc] p-3 border border-[#cfc5b4] flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 shadow-sm">
        <!-- Filter Chips / Stamped Tags -->
        <div class="flex flex-wrap items-center gap-1 font-mono text-[11px]">
          <span class="text-[#565145] mr-1 uppercase font-bold">OP-TYPE:</span>
          <button class="filter-type-btn px-3 py-1 bg-[#b84328] text-white border border-[#b84328] uppercase tracking-wider font-bold shadow-xs cursor-pointer" data-type="ALL">
            ALL (${allMovements.length})
          </button>
          <button class="filter-type-btn px-3 py-1 bg-white text-[#262421] border border-[#cfc5b4] hover:border-[#8c716b] uppercase tracking-wider transition-colors font-bold cursor-pointer" data-type="RECEIPT">
            RECEIPTS (${allMovements.filter(m => m.type === 'RECEIPT').length})
          </button>
          <button class="filter-type-btn px-3 py-1 bg-white text-[#262421] border border-[#cfc5b4] hover:border-[#8c716b] uppercase tracking-wider transition-colors font-bold cursor-pointer" data-type="DISPATCH">
            DISPATCHES (${allMovements.filter(m => m.type === 'DISPATCH').length})
          </button>
          <button class="filter-type-btn px-3 py-1 bg-white text-[#262421] border border-[#cfc5b4] hover:border-[#8c716b] uppercase tracking-wider transition-colors font-bold cursor-pointer" data-type="TRANSFER">
            TRANSFERS (${allMovements.filter(m => m.type === 'TRANSFER').length})
          </button>
          <button class="filter-type-btn px-3 py-1 bg-white text-[#262421] border border-[#cfc5b4] hover:border-[#8c716b] uppercase tracking-wider transition-colors font-bold cursor-pointer" data-type="ADJUST">
            ADJUSTMENTS (${allMovements.filter(m => m.type === 'ADJUST').length})
          </button>
        </div>

        <!-- Right Side: Status Filter & Quick Barcode Field -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center bg-white border border-[#cfc5b4] p-0.5">
            <span class="text-[#565145] font-mono text-[11px] px-2 uppercase font-bold">STATUS:</span>
            <button class="filter-status-btn px-2 py-0.5 font-mono text-xs text-[#b84328] font-bold bg-[#faf7f0] border-r border-[#cfc5b4] uppercase cursor-pointer" data-status="ALL">ALL</button>
            <button class="filter-status-btn px-2 py-0.5 font-mono text-xs text-[#565145] hover:text-[#b84328] transition-colors border-r border-[#cfc5b4] uppercase font-bold cursor-pointer" data-status="WAITING">• WAITING</button>
            <button class="filter-status-btn px-2 py-0.5 font-mono text-xs text-[#565145] hover:text-[#536443] transition-colors border-r border-[#cfc5b4] uppercase font-bold cursor-pointer" data-status="READY">• READY</button>
            <button class="filter-status-btn px-2 py-0.5 font-mono text-xs text-[#565145] hover:text-[#536443] transition-colors uppercase font-bold cursor-pointer" data-status="DONE">• DONE</button>
          </div>

          <!-- Quick Search Barcode Field -->
          <div class="relative flex items-center flex-1 min-w-[240px]">
            <span class="absolute left-2.5 font-mono text-[#b84328] font-bold">_</span>
            <input id="deck-search-input" type="text" placeholder="SCAN SKU OR BATCH / ENTER..."
              class="w-full bg-white border border-[#cfc5b4] text-[#262421] font-mono text-xs pl-7 pr-10 py-1.5 focus:border-[#b84328] focus:outline-none placeholder:text-[#565145]/60 rounded-none shadow-inner" />
            <span class="absolute right-2 text-[#565145] flex items-center">
              <span class="material-symbols-outlined text-[16px] text-[#565145] hover:text-[#b84328] cursor-pointer" id="btn-scan-trigger">barcode_scanner</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Activity Ledger: Recent Stock Movements Container -->
      <div class="bg-white border-2 border-[#cfc5b4] relative overflow-hidden shadow-sm">
        <!-- Header with manifest markings -->
        <div class="px-5 py-2.5 bg-[#efe9dc] border-b-2 border-dashed border-[#cfc5b4] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#b84328]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect height="14" rx="1" width="20" x="2" y="7"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span class="font-mono text-sm uppercase tracking-wider text-[#262421] font-bold">STOCK MOVEMENTS TELEMETRY LOG</span>
          </div>
          <div class="font-mono text-xs text-[#565145] flex items-center gap-4">
            <span>LEDGER ID: <strong class="text-[#262421] font-bold">${isStateEmpty ? 'LG-EMPTY // UNINITIALIZED' : 'LG-WH01-SYNC'}</strong></span>
            <span class="border-l border-[#cfc5b4] pl-4">SECURITY: <strong class="text-[#565145] font-bold">${user.secLevel}</strong></span>
          </div>
        </div>

        <!-- Ledger Content: Empty State OR Live Movements Table -->
        <div id="ledger-content-container">
          ${isStateEmpty ? renderEmptyStateHtml() : renderMovementsTableHtml(allMovements)}
        </div>

        <!-- Ledger Footer / Manifest Summary Line -->
        <div class="px-5 py-2.5 bg-[#efe9dc] border-t-2 border-dashed border-[#cfc5b4] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-[#565145]">
          <div class="flex items-center gap-4">
            <span>SHOWING <span id="visible-count" class="text-[#262421] font-bold">${allMovements.length}</span> OF <span class="text-[#262421] font-bold">${allMovements.length}</span> LOGGED MOVEMENTS</span>
            <span class="hidden md:inline-block text-[#cfc5b4]">|</span>
            <span class="hidden md:inline-block">FILTER: <strong id="active-filter-label" class="text-[#262421] font-bold">ALL / ALL</strong></span>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5 font-mono text-[11px] font-bold">
              <span class="w-2 h-2 rounded-none bg-[#536443]"></span>
              <span class="text-[#536443] font-bold">SYSTEM READY</span>
            </div>
            <span class="border-l border-[#cfc5b4] pl-3 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-none bg-[#8c716b]"></span>
              <span>LATENCY: <span class="text-[#262421] font-bold">14ms</span></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  initDashboardEvents(container);
}

function renderEmptyStateHtml() {
  return `
    <div class="py-16 px-6 flex flex-col items-center justify-center text-center bg-white relative">
      <div class="absolute top-6 right-8 pointer-events-none hidden md:block">
        <div class="rubber-stamp text-[#536443] text-[11px] px-3 py-1 border-[#536443]/70">ARCHIVE EMPTY</div>
      </div>
      <!-- Flat Ink Wood Crate Illustration -->
      <div class="w-20 h-20 border-2 border-dashed border-[#b84328]/60 bg-[#efe9dc] flex items-center justify-center mb-5 relative shadow-xs">
        <span class="absolute -top-1.5 -left-1.5 text-[9px] font-mono text-[#b84328] font-bold">+</span>
        <span class="absolute -top-1.5 -right-1.5 text-[9px] font-mono text-[#b84328] font-bold">+</span>
        <span class="absolute -bottom-1.5 -left-1.5 text-[9px] font-mono text-[#b84328] font-bold">+</span>
        <span class="absolute -bottom-1.5 -right-1.5 text-[9px] font-mono text-[#b84328] font-bold">+</span>
        <svg class="w-10 h-10 text-[#b84328]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="square"></path><path d="M4 12l8 4 8-4" stroke-linecap="square"></path><path d="M12 3v8" stroke-linecap="square"></path><circle cx="12" cy="12" fill="currentColor" r="1.5"></circle></svg>
      </div>
      <div class="font-mono text-2xl uppercase tracking-wider text-[#262421] mb-2 font-bold">NO STOCK MOVEMENTS YET</div>
      <p class="font-body text-sm text-[#565145] max-w-md mb-6 leading-relaxed">
        Your warehouse operations ledger is clear. Register your initial inventory catalog or import an intake manifest to begin real-time stock telemetry.
      </p>
      <button id="btn-empty-add-product" class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b84328] text-white hover:bg-[#972b12] transition-colors font-mono text-xs font-bold uppercase tracking-wider border border-[#b84328] shadow-sm cursor-pointer">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="square"></path></svg>
        <span>+ Add your first product</span>
      </button>
    </div>
  `;
}

function renderMovementsTableHtml(movements) {
  return `
    <div class="overflow-x-auto">
      <table class="w-full text-left font-mono text-xs border-collapse">
        <thead>
          <tr class="border-b border-[#cfc5b4] bg-[#faf7f0] text-[#565145]">
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">ENTRY ID // TIME</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">OP TYPE</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">SKU / ITEM MANIFEST</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-right">QTY</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">SOURCE ➔ DESTINATION</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider">CARRIER</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-center">STATUS</th>
            <th class="py-2.5 px-4 font-bold uppercase tracking-wider text-right">ACTION</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#cfc5b4]/50">
          ${movements.map(m => {
            const isNegative = m.qty < 0;
            const typeColor = m.type === 'RECEIPT' ? 'text-[#536443] bg-[#d3e6bd]/30 border-[#536443]/40' :
                              m.type === 'DISPATCH' ? 'text-[#b84328] bg-[#ffdad2]/40 border-[#b84328]/40' :
                              m.type === 'TRANSFER' ? 'text-[#565145] bg-[#efe9dc] border-[#cfc5b4]' :
                              'text-[#8c716b] bg-[#faf7f0] border-[#cfc5b4]';
            
            const statusColor = m.status === 'DONE' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                                m.status === 'READY' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/20' :
                                'text-[#8c716b] border-[#cfc5b4] bg-white';

            return `
              <tr class="hover:bg-[#faf7f0] transition-colors movement-row" data-type="${m.type}" data-status="${m.status}" data-sku="${m.sku.toLowerCase()}" data-name="${m.productName.toLowerCase()}">
                <td class="py-3 px-4 whitespace-nowrap">
                  <div class="font-bold text-[#262421]">${m.id}</div>
                  <div class="text-[10px] text-[#8c716b]">${m.timestamp}</div>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="inline-block px-2 py-0.5 font-bold text-[10px] border ${typeColor} uppercase tracking-wider">
                    ${m.type}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="font-bold text-[#262421]">${m.sku}</div>
                  <div class="font-body text-xs text-[#565145] truncate max-w-xs">${m.productName}</div>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <span class="font-bold text-sm ${isNegative ? 'text-[#b84328]' : 'text-[#262421]'}">
                    ${m.qty > 0 ? '+' : ''}${m.qty}
                  </span>
                  <span class="text-[10px] text-[#8c716b] block">${m.unit}</span>
                </td>
                <td class="py-3 px-4 text-xs whitespace-nowrap">
                  <div class="text-[#262421]">${m.source}</div>
                  <div class="text-[10px] text-[#536443] font-bold">➔ ${m.destination}</div>
                </td>
                <td class="py-3 px-4 text-xs whitespace-nowrap text-[#565145]">
                  <div>${m.carrier}</div>
                  <div class="text-[10px] text-[#8c716b]">${m.operator}</div>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                  <span class="inline-block px-2 py-0.5 font-bold text-[10px] border ${statusColor} uppercase tracking-widest">
                    ${m.status === 'DONE' ? '✓ DONE' : m.status === 'READY' ? '● READY' : '○ WAITING'}
                  </span>
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  ${m.status !== 'DONE' ? `
                    <button class="btn-complete-mov px-2 py-1 bg-[#536443] hover:bg-[#3b4c2d] text-white text-[10px] uppercase font-bold transition-colors cursor-pointer" data-id="${m.id}">
                      VERIFY
                    </button>
                  ` : `
                    <span class="text-[10px] text-[#8c716b] uppercase font-bold">[LOGGED]</span>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function initDashboardEvents(container) {
  // Empty mode toggle
  const toggleBtn = container.querySelector('#btn-toggle-empty');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      store.toggleEmptyMode();
      renderDashboardView(container);
    });
  }

  // Add product triggers
  const addBtn = container.querySelector('#btn-log-mov');
  const emptyAddBtn = container.querySelector('#btn-empty-add-product');
  const triggerAdd = () => {
    window.location.hash = '#products';
    // Small delay to allow products view to mount and trigger modal
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-add-product'));
    }, 150);
  };
  if (addBtn) addBtn.addEventListener('click', triggerAdd);
  if (emptyAddBtn) emptyAddBtn.addEventListener('click', triggerAdd);

  // Cycle count action
  const cycleBtn = container.querySelector('#btn-cycle-count');
  if (cycleBtn) {
    cycleBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-cycle-count'));
    });
  }

  // Filters logic
  const typeButtons = container.querySelectorAll('.filter-type-btn');
  const statusButtons = container.querySelectorAll('.filter-status-btn');
  const searchInput = container.querySelector('#deck-search-input');
  const filterLabel = container.querySelector('#active-filter-label');
  const visibleCount = container.querySelector('#visible-count');
  const scanTrigger = container.querySelector('#btn-scan-trigger');

  let currentType = 'ALL';
  let currentStatus = 'ALL';

  function applyFilters() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const rows = container.querySelectorAll('.movement-row');
    let visible = 0;

    rows.forEach(row => {
      const type = row.getAttribute('data-type');
      const status = row.getAttribute('data-status');
      const sku = row.getAttribute('data-sku') || '';
      const name = row.getAttribute('data-name') || '';

      const matchType = (currentType === 'ALL' || type === currentType);
      const matchStatus = (currentStatus === 'ALL' || status === currentStatus);
      const matchSearch = (!query || sku.includes(query) || name.includes(query));

      if (matchType && matchStatus && matchSearch) {
        row.style.display = '';
        visible++;
      } else {
        row.style.display = 'none';
      }
    });

    if (visibleCount) visibleCount.textContent = visible;
    if (filterLabel) {
      filterLabel.textContent = `${currentType} / ${currentStatus}${query ? ' / "' + query + '"' : ''}`;
    }
  }

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => {
        b.className = "filter-type-btn px-3 py-1 bg-white text-[#262421] border border-[#cfc5b4] hover:border-[#8c716b] uppercase tracking-wider transition-colors font-bold cursor-pointer";
      });
      btn.className = "filter-type-btn px-3 py-1 bg-[#b84328] text-white border border-[#b84328] uppercase tracking-wider font-bold shadow-xs cursor-pointer";
      currentType = btn.getAttribute('data-type') || 'ALL';
      applyFilters();
    });
  });

  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => {
        b.className = "filter-status-btn px-2 py-0.5 font-mono text-xs text-[#565145] hover:text-[#b84328] transition-colors border-r border-[#cfc5b4] uppercase font-bold cursor-pointer";
      });
      btn.className = "filter-status-btn px-2 py-0.5 font-mono text-xs text-[#b84328] font-bold bg-[#faf7f0] border-r border-[#cfc5b4] uppercase cursor-pointer";
      currentStatus = btn.getAttribute('data-status') || 'ALL';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        applyFilters();
      }
    });
  }

  if (scanTrigger && searchInput) {
    scanTrigger.addEventListener('click', () => {
      searchInput.focus();
      searchInput.placeholder = "BARCODE SCAN READY: SCAN NOW...";
      setTimeout(() => {
        searchInput.placeholder = "SCAN SKU OR BATCH / ENTER...";
      }, 3000);
    });
  }

  // Verify movement action
  container.querySelectorAll('.btn-complete-mov').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const mov = store.state.movements.find(m => m.id === id);
      if (mov) {
        mov.status = 'DONE';
        store.notify('movement:update', mov);
        renderDashboardView(container);
      }
    });
  });
}
