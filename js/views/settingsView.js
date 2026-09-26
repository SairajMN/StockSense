// StockSense System Settings & Terminal Configuration
import { store } from '../store.js';
import { ZONES } from '../data.js';

export function renderSettingsView(container) {
  const user = store.state.user || {
    name: "MARCUS VANCE",
    email: "marcus.vance@stocksense.io",
    badgeId: "OP-4982",
    zone: "WH-01",
    secLevel: "SEC_LVL_04",
    terminal: "TRM-9842-DX",
    role: "CHIEF OPERATIONS CONTROLLER"
  };

  container.innerHTML = `
    <div class="flex flex-col w-full p-4 lg:p-6 space-y-6 font-body text-[#262421] max-w-5xl mx-auto">
      <!-- Header -->
      <div class="bg-[#faf7f0] p-4 border border-[#cfc5b4] shadow-kraft">
        <h1 class="font-mono text-2xl font-bold uppercase tracking-tight text-[#262421]">
          SYSTEM CONFIGURATION &amp; DEPOT SETTINGS
        </h1>
        <p class="font-mono text-xs text-[#565145] mt-1 uppercase">
          HARDWARE TERMINAL MAPPING • SAFETY THRESHOLDS • LOCAL DATA REPOSITORY
        </p>
      </div>

      <!-- Settings Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Terminal & Hardware Assignment -->
        <div class="bg-white border border-[#cfc5b4] p-5 shadow-kraft space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-dashed border-[#cfc5b4]">
            <span class="material-symbols-outlined text-[20px] text-[#b84328]">desktop_windows</span>
            <span class="font-mono text-sm uppercase font-bold text-[#262421]">ACTIVE TERMINAL STATION</span>
          </div>

          <div class="space-y-3 font-mono text-xs">
            <div>
              <label class="block text-[#565145] uppercase font-bold mb-1">ASSIGNED SECTOR ZONE:</label>
              <select id="setting-zone-select" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:outline-none focus:border-[#b84328]">
                ${ZONES.map(z => `
                  <option value="${z.id}" ${store.state.currentZone === z.id ? 'selected' : ''}>
                    ${z.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-[#565145] uppercase font-bold mb-1">TERMINAL HARDWARE ID:</label>
              <input type="text" value="${user.terminal || 'TRM-9842-DX'}" readonly
                class="w-full bg-[#efe9dc] border border-[#cfc5b4] p-2 text-[#262421] font-bold cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-[#565145] uppercase font-bold mb-1">CURRENT OPERATING SHIFT:</label>
              <select id="setting-shift-select" class="w-full bg-[#faf7f0] border border-[#cfc5b4] p-2 text-[#262421] font-bold focus:outline-none focus:border-[#b84328]">
                <option value="ALPHA-02 [06:00-14:30]">ALPHA-02 [06:00 - 14:30]</option>
                <option value="BRAVO-01 [14:30-23:00]">BRAVO-01 [14:30 - 23:00]</option>
                <option value="NIGHT-WATCH [23:00-06:00]">NIGHT-WATCH [23:00 - 06:00]</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Telemetry & Sensory Controls -->
        <div class="bg-white border border-[#cfc5b4] p-5 shadow-kraft space-y-4">
          <div class="flex items-center gap-2 pb-2 border-b border-dashed border-[#cfc5b4]">
            <span class="material-symbols-outlined text-[20px] text-[#536443]">sensors</span>
            <span class="font-mono text-sm uppercase font-bold text-[#262421]">TELEMETRY &amp; SENSORS</span>
          </div>

          <div class="space-y-4 font-mono text-xs">
            <div class="flex items-center justify-between p-3 bg-[#faf7f0] border border-[#cfc5b4]">
              <div>
                <div class="font-bold text-[#262421] uppercase">BARCODE HARDWARE BEEP</div>
                <div class="text-[11px] text-[#565145] font-body">Synthesize acoustic click upon SKU scan / F2 / F3</div>
              </div>
              <input type="checkbox" id="check-audio" checked class="accent-[#b84328] w-4 h-4 cursor-pointer" />
            </div>

            <div class="flex items-center justify-between p-3 bg-[#faf7f0] border border-[#cfc5b4]">
              <div>
                <div class="font-bold text-[#262421] uppercase">EMPTY STATE SIMULATION</div>
                <div class="text-[11px] text-[#565145] font-body">Simulates the exact initial uninitialized Kraft ledger</div>
              </div>
              <input type="checkbox" id="check-empty-mode" ${store.state.emptyMode ? 'checked' : ''} class="accent-[#b84328] w-4 h-4 cursor-pointer" />
            </div>

            <div class="flex items-center justify-between p-3 bg-[#faf7f0] border border-[#cfc5b4]">
              <div>
                <div class="font-bold text-[#262421] uppercase">SECURITY PROTOCOL</div>
                <div class="text-[11px] text-[#565145] font-body">Clearance: ${user.secLevel || 'SEC_LVL_04'}</div>
              </div>
              <span class="px-2 py-0.5 bg-[#d3e6bd]/30 border border-[#536443]/40 text-[#536443] font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        <!-- Ledger Data Management -->
        <div class="bg-white border border-[#cfc5b4] p-5 shadow-kraft space-y-4 md:col-span-2">
          <div class="flex items-center gap-2 pb-2 border-b border-dashed border-[#cfc5b4]">
            <span class="material-symbols-outlined text-[20px] text-[#b84328]">database</span>
            <span class="font-mono text-sm uppercase font-bold text-[#262421]">LOCAL LEDGER DATABASE CONTROLS</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <button id="btn-reset-demo" class="p-4 bg-[#faf7f0] hover:bg-[#efe9dc] border border-[#cfc5b4] flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-[#536443] text-[24px]">restore</span>
              <span class="font-bold uppercase text-[#262421]">RESTORE DEMO TELEMETRY</span>
              <span class="text-[11px] text-[#565145] font-body">Reset to 6 industrial SKUs and 5 verified movement logs</span>
            </button>

            <button id="btn-purge-empty" class="p-4 bg-[#faf7f0] hover:bg-[#ffdad2]/30 border border-[#cfc5b4] flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-[#b84328] text-[24px]">delete_sweep</span>
              <span class="font-bold uppercase text-[#b84328]">CLEAR ALL TO EMPTY</span>
              <span class="text-[11px] text-[#565145] font-body">Wipe local catalog to inspect zero-data manifest sheets</span>
            </button>

            <button id="btn-export-full-db" class="p-4 bg-[#faf7f0] hover:bg-[#efe9dc] border border-[#cfc5b4] flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-[#565145] text-[24px]">save</span>
              <span class="font-bold uppercase text-[#262421]">BACKUP SYSTEM DATABASE</span>
              <span class="text-[11px] text-[#565145] font-body">Download entire state as JSON archive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  const zoneSelect = container.querySelector('#setting-zone-select');
  if (zoneSelect) {
    zoneSelect.addEventListener('change', () => {
      store.state.currentZone = zoneSelect.value;
      if (store.state.user) store.state.user.zone = zoneSelect.value;
      store.notify('zone:change', zoneSelect.value);
      alert(`Terminal reassigned to Zone ${zoneSelect.value}`);
    });
  }

  const shiftSelect = container.querySelector('#setting-shift-select');
  if (shiftSelect) {
    shiftSelect.value = store.state.shift || "ALPHA-02 [06:00-14:30]";
    shiftSelect.addEventListener('change', () => {
      store.state.shift = shiftSelect.value;
      store.notify('shift:change', shiftSelect.value);
    });
  }

  const emptyCheck = container.querySelector('#check-empty-mode');
  if (emptyCheck) {
    emptyCheck.addEventListener('change', () => {
      store.setEmptyMode(emptyCheck.checked);
    });
  }

  container.querySelector('#btn-reset-demo')?.addEventListener('click', () => {
    if (confirm('Restore demo inventory catalog and movement logs?')) {
      store.resetToDemo();
      renderSettingsView(container);
    }
  });

  container.querySelector('#btn-purge-empty')?.addEventListener('click', () => {
    if (confirm('Clear catalog and movements to view the exact empty prototype state?')) {
      store.state.emptyMode = true;
      store.saveState();
      renderSettingsView(container);
    }
  });

  container.querySelector('#btn-export-full-db')?.addEventListener('click', () => {
    const fullBackup = JSON.stringify(store.state, null, 2);
    const blob = new Blob([fullBackup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StockSense_FullBackup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
  });
}
