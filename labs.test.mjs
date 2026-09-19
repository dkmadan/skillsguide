import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRng, generateOrdersDataset } from './src/lib/labs/seedGenerator.ts';
import { evaluateFormula, isFormulaError } from './src/lib/labs/formulaParser.ts';
import { evaluateContrast } from './src/lib/labs/colorUtils.ts';
import { parseCsvText, sanitizeCsvCell } from './src/lib/labs/dataUtils.ts';
import { LAB_SCENARIOS_REGISTRY } from './src/data/labsScenariosData.ts';

test('SeedGenerator: Deterministic replay with Mulberry32 PRNG', () => {
  const rng1 = createRng(12345);
  const rng2 = createRng(12345);
  const rng3 = createRng(99999);

  const seq1 = [rng1(), rng1(), rng1(), rng1()];
  const seq2 = [rng2(), rng2(), rng2(), rng2()];
  const seq3 = [rng3(), rng3(), rng3(), rng3()];

  assert.deepEqual(seq1, seq2, 'Identical seeds must produce identical pseudorandom streams');
  assert.notDeepEqual(seq1, seq3, 'Different seeds must produce different pseudorandom streams');

  // Test dataset generation reproducibility
  const ordersA = generateOrdersDataset({ size: 100, seed: 42 });
  const ordersB = generateOrdersDataset({ size: 100, seed: 42 });
  assert.deepEqual(ordersA, ordersB, 'Seeded dataset generator must reproduce exact records');
  assert.equal(ordersA.records.length, 100);
});

test('FormulaParser: Bounded arithmetic, order of operations, and math functions without eval', () => {
  const emptyContext = { getCellValue: () => null };

  assert.equal(evaluateFormula('=10 + 20', emptyContext), 30);
  assert.equal(evaluateFormula('=ROUND(12.3456, 2)', emptyContext), 12.35);
  assert.equal(evaluateFormula('=MAX(5, 12, 8)', emptyContext), 12);
  assert.equal(evaluateFormula('=MIN(5, 12, 8)', emptyContext), 5);
  
  const divZero = evaluateFormula('=100 / 0', emptyContext);
  assert.ok(isFormulaError(divZero) && divZero.type === '#DIV/0!');

  const unknownFunc = evaluateFormula('=UNKNOWNFUNC(1, 2)', emptyContext);
  assert.ok(isFormulaError(unknownFunc) && unknownFunc.type === '#NAME?');
});

test('FormulaParser: Grid cell ranges and lookups', () => {
  const grid = {
    A1: 10,
    A2: 20,
    A3: 30,
    B1: 'Apples',
    B2: 'Bananas',
    B3: 'Cherries',
  };

  const context = {
    getCellValue: (cell) => {
      const norm = cell.toUpperCase().replace(/\$/g, '');
      return grid[norm] ?? null;
    }
  };

  assert.equal(evaluateFormula('=SUM(A1:A3)', context), 60);
  assert.equal(evaluateFormula('=AVERAGE(A1:A3)', context), 20);
  assert.equal(evaluateFormula('=MIN(A1:A3)', context), 10);
  assert.equal(evaluateFormula('=MAX(A1:A3)', context), 30);
  assert.equal(evaluateFormula('=COUNT(A1:A3)', context), 3);
  assert.equal(evaluateFormula('=IF(A1 > 5, "High", "Low")', context), 'High');
  assert.equal(evaluateFormula('=IF(A1 > 50, "High", "Low")', context), 'Low');
  assert.equal(evaluateFormula('=CONCATENATE(B1, " & ", B2)', context), 'Apples & Bananas');
});

test('ColorUtils: Mathematical WCAG contrast calculation', () => {
  // Black on white is 21:1
  const bw = evaluateContrast('#000000', '#ffffff');
  assert.ok(Math.abs(bw.ratio - 21) < 0.1, `Black on white contrast should be ~21:1, got ${bw.ratio}`);
  assert.equal(bw.wcagAANormal, true);
  assert.equal(bw.wcagAAANormal, true);

  // White on white is 1:1
  const ww = evaluateContrast('#ffffff', '#ffffff');
  assert.ok(Math.abs(ww.ratio - 1) < 0.1, `White on white contrast should be ~1:1, got ${ww.ratio}`);
  assert.equal(ww.wcagAANormal, false);

  // Mid gray #777777 on white is ~4.48:1
  const grayWhite = evaluateContrast('#777777', '#ffffff');
  assert.equal(grayWhite.wcagAANormal, false, 'Fails normal text AA (requires 4.5)');
  assert.equal(grayWhite.wcagAALarge, true, 'Passes large text AA (requires 3.0)');
});

test('DataUtils: CSV parsing limits, validation and formula injection sanitization', () => {
  // Formula injection defense: cells starting with =, +, -, @ must be escaped
  assert.equal(sanitizeCsvCell('=cmd|/c calc'), "\"'=cmd|/c calc\"");
  assert.equal(sanitizeCsvCell('+12345'), "\"'+12345\"");
  assert.equal(sanitizeCsvCell('-100'), "\"'-100\"");
  assert.equal(sanitizeCsvCell('@SUM(A1:A10)'), "\"'@SUM(A1:A10)\"");
  assert.equal(sanitizeCsvCell('Normal text'), "\"Normal text\"");

  // CSV parsing with schema
  const csvData = `id,name,amount\n1,Alice,150\n2,Bob,200\n3,Charlie,invalid_number`;
  const schema = [
    { key: 'id', label: 'ID', type: 'string', required: true },
    { key: 'name', label: 'Name', type: 'string', required: true },
    { key: 'amount', label: 'Amount', type: 'number', required: true }
  ];

  const result = parseCsvText(csvData, schema);
  assert.equal(result.totalRows, 3);
  assert.equal(result.records.length, 3);
  assert.equal(result.records[0].amount, 150);
  assert.equal(result.records[1].amount, 200);
  assert.equal(result.errors.length, 1, 'Should record error for row with invalid number');
});

test('Labs Registry: All 30 labs have at least 6 authored scenarios with full requirements', () => {
  const registeredSlugs = Object.keys(LAB_SCENARIOS_REGISTRY);
  assert.equal(registeredSlugs.length, 30, `Must register scenarios for all 30 labs, got ${registeredSlugs.length}`);

  for (const slug of registeredSlugs) {
    const scenarios = LAB_SCENARIOS_REGISTRY[slug];
    assert.ok(scenarios.length >= 6, `Lab ${slug} must provide at least 6 scenarios, found ${scenarios.length}`);

    for (const sc of scenarios) {
      assert.ok(sc.id, `Scenario in ${slug} must have an id`);
      assert.ok(sc.title, `Scenario in ${slug} must have a title`);
      assert.ok(sc.objective, `Scenario ${sc.id} in ${slug} must have an objective`);
      assert.ok(sc.editableInputs?.length > 0, `Scenario ${sc.id} in ${slug} must specify editable inputs`);
      assert.ok(sc.constraints?.length > 0, `Scenario ${sc.id} in ${slug} must specify constraints`);
      assert.ok(sc.evaluationMethod, `Scenario ${sc.id} in ${slug} must specify an evaluation method`);
      assert.ok(sc.assumptions, `Scenario ${sc.id} in ${slug} must specify simulation assumptions`);
      assert.ok(sc.hints && sc.hints.length >= 2, `Scenario ${sc.id} in ${slug} must have progressive hints`);
    }
  }
});
