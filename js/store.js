// StockSense Reactive State Store with LocalStorage Persistence
import { INITIAL_PRODUCTS, INITIAL_MOVEMENTS, ZONES } from './data.js';

const STORAGE_KEY = 'stocksense_state_v2.4';

class StockSenseStore {
  constructor() {
    this.listeners = new Map();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read state from localStorage:', e);
    }

    return {
      user: {
        name: "MARCUS VANCE",
        email: "marcus.vance@stocksense.io",
        badgeId: "OP-4982",
        zone: "WH-01",
        secLevel: "SEC_LVL_04",
        terminal: "TRM-9842-DX",
        role: "CHIEF OPERATIONS CONTROLLER"
      },
      products: [...INITIAL_PRODUCTS],
      movements: [...INITIAL_MOVEMENTS],
      currentZone: "WH-01",
      shift: "ALPHA-02 [06:00-14:30]",
      status: "ONLINE",
      emptyMode: false // When true, simulates pure initial empty state as seen in Stitch prototypes
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  notify(event, data) {
    this.saveState();
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data, this.state);
        } catch (e) {
          console.error(`Error in listener for ${event}:`, e);
        }
      });
    }
    // Also notify global wildcard
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(this.state));
    }
  }

  // --- Auth Actions ---
  login(email, password, remember = true) {
    const user = {
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || "DISPATCH OPERATOR",
      email: email,
      badgeId: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      zone: "WH-01",
      secLevel: "SEC_LVL_04",
      terminal: "TRM-9842-DX",
      role: "DEPOT DISPATCH SPECIALIST"
    };
    this.state.user = user;
    this.notify('auth:login', user);
    return user;
  }

  signup(name, email, password, zone = "WH-01") {
    const user = {
      name: (name || "DEPOT OPERATOR").toUpperCase(),
      email: email,
      badgeId: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      zone: zone || "WH-01",
      secLevel: "SEC_LVL_02",
      terminal: `TRM-${zone}-DX`,
      role: "CERTIFIED WAREHOUSE SPECIALIST"
    };
    this.state.user = user;
    this.state.currentZone = zone;
    this.notify('auth:signup', user);
    return user;
  }

  logout() {
    this.state.user = null;
    this.notify('auth:logout', null);
  }

  // --- Products Catalog Actions ---
  getProducts() {
    if (this.state.emptyMode) return [];
    return this.state.products;
  }

  getProductBySku(sku) {
    const prods = this.getProducts();
    const query = sku.toLowerCase().trim();
    return prods.find(p => p.sku.toLowerCase() === query || p.barcode === query);
  }

  addProduct(productData) {
    const sku = productData.sku || `SKU-${productData.category.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const stock = Number(productData.stock) || 0;
    const threshold = Number(productData.safetyThreshold) || 10;
    
    let status = "IN_STOCK";
    if (stock <= 0) status = "OUT";
    else if (stock <= threshold) status = "LOW";

    const newProduct = {
      id: sku,
      sku: sku,
      name: productData.name,
      category: productData.category || "GENERAL",
      zone: productData.zone || this.state.currentZone,
      bin: productData.bin || "BAY-01-A",
      stock: stock,
      safetyThreshold: threshold,
      unitCost: Number(productData.unitCost) || 0.00,
      status: status,
      lastMovement: new Date().toISOString().replace('T', ' ').substring(0, 16),
      barcode: productData.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      spec: productData.spec || "Certified Standard Inventory Unit"
    };

    if (this.state.emptyMode) {
      this.state.emptyMode = false;
    }

    this.state.products.unshift(newProduct);

    // Also log automatic intake movement
    this.addMovement({
      type: "RECEIPT",
      sku: newProduct.sku,
      productName: newProduct.name,
      qty: stock,
      unit: "UNITS",
      source: "INITIAL CATALOG INTAKE",
      destination: `${newProduct.zone} [${newProduct.bin}]`,
      carrier: "INTERNAL CATALOG ENTRY",
      status: "DONE"
    });

    this.notify('product:add', newProduct);
    return newProduct;
  }

  updateProductStock(sku, deltaQty, reason = "MANUAL_ADJUSTMENT") {
    const product = this.state.products.find(p => p.sku === sku);
    if (!product) return null;

    product.stock = Math.max(0, product.stock + deltaQty);
    if (product.stock <= 0) product.status = "OUT";
    else if (product.stock <= product.safetyThreshold) product.status = "LOW";
    else product.status = "IN_STOCK";

    product.lastMovement = new Date().toISOString().replace('T', ' ').substring(0, 16);

    this.notify('product:update', product);
    return product;
  }

  // --- Movements Telemetry Actions ---
  getMovements() {
    if (this.state.emptyMode) return [];
    return this.state.movements;
  }

  addMovement(movData) {
    const id = `MOV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMovement = {
      id: id,
      type: movData.type || "TRANSFER",
      sku: movData.sku,
      productName: movData.productName || "Unknown Item",
      qty: Number(movData.qty) || 1,
      unit: movData.unit || "UNITS",
      source: movData.source || "DOCK STAGING",
      destination: movData.destination || "BAY STORAGE",
      carrier: movData.carrier || "FORKLIFT RUNNER",
      status: movData.status || "READY",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: this.state.user ? `${this.state.user.name} [${this.state.user.badgeId}]` : "SYS TELEMETRY"
    };

    if (this.state.emptyMode) {
      this.state.emptyMode = false;
    }

    this.state.movements.unshift(newMovement);
    this.notify('movement:add', newMovement);
    return newMovement;
  }

  // --- Metrics Calculation ---
  getMetrics() {
    const prods = this.getProducts();
    const movs = this.getMovements();

    const totalSkus = prods.length;
    const lowStockCount = prods.filter(p => p.status === 'LOW').length;
    const outOfStockCount = prods.filter(p => p.status === 'OUT').length;
    const atRiskCount = lowStockCount + outOfStockCount;

    const totalValuation = prods.reduce((sum, p) => sum + (p.stock * p.unitCost), 0);

    const pendingReceipts = movs.filter(m => m.type === 'RECEIPT' && m.status !== 'DONE').length;
    const pendingDispatches = movs.filter(m => m.type === 'DISPATCH' && m.status !== 'DONE').length;
    const scheduledTransfers = movs.filter(m => m.type === 'TRANSFER' && m.status !== 'DONE').length;

    return {
      totalSkus,
      lowStockCount,
      outOfStockCount,
      atRiskCount,
      totalValuation,
      pendingReceipts,
      pendingDispatches,
      scheduledTransfers
    };
  }

  // --- System Mode Toggles ---
  setEmptyMode(val) {
    this.state.emptyMode = Boolean(val);
    this.notify('mode:change', this.state.emptyMode);
  }

  toggleEmptyMode() {
    this.setEmptyMode(!this.state.emptyMode);
  }

  resetToDemo() {
    this.state.products = [...INITIAL_PRODUCTS];
    this.state.movements = [...INITIAL_MOVEMENTS];
    this.state.emptyMode = false;
    this.notify('system:reset', this.state);
  }
}

export const store = new StockSenseStore();
