// StockSense Main Application Router & Shell Controller
import { store } from './store.js';
import { renderAuthView } from './views/authView.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderProductsView } from './views/productsView.js';
import { renderStockView } from './views/stockView.js';
import { renderOperationsView } from './views/operationsView.js';
import { renderSettingsView } from './views/settingsView.js';
import {
  openAddProductModal,
  openAdjustStockModal,
  openTransferStockModal,
  openMovementDetailModal,
  openCycleCountModal,
  openProfileModal,
  closeModal,
  showToast
} from './modals.js';

class StockSenseApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentRoute = '';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

    // Custom modal event listeners
    window.addEventListener('open-add-product', () => openAddProductModal());
    window.addEventListener('open-edit-product', (e) => openAddProductModal(e.detail?.product));
    window.addEventListener('open-adjust-stock', (e) => openAdjustStockModal(e.detail));
    window.addEventListener('open-transfer-stock', (e) => openTransferStockModal(e.detail));
    window.addEventListener('open-movement-detail', (e) => openMovementDetailModal(e.detail?.id));
    window.addEventListener('open-cycle-count', () => openCycleCountModal());
    window.addEventListener('open-profile', () => openProfileModal());

    // Subscribe to store updates for live telemetry badges
    store.subscribe('*', () => {
      this.updateHeaderTelemetry();
    });

    // Default route
    if (!window.location.hash) {
      window.location.hash = store.state.user ? '#dashboard' : '#auth';
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.currentRoute = hash;

    // Check auth protection
    if (!store.state.user && hash !== 'auth') {
      window.location.hash = '#auth';
      return;
    }

    if (hash === 'auth') {
      this.renderAuthScreen();
      return;
    }

    // Render authenticated application shell if not already present
    this.ensureAppShell();
    this.renderCurrentView(hash);
    this.updateActiveNav(hash);
    this.updateHeaderTelemetry();
  }

  renderAuthScreen() {
    this.appContainer.innerHTML = `<div id="auth-root"></div>`;
    const authRoot = document.getElementById('auth-root');
    renderAuthView(authRoot, 'login');
  }

  ensureAppShell() {
    if (document.getElementById('stocksense-shell')) return;

    const user = store.state.user || {
      name: "MARCUS VANCE",
      badgeId: "OP-4982",
      zone: "WH-01",
      terminal: "TRM-9842-DX",
      secLevel: "SEC_LVL_04"
    };

    this.appContainer.innerHTML = `
      <div id="stocksense-shell" class="min-h-screen bg-[#f4f0e6] text-[#262421]">
        <!-- Fixed Sidebar -->
        <aside class="fixed left-0 top-0 h-full w-64 bg-[#faf7f0] border-r-2 border-dashed border-[#cfc5b4] z-50 flex flex-col">
          <!-- Logo Header -->
          <div class="h-14 px-4 border-b border-[#cfc5b4] flex items-center justify-between bg-white">
            <a href="#dashboard" class="flex items-center gap-2 text-decoration-none">
              <div class="relative flex items-center justify-center p-1 bg-[#faf7f0] border border-[#cfc5b4]">
                <svg class="w-4 h-4 text-[#b84328]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M4 7l8-4 8 4m-16 0l8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="square"></path>
                </svg>
              </div>
              <span class="font-mono text-base tracking-wider text-[#262421] uppercase font-bold">STOCKSENSE</span>
            </a>
            <span class="font-mono text-[10px] text-[#536443] px-1.5 py-0.5 border border-[#536443]/40 bg-[#d3e6bd]/30 uppercase font-bold tracking-widest">
              V.2.4
            </span>
          </div>

          <!-- System Rail Indicator -->
          <div class="px-4 py-2 border-b border-dashed border-[#cfc5b4] bg-[#efe9dc]">
            <div class="flex items-center justify-between">
              <span class="font-mono text-[11px] text-[#565145] uppercase tracking-widest font-bold">SYSTEM RAIL</span>
              <span class="font-mono text-[11px] text-[#536443] flex items-center gap-1.5 font-bold">
                <span class="inline-block w-2 h-2 rounded-none bg-[#536443]"></span>ONLINE
              </span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 py-2 px-1 flex flex-col gap-1 font-mono text-xs">
            <a href="#dashboard" id="nav-dashboard" class="flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4h6v8H4V4zm10 0h6v5h-6V4zm10 9h6v7h-6v-7zm-10 4h6v3H4v-3z" stroke-linecap="square"></path>
              </svg>
              <span class="uppercase tracking-wider">Dashboard</span>
            </a>

            <a href="#products" id="nav-products" class="flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="square"></path>
              </svg>
              <span class="uppercase tracking-wider">Products</span>
            </a>

            <a href="#stock" id="nav-stock" class="flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 font-bold">
              <span class="material-symbols-outlined text-[18px]">inventory_2</span>
              <span class="uppercase tracking-wider">Stock</span>
            </a>

            <a href="#operations" id="nav-operations" class="flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" stroke-linecap="square"></path>
              </svg>
              <span class="uppercase tracking-wider">Operations</span>
            </a>

            <a href="#settings" id="nav-settings" class="flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 font-bold">
              <span class="material-symbols-outlined text-[18px]">settings</span>
              <span class="uppercase tracking-wider">Settings</span>
            </a>

            <button id="nav-profile-btn" class="w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 border-transparent text-[#58413c] hover:bg-[#ebe5d8] font-bold cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">badge</span>
              <span class="uppercase tracking-wider">Profile</span>
            </button>
          </nav>

          <!-- Security Footprint -->
          <div class="p-3 border-t border-[#cfc5b4] bg-white font-mono text-[11px] text-[#565145]">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1 font-bold">
                <span class="text-[#b84328]">+</span> <span id="rail-sec">${user.secLevel}</span>
              </span>
              <span class="font-bold border-b border-[#565145]/40" id="rail-loc">LOC: ${store.state.currentZone}</span>
            </div>
          </div>
        </aside>

        <!-- Top Header & Main View Container -->
        <div class="pl-64">
          <!-- Fixed Top Header -->
          <header class="fixed top-0 left-64 right-0 h-14 bg-[#faf7f0] border-b-2 border-[#cfc5b4] z-40 flex items-center justify-between px-6">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-white border border-[#8c716b] flex items-center justify-center font-mono text-[#b84328] font-bold text-xs shadow-inner">
                  SS
                </div>
                <span class="font-mono text-sm tracking-wider font-bold uppercase hidden sm:inline-block">
                  STOCK SENSE / OPS
                </span>
              </div>

              <div class="flex items-center gap-1 font-mono text-xs bg-white px-2.5 py-1 border border-[#cfc5b4]">
                <span class="text-[#565145] uppercase">TERM:</span>
                <span class="text-[#262421] font-bold" id="hdr-term">${user.terminal}</span>
              </div>

              <div class="hidden md:flex items-center gap-1 font-mono text-xs bg-white px-2.5 py-1 border border-[#cfc5b4]">
                <span class="text-[#565145] uppercase">STATUS:</span>
                <span class="text-[#536443] font-bold flex items-center gap-1">
                  <span class="w-2 h-2 bg-[#536443]"></span>SYNCED
                </span>
              </div>

              <div class="hidden lg:flex items-center gap-1 font-mono text-xs bg-white px-2.5 py-1 border border-[#cfc5b4]">
                <span class="text-[#565145] uppercase">SHIFT:</span>
                <span class="text-[#58413c] font-bold" id="hdr-shift">${store.state.shift}</span>
              </div>
            </div>

            <!-- Header Right: Quick Barcode + Avatar -->
            <div class="flex items-center gap-4">
              <div class="relative flex items-center">
                <span class="absolute left-2.5 font-mono text-[#b84328] font-bold">_</span>
                <input id="header-scan-input" type="text" placeholder="SCAN SKU / LOC..."
                  class="bg-white border border-[#cfc5b4] text-[#262421] font-mono text-xs pl-7 pr-8 py-1.5 w-48 sm:w-60 placeholder:text-[#8c716b]/70 focus:outline-none focus:border-[#b84328] rounded-none shadow-inner" />
                <span class="absolute right-2 font-mono text-[10px] text-[#565145] bg-[#faf7f0] px-1 border border-[#cfc5b4] font-bold">
                  F2
                </span>
              </div>

              <button id="hdr-avatar-btn" class="w-8 h-8 rounded-none border border-[#8c716b] bg-[#ebe5d8] hover:bg-white flex items-center justify-center text-[#262421] font-mono font-bold text-xs cursor-pointer shadow-kraft">
                <span class="material-symbols-outlined text-[#b84328] text-[18px]">person</span>
              </button>
            </div>
          </header>

          <!-- Main Dynamic View Area -->
          <main class="relative pt-14 bg-[#f4f0e6] min-h-screen" id="main-content-view">
            <!-- View injected here -->
          </main>
        </div>
      </div>
    `;

    // Attach profile modal trigger to avatar & nav button
    document.getElementById('hdr-avatar-btn')?.addEventListener('click', () => openProfileModal());
    document.getElementById('nav-profile-btn')?.addEventListener('click', () => openProfileModal());

    // Header scan input enter key
    const scanInp = document.getElementById('header-scan-input');
    if (scanInp) {
      scanInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && scanInp.value.trim()) {
          const sku = scanInp.value.trim();
          const prod = store.getProductBySku(sku);
          if (prod) {
            showToast(`SKU ${prod.sku}: ${prod.name} | ${prod.stock} ${prod.uom || 'units'} in ${prod.zone} [${prod.bin}]`, 'success');
          } else {
            showToast(`SKU or Barcode "${sku}" not found in current catalog.`, 'error');
          }
        }
      });
    }
  }

  renderCurrentView(route) {
    const viewContainer = document.getElementById('main-content-view');
    if (!viewContainer) return;

    window.scrollTo(0, 0);

    switch (route) {
      case 'dashboard':
        renderDashboardView(viewContainer);
        break;
      case 'products':
        renderProductsView(viewContainer);
        break;
      case 'stock':
        renderStockView(viewContainer);
        break;
      case 'operations':
        renderOperationsView(viewContainer);
        break;
      case 'settings':
        renderSettingsView(viewContainer);
        break;
      default:
        renderDashboardView(viewContainer);
        break;
    }
  }

  updateActiveNav(route) {
    const navItems = ['dashboard', 'products', 'stock', 'operations', 'settings'];
    navItems.forEach(item => {
      const el = document.getElementById(`nav-${item}`);
      if (!el) return;

      if (item === route) {
        el.className = "flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 border-[#b84328] bg-[#ebe5d8] text-[#b84328] font-bold";
      } else {
        el.className = "flex items-center gap-3 px-4 py-2.5 transition-colors border-l-4 border-transparent text-[#58413c] hover:bg-[#ebe5d8] font-bold";
      }
    });
  }

  updateHeaderTelemetry() {
    const user = store.state.user;
    if (!user) return;

    const termEl = document.getElementById('hdr-term');
    const shiftEl = document.getElementById('hdr-shift');
    const locEl = document.getElementById('rail-loc');

    if (termEl) termEl.textContent = user.terminal || 'TRM-9842-DX';
    if (shiftEl) shiftEl.textContent = store.state.shift || 'ALPHA-02 [06:00-14:30]';
    if (locEl) locEl.textContent = `LOC: ${store.state.currentZone}`;
  }

  handleGlobalKeydown(e) {
    if (e.key === 'F2') {
      e.preventDefault();
      const inp = document.getElementById('header-scan-input') || document.getElementById('productSearchInput') || document.getElementById('deck-search-input');
      if (inp) inp.focus();
    } else if (e.key === 'F3') {
      e.preventDefault();
      openAddProductModal();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }
}

// Bootstrap
function bootstrap() {
  new StockSenseApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
