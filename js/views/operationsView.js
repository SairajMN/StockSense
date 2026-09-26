// StockSense Dedicated Operations & Dispatch View (P1.10, P1.11, P1.12)
import { store } from '../store.js';

export function renderOperationsView(container) {
  const allMovements = store.getMovements();
  const products = store.getProducts();

  let viewMode = 'list'; // 'list' or 'kanban'
  let currentOpFilter = 'ALL';
  let currentProductFilter = 'ALL';

  function render() {
    container.innerHTML = `
      <div class="flex flex-col w-full p-4 lg:p-6 space-y-6 font-body text-[#262421]">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf7f0] p-4 border border-[#cfc5b4] shadow-kraft">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-[#536443]"></span>
              <h1 class="font-mono text-2xl font-bold uppercase tracking-tight text-[#262421]">
                DOCK OPERATIONS &amp; DISPATCH CONTROL
              </h1>
            </div>
            <p class="font-mono text-xs text-[#565145] mt-1 uppercase">
              IMMUTABLE MOVEMENT AUDIT TRAIL • MULTI-BAY CROSS-DOCKING • RF CARRIER ROUTING
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- View Mode Toggle: List vs Kanban (P1.11) -->
            <div class="flex items-center bg-white border border-[#cfc5b4] p-0.5 font-mono text-xs">
              <button id="toggle-view-list" class="px-3 py-1 font-bold uppercase flex items-center gap-1 cursor-pointer ${viewMode === 'list' ? 'bg-[#b84328] text-white' : 'text-[#565145] hover:text-[#262421]'}" title="List View">
                <span class="material-symbols-outlined text-[16px]">view_list</span>
                <span class="hidden sm:inline">LIST</span>
              </button>
              <button id="toggle-view-kanban" class="px-3 py-1 font-bold uppercase flex items-center gap-1 cursor-pointer ${viewMode === 'kanban' ? 'bg-[#b84328] text-white' : 'text-[#565145] hover:text-[#262421]'}" title="Kanban Board View">
                <span class="material-symbols-outlined text-[16px]">view_kanban</span>
                <span class="hidden sm:inline">KANBAN</span>
              </button>
            </div>

            <button id="btn-new-movement" class="flex items-center gap-1.5 px-4 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase transition-colors shadow-kraft-dark cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">swap_horiz</span>
              <span>+ LOG MOVEMENT</span>
            </button>
          </div>
        </div>

        <!-- Quick Action Dispatch Modules -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Inbound Intake -->
          <div class="bg-white border border-[#cfc5b4] p-4 flex flex-col justify-between shadow-kraft">
            <div class="flex items-center justify-between pb-2 border-b border-dashed border-[#cfc5b4]">
              <span class="font-mono text-xs font-bold text-[#536443] uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">call_received</span>
                <span>INBOUND RECEIVING DOCK</span>
              </span>
              <span class="text-[10px] font-mono text-[#536443] bg-[#d3e6bd]/30 px-1.5 py-0.5 border border-[#536443]/40 font-bold">
                ACTIVE DOCK
              </span>
            </div>
            <p class="font-body text-xs text-[#565145] my-3 leading-relaxed">
              Record incoming shipments from suppliers, verify packing slips against purchase orders, and assign primary bay storage.
            </p>
            <button id="btn-quick-receipt" class="w-full py-2 bg-[#faf7f0] hover:bg-[#efe9dc] border border-[#cfc5b4] font-mono text-xs font-bold text-[#536443] uppercase cursor-pointer">
              + INTAKE RECEIPT MANIFEST
            </button>
          </div>

          <!-- Outbound Dispatch -->
          <div class="bg-white border border-[#cfc5b4] p-4 flex flex-col justify-between shadow-kraft">
            <div class="flex items-center justify-between pb-2 border-b border-dashed border-[#cfc5b4]">
              <span class="font-mono text-xs font-bold text-[#b84328] uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>OUTBOUND DISPATCH</span>
              </span>
              <span class="text-[10px] font-mono text-[#b84328] bg-[#ffdad2]/40 px-1.5 py-0.5 border border-[#b84328]/40 font-bold">
                STAGING
              </span>
            </div>
            <p class="font-body text-xs text-[#565145] my-3 leading-relaxed">
              Pick and stage outgoing catalog orders, verify SKU bar codes, and generate bill-of-lading dispatch records.
            </p>
            <button id="btn-quick-dispatch" class="w-full py-2 bg-[#faf7f0] hover:bg-[#efe9dc] border border-[#cfc5b4] font-mono text-xs font-bold text-[#b84328] uppercase cursor-pointer">
              + STAGE DISPATCH ORDER
            </button>
          </div>

          <!-- Internal Bay Transfer -->
          <div class="bg-white border border-[#cfc5b4] p-4 flex flex-col justify-between shadow-kraft">
            <div class="flex items-center justify-between pb-2 border-b border-dashed border-[#cfc5b4]">
              <span class="font-mono text-xs font-bold text-[#565145] uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">forklift</span>
                <span>INTERNAL RE-ALLOCATION</span>
              </span>
              <span class="text-[10px] font-mono text-[#565145] bg-[#efe9dc] px-1.5 py-0.5 border border-[#cfc5b4] font-bold">
                CROSS-BAY
              </span>
            </div>
            <p class="font-body text-xs text-[#565145] my-3 leading-relaxed">
              Relocate stock between WH-01, cold vault WH-02, long-span racking WH-03, or hazmat containment staging WH-04.
            </p>
            <button id="btn-quick-transfer" class="w-full py-2 bg-[#faf7f0] hover:bg-[#efe9dc] border border-[#cfc5b4] font-mono text-xs font-bold text-[#565145] uppercase cursor-pointer">
              + TRANSFER STOCK BAY
            </button>
          </div>
        </div>

        <!-- Filter Deck -->
        <div class="bg-[#faf7f0] p-3 border border-[#cfc5b4] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-kraft font-mono text-xs">
          <!-- Operation Type Filter Chips -->
          <div class="flex flex-wrap items-center gap-1">
            <span class="text-[#565145] font-bold mr-1">TYPE:</span>
            <button class="op-type-btn px-2.5 py-1 ${currentOpFilter === 'ALL' ? 'bg-[#b84328] text-white' : 'bg-white text-[#262421]'} border border-[#cfc5b4] font-bold uppercase cursor-pointer" data-type="ALL">
              ALL (${allMovements.length})
            </button>
            <button class="op-type-btn px-2.5 py-1 ${currentOpFilter === 'RECEIPT' ? 'bg-[#b84328] text-white' : 'bg-white text-[#262421]'} border border-[#cfc5b4] font-bold uppercase cursor-pointer" data-type="RECEIPT">
              RECEIPTS (${allMovements.filter(m => m.type === 'RECEIPT').length})
            </button>
            <button class="op-type-btn px-2.5 py-1 ${currentOpFilter === 'DISPATCH' ? 'bg-[#b84328] text-white' : 'bg-white text-[#262421]'} border border-[#cfc5b4] font-bold uppercase cursor-pointer" data-type="DISPATCH">
              DELIVERIES (${allMovements.filter(m => m.type === 'DISPATCH').length})
            </button>
            <button class="op-type-btn px-2.5 py-1 ${currentOpFilter === 'TRANSFER' ? 'bg-[#b84328] text-white' : 'bg-white text-[#262421]'} border border-[#cfc5b4] font-bold uppercase cursor-pointer" data-type="TRANSFER">
              TRANSFERS (${allMovements.filter(m => m.type === 'TRANSFER').length})
            </button>
            <button class="op-type-btn px-2.5 py-1 ${currentOpFilter === 'ADJUST' ? 'bg-[#b84328] text-white' : 'bg-white text-[#262421]'} border border-[#cfc5b4] font-bold uppercase cursor-pointer" data-type="ADJUST">
              ADJUSTMENTS (${allMovements.filter(m => m.type === 'ADJUST').length})
            </button>
          </div>

          <!-- Product Filter (P1.10) -->
          <div class="flex items-center gap-2">
            <span class="text-[#565145] font-bold">LINKED PRODUCT:</span>
            <select id="op-product-filter" class="bg-white border border-[#cfc5b4] p-1 text-[#262421] font-bold focus:outline-none focus:border-[#b84328]">
              <option value="ALL">ALL PRODUCTS</option>
              ${products.map(p => `
                <option value="${p.sku}" ${currentProductFilter === p.sku ? 'selected' : ''}>
                  ${p.sku} — ${p.name.substring(0, 24)}
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Main Movements Display Container -->
        <div id="movements-display-root">
          ${viewMode === 'list' ? renderListView() : renderKanbanView()}
        </div>
      </div>
    `;

    attachEvents();
  }

  function getFilteredMovements() {
    return allMovements.filter(m => {
      const matchType = (currentOpFilter === 'ALL' || m.type === currentOpFilter);
      const matchProd = (currentProductFilter === 'ALL' || m.sku === currentProductFilter || m.items?.some(it => it.sku === currentProductFilter));
      return matchType && matchProd;
    });
  }

  // 1. Grouped List View (P1.10)
  function renderListView() {
    const filtered = getFilteredMovements();

    // Group movements by reference
    const groups = {};
    filtered.forEach(m => {
      const refKey = m.reference || m.id;
      if (!groups[refKey]) {
        groups[refKey] = {
          reference: refKey,
          id: m.id,
          type: m.type,
          source: m.source,
          destination: m.destination,
          carrier: m.carrier,
          status: m.status,
          timestamp: m.timestamp,
          responsible: m.responsible || m.operator,
          contact: m.contact,
          items: m.items && m.items.length > 0 ? m.items : [{ sku: m.sku, name: m.productName, qty: m.qty, uom: m.unit }]
        };
      } else if (m.items) {
        // Merge if multi-line
        m.items.forEach(it => {
          if (!groups[refKey].items.some(existing => existing.sku === it.sku)) {
            groups[refKey].items.push(it);
          }
        });
      }
    });

    const groupList = Object.values(groups);

    return `
      <div class="bg-white border-2 border-[#cfc5b4] relative overflow-hidden shadow-kraft">
        <div class="px-5 py-3 bg-[#efe9dc] border-b-2 border-dashed border-[#cfc5b4] flex items-center justify-between font-mono text-xs">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-[#b84328]">receipt_long</span>
            <span class="font-bold text-[#262421] uppercase">
              OPERATIONAL ORDERS &amp; MOVE AUDIT TRAIL (${groupList.length} ORDERS)
            </span>
          </div>
          <span class="text-[#565145]">CLICK ANY ROW TO EXPAND LINE ITEMS OR PRINT</span>
        </div>

          ${groupList.length === 0 ? `
            <div class="py-12 px-4 text-center font-mono text-xs text-[#565145] flex flex-col items-center justify-center gap-3 bg-white">
              <span class="material-symbols-outlined text-[40px] text-[#565145]">swap_horiz</span>
              <div class="text-sm font-bold uppercase text-[#262421]">NO OPERATIONAL MOVEMENTS RECORDED</div>
              <p class="font-body text-xs text-[#565145] max-w-sm">No inventory movements, intake receipts, or outbound dispatches have been registered yet.</p>
              <button id="btn-empty-log-movement" class="mt-1 px-4 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase shadow-kraft cursor-pointer">
                + LOG A MOVEMENT
              </button>
            </div>
          ` : groupList.map(grp => {
            const isDone = grp.status === 'DONE';
            const statusBadge = grp.status === 'DONE' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                                grp.status === 'READY' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
                                grp.status === 'DRAFT' ? 'text-[#565145] border-[#cfc5b4] bg-[#efe9dc]' :
                                grp.status === 'CANCELED' ? 'text-[#ba1a1a] border-[#ba1a1a]/40 bg-[#ffdad6]' :
                                'text-[#8c716b] border-[#cfc5b4] bg-white';

            return `
              <div class="p-4 hover:bg-[#faf7f0] transition-colors order-group-card font-mono text-xs" data-id="${grp.id}">
                <!-- Top Summary Row -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-dashed border-[#cfc5b4]/60">
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-sm text-[#b84328] cursor-pointer hover:underline btn-open-detail" data-id="${grp.id}">
                      ${grp.reference}
                    </span>
                    <span class="px-2 py-0.5 border text-[10px] font-bold uppercase ${
                      grp.type === 'RECEIPT' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                      grp.type === 'DISPATCH' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
                      'text-[#565145] border-[#cfc5b4] bg-[#efe9dc]'
                    }">
                      ${grp.type}
                    </span>
                    <span class="text-[11px] text-[#565145]">${grp.timestamp}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase border ${statusBadge}">
                      ${grp.status}
                    </span>
                    <button class="btn-open-detail px-3 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] text-[10px] font-bold uppercase cursor-pointer" data-id="${grp.id}">
                      INSPECT / PRINT →
                    </button>
                  </div>
                </div>

                <!-- Middle Routing & Contact Info -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 text-[11px] text-[#565145]">
                  <div>ROUTING: <strong class="text-[#262421]">${grp.source}</strong> ➔ <strong class="text-[#536443]">${grp.destination}</strong></div>
                  <div>PARTNER: <strong class="text-[#262421]">${grp.contact || 'Direct Depot Runner'}</strong></div>
                  <div>RESPONSIBLE: <strong class="text-[#262421]">${grp.responsible}</strong></div>
                </div>

                <!-- Expandable Line Items Table (Grouped P1.10) -->
                <div class="mt-2 bg-[#faf7f0] border border-[#cfc5b4] p-2">
                  <div class="text-[10px] font-bold uppercase text-[#565145] mb-1">
                    MANIFEST PRODUCTS (${grp.items.length} ITEMS):
                  </div>
                  <div class="space-y-1">
                    ${grp.items.map(it => {
                      const isIncoming = grp.type === 'RECEIPT' || it.qty > 0;
                      const sign = isIncoming ? '+' : '–';
                      const colorClass = isIncoming ? 'text-[#536443] bg-[#d3e6bd]/20' : 'text-[#b84328] bg-[#ffdad2]/30';

                      return `
                        <div class="flex items-center justify-between p-1 bg-white border border-[#cfc5b4]/50 text-xs">
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-[#b84328]">${it.sku}</span>
                            <span class="font-body text-xs text-[#262421] truncate max-w-sm">${it.name}</span>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 font-bold font-mono text-xs border ${colorClass}">
                              ${sign}${Math.abs(it.qty)} ${it.uom || 'units'}
                            </span>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 2. Kanban Board View (P1.11)
  function renderKanbanView() {
    const filtered = getFilteredMovements();
    const columns = [
      { id: 'DRAFT', label: 'DRAFT (STAGED)', color: 'border-[#565145] bg-[#efe9dc]' },
      { id: 'WAITING', label: 'WAITING (IN QUEUE)', color: 'border-[#cfc5b4] bg-[#faf7f0]' },
      { id: 'READY', label: 'READY (STAGED FOR DOCK)', color: 'border-[#b84328] bg-[#ffdad2]/30' },
      { id: 'DONE', label: 'DONE (POSTED TO LEDGER)', color: 'border-[#536443] bg-[#d3e6bd]/30' },
      { id: 'CANCELED', label: 'CANCELED', color: 'border-[#ba1a1a] bg-[#ffdad6]' }
    ];

    return `
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
        ${columns.map(col => {
          const colMovements = filtered.filter(m => (m.status || 'WAITING') === col.id);

          return `
            <div class="bg-white border-2 border-[#cfc5b4] flex flex-col shadow-kraft">
              <div class="p-2.5 border-b-2 border-dashed border-[#cfc5b4] ${col.color} flex items-center justify-between font-bold">
                <span class="text-[11px] uppercase">${col.label}</span>
                <span class="px-1.5 py-0.5 bg-white border border-[#cfc5b4] text-[10px]">
                  ${colMovements.length}
                </span>
              </div>

              <div class="p-2 flex-1 space-y-2 min-h-[400px] overflow-y-auto bg-[#faf7f0]">
                ${colMovements.length === 0 ? `
                  <div class="p-4 text-center text-[#8c716b] text-[11px]">
                    No orders in this state
                  </div>
                ` : colMovements.map(m => `
                  <div class="p-3 bg-white border border-[#cfc5b4] hover:border-[#b84328] transition-colors cursor-pointer shadow-sm btn-open-detail" data-id="${m.id}">
                    <div class="flex items-center justify-between pb-1 border-b border-dashed border-[#cfc5b4]/60">
                      <strong class="text-[#b84328]">${m.reference || m.id}</strong>
                      <span class="text-[9px] font-bold uppercase px-1 border ${
                        m.type === 'RECEIPT' ? 'text-[#536443] border-[#536443]/40' : 'text-[#b84328] border-[#b84328]/40'
                      }">${m.type}</span>
                    </div>

                    <div class="my-1.5">
                      <div class="font-bold text-[#262421] text-xs">${m.sku}</div>
                      <div class="font-body text-[11px] text-[#565145] truncate">${m.productName}</div>
                    </div>

                    <div class="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-[#cfc5b4]/60">
                      <span class="font-bold ${m.qty < 0 ? 'text-[#b84328]' : 'text-[#536443]'}">
                        ${m.qty > 0 ? '+' : ''}${m.qty} ${m.unit || 'units'}
                      </span>
                      <span class="text-[10px] text-[#8c716b]">${m.scheduledDate || m.timestamp.substring(5, 10)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function attachEvents() {
    // View Toggle
    container.querySelector('#toggle-view-list')?.addEventListener('click', () => {
      viewMode = 'list';
      render();
    });

    container.querySelector('#toggle-view-kanban')?.addEventListener('click', () => {
      viewMode = 'kanban';
      render();
    });

    // Operation Type Buttons
    container.querySelectorAll('.op-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentOpFilter = btn.getAttribute('data-type') || 'ALL';
        render();
      });
    });

    // Product Filter Dropdown
    const prodFilter = container.querySelector('#op-product-filter');
    if (prodFilter) {
      prodFilter.addEventListener('change', () => {
        currentProductFilter = prodFilter.value;
        render();
      });
    }

    // Detail Modal Openers
    container.querySelectorAll('.btn-open-detail').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.getAttribute('data-id');
        if (id) {
          window.dispatchEvent(new CustomEvent('open-movement-detail', { detail: { id } }));
        }
      });
    });

    // Quick Action Buttons
    container.querySelector('#btn-new-movement')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-adjust-stock'));
    });

    container.querySelector('#btn-empty-log-movement')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-adjust-stock'));
    });

    container.querySelector('#btn-quick-receipt')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { forcedType: 'RECEIPT' } }));
    });

    container.querySelector('#btn-quick-dispatch')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { forcedType: 'DISPATCH' } }));
    });

    container.querySelector('#btn-quick-transfer')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-transfer-stock'));
    });
  }

  render();
}
