// StockSense Initial Seed Data & Definitions

export const INITIAL_PRODUCTS = [
  {
    id: "SKU-HYD-7701",
    sku: "SKU-HYD-7701",
    name: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI",
    category: "HYDRAULICS",
    zone: "WH-01",
    bin: "BAY-01-A",
    stock: 142,
    safetyThreshold: 40,
    unitCost: 285.50,
    status: "IN_STOCK",
    lastMovement: "2026-09-25 14:32",
    barcode: "847291048291",
    spec: "Bore 4.0in / Stroke 24in / Nitride Rod"
  },
  {
    id: "SKU-FST-1049",
    sku: "SKU-FST-1049",
    name: "Grade 8 Zinc-Plated Hex Flange Bolts (M16x2.0)",
    category: "FASTENERS",
    zone: "WH-03",
    bin: "BIN-04-F",
    stock: 28,
    safetyThreshold: 50,
    unitCost: 1.85,
    status: "LOW",
    lastMovement: "2026-09-26 08:15",
    barcode: "719302847261",
    spec: "Box of 100 / High Tensile Steel"
  },
  {
    id: "SKU-MTR-8820",
    sku: "SKU-MTR-8820",
    name: "3-Phase Induction Electric Motor 15HP 1750RPM",
    category: "MOTORS & BEARINGS",
    zone: "WH-01",
    bin: "BAY-02-B",
    stock: 12,
    safetyThreshold: 10,
    unitCost: 890.00,
    status: "IN_STOCK",
    lastMovement: "2026-09-24 11:20",
    barcode: "928374019283",
    spec: "TEFC / 230/460V / Cast Iron Housing"
  },
  {
    id: "SKU-ELC-4932",
    sku: "SKU-ELC-4932",
    name: "Programmable Logic Controller Modular Base 24VDC",
    category: "ELECTRONICS",
    zone: "WH-01",
    bin: "CAB-01-D",
    stock: 0,
    safetyThreshold: 5,
    unitCost: 520.00,
    status: "OUT",
    lastMovement: "2026-09-26 09:40",
    barcode: "638291038472",
    spec: "16 DI / 16 DO / Ethernet IP & Modbus"
  },
  {
    id: "SKU-PNE-3301",
    sku: "SKU-PNE-3301",
    name: "Inline Pressure Regulator & Air Filter 1/2\" NPT",
    category: "PNEUMATICS",
    zone: "WH-02",
    bin: "BIN-02-C",
    stock: 64,
    safetyThreshold: 20,
    unitCost: 74.20,
    status: "IN_STOCK",
    lastMovement: "2026-09-23 16:55",
    barcode: "549281740294",
    spec: "0-160 PSI Gauge / Auto Drain Poly Bowl"
  },
  {
    id: "SKU-MTR-3011",
    sku: "SKU-MTR-3011",
    name: "Deep Groove Sealed Radial Ball Bearings 6205-2RS",
    category: "MOTORS & BEARINGS",
    zone: "WH-03",
    bin: "BIN-08-A",
    stock: 35,
    safetyThreshold: 60,
    unitCost: 14.50,
    status: "LOW",
    lastMovement: "2026-09-26 10:05",
    barcode: "482019385012",
    spec: "25x52x15mm / Nitrile Rubber Seal"
  }
];

export const INITIAL_MOVEMENTS = [
  {
    id: "MOV-9081",
    type: "RECEIPT",
    sku: "SKU-HYD-7701",
    productName: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI",
    qty: 50,
    unit: "UNITS",
    source: "VENDOR // DANA INC",
    destination: "WH-01 [BAY-01-A]",
    carrier: "FREIGHT-X 88",
    status: "DONE",
    timestamp: "2026-09-25 14:32",
    operator: "MARCUS VANCE [OP-49]"
  },
  {
    id: "MOV-9082",
    type: "DISPATCH",
    sku: "SKU-ELC-4932",
    productName: "Programmable Logic Controller Modular Base 24VDC",
    qty: 4,
    unit: "UNITS",
    source: "WH-01 [CAB-01-D]",
    destination: "ASSEMBLY PLANT 4",
    carrier: "INTERNAL RUNNER",
    status: "DONE",
    timestamp: "2026-09-26 09:40",
    operator: "MARCUS VANCE [OP-49]"
  },
  {
    id: "MOV-9083",
    type: "TRANSFER",
    sku: "SKU-MTR-3011",
    productName: "Deep Groove Sealed Radial Ball Bearings 6205-2RS",
    qty: 25,
    unit: "BOXES",
    source: "WH-01 [STAGING]",
    destination: "WH-03 [BIN-08-A]",
    carrier: "FORKLIFT-02",
    status: "READY",
    timestamp: "2026-09-26 10:05",
    operator: "ELENA ROSTOVA [OP-12]"
  },
  {
    id: "MOV-9084",
    type: "RECEIPT",
    sku: "SKU-FST-1049",
    productName: "Grade 8 Zinc-Plated Hex Flange Bolts (M16x2.0)",
    qty: 200,
    unit: "PACKS",
    source: "APEX FASTENER CO.",
    destination: "WH-03 [BIN-04-F]",
    carrier: "DHL EXPRESS",
    status: "WAITING",
    timestamp: "2026-09-26 10:45",
    operator: "SYSTEM DOCK QUEUE"
  },
  {
    id: "MOV-9085",
    type: "ADJUST",
    sku: "SKU-PNE-3301",
    productName: "Inline Pressure Regulator & Air Filter 1/2\" NPT",
    qty: -2,
    unit: "UNITS",
    source: "WH-02 [BIN-02-C]",
    destination: "DAMAGED RETURN PIT",
    carrier: "QC INSPECTION",
    status: "DONE",
    timestamp: "2026-09-26 10:50",
    operator: "MARCUS VANCE [OP-49]"
  }
];

export const ZONES = [
  { id: "WH-01", name: "WH-01 [MAIN AUTOMATED DOCK]", desc: "High-bay automated pallet retrieval and central sorting" },
  { id: "WH-02", name: "WH-02 [COLD STORAGE VAULT]", desc: "Temperature regulated environment (-18C to +4C)" },
  { id: "WH-03", name: "WH-03 [PALLET RACKING NORTH]", desc: "Heavy industrial racking & long-span raw materials" },
  { id: "WH-04", name: "WH-04 [HAZMAT INSPECTION PIT]", desc: "Flammables, chemicals & containment staging" }
];

export const CATEGORIES = [
  "HYDRAULICS",
  "FASTENERS",
  "MOTORS & BEARINGS",
  "ELECTRONICS",
  "PNEUMATICS"
];
