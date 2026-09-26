// StockSense Dedicated Operations & Dispatch View
import { store } from '../store.js';

export function renderOperationsView(container) {
  const allMovements = store.getMovements();
  const user = store.state.user || { zone: "WH-01", terminal: "TRM-9842-DX" };

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

        <button id="btn-new-movement" class="flex items-center gap-1.5 px-4 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-mono text-xs font-bold uppercase transition-colors shadow-kraft-dark cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span>+ LOG STOCK MOVEMENT</span>
        </button>
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

      <!-- Telemetry Movements Ledger -->
      <div class="bg-white border-2 border-[#cfc5b4] relative overflow-hidden shadow-kraft">
        <div class="px-5 py-3 bg-[#efe9dc] border-b-2 border-dashed border-[#cfc5b4] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-[#b84328]">receipt_long</span>
            <span class="font-mono text-sm uppercase tracking-wider text-[#262421] font-bold">
              HISTORICAL TELEMETRY LOG (${allMovements.length} RECORDS)
            </span>
          </div>
          <span class="font-mono text-xs text-[#565145]">LEDGER: IMMUTABLE AUDIT LOG</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr class="border-b border-[#cfc5b4] bg-[#faf7f0] text-[#565145]">
                <th class="py-2.5 px-4 font-bold uppercase">ENTRY ID</th>
                <th class="py-2.5 px-4 font-bold uppercase">TIMESTAMP</th>
                <th class="py-2.5 px-4 font-bold uppercase">TYPE</th>
                <th class="py-2.5 px-4 font-bold uppercase">SKU / ITEM</th>
                <th class="py-2.5 px-4 font-bold uppercase text-right">QUANTITY</th>
                <th class="py-2.5 px-4 font-bold uppercase">ROUTING</th>
                <th class="py-2.5 px-4 font-bold uppercase">OPERATOR</th>
                <th class="py-2.5 px-4 font-bold uppercase text-center">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#cfc5b4]/50">
              ${allMovements.map(m => `
                <tr class="hover:bg-[#faf7f0] transition-colors">
                  <td class="py-3 px-4 font-bold text-[#b84328]">${m.id}</td>
                  <td class="py-3 px-4 text-[#565145]">${m.timestamp}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 border text-[10px] font-bold uppercase ${
                      m.type === 'RECEIPT' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                      m.type === 'DISPATCH' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
                      'text-[#565145] border-[#cfc5b4] bg-[#efe9dc]'
                    }">
                      ${m.type}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-[#262421]">${m.sku}</div>
                    <div class="text-[11px] text-[#565145] font-body truncate max-w-xs">${m.productName}</div>
                  </td>
                  <td class="py-3 px-4 text-right font-bold text-sm ${m.qty < 0 ? 'text-[#b84328]' : 'text-[#262421]'}">
                    ${m.qty > 0 ? '+' : ''}${m.qty} ${m.unit}
                  </td>
                  <td class="py-3 px-4 text-[11px]">
                    <div>${m.source}</div>
                    <div class="text-[#536443] font-bold">➔ ${m.destination}</div>
                  </td>
                  <td class="py-3 px-4 text-[11px] text-[#565145]">${m.operator}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      m.status === 'DONE' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/20' :
                      m.status === 'READY' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
                      'text-[#8c716b] border-[#cfc5b4] bg-white'
                    }">
                      ${m.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Attach quick modal triggers
  container.querySelector('#btn-new-movement')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-adjust-stock'));
  });

  container.querySelector('#btn-quick-receipt')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { forcedType: 'RECEIPT' } }));
  });

  container.querySelector('#btn-quick-dispatch')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { forcedType: 'DISPATCH' } }));
  });

  container.querySelector('#btn-quick-transfer')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-adjust-stock', { detail: { forcedType: 'TRANSFER' } }));
  });
}
