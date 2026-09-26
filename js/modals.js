// StockSense Interactive Kraft Ledger Modals
import { store } from './store.js';
import { CATEGORIES, WAREHOUSES, LOCATIONS, UOM_OPTIONS } from './data.js';

let activeModal = null;

export function closeModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

// In-App Kraft Ledger Toast Notification (P2.11)
export function showToast(message, type = 'info') {
  const existing = document.getElementById('stocksense-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'stocksense-toast';
  const borderColor = type === 'error' ? 'border-[#ba1a1a] text-[#ba1a1a] bg-[#ffdad6]' :
                      type === 'success' ? 'border-[#536443] text-[#536443] bg-[#d3e6bd]/40' :
                      'border-[#b84328] text-[#b84328] bg-[#faf7f0]';

  toast.className = `fixed bottom-6 right-6 z-50 p-4 border-2 font-mono text-xs shadow-2xl flex items-center gap-3 animate-bounce transition-all ${borderColor}`;
  toast.innerHTML = `
    <span class="rubber-stamp text-[11px] px-2 py-0.5 border">
      ${type === 'error' ? 'DISPATCH ALERT' : type === 'success' ? 'SYSTEM VERIFIED' : 'TELEMETRY'}
    </span>
    <span class="font-bold uppercase tracking-wider">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-[#262421] hover:text-[#b84328] font-bold text-sm ml-2 cursor-pointer">✕</button>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4500);
}

// In-App Kraft Ledger Confirmation Modal (P2.11)
export function showConfirmModal({ title = 'CONFIRM ACTION', message, confirmText = 'CONFIRM', cancelText = 'CANCEL', onConfirm, onCancel }) {
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-md bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs animate-fadeIn">
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="rubber-stamp text-[10px] px-1.5 py-0.5 border border-[#b84328] text-[#b84328] font-bold">CONFIRMATION</span>
          <span class="font-bold text-sm text-[#262421] uppercase">${title}</span>
        </div>
        <button id="confirm-modal-close" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <div class="p-4 bg-[#faf7f0] border border-[#cfc5b4] mb-5 text-[#262421] leading-relaxed font-bold">
        ${message}
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-dashed border-[#cfc5b4]">
        <button type="button" id="confirm-modal-cancel" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer hover:bg-[#e4ddce]">
          ${cancelText}
        </button>
        <button type="button" id="confirm-modal-ok" class="px-5 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const cleanup = () => {
    modal.remove();
  };

  modal.querySelector('#confirm-modal-close').addEventListener('click', () => {
    cleanup();
    if (onCancel) onCancel();
  });
  modal.querySelector('#confirm-modal-cancel').addEventListener('click', () => {
    cleanup();
    if (onCancel) onCancel();
  });
  modal.querySelector('#confirm-modal-ok').addEventListener('click', () => {
    cleanup();
    if (onConfirm) onConfirm();
  });
}

// 1. Add / Edit Product Modal (P0.3, P1.4)
export function openAddProductModal(editProduct = null) {
  closeModal();

  const isEdit = Boolean(editProduct);
  const locations = store.getLocations();
  const prod = editProduct || {
    sku: "",
    name: "",
    category: CATEGORIES[0],
    spec: "",
    zone: store.state.currentZone || "WH-01",
    bin: "BAY-01-A",
    uom: "units",
    stock: 50,
    safetyThreshold: 15,
    unitCost: 45.00,
    locationId: locations[0]?.id || "LOC-WH1-A"
  };

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs overflow-y-auto max-h-[90vh]">
      <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -top-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>

      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#b84328] text-[20px]">
            ${isEdit ? 'edit_note' : 'add_box'}
          </span>
          <span class="font-bold text-sm text-[#262421] uppercase">
            ${isEdit ? `EDIT SKU SPECIFICATION // ${prod.sku}` : 'REGISTER NEW SKU // INTAKE MANIFEST'}
          </span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <form id="prod-form" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SKU IDENTIFIER:</label>
            <input type="text" id="inp-sku" value="${prod.sku}" ${isEdit ? 'readonly' : ''} placeholder="AUTO-GENERATED IF EMPTY"
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none ${isEdit ? 'opacity-80 cursor-not-allowed' : ''}" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">CATEGORY:</label>
            <select id="inp-cat" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              ${CATEGORIES.map(c => `<option value="${c}" ${prod.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">ITEM DESIGNATION / NAME:</label>
          <input type="text" id="inp-name" required value="${prod.name}" placeholder="e.g. Industrial Hydraulic Solenoid Valve 24V"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">TECHNICAL SPECIFICATIONS / NOTES:</label>
          <input type="text" id="inp-spec" value="${prod.spec || ''}" placeholder="e.g. 3/8 NPT / 350 Bar Max / IP65 Waterproof Coil"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">UNIT OF MEASURE (UOM):</label>
            <select id="inp-uom" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none uppercase">
              ${UOM_OPTIONS.map(u => `<option value="${u}" ${(prod.uom || 'units') === u ? 'selected' : ''}>${u.toUpperCase()}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">PRIMARY DEPOT ZONE:</label>
            <select id="inp-zone" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              ${WAREHOUSES.map(z => `<option value="${z.id}" ${prod.zone === z.id ? 'selected' : ''}>${z.id}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">PRIMARY LOCATION / BIN:</label>
            <select id="inp-loc-id" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              ${locations.map(l => `<option value="${l.id}" ${(prod.locationId === l.id || prod.bin === l.shortCode) ? 'selected' : ''}>${l.shortCode} (${l.warehouseId})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">${isEdit ? 'ON-HAND STOCK TOTAL:' : 'INITIAL INTAKE STOCK:'}</label>
            <input type="number" id="inp-stock" min="0" value="${prod.stock}" required ${isEdit ? 'readonly' : ''}
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none ${isEdit ? 'opacity-80 cursor-not-allowed' : ''}" />
            ${isEdit ? '<span class="text-[10px] text-[#8c716b]">Use Stock screen or Transfer to change qty</span>' : ''}
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SAFETY MIN THRESHOLD:</label>
            <input type="number" id="inp-threshold" min="1" value="${prod.safetyThreshold || 10}" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">UNIT VALUATION ($):</label>
            <input type="number" id="inp-cost" step="0.01" min="0" value="${prod.unitCost || 0.00}" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <div class="text-[11px] text-[#565145]">
            STATUS: <strong class="text-[#536443]">${isEdit ? 'RECORDED IN MASTER CATALOG' : 'VERIFIED DOCK INTAKE'}</strong>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" id="btn-cancel" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer hover:bg-[#ebe5d8]">
              CANCEL
            </button>
            <button type="submit" class="px-6 py-2 bg-[#b84328] hover:bg-[#972b12] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
              ${isEdit ? 'UPDATE SPECIFICATION &amp; STAMP' : 'REGISTER &amp; STAMP SKU'}
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

  modal.querySelector('#prod-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const locId = modal.querySelector('#inp-loc-id').value;
    const locObj = store.getLocationById(locId);

    const formData = {
      sku: modal.querySelector('#inp-sku').value.trim() || undefined,
      category: modal.querySelector('#inp-cat').value,
      name: modal.querySelector('#inp-name').value.trim(),
      spec: modal.querySelector('#inp-spec').value.trim(),
      uom: modal.querySelector('#inp-uom').value,
      zone: modal.querySelector('#inp-zone').value,
      bin: locObj ? locObj.shortCode : "BAY-01-A",
      locationId: locId,
      stock: Number(modal.querySelector('#inp-stock').value) || 0,
      safetyThreshold: Number(modal.querySelector('#inp-threshold').value) || 10,
      unitCost: Number(modal.querySelector('#inp-cost').value) || 0.00
    };

    if (isEdit) {
      store.updateProduct(prod.sku, {
        name: formData.name,
        category: formData.category,
        spec: formData.spec,
        uom: formData.uom,
        zone: formData.zone,
        bin: formData.bin,
        safetyThreshold: formData.safetyThreshold,
        unitCost: formData.unitCost
      });
      showToast(`SKU ${prod.sku} updated successfully.`, 'success');
    } else {
      store.addProduct(formData);
      showToast(`SKU ${formData.sku || 'ITEM'} registered in catalog.`, 'success');
    }

    closeModal();
    window.location.hash = '#products';
  });
}

// 2. Internal Transfers Modal (P0.1)
export function openTransferStockModal(options = {}) {
  closeModal();

  const prods = store.getProducts();
  if (prods.length === 0) {
    showToast('Catalog is currently empty. Add products before transferring.', 'error');
    openAddProductModal();
    return;
  }

  const defaultSku = options.sku || prods[0].sku;
  const locations = store.getLocations();

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs">
      <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#536443] font-bold">+</span>
      <span class="absolute -top-1.5 -right-1.5 text-[10px] font-mono text-[#536443] font-bold">+</span>
      <span class="absolute -bottom-1.5 -left-1.5 text-[10px] font-mono text-[#536443] font-bold">+</span>
      <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#536443] font-bold">+</span>

      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#536443] text-[22px]">swap_horiz</span>
          <span class="font-bold text-sm text-[#262421] uppercase">INTERNAL STOCK TRANSFER // DISPATCH</span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <form id="transfer-stock-form" class="space-y-4">
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">SELECT PRODUCT TO RELOCATE:</label>
          <select id="trf-sku" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            ${prods.map(p => `
              <option value="${p.sku}" ${p.sku === defaultSku ? 'selected' : ''}>
                ${p.sku} — ${p.name.substring(0, 32)} (Total: ${p.stock} ${p.uom || 'units'})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">SOURCE LOCATION (DECREMENT):</label>
            <select id="trf-source-loc" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              <!-- Dynamically populated -->
            </select>
            <div id="source-avail-note" class="text-[11px] text-[#536443] mt-1 font-bold"></div>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">DESTINATION LOCATION (INCREMENT):</label>
            <select id="trf-dest-loc" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
              <!-- Dynamically populated -->
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">TRANSFER QUANTITY (<span id="trf-uom-label">UNITS</span>):</label>
          <input type="number" id="trf-qty" min="1" value="1" required
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold text-base focus:border-[#b84328] focus:outline-none" />
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">TRANSFER REASON / CARRIER NOTES:</label>
          <input type="text" id="trf-notes" value="Internal bay rebalancing"
            class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
        </div>

        <div class="p-3 bg-[#faf7f0] border border-[#cfc5b4] flex items-center justify-between text-[11px]">
          <span class="text-[#565145]">LEDGER RULE: <strong>TOTAL COMPANY STOCK UNCHANGED</strong></span>
          <span class="px-2 py-0.5 bg-[#d3e6bd]/40 border border-[#536443]/40 text-[#536443] font-bold uppercase">
            IMMUTABLE AUDIT
          </span>
        </div>

        <div class="pt-3 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <button type="button" id="btn-cancel-trf" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer">
            CANCEL
          </button>
          <button type="submit" class="px-6 py-2 bg-[#536443] hover:bg-[#3b4c2d] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
            EXECUTE INTERNAL TRANSFER
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  const skuSelect = modal.querySelector('#trf-sku');
  const sourceSelect = modal.querySelector('#trf-source-loc');
  const destSelect = modal.querySelector('#trf-dest-loc');
  const sourceNote = modal.querySelector('#source-avail-note');
  const uomLabel = modal.querySelector('#trf-uom-label');
  const qtyInput = modal.querySelector('#trf-qty');

  function updateLocationSelectors() {
    const selectedSku = skuSelect.value;
    const prod = store.getProductBySku(selectedSku);
    if (!prod) return;

    uomLabel.textContent = (prod.uom || 'units').toUpperCase();

    const locMap = prod.locations || {};
    // Populate source locations (prefer locations with stock > 0)
    sourceSelect.innerHTML = locations.map(l => {
      const q = locMap[l.id] || 0;
      return `<option value="${l.id}">${l.name} — (${q} ${prod.uom || 'units'})</option>`;
    }).join('');

    // Pre-select first location with stock > 0
    const sourceOptions = Array.from(sourceSelect.options);
    const hasStock = sourceOptions.find(opt => {
      const q = locMap[opt.value] || 0;
      return q > 0;
    });
    if (hasStock) sourceSelect.value = hasStock.value;

    // Populate dest locations
    updateDestOptions();
    updateSourceStockNote();
  }

  function updateDestOptions() {
    const currentSource = sourceSelect.value;
    destSelect.innerHTML = locations
      .filter(l => l.id !== currentSource)
      .map(l => `<option value="${l.id}">${l.name} [${l.warehouseId}]</option>`)
      .join('');
  }

  function updateSourceStockNote() {
    const selectedSku = skuSelect.value;
    const prod = store.getProductBySku(selectedSku);
    const currentSource = sourceSelect.value;
    const avail = prod?.locations?.[currentSource] || 0;
    sourceNote.textContent = `Available at source: ${avail} ${prod?.uom || 'units'}`;
    qtyInput.max = avail;
  }

  skuSelect.addEventListener('change', updateLocationSelectors);
  sourceSelect.addEventListener('change', () => {
    updateDestOptions();
    updateSourceStockNote();
  });

  updateLocationSelectors();

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modal.querySelector('#btn-cancel-trf').addEventListener('click', closeModal);

  modal.querySelector('#transfer-stock-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sku = skuSelect.value;
    const sourceLocId = sourceSelect.value;
    const destLocId = destSelect.value;
    const qty = Number(qtyInput.value);
    const notes = modal.querySelector('#trf-notes').value;

    const result = store.transferStock(sku, sourceLocId, destLocId, qty, notes);
    if (!result.success) {
      showToast(result.error, 'error');
      return;
    }

    showToast(`Transferred ${qty} ${result.product.uom || 'units'} of ${sku} successfully!`, 'success');
    closeModal();
    window.location.hash = '#operations';
  });
}

// 3. Movement / Document Detail Modal (P1.5, P1.12)
export function openMovementDetailModal(movementId) {
  closeModal();

  const mov = store.getMovements().find(m => m.id === movementId);
  if (!mov) {
    showToast('Movement record not found.', 'error');
    return;
  }

  const isReadOnly = mov.status === 'DONE';
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-2xl bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs overflow-y-auto max-h-[90vh]">
      <span class="absolute -top-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -top-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -left-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>
      <span class="absolute -bottom-1.5 -right-1.5 text-[10px] font-mono text-[#b84328] font-bold">+</span>

      <!-- Manifest Header -->
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#b84328] text-[22px]">description</span>
          <span class="font-bold text-sm text-[#262421] uppercase">
            OPERATIONAL MANIFEST // ${mov.reference || mov.id}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 border text-[10px] font-bold uppercase ${
            mov.status === 'DONE' ? 'text-[#536443] border-[#536443]/40 bg-[#d3e6bd]/30' :
            mov.status === 'READY' ? 'text-[#b84328] border-[#b84328]/40 bg-[#ffdad2]/30' :
            mov.status === 'DRAFT' ? 'text-[#565145] border-[#cfc5b4] bg-[#efe9dc]' :
            mov.status === 'CANCELED' ? 'text-[#ba1a1a] border-[#ba1a1a]/40 bg-[#ffdad6]' :
            'text-[#8c716b] border-[#cfc5b4] bg-white'
          }">
            ${mov.status}
          </span>
          <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer ml-2">✕</button>
        </div>
      </div>

      <!-- Manifest Metadata Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#faf7f0] border border-[#cfc5b4] mb-4">
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">OPERATION TYPE:</span>
          <span class="text-sm font-bold text-[#b84328] uppercase">${mov.type}</span>
        </div>
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">CONTACT / PARTNER:</span>
          <span class="text-xs font-bold text-[#262421]">${mov.contact || 'Standard Logistics'}</span>
        </div>
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">RESPONSIBLE PERSON:</span>
          <span class="text-xs font-bold text-[#262421]">${mov.responsible || mov.operator}</span>
        </div>
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">SCHEDULED DATE:</span>
          <span class="text-xs font-bold text-[#262421]">${mov.scheduledDate || mov.timestamp.substring(0, 10)}</span>
        </div>
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">SOURCE:</span>
          <span class="text-xs text-[#565145]">${mov.source}</span>
        </div>
        <div>
          <span class="text-[#565145] text-[10px] block uppercase font-bold">DESTINATION:</span>
          <span class="text-xs text-[#536443] font-bold">${mov.destination}</span>
        </div>
      </div>

      <!-- Line-Item Products Table -->
      <div class="mb-4 border border-[#cfc5b4]">
        <div class="px-3 py-2 bg-[#efe9dc] border-b border-[#cfc5b4] flex items-center justify-between">
          <span class="font-bold text-xs uppercase text-[#262421]">MANIFEST LINE ITEMS</span>
          <span class="text-[10px] text-[#565145] uppercase">
            ${isReadOnly ? 'LOCKED // READ-ONLY' : 'EDITABLE DOCK LIST'}
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr class="bg-[#faf7f0] border-b border-[#cfc5b4] text-[#565145]">
                <th class="py-2 px-3">SKU</th>
                <th class="py-2 px-3">PRODUCT DESIGNATION</th>
                <th class="py-2 px-3 text-right">QUANTITY</th>
                <th class="py-2 px-3">UOM</th>
              </tr>
            </thead>
            <tbody id="line-items-body" class="divide-y divide-[#cfc5b4]/50">
              ${(mov.items || [{ sku: mov.sku, name: mov.productName, qty: Math.abs(mov.qty), uom: mov.unit }]).map(it => `
                <tr class="hover:bg-[#faf7f0]">
                  <td class="py-2.5 px-3 font-bold text-[#b84328]">${it.sku}</td>
                  <td class="py-2.5 px-3 font-body text-xs text-[#262421]">${it.name}</td>
                  <td class="py-2.5 px-3 text-right font-bold text-sm text-[#262421]">${it.qty}</td>
                  <td class="py-2.5 px-3 uppercase text-[11px] text-[#565145]">${it.uom || 'units'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Bar with Print, Validate, Cancel -->
      <div class="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
        <div class="flex items-center gap-2">
          <button id="btn-print-manifest" class="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#efe9dc] border border-[#cfc5b4] text-[#262421] font-bold uppercase cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span>PRINT MANIFEST</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          ${!isReadOnly && mov.status !== 'CANCELED' ? `
            <button id="btn-cancel-mov" class="px-3 py-2 bg-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white border border-[#ba1a1a]/40 text-[#ba1a1a] font-bold uppercase transition-colors cursor-pointer">
              CANCEL ORDER
            </button>
            <button id="btn-validate-mov" class="flex items-center gap-1.5 px-5 py-2 bg-[#536443] hover:bg-[#3b4c2d] text-white font-bold uppercase transition-colors cursor-pointer shadow-kraft-dark">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>VALIDATE &amp; ADVANCE</span>
            </button>
          ` : `
            <span class="font-bold text-xs text-[#536443] flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">lock</span>
              <span>RECORD LOCKED (${mov.status})</span>
            </span>
          `}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  activeModal = modal;

  modal.querySelector('#modal-close-btn').addEventListener('click', closeModal);

  // Print manifest
  modal.querySelector('#btn-print-manifest')?.addEventListener('click', () => {
    window.print();
  });

  // Cancel order
  modal.querySelector('#btn-cancel-mov')?.addEventListener('click', () => {
    showConfirmModal({
      title: 'CANCEL ORDER MANIFEST',
      message: `Are you sure you want to cancel operation ${mov.reference || mov.id}? This will flag the manifest as CANCELED and lock modifications.`,
      confirmText: 'YES, CANCEL MANIFEST',
      cancelText: 'RETURN',
      onConfirm: () => {
        store.cancelMovement(mov.id);
        showToast(`Order ${mov.reference || mov.id} has been canceled.`, 'error');
        closeModal();
        window.location.hash = '#operations';
      }
    });
  });

  // Validate order
  modal.querySelector('#btn-validate-mov')?.addEventListener('click', () => {
    const updated = store.validateMovement(mov.id);
    if (updated) {
      showToast(`Manifest advanced to status: ${updated.status}`, 'success');
      closeModal();
      window.location.hash = '#operations';
    }
  });
}

// 4. Adjust Stock / General Movement Modal
export function openAdjustStockModal(options = {}) {
  closeModal();

  const prods = store.getProducts();
  if (prods.length === 0) {
    showToast('Please add at least one product before logging movements.', 'error');
    openAddProductModal();
    return;
  }

  const defaultSku = options.sku || prods[0].sku;
  const defaultType = options.forcedType || 'RECEIPT';
  const locations = store.getLocations();

  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop";
  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border-2 border-[#cfc5b4] shadow-2xl p-6 font-mono text-xs">
      <div class="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#cfc5b4] mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#536443] text-[20px]">sync_alt</span>
          <span class="font-bold text-sm text-[#262421] uppercase">LOG STOCK TELEMETRY // DISPATCH</span>
        </div>
        <button id="modal-close-btn" class="text-[#565145] hover:text-[#b84328] text-base font-bold cursor-pointer">✕</button>
      </div>

      <form id="adjust-stock-form" class="space-y-4">
        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">SELECT TARGET SKU:</label>
          <select id="adj-sku" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            ${prods.map(p => `
              <option value="${p.sku}" ${p.sku === defaultSku ? 'selected' : ''}>
                ${p.sku} — ${p.name.substring(0, 32)} (Current: ${p.stock} ${p.uom || 'units'})
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
              <option value="ADJUST" ${defaultType === 'ADJUST' ? 'selected' : ''}>AUDIT ADJUSTMENT (+/-)</option>
            </select>
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">QUANTITY:</label>
            <input type="number" id="adj-qty" min="1" value="10" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">ASSIGNED LOCATION:</label>
          <select id="adj-loc" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            ${locations.map(l => `<option value="${l.id}">${l.name} [${l.warehouseId}]</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">ORIGIN / SOURCE:</label>
            <input type="text" id="adj-source" value="VENDOR DOCK INTAKE" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
          </div>
          <div>
            <label class="block text-[#565145] font-bold mb-1 uppercase">DESTINATION:</label>
            <input type="text" id="adj-dest" value="MAIN STAGING" required
              class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] focus:border-[#b84328] focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-[#565145] font-bold mb-1 uppercase">INITIAL STATUS:</label>
          <select id="adj-status" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:border-[#b84328] focus:outline-none">
            <option value="DRAFT">DRAFT (STAGED)</option>
            <option value="READY">READY FOR VALIDATION</option>
            <option value="DONE">DONE (IMMEDIATE LEDGER POSTING)</option>
          </select>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3 border-t border-dashed border-[#cfc5b4]">
          <button type="button" id="btn-cancel-adj" class="px-4 py-2 border border-[#cfc5b4] bg-[#efe9dc] text-[#565145] font-bold uppercase cursor-pointer">
            CANCEL
          </button>
          <button type="submit" class="px-6 py-2 bg-[#536443] hover:bg-[#3b4c2d] text-white font-bold uppercase cursor-pointer shadow-kraft-dark">
            POST TO OPERATIONS LOG
          </button>
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
    const locId = modal.querySelector('#adj-loc').value;
    const source = modal.querySelector('#adj-source').value;
    const dest = modal.querySelector('#adj-dest').value;
    const status = modal.querySelector('#adj-status').value;

    const prod = store.getProductBySku(sku);
    if (!prod) return;

    let signedQty = qty;
    if (type === 'DISPATCH') signedQty = -Math.abs(qty);
    else if (type === 'RECEIPT') signedQty = Math.abs(qty);

    if (status === 'DONE') {
      const curStock = prod.locations?.[locId] || 0;
      store.setProductLocationStock(sku, locId, Math.max(0, curStock + signedQty));
    }

    store.addMovement({
      type,
      sku,
      productName: prod.name,
      qty: signedQty,
      unit: prod.uom || "units",
      source,
      destination: dest,
      fromLocationId: type === 'DISPATCH' ? locId : null,
      toLocationId: type === 'RECEIPT' ? locId : null,
      carrier: "FORKLIFT RUNNER",
      status: status,
      items: [{ sku, name: prod.name, qty: Math.abs(signedQty), uom: prod.uom || 'units' }]
    });

    showToast(`Logged ${type} operation successfully.`, 'success');
    closeModal();
    window.location.hash = '#operations';
  });
}

// 5. Cycle Count Modal (P0 / Adjustments)
export function openCycleCountModal() {
  closeModal();

  const prods = store.getProducts();
  if (prods.length === 0) {
    showToast('Catalog is currently empty. Add products before performing a cycle count.', 'error');
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
              <option value="${p.sku}" data-stock="${p.stock}" data-uom="${p.uom || 'units'}">
                ${p.sku} — ${p.name.substring(0, 32)} (Ledger: ${p.stock} ${p.uom || 'units'})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="p-3 bg-[#faf7f0] border border-[#cfc5b4] flex items-center justify-between">
          <span class="font-bold text-[#565145]">CURRENT SYSTEM RECORD:</span>
          <span id="cycle-current-val" class="font-bold text-base text-[#262421]">
            ${prods[0].stock} ${prods[0].uom || 'units'}
          </span>
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
    const uom = selectedOption.getAttribute('data-uom') || 'units';
    const actualStock = parseInt(actualInput.value, 10) || 0;
    const diff = actualStock - systemStock;

    currentVal.textContent = `${systemStock} ${uom.toUpperCase()}`;

    if (diff === 0) {
      diffBox.className = "p-3 border border-[#536443]/40 bg-[#d3e6bd]/20 text-center font-bold text-[#536443]";
      diffVal.textContent = `0 ${uom.toUpperCase()} (BALANCED)`;
    } else if (diff > 0) {
      diffBox.className = "p-3 border border-[#536443]/40 bg-[#d3e6bd]/30 text-center font-bold text-[#536443]";
      diffVal.textContent = `+${diff} ${uom.toUpperCase()} (SURPLUS FOUND)`;
    } else {
      diffBox.className = "p-3 border border-[#b84328]/40 bg-[#ffdad2]/40 text-center font-bold text-[#b84328]";
      diffVal.textContent = `${diff} ${uom.toUpperCase()} (DEFICIT / SHORTAGE)`;
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
        unit: prod.uom || "units",
        source: `CYCLE COUNT AUDIT [PREV: ${systemStock}]`,
        destination: `LEDGER RECONCILED [NEW: ${actualStock}]`,
        carrier: "CHIEF AUDITOR",
        status: "DONE"
      });
    }

    closeModal();
    showToast(`Cycle count reconciled for ${sku}: ${diff >= 0 ? '+' : ''}${diff} ${prod.uom || 'units'}`, 'success');
    window.location.hash = '#dashboard';
  });
}

// 6. Operator Profile Modal
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
