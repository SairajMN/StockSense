// StockSense Comprehensive Automated Test Suite
// Tests all P0, P1, P2 features, auth validation, and inventory workflows

import assert from 'assert';

// Mock localStorage for Node environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

// Dynamic import of store
const { store } = await import('../../../../../Desktop/StockSense/js/store.js');
const { INITIAL_PRODUCTS, LOCATIONS, WAREHOUSES } = await import('../../../../../Desktop/StockSense/js/data.js');

let testsPassed = 0;
let testsFailed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    testsPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}`);
    console.error(`         ${err.message}`);
    testsFailed++;
  }
}

console.log("\n=======================================================");
console.log("   STOCKSENSE AUTOMATED VERIFICATION TEST SUITE");
console.log("=======================================================\n");

// 1. Authentication & User Database Tests
console.log("--- 1. Auth Validation & User Credentials ---");

it("Demo accounts exist in initial state", () => {
  const users = store.state.users;
  assert(Array.isArray(users), "users should be an array");
  const demoAdmin = users.find(u => u.loginId === 'demo_admin');
  assert(demoAdmin, "demo_admin should be present");
  const marcus = users.find(u => u.loginId === 'marcus12');
  assert(marcus, "marcus12 should be present");
});

it("Login with valid demo_admin credentials succeeds", () => {
  const res = store.loginUser("demo_admin", "StockSense2026!");
  assert(res.success, "Login should succeed");
  assert.strictEqual(res.user.loginId, "demo_admin");
  assert.strictEqual(store.state.user.loginId, "demo_admin");
});

it("Login with wrong password fails with exact spec error message", () => {
  const res = store.loginUser("demo_admin", "WrongPass123!");
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, "Invalid Login Id or Password.");
});

it("Login with non-existent Login ID fails with exact spec error message", () => {
  const res = store.loginUser("nonexistent_id", "StockSense2026!");
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.error, "Invalid Login Id or Password.");
});

it("Login ID validation enforces 6–12 characters length", () => {
  assert(store.validateLoginId("short"), "Should reject <6 chars");
  assert(store.validateLoginId("toolongloginid123"), "Should reject >12 chars");
  assert.strictEqual(store.validateLoginId("valid_id"), null, "Should accept 6-12 chars");
});

it("Login ID validation enforces uniqueness", () => {
  const err = store.validateLoginId("demo_admin");
  assert.strictEqual(err, "This Login ID is already taken.");
});

it("Email validation enforces uniqueness", () => {
  const err = store.validateEmail("demo@stocksense.io");
  assert.strictEqual(err, "This email is already registered.");
});

it("Password validation lists all missing complexity requirements", () => {
  // Missing all: length, uppercase, lowercase, special char
  const err1 = store.validatePassword("123");
  assert(err1.includes("more than 8 characters"), "Should report length");
  assert(err1.includes("one lowercase letter"), "Should report lowercase");
  assert(err1.includes("one uppercase letter"), "Should report uppercase");
  assert(err1.includes("one special character"), "Should report special character");

  // Valid password
  const validErr = store.validatePassword("ValidPass2026!");
  assert.strictEqual(validErr, null, "Strong password should have no errors");
});

it("Re-Enter Password must match Password exactly", () => {
  assert.strictEqual(store.validateConfirmPassword("Pass123!", "Pass123!"), null);
  assert.strictEqual(store.validateConfirmPassword("Pass123!", "Mismatch!"), "Passwords do not match.");
});

it("Signup creates a new user record and does NOT auto-login", () => {
  const prevUser = store.state.user;
  const newLoginId = "test_user_99";
  const res = store.signupUser({
    loginId: newLoginId,
    email: "test99@example.com",
    password: "TestPassword99@",
    confirmPassword: "TestPassword99@"
  });
  assert(res.success, "Signup should succeed");
  assert.strictEqual(res.user.loginId, newLoginId);
  // Must NOT auto log in
  assert.strictEqual(store.state.user, prevUser);

  // Now logging in with the new user credentials succeeds
  const loginRes = store.loginUser(newLoginId, "TestPassword99@");
  assert(loginRes.success, "New user can log in");
  assert.strictEqual(store.state.user.loginId, newLoginId);
});

// 2. OTP Password Reset Flow
console.log("\n--- 2. OTP Password Reset Flow ---");

it("Generates 6-digit OTP code with expiration", () => {
  const res = store.requestPasswordReset("test99@example.com");
  assert(res.success, "Password reset request should succeed");
  assert.strictEqual(res.otp.length, 6, "OTP must be 6 digits");
  assert(res.expiresAt > Date.now(), "Expiry must be in the future");
});

it("Fails verification with wrong OTP code", () => {
  const res = store.verifyResetOtp("test99@example.com", "000000", "NewPass2026!");
  assert.strictEqual(res.success, false);
});

it("Succeeds verification with correct OTP and updates password", () => {
  const token = store.state.resetTokens["test99@example.com"];
  const correctOtp = token.otp;
  const res = store.verifyResetOtp("test99@example.com", correctOtp, "NewSecretKey2026#");
  assert(res.success, "OTP verification should succeed");

  // Old password should now fail
  const oldLogin = store.loginUser("test_user_99", "TestPassword99@");
  assert.strictEqual(oldLogin.success, false);

  // New password should succeed
  const newLogin = store.loginUser("test_user_99", "NewSecretKey2026#");
  assert(newLogin.success, "Login with updated password should succeed");
});

// 3. Products Catalog & Unit of Measure (UOM)
console.log("\n--- 3. Products Catalog & Unit of Measure (UOM) ---");

it("Products have uom field and calculate total stock across bays", () => {
  const prods = store.getProducts();
  assert(prods.length > 0, "Products should exist");
  const p1 = prods[0];
  assert(p1.uom, "Product must have uom field");
  assert(typeof p1.locations === 'object', "Product must have locations map");
  
  // Verify sum across locations equals product.stock
  const expectedSum = Object.values(p1.locations).reduce((a, b) => a + b, 0);
  assert.strictEqual(p1.stock, expectedSum, "Total stock must equal sum of location bays");
});

it("Can add product with custom UOM and initial location stock", () => {
  const newSku = "SKU-TST-8800";
  const created = store.addProduct({
    sku: newSku,
    name: "Industrial Synthetic Lubricant ISO 68",
    category: "HYDRAULICS",
    uom: "liters",
    unitCost: 45.00,
    stock: 250,
    locationId: "LOC-WH1-A",
    safetyThreshold: 50
  });

  assert.strictEqual(created.sku, newSku);
  assert.strictEqual(created.uom, "liters");
  assert.strictEqual(created.locations["LOC-WH1-A"], 250);
  assert.strictEqual(created.stock, 250);
});

it("Can update an existing product", () => {
  const updated = store.updateProduct("SKU-TST-8800", {
    name: "Industrial Synthetic Lubricant ISO 68 - Extended Life",
    unitCost: 49.50
  });
  assert(updated);
  assert.strictEqual(updated.name, "Industrial Synthetic Lubricant ISO 68 - Extended Life");
  assert.strictEqual(updated.unitCost, 49.50);
});

// 4. Dedicated Editable Stock & Free-to-Use Calculation
console.log("\n--- 4. Dedicated Stock Ledger & Free-to-Use ---");

it("Directly edits on-hand stock inline", () => {
  const sku = "SKU-TST-8800";
  store.updateStockOnHand(sku, 320);
  const prod = store.getProductBySku(sku);
  assert.strictEqual(prod.stock, 320, "On hand stock should be updated to 320");
});

it("Calculates Free to Use stock deducting open delivery orders", () => {
  const sku = "SKU-TST-8800";
  const initialFree = store.getProductFreeToUse(sku);
  assert.strictEqual(initialFree, 320);

  // Add an outgoing dispatch in READY state (reserving 50 units)
  store.addMovement({
    type: "DISPATCH",
    sku: sku,
    qty: -50,
    status: "READY"
  });

  const freeAfterReservation = store.getProductFreeToUse(sku);
  assert.strictEqual(freeAfterReservation, 270, "Free to use should be 320 - 50 = 270");
});

// 5. Internal Transfers (Preserves Company Stock Invariant)
console.log("\n--- 5. Internal Transfers (Preserving Total Company Stock) ---");

it("Internal transfer moves stock between bays and preserves total company stock", () => {
  const sku = "SKU-TST-8800";
  const prodBefore = store.getProductBySku(sku);
  const totalBefore = prodBefore.stock;
  const locABefore = prodBefore.locations["LOC-WH1-A"] || 0;
  const locBBefore = prodBefore.locations["LOC-WH1-B"] || 0;

  const transferQty = 40;
  const res = store.transferStock(sku, "LOC-WH1-A", "LOC-WH1-B", transferQty, "Bay relocation");
  assert(res.success, "Transfer should succeed");

  const prodAfter = store.getProductBySku(sku);
  assert.strictEqual(prodAfter.locations["LOC-WH1-A"], locABefore - transferQty, "Source bay must decrease by 40");
  assert.strictEqual(prodAfter.locations["LOC-WH1-B"], locBBefore + transferQty, "Destination bay must increase by 40");
  assert.strictEqual(prodAfter.stock, totalBefore, "TOTAL COMPANY STOCK MUST BE UNCHANGED");

  // Verify movement history log entry
  const lastMove = store.getMovements()[0];
  assert.strictEqual(lastMove.type, "TRANSFER");
  assert.strictEqual(lastMove.sku, sku);
  assert.strictEqual(lastMove.qty, transferQty);
});

// 6. Status Lifecycle & Read-Only on DONE
console.log("\n--- 6. Status Lifecycle & Read-Only State ---");

it("Movement status advances Draft -> Ready -> Done and locks fields", () => {
  const mov = store.addMovement({
    type: "RECEIPT",
    sku: "SKU-TST-8800",
    qty: 25,
    status: "DRAFT"
  });
  assert.strictEqual(mov.status, "DRAFT");

  const validatedToReady = store.validateMovement(mov.id);
  assert.strictEqual(validatedToReady.status, "READY");

  const validatedToDone = store.validateMovement(mov.id);
  assert.strictEqual(validatedToDone.status, "DONE");

  // Validating an already DONE movement returns the existing locked movement
  const doneAttempt = store.validateMovement(mov.id);
  assert.strictEqual(doneAttempt.status, "DONE");
});

it("Canceling a non-done movement sets status to CANCELED", () => {
  const mov = store.addMovement({
    type: "DISPATCH",
    sku: "SKU-TST-8800",
    qty: -10,
    status: "WAITING"
  });

  const canceled = store.cancelMovement(mov.id);
  assert.strictEqual(canceled.status, "CANCELED");
});

// 7. Reordering Rules
console.log("\n--- 7. Reordering Rules Calculation ---");

it("Surfaces suggested replenishment when stock drops below threshold", () => {
  const sku = "SKU-TST-8800";
  // Set stock to 20 (threshold is 50)
  store.updateStockOnHand(sku, 20);
  const prod = store.getProductBySku(sku);
  assert.strictEqual(prod.status, "LOW");
  // target is threshold * 2 = 100, suggested is 100 - 20 = 80
  assert(prod.suggestedReorder > 0, "Suggested reorder quantity must be > 0");
  assert.strictEqual(prod.suggestedReorder, 80);
});

// 8. Locations & Warehouses Entity Structure
console.log("\n--- 8. Multi-Bay Locations & Warehouses ---");

it("Supports adding location linked to warehouseId", () => {
  const newLoc = store.addLocation({
    name: "Sub-Depot Bay 9-North",
    shortCode: "BAY-09-N",
    warehouseId: "WH-03"
  });
  assert(newLoc.id);
  assert.strictEqual(newLoc.warehouseId, "WH-03");

  const wh3Locs = store.getLocations("WH-03");
  assert(wh3Locs.some(l => l.shortCode === "BAY-09-N"));
});

// 9. Delete Product with Stock Clean-Up
console.log("\n--- 9. Product Deletion ---");

it("Deletes product from catalog", () => {
  const sku = "SKU-TST-8800";
  const deleted = store.deleteProduct(sku);
  assert(deleted);
  const notFound = store.getProductBySku(sku);
  assert.strictEqual(notFound, null, "Deleted SKU must no longer be found");
});

console.log("\n=======================================================");
console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log("=======================================================\n");

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
