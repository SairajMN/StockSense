// StockSense Reactive State Store with LocalStorage Persistence
import { INITIAL_PRODUCTS, INITIAL_MOVEMENTS, WAREHOUSES, LOCATIONS, ZONES } from './data.js';

const STORAGE_KEY = 'stocksense_state_v2.5';

// Demo-level password hash (P2.12 - does not persist plaintext)
function mockPasswordHash(plain) {
  if (!plain) return '';
  let hash = 5381;
  for (let i = 0; i < plain.length; i++) {
    hash = ((hash << 5) + hash) + plain.charCodeAt(i);
  }
  return 'SS_HASH_' + Math.abs(hash).toString(36) + '_' + btoa(plain).split('').reverse().join('');
}

// Demo users list for testing and evaluation
export const INITIAL_USERS = [
  {
    loginId: "demo_admin",
    email: "demo@stocksense.io",
    passwordHash: mockPasswordHash("StockSense2026!"),
    badgeId: "OP-1001",
    zone: "WH-01",
    role: "Chief Operations Controller"
  },
  {
    loginId: "marcus12",
    email: "marcus.vance@stocksense.io",
    passwordHash: mockPasswordHash("DemoPass1@"),
    badgeId: "OP-4982",
    zone: "WH-01",
    role: "Warehouse Specialist"
  }
];

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
        if (!parsed.credentials) parsed.credentials = {};
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          parsed.users = JSON.parse(JSON.stringify(INITIAL_USERS));
        } else {
          for (const defUser of INITIAL_USERS) {
            if (!parsed.users.some(u => (u.loginId || '').toLowerCase() === defUser.loginId.toLowerCase())) {
              parsed.users.push(defUser);
            }
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read state from localStorage:', e);
    }

    return {
      user: {
        name: "DEMO ADMIN",
        loginId: "demo_admin",
        email: "demo@stocksense.io",
        badgeId: "OP-1001",
        zone: "WH-01",
        secLevel: "SEC_LVL_04",
        terminal: "TRM-9842-DX",
        role: "Chief Operations Controller"
      },
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
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

  // --- Validation Methods ---
  validateLoginId(loginId) {
    const clean = (loginId || '').trim();
    if (clean.length < 6 || clean.length > 12) {
      return "Login ID must be 6–12 characters.";
    }
    const users = this.state.users || [];
    const exists = users.some(u => (u.loginId || '').toLowerCase() === clean.toLowerCase());
    if (exists) {
      return "This Login ID is already taken.";
    }
    return null;
  }

  validateEmail(email) {
    const clean = (email || '').trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return "Please enter a valid email address.";
    }
    const users = this.state.users || [];
    const exists = users.some(u => (u.email || '').toLowerCase() === clean);
    if (exists) {
      return "This email is already registered.";
    }
    return null;
  }

  validatePassword(password) {
    const missing = [];
    if (!password || password.length <= 8) {
      missing.push("more than 8 characters");
    }
    if (!/[a-z]/.test(password || '')) {
      missing.push("one lowercase letter");
    }
    if (!/[A-Z]/.test(password || '')) {
      missing.push("one uppercase letter");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`^]/.test(password || '')) {
      missing.push("one special character");
    }
    if (missing.length > 0) {
      return `Password must contain: ${missing.join(', ')}.`;
    }
    return null;
  }

  validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  }

  // --- Auth Actions ---
  loginUser(loginId, password) {
    const cleanId = (loginId || '').trim().toLowerCase();
    const hash = mockPasswordHash(password || '');
    const users = this.state.users || [];

    const user = users.find(u => (u.loginId || '').toLowerCase() === cleanId);
    if (!user || user.passwordHash !== hash) {
      return { success: false, error: "Invalid Login Id or Password." };
    }

    const sessionUser = {
      loginId: user.loginId,
      name: user.loginId.toUpperCase(),
      email: user.email,
      badgeId: user.badgeId || `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      zone: user.zone || "WH-01",
      secLevel: "SEC_LVL_04",
      terminal: "TRM-9842-DX",
      role: user.role || "Warehouse Specialist"
    };

    this.state.user = sessionUser;
    this.notify('auth:login', sessionUser);
    return { success: true, user: sessionUser };
  }

  signupUser({ loginId, email, password, confirmPassword }) {
    const loginIdError = this.validateLoginId(loginId);
    const emailError = this.validateEmail(email);
    const passwordError = this.validatePassword(password);
    const confirmError = this.validateConfirmPassword(password, confirmPassword);

    if (loginIdError || emailError || passwordError || confirmError) {
      return {
        success: false,
        errors: {
          loginId: loginIdError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmError
        }
      };
    }

    const newUser = {
      loginId: loginId.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: mockPasswordHash(password),
      badgeId: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      zone: "WH-01",
      role: "Warehouse Specialist"
    };

    if (!this.state.users) this.state.users = [];
    this.state.users.push(newUser);
    this.saveState();

    return { success: true, user: newUser };
  }

  login(loginIdOrEmail, password, remember = true) {
    const res = this.loginUser(loginIdOrEmail, password);
    if (res.success) return res.user;

    const users = this.state.users || [];
    const clean = (loginIdOrEmail || '').trim().toLowerCase();
    const userByEmail = users.find(u => (u.email || '').toLowerCase() === clean);
    if (userByEmail && userByEmail.passwordHash === mockPasswordHash(password || '')) {
      return this.loginUser(userByEmail.loginId, password).user;
    }
    return null;
  }

  signup(name, email, password, zone = "WH-01") {
    const cleanEmail = (email || '').trim().toLowerCase();
    const loginId = (name || cleanEmail.split('@')[0] || "user12").toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(6, '0').slice(0, 12);
    const res = this.signupUser({ loginId, email: cleanEmail, password, confirmPassword: password });
    if (res.success) {
      this.loginUser(loginId, password);
      return this.state.user;
    }
    return null;
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

    // Success: Clear token & update user password record hash (P2.12)
    delete this.state.resetTokens[cleanEmail];
    if (!this.state.credentials) this.state.credentials = {};
    const newHash = mockPasswordHash(newPassword);
    this.state.credentials[cleanEmail] = newHash;

    const user = (this.state.users || []).find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (user) {
      user.passwordHash = newHash;
    }

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

    const threshold = Number(product.safetyThreshold) || Number(product.minStock) || 10;
    product.safetyThreshold = threshold;
    product.minStock = threshold;

    if (totalStock <= 0) product.status = "OUT";
    else if (totalStock <= threshold) product.status = "LOW";
    else product.status = "IN_STOCK";

    // P2: Reordering Rules calculation
    const targetStock = product.reorderQty ? Number(product.reorderQty) : (threshold * 2);
    product.suggestedReorder = (totalStock <= threshold) ? Math.max(0, targetStock - totalStock) : 0;

    return product;
  }

  // P2: Warehouse stock isolation helper
  getWarehouseStock(sku, warehouseId = this.state.currentZone) {
    const prod = this.getProductBySku(sku);
    if (!prod || !prod.locations) return 0;
    const locsInWh = new Set(this.getLocations(warehouseId).map(l => l.id));
    return Object.entries(prod.locations)
      .filter(([locId]) => locsInWh.has(locId))
      .reduce((sum, [, qty]) => sum + (Number(qty) || 0), 0);
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

  updateStockOnHand(sku, newQty) {
    const prod = this.state.products.find(p => p.sku === sku);
    if (!prod) return null;
    if (!prod.locations) prod.locations = {};
    const locKeys = Object.keys(prod.locations);
    const targetLoc = locKeys.length > 0 ? locKeys[0] : "LOC-WH1-A";
    locKeys.forEach(k => {
      if (k !== targetLoc) prod.locations[k] = 0;
    });
    this.setProductLocationStock(sku, targetLoc, Math.max(0, Number(newQty) || 0));
    return this.enrichProduct(prod);
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
    if (!mov) return null;
    if (mov.status === 'DONE' || mov.status === 'CANCELED') return mov;

    // Lifecycle progression: DRAFT -> WAITING -> READY -> DONE
    if (mov.status === 'DRAFT') {
      mov.status = 'READY';
    } else if (mov.status === 'WAITING') {
      mov.status = 'READY';
    } else if (mov.status === 'READY') {
      mov.status = 'DONE';

      // Physical stock movement upon completion
      if (mov.type === 'RECEIPT') {
        const targetLoc = mov.toLocationId || "LOC-WH1-A";
        mov.items?.forEach(item => {
          const cur = this.getProductBySku(item.sku)?.locations?.[targetLoc] || 0;
          this.setProductLocationStock(item.sku, targetLoc, cur + Math.abs(Number(item.qty) || 0));
        });
      } else if (mov.type === 'DISPATCH') {
        const sourceLoc = mov.fromLocationId || "LOC-WH1-A";
        mov.items?.forEach(item => {
          const cur = this.getProductBySku(item.sku)?.locations?.[sourceLoc] || 0;
          this.setProductLocationStock(item.sku, sourceLoc, Math.max(0, cur - Math.abs(Number(item.qty) || 0)));
        });
      }
    }

    this.notify('movement:update', mov);
    return mov;
  }

  cancelMovement(id) {
    const mov = this.state.movements.find(m => m.id === id);
    if (!mov) return null;
    if (mov.status === 'DONE') return mov;

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
