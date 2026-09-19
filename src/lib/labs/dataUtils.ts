/**
 * Shared tabular and structured data utilities for interactive labs.
 * Handles CSV/JSON import, type casting, schema validation, safe CSV exporting,
 * and change logging without data loss or silent truncation.
 */

export interface DataColumnDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  required?: boolean;
}

export interface ParseResult<T = Record<string, unknown>> {
  success: boolean;
  records: T[];
  errors: string[];
  totalRows: number;
}

export const MAX_IMPORT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMPORT_RECORDS = 10000;

/**
 * Parses CSV text into records with column mapping and type safety.
 */
export function parseCsvText<T = Record<string, unknown>>(
  csvText: string,
  schema?: DataColumnDef[]
): ParseResult<T> {
  const errors: string[] = [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return { success: false, records: [], errors: ['CSV file is empty.'], totalRows: 0 };
  }

  if (lines.length > MAX_IMPORT_RECORDS + 1) {
    return {
      success: false,
      records: [],
      errors: [`Dataset exceeds maximum limit of ${MAX_IMPORT_RECORDS} records. Found ${lines.length - 1} records.`],
      totalRows: lines.length - 1
    };
  }

  // Parse header
  const headers = splitCsvLine(lines[0]).map(h => h.trim());
  const records: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCells = splitCsvLine(lines[i]);
    const rowObj: Record<string, unknown> = {};

    headers.forEach((h, colIdx) => {
      let cellVal: string | number | boolean | null = rawCells[colIdx] !== undefined ? rawCells[colIdx].trim() : '';

      // Clean leading single quote if present (from CSV injection escape)
      if (typeof cellVal === 'string' && cellVal.startsWith("'")) {
        cellVal = cellVal.slice(1);
      }

      if (schema) {
        const colDef = schema.find(c => c.key.toLowerCase() === h.toLowerCase());
        if (colDef) {
          if (colDef.type === 'number') {
            const num = Number(cellVal);
            if (cellVal !== '' && isNaN(num)) {
              errors.push(`Row ${i}: Column "${h}" expected a number, got "${cellVal}"`);
              cellVal = null;
            } else {
              cellVal = cellVal === '' ? null : num;
            }
          } else if (colDef.type === 'boolean') {
            cellVal = cellVal.toLowerCase() === 'true' || cellVal === '1';
          }
          const rawTrimmed = rawCells[colIdx] !== undefined ? rawCells[colIdx].trim() : '';
          if (colDef.required && rawTrimmed === '') {
            errors.push(`Row ${i}: Required column "${h}" is empty.`);
          }
        }
      }

      rowObj[h] = cellVal;
    });

    records.push(rowObj as T);
  }

  return {
    success: errors.length === 0,
    records,
    errors,
    totalRows: records.length
  };
}

/**
 * Splits a CSV line handling quoted strings and commas safely.
 */
export function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Prevents CSV formula injection attacks by escaping initial symbols.
 */
export function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}
