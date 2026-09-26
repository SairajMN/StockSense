// StockSense Reactive State Store with LocalStorage Persistence
import { INITIAL_PRODUCTS, INITIAL_MOVEMENTS, WAREHOUSES, LOCATIONS, ZONES } from './data.js';

const STORAGE_KEY = 'stocksense_state_v2.5';

class StockSenseStore {
  constructor() {
    this.listeners = new Map();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new structures exist if migrating
        if (!parsed.locations) parsed.locations = [...LOCATIONS];
        if (!parsed.warehouses) parsed.warehouses = [...WAREHOUSES];
        if (!parsed.resetTokens) parsed.resetTokens = {};
        return parsed;
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
      products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
      movements: JSON.parse(JSON.stringify(INITIAL_MOVEMENTS)),
      locations: [...LOCATIONS],
      warehouses: [...WAREHOUSES],
      resetTokens: {},
      currentZone: "WH-01",
      shift: "ALPHA-02 [06:00-14:30]",
      status: "ONLINE",
      emptyMode: false
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

  // --- OTP-based Password Reset ---
  requestPasswordReset(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (!this.state.resetTokens) this.state.resetTokens = {};
    this.state.resetTokens[cleanEmail] = {
      otp,
      expiresAt
    };
    this.saveState();

    console.log(`[StockSense Security Rail] OTP Code generated for ${cleanEmail}: ${otp}`);
    return {
      success: true,
      email: cleanEmail,
      otp,
      expiresAt
    };
  }

  verifyResetOtp(email, code, newPassword) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();

    if (!this.state.resetTokens || !this.state.resetTokens[cleanEmail]) {
      return { success: false, error: "No active reset request found for this email. Request a new code." };
    }

    const record = this.state.resetTokens[cleanEmail];
    if (Date.now() > record.expiresAt) {
      delete this.state.resetTokens[cleanEmail];
      this.saveState();
      return { success: false, error: "OTP expired. Please request a new verification code." };
    }

    if (record.otp !== cleanCode) {
      return { success: false, error: "Invalid 6-digit OTP code entered. Please check and try again." };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Success: Clear token & update user password record
    delete this.state.resetTokens[cleanEmail];
    this.saveState();
    this.notify('auth:passwordReset', { email: cleanEmail });
    return { success: true };
  }

  // --- Location & Warehouse Entities ---
  getWarehouses() {
    return this.state.warehouses || WAREHOUSES;
  }

  getLocations() {
    return this.state.locations || LOCATIONS;
  }

  getLocationById(locId) {
    return this.getLocations().find(l => l.id === locId) || null;
  }

  getLocationsForWarehouse(whId) {
    return this.getLocations().filter(l => l.warehouseId === whId);
  }

  addLocation(locData) {
    const id = locData.id || `LOC-${locData.warehouseId.replace('WH-', 'WH')}-${Math.floor(100 + Math.random() * 900)}`;
    const newLoc = {
      id,
      name: locData.name,
      shortCode: locData.shortCode || id,
      warehouseId: locData.warehouseId
    };
    if (!this.state.locations) this.state.locations = [];
    this.state.locations.push(newLoc);
    this.notify('location:add', newLoc);
    return newLoc;
  }

  addWarehouse(whData) {
    const id = whData.id || `WH-0${(this.state.warehouses?.length || 0) + 1}`;
    const newWh = {
      id,
      name: whData.name,
      shortCode: whData.shortCode || id,
      address: whData.address || "Industrial Logistics Bay"
    };
    if (!this.state.warehouses) this.state.warehouses = [];
    this.state.warehouses.push(newWh);
    this.notify('warehouse:add', newWh);
    return newWh;
  }

  // --- Products Catalog Actions ---
  getProducts() {
    if (this.state.emptyMode) return [];
    return this.state.products.map(p => this.enrichProduct(p));
  }

  enrichProduct(product) {
    const locs = product.locations || {};
    let totalStock = 0;
    const locEntries = Object.entries(locs);
    if (locEntries.length > 0) {
      totalStock = locEntries.reduce((sum, [, q]) => sum + (Number(q) || 0), 0);
    } else {
      totalStock = Number(product.stock) || 0;
    }

    product.stock = totalStock;

    if (totalStock <= 0) product.status = "OUT";
    else if (totalStock <= (product.safetyThreshold || 10)) product.status = "LOW";
    else product.status = "IN_STOCK";

    return product;
  }

  getProductBySku(sku) {
    const prods = this.getProducts();
    const query = (sku || '').toLowerCase().trim();
    return prods.find(p => p.sku.toLowerCase() === query || p.barcode === query) || null;
  }

  getProductFreeToUse(sku) {
    const prod = this.getProductBySku(sku);
    if (!prod) return 0;
    const onHand = prod.stock;

    // Open delivery orders (outgoing dispatches waiting or ready)
    const movs = this.getMovements();
    const reserved = movs
      .filter(m => m.type === 'DISPATCH' && (m.status === 'READY' || m.status === 'WAITING' || m.status === 'DRAFT') && m.sku === sku)
      .reduce((sum, m) => sum + Math.abs(Number(m.qty) || 0), 0);

    return Math.max(0, onHand - reserved);
  }

  addProduct(productData) {
    const sku = productData.sku || `SKU-${productData.category.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const stock = Number(productData.stock) || 0;
    const threshold = Number(productData.safetyThreshold) || 10;
    const uom = productData.uom || "units";
    const locId = productData.locationId || "LOC-WH1-A";

    const locations = {};
    locations[locId] = stock;

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
      uom: uom,
      locations: locations,
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

    // Initial receipt movement log
    this.addMovement({
      reference: `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      type: "RECEIPT",
      sku: newProduct.sku,
      productName: newProduct.name,
      qty: stock,
      unit: uom,
      source: "INITIAL CATALOG INTAKE",
      destination: `${newProduct.zone} [${newProduct.bin}]`,
      fromLocationId: null,
      toLocationId: locId,
      carrier: "INTERNAL CATALOG ENTRY",
      status: "DONE",
      scheduledDate: new Date().toISOString().substring(0, 10),
      items: [{ sku: newProduct.sku, name: newProduct.name, qty: stock, uom: uom }]
    });

    this.notify('product:add', newProduct);
    return newProduct;
  }

  updateProduct(sku, updates) {
    const index = this.state.products.findIndex(p => p.sku === sku);
    if (index === -1) return null;

    const prod = this.state.products[index];
    Object.assign(prod, updates);

    // Re-enrich & recalculate stock
    this.enrichProduct(prod);
    prod.lastMovement = new Date().toISOString().replace('T', ' ').substring(0, 16);

    this.notify('product:update', prod);
    return prod;
  }

  deleteProduct(sku) {
    const index = this.state.products.findIndex(p => p.sku === sku);
    if (index === -1) return false;

    const [deleted] = this.state.products.splice(index, 1);
    this.notify('product:delete', deleted);
    return true;
  }

  setProductLocationStock(sku, locationId, newQty) {
    const prod = this.state.products.find(p => p.sku === sku);
    if (!prod) return null;

    if (!prod.locations) prod.locations = {};
    const oldQty = prod.locations[locationId] || 0;
    prod.locations[locationId] = Math.max(0, Number(newQty) || 0);

    const diff = (prod.locations[locationId]) - oldQty;
    this.enrichProduct(prod);

    const loc = this.getLocationById(locationId);
    const locName = loc ? loc.name : locationId;

    if (diff !== 0) {
      this.addMovement({
        reference: `ADJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        type: "ADJUST",
        sku: prod.sku,
        productName: prod.name,
        qty: diff,
        unit: prod.uom || "units",
        source: `INLINE STOCK EDIT [PREV: ${oldQty}]`,
        destination: `${locName} [NEW: ${prod.locations[locationId]}]`,
        fromLocationId: diff < 0 ? locationId : null,
        toLocationId: diff > 0 ? locationId : null,
        carrier: "MANUAL INVENTORY AUDIT",
        status: "DONE",
        scheduledDate: new Date().toISOString().substring(0, 10),
        items: [{ sku: prod.sku, name: prod.name, qty: diff, uom: prod.uom || "units" }]
      });
    }

    this.notify('product:update', prod);
    return prod;
  }

  updateProductStock(sku, deltaQty, reason = "MANUAL_ADJUSTMENT") {
    const product = this.state.products.find(p => p.sku === sku);
    if (!product) return null;

    const locKeys = Object.keys(product.locations || {});
    const primaryLoc = locKeys[0] || "LOC-WH1-A";
    if (!product.locations) product.locations = {};

    const currentLocStock = product.locations[primaryLoc] || 0;
    product.locations[primaryLoc] = Math.max(0, currentLocStock + deltaQty);

    this.enrichProduct(product);
    product.lastMovement = new Date().toISOString().replace('T', ' ').substring(0, 16);

    this.notify('product:update', product);
    return product;
  }

  // --- Internal Stock Transfer (P0.1) ---
  transferStock(sku, fromLocId, toLocId, qty, notes = "") {
    const prod = this.state.products.find(p => p.sku === sku);
    if (!prod) {
      return { success: false, error: `Product with SKU "${sku}" not found.` };
    }

    if (!prod.locations) prod.locations = {};
    const fromQty = Number(prod.locations[fromLocId]) || 0;
    const transferQty = Number(qty);

    if (transferQty <= 0) {
      return { success: false, error: "Transfer quantity must be greater than 0." };
    }

    if (fromQty < transferQty) {
      return {
        success: false,
        error: `Insufficient stock at source location. Available: ${fromQty} ${prod.uom || 'units'}, Requested: ${transferQty}.`
      };
    }

    // Decrement source, increment destination
    prod.locations[fromLocId] = fromQty - transferQty;
    prod.locations[toLocId] = (Number(prod.locations[toLocId]) || 0) + transferQty;

    // Total company stock stays unchanged
    this.enrichProduct(prod);

    const fromLoc = this.getLocationById(fromLocId);
    const toLoc = this.getLocationById(toLocId);
    const fromName = fromLoc ? `${fromLoc.warehouseId} [${fromLoc.name}]` : fromLocId;
    const toName = toLoc ? `${toLoc.warehouseId} [${toLoc.name}]` : toLocId;

    const mov = this.addMovement({
      reference: `TRF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      type: "TRANSFER",
      sku: prod.sku,
      productName: prod.name,
      qty: transferQty,
      unit: prod.uom || "units",
      source: fromName,
      destination: toName,
      fromLocationId: fromLocId,
      toLocationId: toLocId,
      carrier: "INTERNAL BAY FORKLIFT",
      status: "DONE",
      scheduledDate: new Date().toISOString().substring(0, 10),
      operator: this.state.user ? `${this.state.user.name} [${this.state.user.badgeId}]` : "SYS TELEMETRY",
      responsible: this.state.user ? this.state.user.name : "DISPATCH CONTROLLER",
      contact: "Internal Bay Logistics",
      notes: notes,
      items: [{ sku: prod.sku, name: prod.name, qty: transferQty, uom: prod.uom || "units" }]
    });

    this.notify('product:update', prod);
    return { success: true, movement: mov, product: prod };
  }

  // --- Movements & Lifecycle Actions ---
  getMovements() {
    if (this.state.emptyMode) return [];
    return this.state.movements;
  }

  addMovement(movData) {
    const id = movData.id || `MOV-${Math.floor(1000 + Math.random() * 9000)}`;
    const ref = movData.reference || `REF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newMovement = {
      id: id,
      reference: ref,
      type: movData.type || "TRANSFER",
      sku: movData.sku,
      productName: movData.productName || "Unknown Item",
      qty: Number(movData.qty) || 1,
      unit: movData.unit || "units",
      source: movData.source || "DOCK STAGING",
      destination: movData.destination || "BAY STORAGE",
      fromLocationId: movData.fromLocationId || null,
      toLocationId: movData.toLocationId || null,
      carrier: movData.carrier || "FORKLIFT RUNNER",
      status: movData.status || "DRAFT",
      scheduledDate: movData.scheduledDate || new Date().toISOString().substring(0, 10),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: this.state.user ? `${this.state.user.name} [${this.state.user.badgeId}]` : "SYS TELEMETRY",
      responsible: movData.responsible || (this.state.user ? this.state.user.name : "DISPATCH CONTROLLER"),
      contact: movData.contact || "Standard Logistics Partner",
      notes: movData.notes || "",
      items: movData.items || [
        { sku: movData.sku, name: movData.productName || "Unknown Item", qty: Number(movData.qty) || 1, uom: movData.unit || "units" }
      ]
    };

    if (this.state.emptyMode) {
      this.state.emptyMode = false;
    }

    this.state.movements.unshift(newMovement);
    this.notify('movement:add', newMovement);
    return newMovement;
  }

  validateMovement(id) {
    const mov = this.state.movements.find(m => m.id === id);
    if (!mov || mov.status === 'DONE' || mov.status === 'CANCELED') return null;

    // Lifecycle progression: DRAFT -> WAITING -> READY -> DONE
    if (mov.status === 'DRAFT') {
      mov.status = 'READY';
    } else if (mov.status === 'WAITING') {
      mov.status = 'READY';
    } else if (mov.status === 'READY') {
      mov.status = 'DONE';

      // Physical stock movement upon completion
      if (mov.type === 'RECEIPT' && mov.toLocationId) {
        mov.items?.forEach(item => {
          this.setProductLocationStock(item.sku, mov.toLocationId, (this.getProductBySku(item.sku)?.locations?.[mov.toLocationId] || 0) + item.qty);
        });
      } else if (mov.type === 'DISPATCH' && mov.fromLocationId) {
        mov.items?.forEach(item => {
          this.setProductLocationStock(item.sku, mov.fromLocationId, Math.max(0, (this.getProductBySku(item.sku)?.locations?.[mov.fromLocationId] || 0) - item.qty));
        });
      }
    }

    this.notify('movement:update', mov);
    return mov;
  }

  cancelMovement(id) {
    const mov = this.state.movements.find(m => m.id === id);
    if (!mov || mov.status === 'DONE') return null;

    mov.status = 'CANCELED';
    this.notify('movement:update', mov);
    return mov;
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

    const pendingReceipts = movs.filter(m => m.type === 'RECEIPT' && m.status !== 'DONE' && m.status !== 'CANCELED').length;
    const pendingDispatches = movs.filter(m => m.type === 'DISPATCH' && m.status !== 'DONE' && m.status !== 'CANCELED').length;
    const scheduledTransfers = movs.filter(m => m.type === 'TRANSFER' && m.status !== 'DONE' && m.status !== 'CANCELED').length;

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
    this.state.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.state.movements = JSON.parse(JSON.stringify(INITIAL_MOVEMENTS));
    this.state.locations = [...LOCATIONS];
    this.state.warehouses = [...WAREHOUSES];
    this.state.emptyMode = false;
    this.notify('system:reset', this.state);
  }
}

export const store = new StockSenseStore();
