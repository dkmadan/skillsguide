/**
 * Deterministic seeded random number generator and synthetic dataset builder.
 * Uses Mulberry32 algorithm: 32-bit state, high statistical quality, 100% reproducible.
 */

export function createRng(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandom<T>(rng: () => number, array: T[]): T {
  return array[Math.floor(rng() * array.length)];
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export interface SyntheticDatasetOptions {
  seed?: number;
  size: 'small' | 'medium' | 'large' | number;
  missingRate?: number; // 0.0 to 1.0
  duplicateRate?: number; // 0.0 to 1.0
  outlierRate?: number; // 0.0 to 1.0
}

const REGIONS = ['North', 'West', 'South', 'East', 'Central'];
const QUARTERS: ('Q1' | 'Q2' | 'Q3' | 'Q4')[] = ['Q1', 'Q2', 'Q3', 'Q4'];
const CUSTOMER_NAMES = [
  'Nexus Retail', 'Delta Logistics', 'Vertex Media', 'Sigma Solutions',
  'Orion Traders', 'Zeta Innovations', 'Pinnacle Tech', 'Horizon Group',
  'Quantum Dynamics', 'Omega Labs', 'Aura Systems', 'Apex Corp',
  'Nova Traders', 'Helios Freight', 'Crestline Media', 'Echo Enterprises'
];
const PRODUCT_CATEGORIES = ['Seals & Fittings', 'Valves & Actuators', 'Lubricants', 'Fasteners', 'Sensors'];

export function generateOrdersDataset(options: SyntheticDatasetOptions) {
  const seed = options.seed ?? 42;
  const rng = createRng(seed);
  const count = typeof options.size === 'number'
    ? options.size
    : options.size === 'small' ? 50 : options.size === 'medium' ? 500 : 5000;

  const missingRate = options.missingRate ?? 0.05;
  const duplicateRate = options.duplicateRate ?? 0.03;
  const outlierRate = options.outlierRate ?? 0.02;

  const records: Record<string, unknown>[] = [];

  for (let i = 1; i <= count; i++) {
    const isMissingRegion = rng() < missingRate;
    const isOutlier = rng() < outlierRate;
    const baseQty = isOutlier ? randomInt(rng, 300, 1000) : randomInt(rng, 10, 80);
    const unitPrice = pickRandom(rng, [120, 150, 180, 220, 250, 300, 450]);
    const discount = rng() > 0.4 ? Math.floor(baseQty * unitPrice * 0.1) : 0;
    const status = rng() < 0.08 ? 'Cancelled' : 'Completed';
    const isReturned = status === 'Completed' && rng() < 0.07;

    const row = {
      orderId: `ORD-${String(i).padStart(4, '0')}`,
      customerId: `CUST-${String(randomInt(rng, 1, 20)).padStart(3, '0')}`,
      customer: pickRandom(rng, CUSTOMER_NAMES),
      region: isMissingRegion ? '' : pickRandom(rng, REGIONS),
      quarter: pickRandom(rng, QUARTERS),
      qty: baseQty,
      unitPrice,
      discount,
      status,
      returnStatus: isReturned ? 'Returned' : 'None',
      revenue: status === 'Cancelled' ? 0 : baseQty * unitPrice - discount
    };

    records.push(row);

    // Inject duplicate row if triggered
    if (rng() < duplicateRate && records.length < count) {
      records.push({ ...row, orderId: `ORD-${String(i).padStart(4, '0')}-DUP` });
    }
  }

  return {
    seed,
    records: records.slice(0, count),
    totalRows: Math.min(records.length, count)
  };
}

export function generateCustomersDataset(options: SyntheticDatasetOptions) {
  const seed = options.seed ?? 101;
  const rng = createRng(seed);
  const count = typeof options.size === 'number'
    ? options.size
    : options.size === 'small' ? 20 : options.size === 'medium' ? 100 : 500;

  const records = CUSTOMER_NAMES.slice(0, count).map((name, idx) => ({
    customerId: `CUST-${String(idx + 1).padStart(3, '0')}`,
    name,
    city: pickRandom(rng, ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai']),
    tier: pickRandom(rng, ['Gold', 'Silver', 'Bronze'] as const),
    creditLimit: pickRandom(rng, [50000, 100000, 250000, 500000])
  }));

  return { seed, records, totalRows: records.length };
}

export function generateInventoryDataset(options: SyntheticDatasetOptions) {
  const seed = options.seed ?? 202;
  const rng = createRng(seed);
  const count = typeof options.size === 'number'
    ? options.size
    : options.size === 'small' ? 20 : options.size === 'medium' ? 100 : 500;

  const records: Record<string, unknown>[] = [];
  for (let i = 1; i <= count; i++) {
    const isZeroTarget = rng() < 0.05;
    const isBlankActual = rng() < 0.05;
    const isInvalidActual = rng() < 0.03;

    const targetQty = isZeroTarget ? 0 : randomInt(rng, 40, 150);
    let actualQty: number | string | null = randomInt(rng, 30, 160);
    if (isBlankActual) actualQty = null;
    else if (isInvalidActual) actualQty = 'INVALID';

    records.push({
      sku: `SKU-${String(i).padStart(2, '0')}`,
      item: `Industrial Component ${i}`,
      category: pickRandom(rng, PRODUCT_CATEGORIES),
      targetQty,
      actualQty,
      unitCost: pickRandom(rng, [45, 90, 120, 200, 350, 600])
    });
  }

  return { seed, records, totalRows: records.length };
}
