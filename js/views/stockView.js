// StockSense Dedicated Editable Stock Screen (P1.8)
import { store } from '../store.js';
import { CATEGORIES } from '../data.js';
import { showToast } from '../modals.js';

export function renderStockView(container) {
  const products = store.getProducts();
  const locations = store.getLocations();

  container.innerHTML = `
    <div class="flex flex-col w-full p-4 lg:p-6 space-y-4 font-body text-[#262421]">
      <!-- Header / Telemetry Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf7f0] p-4 border border-[#cfc5b4] shadow-kraft">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-[#536443]"></span>
            <h1 class="font-mono text-2xl font-bold uppercase tracking-tight text-[#262421]">
              ON-HAND STOCK &amp; ALLOCATION RECONCILIATION
            </h1>
          </div>
          <p class="font-mono text-xs text-[#565145] mt-1 uppercase">
            DIRECT INLINE ON-HAND AUDITING • FREE-TO-USE BUFFER • MULTI-BAY INVENTORY BREAKDOWN
          </p>
        </div>

        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="px-2.5 py-1 bg-white border border-[#cfc5b4] text-[#536443] font-bold">
            ⚡ INLINE EDITING ACTIVE
          </span>
          <button id="btn-quick-trf" class="flex items-center gap-1 px-3 py-1.5 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase transition-colors shadow-kraft-dark cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
            <span>TRANSFER STOCK</span>
          </button>
        </div>
      </div>

      <!-- Quick Search & Category Filter -->
      <div class="bg-[#faf7f0] border border-[#cfc5b4] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-kraft">
        <div class="relative flex-1">
          <span class="absolute left-3 top-2.5 font-mono text-[#b84328] font-bold">_</span>
          <input id="stockSearchInput" type="text" placeholder="FILTER PRODUCTS BY SKU, NAME, OR LOCATION..."
            class="w-full bg-white border border-[#cfc5b4] text-[#262421] font-mono text-xs pl-7 pr-4 py-2 placeholder:text-[#565145]/60 focus:outline-none focus:border-[#b84328] shadow-inner" />
        </div>

        <div class="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span class="text-[#565145] font-bold uppercase">CATEGORY:</span>
          <button class="stock-cat-btn px-2.5 py-1 bg-[#b84328] text-white border border-[#b84328] font-bold uppercase cursor-pointer" data-cat="ALL">
            ALL
          </button>
          ${CATEGORIES.map(c => `
            <button class="stock-cat-btn px-2.5 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-bold uppercase cursor-pointer transition-colors" data-cat="${c}">
              ${c}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Editable Stock Ledger Table or Empty State -->
      ${products.length === 0 ? `
        <div class="py-16 px-6 flex flex-col items-center justify-center text-center bg-white border border-[#cfc5b4] shadow-kraft">
          <div class="w-16 h-16 border-2 border-dashed border-[#b84328]/60 bg-[#efe9dc] flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-[#b84328] text-[32px]">inventory_2</span>
          </div>
          <div class="font-mono text-xl uppercase tracking-wider text-[#262421] mb-2 font-bold">NO INVENTORY RECORDS IN LEDGER</div>
          <p class="font-body text-xs text-[#565145] max-w-md mb-5 leading-relaxed">
            No inventory units recorded in catalog. Add products to populate this on-hand stock ledger.
          </p>
          <a href="#products" class="px-5 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-kraft-dark">
            GO TO PRODUCTS CATALOG
          </a>
        </div>
      ` : `
        <div class="bg-[#faf7f0] border border-[#cfc5b4] relative overflow-hidden shadow-kraft">
          <div class="px-4 py-2.5 bg-[#efe9dc] border-b border-dashed border-[#cfc5b4] flex items-center justify-between font-mono text-xs text-[#565145]">
            <div class="flex items-center gap-3">
              <span>RULE: <strong class="text-[#262421]">FREE TO USE = ON HAND - RESERVED DELIVERIES</strong></span>
              <span>•</span>
              <span>PRESS <strong class="text-[#b84328]">[ENTER]</strong> OR BLUR TO POST INLINE EDITS</span>
            </div>
            <span class="font-bold text-[#536443]">AUDIT STAMP: REAL-TIME</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr class="border-b border-[#cfc5b4] bg-[#faf7f0] text-[#565145]">
                  <th class="py-2.5 px-4 font-bold uppercase">SKU / ITEM DESIGNATION</th>
                  <th class="py-2.5 px-4 font-bold uppercase">CATEGORY</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-right">UNIT COST</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-center bg-[#efe9dc]/50">ON HAND (INLINE EDIT)</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-right">RESERVED</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-right">FREE TO USE</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-center">LOCATIONS BREAKDOWN</th>
                  <th class="py-2.5 px-4 font-bold uppercase text-right">ACTION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#cfc5b4]/50" id="stock-table-body">
                ${products.map(p => {
                  const freeToUse = store.getProductFreeToUse(p.sku);
                const reserved = Math.max(0, p.stock - freeToUse);
                const locEntries = Object.entries(p.locations || {});
                const primaryLoc = locEntries[0] ? locEntries[0][0] : "LOC-WH1-A";

                return `
                  <tr class="hover:bg-[#faf7f0] transition-colors stock-row" data-sku="${p.sku.toLowerCase()}" data-name="${p.name.toLowerCase()}" data-cat="${p.category}">
                    <td class="py-3 px-4">
                      <div class="font-bold text-[#b84328]">${p.sku}</div>
                      <div class="font-body text-xs text-[#262421] font-medium truncate max-w-xs">${p.name}</div>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="px-2 py-0.5 bg-white border border-[#cfc5b4] text-[10px] font-bold uppercase text-[#565145]">
                        ${p.category}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap font-bold text-[#262421]">
                      $${p.unitCost.toFixed(2)}
                    </td>
                    <td class="py-3 px-4 text-center whitespace-nowrap bg-[#efe9dc]/20">
                      <div class="inline-flex items-center gap-1.5">
                        <input type="number" min="0" value="${p.stock}" 
                          class="inline-stock-input w-20 text-center bg-white border border-[#cfc5b4] focus:border-[#b84328] focus:bg-[#faf7f0] py-1 font-bold text-sm text-[#262421] rounded-none shadow-inner"
                          data-sku="${p.sku}" data-loc="${primaryLoc}" data-uom="${p.uom || 'units'}" />
                        <span class="text-[10px] text-[#565145] font-bold uppercase">${p.uom || 'units'}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <span class="font-bold ${reserved > 0 ? 'text-[#b84328]' : 'text-[#8c716b]'}">
                        ${reserved} ${p.uom || 'units'}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <span class="px-2 py-0.5 text-xs font-bold border ${
                        freeToUse > (p.safetyThreshold || 10) ? 'border-[#536443]/40 bg-[#d3e6bd]/20 text-[#536443]' :
                        freeToUse > 0 ? 'border-[#b84328]/40 bg-[#ffdad2]/30 text-[#b84328]' :
                        'border-[#ba1a1a]/40 bg-[#ffdad6] text-[#ba1a1a]'
                      }">
                        ${freeToUse} ${p.uom || 'units'}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center whitespace-nowrap">
                      <button class="btn-toggle-locs px-2 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[10px] font-bold uppercase cursor-pointer" data-sku="${p.sku}">
                        ${locEntries.length} BAYS ▼
                      </button>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <button class="btn-trf-row px-2.5 py-1 bg-[#536443] hover:bg-[#3b4c2d] text-white text-[10px] font-bold uppercase cursor-pointer shadow-kraft" data-sku="${p.sku}">
                        TRANSFER
                      </button>
                    </td>
                  </tr>

                  <!-- Expandable Location Breakdown Row -->
                  <tr id="loc-row-${p.sku}" class="hidden bg-[#efe9dc]/50 border-b border-[#cfc5b4]/60">
                    <td colspan="8" class="p-3">
                      <div class="p-3 bg-white border border-dashed border-[#cfc5b4]">
                        <div class="text-[11px] font-bold uppercase text-[#565145] mb-2 flex items-center justify-between">
                          <span>BAY BREAKDOWN FOR ${p.sku}:</span>
                          <span class="text-[#536443]">DIRECT PER-LOCATION CORRECTION:</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          ${locations.map(loc => {
                            const curLocStock = p.locations?.[loc.id] || 0;
                            return `
                              <div class="p-2 border border-[#cfc5b4] bg-[#faf7f0] flex items-center justify-between">
                                <div>
                                  <div class="font-bold text-[#262421] text-[11px]">${loc.name}</div>
                                  <div class="text-[10px] text-[#565145]">${loc.warehouseId} [${loc.shortCode}]</div>
                                </div>
                                <div class="flex items-center gap-1">
                                  <input type="number" min="0" value="${curLocStock}" 
                                    class="subloc-stock-input w-16 text-center bg-white border border-[#cfc5b4] p-1 font-bold text-xs"
                                    data-sku="${p.sku}" data-loc="${loc.id}" />
                                  <span class="text-[10px] text-[#565145]">${p.uom || 'units'}</span>
                                </div>
                              </div>
                            `;
                          }).join('')}
                        </div>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `}
  </div>
`;

  // Attach event handlers
  const searchInput = container.querySelector('#stockSearchInput');
  const catBtns = container.querySelectorAll('.stock-cat-btn');

  let currentCat = 'ALL';

  function filterStock() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    container.querySelectorAll('.stock-row').forEach(row => {
      const sku = row.getAttribute('data-sku') || '';
      const name = row.getAttribute('data-name') || '';
      const cat = row.getAttribute('data-cat') || '';

      const matchCat = (currentCat === 'ALL' || cat === currentCat);
      const matchSearch = (!q || sku.includes(q) || name.includes(q));

      row.style.display = (matchCat && matchSearch) ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', filterStock);

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => {
        b.className = "stock-cat-btn px-2.5 py-1 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-bold uppercase cursor-pointer transition-colors";
      });
      btn.className = "stock-cat-btn px-2.5 py-1 bg-[#b84328] text-white border border-[#b84328] font-bold uppercase cursor-pointer";
      currentCat = btn.getAttribute('data-cat') || 'ALL';
      filterStock();
    });
  });

  // Inline Stock Edit on primary location input
  container.querySelectorAll('.inline-stock-input').forEach(input => {
    const handleSave = () => {
      const sku = input.getAttribute('data-sku');
      const locId = input.getAttribute('data-loc');
      const uom = input.getAttribute('data-uom');
      const newQty = parseInt(input.value, 10);

      if (isNaN(newQty) || newQty < 0) {
        showToast('Please enter a valid stock quantity (>= 0).', 'error');
        return;
      }

      store.setProductLocationStock(sku, locId, newQty);
      showToast(`Stock for ${sku} updated to ${newQty} ${uom}.`, 'success');
      renderStockView(container);
    };

    input.addEventListener('change', handleSave);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  });

  // Sub-location Stock Edit
  container.querySelectorAll('.subloc-stock-input').forEach(input => {
    input.addEventListener('change', () => {
      const sku = input.getAttribute('data-sku');
      const locId = input.getAttribute('data-loc');
      const newQty = parseInt(input.value, 10);
      if (isNaN(newQty) || newQty < 0) return;

      store.setProductLocationStock(sku, locId, newQty);
      showToast(`Location stock updated for ${sku}.`, 'success');
      renderStockView(container);
    });
  });

  // Toggle location breakdown rows
  container.querySelectorAll('.btn-toggle-locs').forEach(btn => {
    btn.addEventListener('click', () => {
      const sku = btn.getAttribute('data-sku');
      const locRow = container.querySelector(`#loc-row-${sku}`);
      if (locRow) locRow.classList.toggle('hidden');
    });
  });

  // Transfer buttons
  container.querySelector('#btn-quick-trf')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-transfer-stock'));
  });

  container.querySelectorAll('.btn-trf-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const sku = btn.getAttribute('data-sku');
      window.dispatchEvent(new CustomEvent('open-transfer-stock', { detail: { sku } }));
    });
  });
}
