/**
 * Bounded, secure formula parser and evaluator for educational spreadsheet labs.
 * Strictly adheres to safe AST parsing without ever invoking `eval()` or `Function()`.
 */

export type CellValue = string | number | boolean | null;

export interface SheetGrid {
  [cellAddress: string]: {
    raw: string; // User input, e.g. "=SUM(A1:A5)" or "150"
    computed?: CellValue;
    error?: string;
  };
}

export interface FormulaError {
  isError: true;
  type: '#DIV/0!' | '#REF!' | '#NAME?' | '#VALUE!' | '#N/A' | '#CIRCULAR!';
  message: string;
}

export function isFormulaError(val: unknown): val is FormulaError {
  return typeof val === 'object' && val !== null && (val as FormulaError).isError === true;
}

// Convert "A" -> 1, "Z" -> 26, "AA" -> 27
export function colLettersToIndex(colLetters: string): number {
  let index = 0;
  const upper = colLetters.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index;
}

// Convert 1 -> "A", 26 -> "Z", 27 -> "AA"
export function indexToColLetters(colIndex: number): string {
  let letters = '';
  let temp = colIndex;
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    temp = Math.floor((temp - 1) / 26);
  }
  return letters;
}

// Parse "A1" or "$A$1" into { col: 1, row: 1, colFixed: boolean, rowFixed: boolean, raw: string }
export function parseCellAddress(addr: string): { col: number; row: number; colFixed: boolean; rowFixed: boolean } | null {
  const match = addr.trim().match(/^(\$?)([A-Za-z]+)(\$?)([0-9]+)$/);
  if (!match) return null;
  const colFixed = match[1] === '$';
  const col = colLettersToIndex(match[2]);
  const rowFixed = match[3] === '$';
  const row = parseInt(match[4], 10);
  return { col, row, colFixed, rowFixed };
}

// Expand a range like "A1:B3" into array of addresses ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']
export function expandRange(rangeStr: string): string[] | null {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return null;
  const start = parseCellAddress(parts[0]);
  const end = parseCellAddress(parts[1]);
  if (!start || !end) return null;

  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  const addresses: string[] = [];
  for (let c = minCol; c <= maxCol; c++) {
    const colName = indexToColLetters(c);
    for (let r = minRow; r <= maxRow; r++) {
      addresses.push(`${colName}${r}`);
    }
  }
  return addresses;
}

// Allowlisted built-in functions
const ALLOWED_FUNCTIONS = new Set([
  'SUM', 'AVERAGE', 'COUNT', 'COUNTA', 'IF', 'MIN', 'MAX', 'ROUND', 'XLOOKUP', 'VLOOKUP', 'CONCATENATE'
]);

export interface EvalContext {
  getCellValue: (cellAddr: string) => CellValue | FormulaError;
  evaluatingStack?: Set<string>;
}

/**
 * Tokenizes and evaluates an expression like:
 * "SUM(A1:A5) + 10" or "IF(B2=0, 0, A2/B2)" or "XLOOKUP(A2, A10:A20, B10:B20)"
 */
export function evaluateFormula(formula: string, context: EvalContext): CellValue | FormulaError {
  const clean = formula.trim().startsWith('=') ? formula.trim().slice(1).trim() : formula.trim();

  // Pure number check
  if (!isNaN(Number(clean)) && clean !== '') {
    return Number(clean);
  }

  // Quoted string check
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    return clean.slice(1, -1);
  }

  // Direct cell reference check (e.g. "A1" or "$A$1")
  const directCell = parseCellAddress(clean);
  if (directCell) {
    const normalized = `${indexToColLetters(directCell.col)}${directCell.row}`;
    return context.getCellValue(normalized);
  }

  // Function call parsing: NAME(arg1, arg2, ...)
  const funcMatch = clean.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(([\s\S]*)\)$/);
  if (funcMatch) {
    const funcName = funcMatch[1].toUpperCase();
    const rawArgs = splitArguments(funcMatch[2]);

    if (!ALLOWED_FUNCTIONS.has(funcName)) {
      return { isError: true, type: '#NAME?', message: `Unsupported function: ${funcName}` };
    }

    return executeFunction(funcName, rawArgs, context);
  }

  // Basic arithmetic evaluation: +, -, *, /
  return parseArithmetic(clean, context);
}

// Helper to safely split arguments respecting nested parentheses and quotes
function splitArguments(argStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;

  for (let i = 0; i < argStr.length; i++) {
    const char = argStr[i];
    if (char === '"' || char === "'") inQuotes = !inQuotes;
    else if (!inQuotes && char === '(') depth++;
    else if (!inQuotes && char === ')') depth--;
    else if (!inQuotes && char === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim() !== '') {
    args.push(current.trim());
  }
  return args;
}

// Execute verified allowlisted spreadsheet functions
function executeFunction(name: string, rawArgs: string[], context: EvalContext): CellValue | FormulaError {
  switch (name) {
    case 'SUM': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      return vals.reduce<number>((acc: number, v) => acc + (typeof v === 'number' ? v : 0), 0);
    }
    case 'AVERAGE': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      const numVals = vals.filter((v): v is number => typeof v === 'number');
      if (numVals.length === 0) return { isError: true, type: '#DIV/0!', message: 'AVERAGE of 0 numeric values' };
      return Math.round((numVals.reduce((a, b) => a + b, 0) / numVals.length) * 100) / 100;
    }
    case 'COUNT': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      return vals.filter(v => typeof v === 'number').length;
    }
    case 'COUNTA': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      return vals.filter(v => v !== null && v !== '').length;
    }
    case 'MIN': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      const numVals = vals.filter((v): v is number => typeof v === 'number');
      return numVals.length > 0 ? Math.min(...numVals) : 0;
    }
    case 'MAX': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      const numVals = vals.filter((v): v is number => typeof v === 'number');
      return numVals.length > 0 ? Math.max(...numVals) : 0;
    }
    case 'ROUND': {
      if (rawArgs.length < 1) return { isError: true, type: '#VALUE!', message: 'ROUND requires 1 or 2 arguments' };
      const val = evaluateFormula(rawArgs[0], context);
      if (isFormulaError(val)) return val;
      const digits = rawArgs.length > 1 ? Number(evaluateFormula(rawArgs[1], context)) : 0;
      if (typeof val !== 'number') return { isError: true, type: '#VALUE!', message: 'ROUND argument must be numeric' };
      const factor = Math.pow(10, digits || 0);
      return Math.round(val * factor) / factor;
    }
    case 'IF': {
      if (rawArgs.length < 2) return { isError: true, type: '#VALUE!', message: 'IF requires at least condition and true value' };
      const conditionRes = evaluateComparison(rawArgs[0], context);
      if (isFormulaError(conditionRes)) return conditionRes;
      if (conditionRes === true) {
        return evaluateFormula(rawArgs[1], context);
      } else {
        return rawArgs[2] ? evaluateFormula(rawArgs[2], context) : false;
      }
    }
    case 'XLOOKUP': {
      // XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
      if (rawArgs.length < 3) return { isError: true, type: '#VALUE!', message: 'XLOOKUP requires lookup_value, lookup_array, return_array' };
      const lookupVal = evaluateFormula(rawArgs[0], context);
      if (isFormulaError(lookupVal)) return lookupVal;

      const lookupRange = expandRange(rawArgs[1]);
      const returnRange = expandRange(rawArgs[2]);
      if (!lookupRange || !returnRange) {
        return { isError: true, type: '#REF!', message: 'Invalid range in XLOOKUP' };
      }
      if (lookupRange.length !== returnRange.length) {
        return { isError: true, type: '#VALUE!', message: 'XLOOKUP arrays must have equal length' };
      }

      for (let i = 0; i < lookupRange.length; i++) {
        const candidate = context.getCellValue(lookupRange[i]);
        if (String(candidate).trim().toLowerCase() === String(lookupVal).trim().toLowerCase()) {
          const res = context.getCellValue(returnRange[i]);
          return isFormulaError(res) ? res : res;
        }
      }

      // If not found, return 4th arg if provided, else #N/A
      if (rawArgs.length >= 4) {
        return evaluateFormula(rawArgs[3], context);
      }
      return { isError: true, type: '#N/A', message: `Value not found: ${lookupVal}` };
    }
    case 'VLOOKUP': {
      // VLOOKUP(lookup_value, table_array, col_index, [exact_match])
      if (rawArgs.length < 3) return { isError: true, type: '#VALUE!', message: 'VLOOKUP requires lookup_val, range, col_index' };
      const lookupVal = evaluateFormula(rawArgs[0], context);
      if (isFormulaError(lookupVal)) return lookupVal;
      const colIdx = Number(evaluateFormula(rawArgs[2], context));

      const parts = rawArgs[1].split(':');
      if (parts.length !== 2) return { isError: true, type: '#REF!', message: 'Invalid table range' };
      const start = parseCellAddress(parts[0]);
      const end = parseCellAddress(parts[1]);
      if (!start || !end) return { isError: true, type: '#REF!', message: 'Invalid table range' };

      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);
      const targetCol = start.col + colIdx - 1;

      for (let r = minRow; r <= maxRow; r++) {
        const keyCell = `${indexToColLetters(start.col)}${r}`;
        const keyVal = context.getCellValue(keyCell);
        if (String(keyVal).trim().toLowerCase() === String(lookupVal).trim().toLowerCase()) {
          const resCell = `${indexToColLetters(targetCol)}${r}`;
          return context.getCellValue(resCell);
        }
      }
      return { isError: true, type: '#N/A', message: `VLOOKUP value not found: ${lookupVal}` };
    }
    case 'CONCATENATE': {
      const vals = resolveValuesList(rawArgs, context);
      if (isFormulaError(vals)) return vals;
      return vals.map(v => (v === null ? '' : String(v))).join('');
    }
    default:
      return { isError: true, type: '#NAME?', message: `Unknown function: ${name}` };
  }
}

// Flatten ranges or expressions into a list of cell values
function resolveValuesList(rawArgs: string[], context: EvalContext): (CellValue)[] | FormulaError {
  const result: CellValue[] = [];
  for (const arg of rawArgs) {
    if (arg.includes(':')) {
      const cells = expandRange(arg);
      if (!cells) return { isError: true, type: '#REF!', message: `Invalid range reference: ${arg}` };
      for (const cell of cells) {
        const val = context.getCellValue(cell);
        if (isFormulaError(val)) return val;
        result.push(val);
      }
    } else {
      const val = evaluateFormula(arg, context);
      if (isFormulaError(val)) return val;
      result.push(val);
    }
  }
  return result;
}

// Parse comparison like "A1=0", "B2>100", "C1<='Active'"
function evaluateComparison(expr: string, context: EvalContext): boolean | FormulaError {
  let operator = '';
  let parts: string[] = [];

  if (expr.includes('=')) { operator = '='; parts = expr.split('='); }
  else if (expr.includes('>=')) { operator = '>='; parts = expr.split('>='); }
  else if (expr.includes('<=')) { operator = '<='; parts = expr.split('<='); }
  else if (expr.includes('>')) { operator = '>'; parts = expr.split('>'); }
  else if (expr.includes('<')) { operator = '<'; parts = expr.split('<'); }
  else if (expr.includes('<>')) { operator = '<>'; parts = expr.split('<>'); }

  if (parts.length === 2) {
    const left = evaluateFormula(parts[0], context);
    const right = evaluateFormula(parts[1], context);
    if (isFormulaError(left)) return left;
    if (isFormulaError(right)) return right;

    if (operator === '=') return left === right || String(left).toLowerCase() === String(right).toLowerCase();
    if (operator === '<>') return left !== right;
    if (operator === '>') return Number(left) > Number(right);
    if (operator === '<') return Number(left) < Number(right);
    if (operator === '>=') return Number(left) >= Number(right);
    if (operator === '<=') return Number(left) <= Number(right);
  }

  const single = evaluateFormula(expr, context);
  if (isFormulaError(single)) return single;
  return Boolean(single);
}

// Simple arithmetic parser for expressions like "A1 + B1", "C2 * 1.18", "D5 / E5"
function parseArithmetic(clean: string, context: EvalContext): CellValue | FormulaError {
  const ops = ['+', '-', '*', '/'];
  for (const op of ops) {
    // Look for top-level operator not inside quotes or brackets
    let depth = 0;
    for (let i = clean.length - 1; i >= 0; i--) {
      const ch = clean[i];
      if (ch === ')') depth++;
      else if (ch === '(') depth--;
      else if (depth === 0 && ch === op && i > 0) {
        const leftExpr = clean.slice(0, i);
        const rightExpr = clean.slice(i + 1);

        const leftVal = evaluateFormula(leftExpr, context);
        if (isFormulaError(leftVal)) return leftVal;
        const rightVal = evaluateFormula(rightExpr, context);
        if (isFormulaError(rightVal)) return rightVal;

        const numL = Number(leftVal);
        const numR = Number(rightVal);
        if (isNaN(numL) || isNaN(numR)) {
          return { isError: true, type: '#VALUE!', message: 'Arithmetic operand is non-numeric' };
        }

        if (op === '+') return numL + numR;
        if (op === '-') return numL - numR;
        if (op === '*') return numL * numR;
        if (op === '/') {
          if (numR === 0) return { isError: true, type: '#DIV/0!', message: 'Division by zero' };
          return numL / numR;
        }
      }
    }
  }

  return { isError: true, type: '#VALUE!', message: `Unrecognized expression syntax: ${clean}` };
}
