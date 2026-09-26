// StockSense Initial Seed Data & Definitions

export const WAREHOUSES = [
  { id: "WH-01", name: "WH-01 [MAIN AUTOMATED DOCK]", shortCode: "WH-01", address: "Dock Bay 1-12, Logistics Terminal A" },
  { id: "WH-02", name: "WH-02 [COLD STORAGE VAULT]", shortCode: "WH-02", address: "Temperature Regulated Vault B (-18C to +4C)" },
  { id: "WH-03", name: "WH-03 [PALLET RACKING NORTH]", shortCode: "WH-03", address: "Heavy Industrial Racks, North Yard" },
  { id: "WH-04", name: "WH-04 [HAZMAT INSPECTION PIT]", shortCode: "WH-04", address: "Containment Depot, Hazmat Staging" }
];

export const ZONES = WAREHOUSES; // Alias for backward compatibility

export const LOCATIONS = [
  { id: "LOC-WH1-A", name: "Bay 01-A (Main Staging)", shortCode: "BAY-01-A", warehouseId: "WH-01" },
  { id: "LOC-WH1-B", name: "Bay 02-B (Heavy Machinery)", shortCode: "BAY-02-B", warehouseId: "WH-01" },
  { id: "LOC-WH1-C", name: "Cabinet 01-D (Electronics Vault)", shortCode: "CAB-01-D", warehouseId: "WH-01" },
  { id: "LOC-WH2-A", name: "Bin 02-C (Cryo/Cold Shelf)", shortCode: "BIN-02-C", warehouseId: "WH-02" },
  { id: "LOC-WH3-A", name: "Bin 04-F (Hardware Tier)", shortCode: "BIN-04-F", warehouseId: "WH-03" },
  { id: "LOC-WH3-B", name: "Bin 08-A (Bearing Racks)", shortCode: "BIN-08-A", warehouseId: "WH-03" },
  { id: "LOC-WH4-A", name: "Pit 01 (Hazmat Pit)", shortCode: "PIT-01", warehouseId: "WH-04" }
];

export const UOM_OPTIONS = [
  "units",
  "kg",
  "liters",
  "boxes",
  "packs",
  "meters"
];

export const CATEGORIES = [
  "HYDRAULICS",
  "FASTENERS",
  "MOTORS & BEARINGS",
  "ELECTRONICS",
  "PNEUMATICS"
];

export const INITIAL_PRODUCTS = [
  {
    id: "SKU-HYD-7701",
    sku: "SKU-HYD-7701",
    name: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI",
    category: "HYDRAULICS",
    zone: "WH-01",
    bin: "BAY-01-A",
    uom: "units",
    locations: {
      "LOC-WH1-A": 100,
      "LOC-WH1-B": 42
    },
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
    uom: "packs",
    locations: {
      "LOC-WH3-A": 28
    },
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
    uom: "units",
    locations: {
      "LOC-WH1-B": 12
    },
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
    uom: "units",
    locations: {
      "LOC-WH1-C": 0
    },
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
    uom: "units",
    locations: {
      "LOC-WH2-A": 64
    },
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
    uom: "boxes",
    locations: {
      "LOC-WH3-B": 35
    },
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
    reference: "REC-2026-001",
    type: "RECEIPT",
    sku: "SKU-HYD-7701",
    productName: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI",
    qty: 50,
    unit: "units",
    source: "VENDOR // DANA INC",
    destination: "WH-01 [BAY-01-A]",
    fromLocationId: null,
    toLocationId: "LOC-WH1-A",
    carrier: "FREIGHT-X 88",
    status: "DONE",
    scheduledDate: "2026-09-25",
    timestamp: "2026-09-25 14:32",
    operator: "MARCUS VANCE [OP-49]",
    responsible: "MARCUS VANCE",
    contact: "Dana Industrial Logistics",
    items: [
      { sku: "SKU-HYD-7701", name: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI", qty: 50, uom: "units" }
    ]
  },
  {
    id: "MOV-9082",
    reference: "DEL-2026-004",
    type: "DISPATCH",
    sku: "SKU-ELC-4932",
    productName: "Programmable Logic Controller Modular Base 24VDC",
    qty: 4,
    unit: "units",
    source: "WH-01 [CAB-01-D]",
    destination: "ASSEMBLY PLANT 4",
    fromLocationId: "LOC-WH1-C",
    toLocationId: null,
    carrier: "INTERNAL RUNNER",
    status: "DONE",
    scheduledDate: "2026-09-26",
    timestamp: "2026-09-26 09:40",
    operator: "MARCUS VANCE [OP-49]",
    responsible: "MARCUS VANCE",
    contact: "Assembly Plant 4 Floor Mgr",
    items: [
      { sku: "SKU-ELC-4932", name: "Programmable Logic Controller Modular Base 24VDC", qty: 4, uom: "units" }
    ]
  },
  {
    id: "MOV-9083",
    reference: "TRF-2026-002",
    type: "TRANSFER",
    sku: "SKU-MTR-3011",
    productName: "Deep Groove Sealed Radial Ball Bearings 6205-2RS",
    qty: 25,
    unit: "boxes",
    source: "WH-01 [BAY-01-A]",
    destination: "WH-03 [BIN-08-A]",
    fromLocationId: "LOC-WH1-A",
    toLocationId: "LOC-WH3-B",
    carrier: "FORKLIFT-02",
    status: "READY",
    scheduledDate: "2026-09-26",
    timestamp: "2026-09-26 10:05",
    operator: "ELENA ROSTOVA [OP-12]",
    responsible: "ELENA ROSTOVA",
    contact: "Internal Bay Logistics",
    items: [
      { sku: "SKU-MTR-3011", name: "Deep Groove Sealed Radial Ball Bearings 6205-2RS", qty: 25, uom: "boxes" }
    ]
  },
  {
    id: "MOV-9084",
    reference: "REC-2026-002",
    type: "RECEIPT",
    sku: "SKU-FST-1049",
    productName: "Grade 8 Zinc-Plated Hex Flange Bolts (M16x2.0)",
    qty: 200,
    unit: "packs",
    source: "APEX FASTENER CO.",
    destination: "WH-03 [BIN-04-F]",
    fromLocationId: null,
    toLocationId: "LOC-WH3-A",
    carrier: "DHL EXPRESS",
    status: "WAITING",
    scheduledDate: "2026-09-26",
    timestamp: "2026-09-26 10:45",
    operator: "SYSTEM DOCK QUEUE",
    responsible: "MARCUS VANCE",
    contact: "Apex Supply Rep",
    items: [
      { sku: "SKU-FST-1049", name: "Grade 8 Zinc-Plated Hex Flange Bolts (M16x2.0)", qty: 200, uom: "packs" }
    ]
  },
  {
    id: "MOV-9085",
    reference: "ADJ-2026-001",
    type: "ADJUST",
    sku: "SKU-PNE-3301",
    productName: "Inline Pressure Regulator & Air Filter 1/2\" NPT",
    qty: -2,
    unit: "units",
    source: "WH-02 [BIN-02-C]",
    destination: "DAMAGED RETURN PIT",
    fromLocationId: "LOC-WH2-A",
    toLocationId: "LOC-WH4-A",
    carrier: "QC INSPECTION",
    status: "DONE",
    scheduledDate: "2026-09-26",
    timestamp: "2026-09-26 10:50",
    operator: "MARCUS VANCE [OP-49]",
    responsible: "MARCUS VANCE",
    contact: "QC Lead",
    items: [
      { sku: "SKU-PNE-3301", name: "Inline Pressure Regulator & Air Filter 1/2\" NPT", qty: -2, uom: "units" }
    ]
  },
  {
    id: "MOV-9086",
    reference: "DEL-2026-005",
    type: "DISPATCH",
    sku: "SKU-HYD-7701",
    productName: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI",
    qty: 10,
    unit: "units",
    source: "WH-01 [BAY-01-A]",
    destination: "REGIONAL WORKSHOP 2",
    fromLocationId: "LOC-WH1-A",
    toLocationId: null,
    carrier: "FREIGHT-X 88",
    status: "DRAFT",
    scheduledDate: "2026-09-27",
    timestamp: "2026-09-26 11:15",
    operator: "MARCUS VANCE [OP-49]",
    responsible: "MARCUS VANCE",
    contact: "Workshop 2 Procurement",
    items: [
      { sku: "SKU-HYD-7701", name: "Heavy-Duty Dual Piston Hydraulic Ram 4500 PSI", qty: 10, uom: "units" }
    ]
  }
];
