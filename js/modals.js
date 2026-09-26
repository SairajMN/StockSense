// StockSense Interactive Kraft Ledger Modals
import { store } from '../store.js';
import { CATEGORIES, ZONES } from '../data.js';

let activeModal = null;

export function closeModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

// 1. Add Product Modal
export function openAddProductModal() {
  closeModal();

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs overflow-y-auto max-h-[90vh]">
      <!-- Ticket Notches -->
      <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -top-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>

      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#b84328] text-[20px]">add_box</span>
          <span class="font-bold text-sm text-[#262421] uppercase">REGISTER NEW SKU // INTAKE MANIFEST</span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <form id="add-prod-form" class="space-y-4">
        <!-- SKU & Category -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SKU IDENTIFIER:</label>
            <input type="text" id="inp-sku" placeholder="AUTO-GENERATED IF EMPTY"
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">CATEGORY:</label>
            <select id="inp-cat" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Product Name -->
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">ITEM DESIGNATION / NAME:</label>
          <input type="text" id="inp-name" required placeholder="e.g. Industrial Hydraulic Solenoid Valve 24V"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
        </div>

        <!-- Technical Spec -->
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">TECHNICAL SPECIFICATIONS / DIMENSIONS:</label>
          <input type="text" id="inp-spec" placeholder="e.g. 3/8 NPT / 350 Bar Max / IP65 Waterproof Coil"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
        </div>

        <!-- Zone & Bin -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">DEPOT SECTOR ZONE:</label>
            <select id="inp-zone" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              ${ZONES.map(z => `<option value="${z.id}">${z.id}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SHELF BAY / BIN CODE:</label>
            <input type="text" id="inp-bin" value="BAY-01-A"
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <!-- Stock, Min Threshold, Unit Cost -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">INITIAL STOCK QTY:</label>
            <input type="number" id="inp-stock" min="0" value="50" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SAFETY MIN THRESHOLD:</label>
            <input type="number" id="inp-threshold" min="1" value="15" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">UNIT VALUATION ($):</label>
            <input type="number" id="inp-cost" step="0.01" min="0" value="45.00" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <div class="text-[11px] text-[#565145]">
            STATUS: <strong class="text-[#536443]">VERIFIED DOCK INTAKE</strong>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-cancel" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer hover:bg-[#ebe5d8]">
              CANCEL
            </button>
            <button type="submit" class="px-6 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
              REGISTER &amp; STAMP SKU
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel').addEventListener('click', closeModal);

  modal.querySelector('#add-prod-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
      sku: modal.querySelector('#inp-sku').value.trim() || undefined,
      category: modal.querySelector('#inp-cat').value,
      name: modal.querySelector('#inp-name').value.trim(),
      spec: modal.querySelector('#inp-spec').value.trim(),
      zone: modal.querySelector('#inp-zone').value,
      bin: modal.querySelector('#inp-bin').value.trim(),
      stock: modal.querySelector('#inp-stock').value,
      safetyThreshold: modal.querySelector('#inp-threshold').value,
      unitCost: modal.querySelector('#inp-cost').value
    };

    store.addProduct(product);
    closeModal();
    window.location.hash = '#products';
  });
}

// 2. Adjust Stock / Movement Modal
export function openAdjustStockModal(options = {}) {
  closeModal();

  const prods = store.getProducts();
  if (prods.length === 0) {
    alert('Please add at least one product before logging stock movements.');
    openAddProductModal();
    return;
  }

  const defaultSku = options.sku || prods[0].sku;
  const defaultType = options.forcedType || 'RECEIPT';

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs">
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#536443] text-[20px]">sync_alt</span>
          <span class="font-bold text-sm text-[#262421] uppercase">DISPATCH TELEMETRY // STOCK MOVEMENT</span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <form id="adjust-stock-form" class="space-y-4">
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">SELECT TARGET ITEM / SKU:</label>
          <select id="adj-sku" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            ${prods.map(p => `
              <option value="${p.sku}" ${p.sku === defaultSku ? 'selected' : ''}>
                ${p.sku} — ${p.name.substring(0, 32)} (Current: ${p.stock} units)
              </option>
            `).join('')}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">OPERATION TYPE:</label>
            <select id="adj-type" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              <option value="RECEIPT" ${defaultType === 'RECEIPT' ? 'selected' : ''}>INBOUND RECEIPT (+)</option>
              <option value="DISPATCH" ${defaultType === 'DISPATCH' ? 'selected' : ''}>OUTBOUND DISPATCH (-)</option>
              <option value="TRANSFER" ${defaultType === 'TRANSFER' ? 'selected' : ''}>CROSS-BAY TRANSFER</option>
              <option value="ADJUST" ${defaultType === 'ADJUST' ? 'selected' : ''}>AUDIT ADJUSTMENT (+/-)</option>
            </select>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">QUANTITY:</label>
            <input type="number" id="adj-qty" min="1" value="10" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">ORIGIN / SOURCE:</label>
            <input type="text" id="adj-source" value="INBOUND DOCK 01" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">DESTINATION:</label>
            <input type="text" id="adj-dest" value="WH-01 [BAY-01-A]" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">ASSIGNED CARRIER / OPERATOR:</label>
          <input type="text" id="adj-carrier" value="FORKLIFT RUNNER 04"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <span class="text-[11px] text-[#565145]">LEDGER: <strong class="text-[#b84328]">IMMEDIATE SYNC</strong></span>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-cancel-adj" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer">
              CANCEL
            </button>
            <button type="submit" class="px-6 py-2 bg-[#536443] hover:bg-[#3b4c2d] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
              DISPATCH &amp; LOG TELEMETRY
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel-adj').addEventListener('click', closeModal);

  modal.querySelector('#adjust-stock-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sku = modal.querySelector('#adj-sku').value;
    const type = modal.querySelector('#adj-type').value;
    const qty = parseInt(modal.querySelector('#adj-qty').value, 10);
    const source = modal.querySelector('#adj-source').value;
    const dest = modal.querySelector('#adj-dest').value;
    const carrier = modal.querySelector('#adj-carrier').value;

    const prod = store.getProductBySku(sku);
    if (!prod) return;

    // Calculate signed quantity for stock change
    let signedQty = qty;
    if (type === 'DISPATCH') {
      signedQty = -Math.abs(qty);
    } else if (type === 'RECEIPT') {
      signedQty = Math.abs(qty);
    }

    if (type !== 'TRANSFER') {
      store.updateProductStock(sku, signedQty);
    }

    store.addMovement({
      type,
      sku,
      productName: prod.name,
      qty: signedQty,
      unit: "UNITS",
      source,
      destination: dest,
      carrier,
      status: "DONE"
    });

    closeModal();
    window.location.hash = '#operations';
  });
}

// 3. Cycle Count Modal
export function openCycleCountModal() {
  closeModal();

  const prods = store.getProducts();
  if (prods.length === 0) {
    alert('Catalog is currently empty. Add products before performing a cycle count.');
    return;
  }

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs">
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#b84328] text-[20px]">fact_check</span>
          <span class="font-bold text-sm text-[#262421] uppercase">PHYSICAL CYCLE COUNT RECONCILIATION</span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">AUDIT TARGET ITEM:</label>
          <select id="cycle-sku" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            ${prods.map(p => `
              <option value="${p.sku}" data-stock="${p.stock}">
                ${p.sku} — ${p.name.substring(0, 32)} (Ledger: ${p.stock})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="p-3 bg-[#faf7f0] border border-[#cfc5b4] flex items-center justify-between">
          <span class="font-bold text-[#565145]">CURRENT SYSTEM RECORD:</span>
          <span id="cycle-current-val" class="font-bold text-base text-[#262421]">${prods[0].stock} UNITS</span>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">ACTUAL PHYSICAL COUNT VERIFIED:</label>
          <input type="number" id="cycle-actual-qty" min="0" value="${prods[0].stock}" required
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold text-base focus:border-[#b84328] focus:outline-none" />
        </div>

        <div id="cycle-diff-box" class="p-3 border text-center font-bold">
          DISCREPANCY: <span id="cycle-diff-val" class="text-[#536443]">0 UNITS (BALANCED)</span>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <span class="text-[11px] text-[#565145]">AUDIT ID: <strong class="text-[#262421]">CC-2026-X</strong></span>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-cancel-cycle" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer">
              CANCEL
            </button>
            <button id="btn-reconcile" class="px-6 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
              RECONCILE &amp; STAMP
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  const skuSelect = modal.querySelector('#cycle-sku');
  const currentVal = modal.querySelector('#cycle-current-val');
  const actualInput = modal.querySelector('#cycle-actual-qty');
  const diffBox = modal.querySelector('#cycle-diff-box');
  const diffVal = modal.querySelector('#cycle-diff-val');

  function updateDiscrepancy() {
    const selectedOption = skuSelect.options[skuSelect.selectedIndex];
    const systemStock = parseInt(selectedOption.getAttribute('data-stock'), 10) || 0;
    const actualStock = parseInt(actualInput.value, 10) || 0;
    const diff = actualStock - systemStock;

    currentVal.textContent = `${systemStock} UNITS`;

    if (diff === 0) {
      diffBox.className = "p-3 border border-[#536443]/40 bg-[#d3e6bd]/20 text-center font-bold text-[#536443]";
      diffVal.textContent = "0 UNITS (BALANCED)";
    } else if (diff > 0) {
      diffBox.className = "p-3 border border-[#536443]/40 bg-[#d3e6bd]/30 text-center font-bold text-[#536443]";
      diffVal.textContent = `+${diff} UNITS (SURPLUS FOUND)`;
    } else {
      diffBox.className = "p-3 border border-[#b84328]/40 bg-[#ffdad2]/40 text-center font-bold text-[#b84328]";
      diffVal.textContent = `${diff} UNITS (DEFICIT / SHORTAGE)`;
    }
  }

  skuSelect.addEventListener('change', () => {
    const selectedOption = skuSelect.options[skuSelect.selectedIndex];
    actualInput.value = selectedOption.getAttribute('data-stock');
    updateDiscrepancy();
  });

  actualInput.addEventListener('input', updateDiscrepancy);
  updateDiscrepancy();

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel-cycle').addEventListener('click', closeModal);

  modal.querySelector('#btn-reconcile').addEventListener('click', () => {
    const sku = skuSelect.value;
    const selectedOption = skuSelect.options[skuSelect.selectedIndex];
    const systemStock = parseInt(selectedOption.getAttribute('data-stock'), 10) || 0;
    const actualStock = parseInt(actualInput.value, 10) || 0;
    const diff = actualStock - systemStock;

    const prod = store.getProductBySku(sku);
    if (!prod) return;

    if (diff !== 0) {
      store.updateProductStock(sku, diff);
      store.addMovement({
        type: "ADJUST",
        sku,
        productName: prod.name,
        qty: diff,
        unit: "UNITS",
        source: `CYCLE COUNT AUDIT [PREV: ${systemStock}]`,
        destination: `LEDGER RECONCILED [NEW: ${actualStock}]`,
        carrier: "CHIEF AUDITOR",
        status: "DONE"
      });
    }

    closeModal();
    alert(`Cycle count for ${sku} recorded. Discrepancy reconciled: ${diff >= 0 ? '+' : ''}${diff} units.`);
    window.location.hash = '#dashboard';
  });
}

// 4. Operator Profile Modal
export function openProfileModal() {
  closeModal();

  const user = store.state.user || {
    name: "MARCUS VANCE",
    email: "marcus.vance@stocksense.io",
    badgeId: "OP-4982",
    zone: "WH-01",
    secLevel: "SEC_LVL_04",
    terminal: "TRM-9842-DX",
    role: "CHIEF OPERATIONS CONTROLLER"
  };

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-md bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs">
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <span class="font-bold text-sm text-[#262421] uppercase">OPERATOR CREDENTIALS // BADGE</span>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <!-- Operator ID Card Replica -->
      <div class="p-4 bg-[#faf7f0] border border-[#cfc5b4] relative overflow-hidden shadow-kraft mb-4">
        <div class="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
          <span class="material-symbols-outlined text-[120px]">badge</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-[#b84328] text-white flex items-center justify-center font-bold text-lg border border-[#cfc5b4]">
            ${user.name.substring(0, 2)}
          </div>
          <div>
            <div class="font-bold text-sm text-[#262421] uppercase">${user.name}</div>
            <div class="text-[11px] text-[#536443] font-bold">${user.role}</div>
            <div class="text-[10px] text-[#8c716b]">${user.email}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-dashed border-[#cfc5b4]">
          <div>BADGE ID: <strong class="text-[#262421]">${user.badgeId}</strong></div>
          <div>CLEARANCE: <strong class="text-[#536443]">${user.secLevel}</strong></div>
          <div>DEPOT ZONE: <strong class="text-[#262421]">${user.zone}</strong></div>
          <div>ACTIVE SHIFT: <strong class="text-[#262421]">ALPHA-02</strong></div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-2">
        <button id="btn-logout" class="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white border border-[#ba1a1a]/40 font-bold uppercase transition-colors cursor-pointer">
          LOG OUT OF TERMINAL
        </button>
        <button id="btn-close-prof" class="px-5 py-2 bg-[#efe9dc] text-[#262421] font-bold uppercase cursor-pointer hover:bg-[#ebe5d8]">
          DISMISS
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#btn-close-prof').addEventListener('click', closeModal);
  modal.querySelector('#btn-logout').addEventListener('click', () => {
    store.logout();
    closeModal();
    window.location.hash = '#auth';
  });
}
