'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import {
  Database,
  Code2,
  Layers,
  Send,
  Sparkles,
  GitMerge,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Table as TableIcon,
  Search,
  Key
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface Customer {
  customer_id: number;
  name: string;
  city: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

interface Order {
  order_id: number;
  customer_id: number;
  amount: number | null;
  status: 'Delivered' | 'Cancelled';
}

// Relational tables with intentional educational defects per difficulty tier
const TABLES_DATA: Record<LabDifficulty, { customers: Customer[]; orders: Order[] }> = {
  beginner: {
    customers: [
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // duplicate PK!
      { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
      { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
      { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // unmatched (0 orders)
    ],
    orders: [
      { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
      { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
      { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
      { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
      { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
      { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' }, // failed payment null
    ]
  },
  intermediate: {
    customers: [
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // duplicate PK
      { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
      { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
      { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // unmatched
      { customer_id: 5, name: 'Alicia Sharma', city: 'Bengaluru', tier: 'Gold' },
      { customer_id: 6, name: 'Esha Kapoor', city: 'Chennai', tier: 'Silver' }, // unmatched
    ],
    orders: [
      { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
      { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
      { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
      { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
      { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
      { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' },
      { order_id: 107, customer_id: 5, amount: 2600, status: 'Delivered' },
      { order_id: 108, customer_id: 3, amount: null, status: 'Delivered' },
    ]
  },
  challenge: {
    customers: [
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
      { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' }, // duplicate PK
      { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
      { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
      { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' },
      { customer_id: 5, name: 'Alicia Sharma', city: 'Bengaluru', tier: 'Gold' },
      { customer_id: 6, name: 'Esha Kapoor', city: 'Chennai', tier: 'Silver' },
      { customer_id: 7, name: 'Farah Iyer', city: 'Bengaluru', tier: 'Gold' },
    ],
    orders: [
      { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
      { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
      { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
      { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
      { order_id: 105, customer_id: 3, amount: 3100, status: 'Cancelled' },
      { order_id: 106, customer_id: 2, amount: null, status: 'Delivered' },
      { order_id: 107, customer_id: 5, amount: 2600, status: 'Delivered' },
      { order_id: 108, customer_id: 3, amount: null, status: 'Delivered' },
      { order_id: 109, customer_id: 9, amount: 3200, status: 'Delivered' }, // orphan customer_id
      { order_id: 110, customer_id: 1, amount: 1800, status: 'Delivered' },
    ]
  }
};

type JoinType = 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN';

interface QueryConfig {
  selectedFields: string[]; // e.g. ['customers.name', 'SUM(orders.amount)']
  baseTable: 'customers' | 'orders';
  joinType: JoinType;
  joinTable: 'orders' | 'customers' | 'none';
  joinLeftKey: string;
  joinRightKey: string;
  whereFilters: { field: string; op: '=' | '!=' | '>' | '<' | 'IS NULL' | 'IS NOT NULL'; val: string }[];
  groupByField: string; // 'none' | 'customers.name' | 'customers.city' | 'customers.tier'
  orderByField: string; // 'none' | 'name' | 'total_spend'
  orderDirection: 'ASC' | 'DESC';
  deduplicateCustomers: boolean;
  guardNullAmounts: boolean;
}

const INITIAL_QUERY: QueryConfig = {
  selectedFields: ['customers.name', 'SUM(orders.amount)'],
  baseTable: 'customers',
  joinType: 'LEFT JOIN',
  joinTable: 'orders',
  joinLeftKey: 'customers.customer_id',
  joinRightKey: 'orders.customer_id',
  whereFilters: [],
  groupByField: 'customers.name',
  orderByField: 'none',
  orderDirection: 'DESC',
  deduplicateCustomers: false,
  guardNullAmounts: false,
};

export default function SqlQueryLogicLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const tables = TABLES_DATA[variant];
  const { state: query, set: setQuery, undo, redo, reset, canUndo, canRedo } = useUndoableState<QueryConfig>(INITIAL_QUERY);

  const [activeTab, setActiveTab] = useState<'builder' | 'schema' | 'preview'>('builder');

  const updateQuery = useCallback((patch: Partial<QueryConfig>) => {
    setQuery(prev => ({ ...prev, ...patch }));
    onDirty();
  }, [setQuery, onDirty]);

  // Primary key uniqueness validation
  const pkAnalysis = useMemo(() => {
    const customerIds = tables.customers.map(c => c.customer_id);
    const uniqueIds = new Set(customerIds);
    const hasDuplicatePK = customerIds.length !== uniqueIds.size;
    return {
      isValidPK: !hasDuplicatePK,
      duplicateCount: customerIds.length - uniqueIds.size,
      warning: hasDuplicatePK ? 'WARNING: customers.customer_id violates uniqueness. It is NOT a valid primary key!' : 'customers.customer_id is unique.'
    };
  }, [tables.customers]);

  // Execute query over bounded local datasets
  const queryExecution = useMemo(() => {
    // 1. Prepare base tables
    let customers = [...tables.customers];
    if (query.deduplicateCustomers) {
      const seen = new Set<number>();
      customers = customers.filter(c => {
        if (seen.has(c.customer_id)) return false;
        seen.add(c.customer_id);
        return true;
      });
    }

    const orders = [...tables.orders];

    // 2. Perform Join
    interface JoinedRow {
      customer_id?: number;
      name?: string;
      city?: string;
      tier?: string;
      order_id?: number;
      amount?: number | null;
      status?: string;
    }

    let joinedRows: JoinedRow[] = [];

    if (query.joinTable === 'orders') {
      if (query.joinType === 'INNER JOIN') {
        customers.forEach(c => {
          const matched = orders.filter(o => o.customer_id === c.customer_id);
          matched.forEach(o => {
            joinedRows.push({ ...c, ...o });
          });
        });
      } else if (query.joinType === 'LEFT JOIN') {
        customers.forEach(c => {
          const matched = orders.filter(o => o.customer_id === c.customer_id);
          if (matched.length === 0) {
            joinedRows.push({ ...c, order_id: undefined, amount: null, status: undefined });
          } else {
            matched.forEach(o => {
              joinedRows.push({ ...c, ...o });
            });
          }
        });
      }
    } else {
      joinedRows = customers.map(c => ({ ...c }));
    }

    // 3. Apply WHERE filters
    let filtered = joinedRows;
    query.whereFilters.forEach(f => {
      filtered = filtered.filter(row => {
        const val = (row as Record<string, unknown>)[f.field.replace('customers.', '').replace('orders.', '')];
        if (f.op === '=') return String(val).toLowerCase() === f.val.toLowerCase();
        if (f.op === '!=') return String(val).toLowerCase() !== f.val.toLowerCase();
        if (f.op === '>') return Number(val) > Number(f.val);
        if (f.op === '<') return Number(val) < Number(f.val);
        if (f.op === 'IS NULL') return val === null || val === undefined;
        if (f.op === 'IS NOT NULL') return val !== null && val !== undefined;
        return true;
      });
    });

    // 4. GROUP BY & Aggregation
    interface ResultRow {
      [key: string]: unknown;
    }

    let finalRows: ResultRow[] = [];

    if (query.groupByField !== 'none') {
      const groupKey = query.groupByField.replace('customers.', '').replace('orders.', '') as keyof JoinedRow;
      const groups: Record<string, JoinedRow[]> = {};

      filtered.forEach(r => {
        const key = String(r[groupKey] ?? 'Unknown');
        groups[key] = groups[key] || [];
        groups[key].push(r);
      });

      finalRows = Object.entries(groups).map(([k, group]) => {
        const row: ResultRow = { [query.groupByField]: k };

        // Check if user selected SUM(orders.amount)
        if (query.selectedFields.some(f => f.includes('SUM'))) {
          let sum = 0;
          let hasNonNull = false;
          let isCorrupted = false;

          group.forEach(g => {
            if (g.amount !== null && g.amount !== undefined) {
              hasNonNull = true;
              sum += g.amount;
            } else if (g.order_id !== undefined && !query.guardNullAmounts) {
              // Null payment order without null guard can corrupt total in real SQL/JS
              isCorrupted = true;
            }
          });

          row['total_amount'] = isCorrupted ? 'NaN (Corrupted by NULL)' : (hasNonNull ? sum : 0);
        }

        // Check if user selected COUNT(*)
        if (query.selectedFields.some(f => f.includes('COUNT'))) {
          const countOrders = group.filter(g => g.order_id !== undefined).length;
          row['order_count'] = countOrders;
        }

        return row;
      });
    } else {
      finalRows = filtered as ResultRow[];
    }

    return {
      rows: finalRows,
      unmatchedCount: customers.filter(c => !orders.some(o => o.customer_id === c.customer_id)).length,
      cartesianExplosion: !query.deduplicateCustomers && pkAnalysis.duplicateCount > 0
    };
  }, [tables, query, pkAnalysis]);

  // Generate equivalent SQL string
  const generatedSql = useMemo(() => {
    const fields = query.selectedFields.join(', ');
    let sql = `SELECT ${fields}\nFROM ${query.baseTable}`;

    if (query.joinTable !== 'none') {
      sql += `\n${query.joinType} ${query.joinTable}\n  ON ${query.joinLeftKey} = ${query.joinRightKey}`;
    }

    if (query.whereFilters.length > 0) {
      const preds = query.whereFilters.map(f => {
        if (f.op === 'IS NULL' || f.op === 'IS NOT NULL') return `${f.field} ${f.op}`;
        return `${f.field} ${f.op} '${f.val}'`;
      }).join('\n  AND ');
      sql += `\nWHERE ${preds}`;
    }

    if (query.groupByField !== 'none') {
      sql += `\nGROUP BY ${query.groupByField}`;
    }

    if (query.orderByField !== 'none') {
      sql += `\nORDER BY ${query.orderByField} ${query.orderDirection}`;
    }

    return sql + ';';
  }, [query]);

  const handleSubmit = () => {
    onSubmit({
      variant,
      queryConfig: query,
      generatedSql,
      resultCount: queryExecution.rows.length,
      unmatchedCount: queryExecution.unmatchedCount,
      repairedDuplicates: query.deduplicateCustomers,
      guardedNulls: query.guardNullAmounts
    });
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ===================================================================== */}
      {/* TAB NAVIGATION: Query Builder / Schema Inspector                      */}
      {/* ===================================================================== */}
      <div className="p-3 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Structured Query Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schema &amp; PK Audit</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300"
            title="Undo query change"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-slate-300"
            title="Redo query change"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BUILDER TAB: Clause Selectors, Filters & Generated SQL                */}
      {/* ===================================================================== */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Query Controls Column */}
          <div className="lg:col-span-7 space-y-3">
            {/* Clause 1: SELECT & FROM */}
            <div className="p-3.5 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2">
              <span className="font-bold text-white text-xs block">1. SELECT &amp; FROM Base Table</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Base Table (FROM):</label>
                  <select
                    value={query.baseTable}
                    onChange={(e) => updateQuery({ baseTable: e.target.value as 'customers' | 'orders' })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white"
                  >
                    <option value="customers">customers</option>
                    <option value="orders">orders</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Selected Fields (SELECT):</label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: 'customers.name', label: 'Name' },
                      { key: 'SUM(orders.amount)', label: 'SUM(Amount)' },
                      { key: 'COUNT(*)', label: 'COUNT(*)' },
                      { key: 'customers.city', label: 'City' }
                    ].map(f => {
                      const isSel = query.selectedFields.includes(f.key);
                      return (
                        <button
                          key={f.key}
                          onClick={() => {
                            const next = isSel
                              ? query.selectedFields.filter(x => x !== f.key)
                              : [...query.selectedFields, f.key];
                            updateQuery({ selectedFields: next.length > 0 ? next : [f.key] });
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                            isSel ? 'bg-purple-600/30 text-purple-200 border-purple-500/40' : 'bg-white/5 text-slate-400 border-white/10'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Clause 2: JOIN Configuration */}
            <div className="p-3.5 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2">
              <span className="font-bold text-white text-xs block">2. Relational JOIN &amp; Match Key</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Join Type:</label>
                  <select
                    value={query.joinType}
                    onChange={(e) => updateQuery({ joinType: e.target.value as JoinType })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white"
                  >
                    <option value="LEFT JOIN">LEFT JOIN (Retains Prospects)</option>
                    <option value="INNER JOIN">INNER JOIN (Purchasers Only)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Join Table:</label>
                  <select
                    value={query.joinTable}
                    onChange={(e) => updateQuery({ joinTable: e.target.value as 'orders' | 'none' })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white"
                  >
                    <option value="orders">orders</option>
                    <option value="none">None (Single table)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Matching Foreign Key:</label>
                  <div className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-slate-300">
                    customer_id = customer_id
                  </div>
                </div>
              </div>
            </div>

            {/* Clause 3: GROUP BY & Data Hygiene Guards */}
            <div className="p-3.5 rounded-2xl bg-[#0f1325] border border-white/10 space-y-2">
              <span className="font-bold text-white text-xs block">3. Aggregation &amp; Hygiene Guards</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">GROUP BY:</label>
                  <select
                    value={query.groupByField}
                    onChange={(e) => updateQuery({ groupByField: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-white"
                  >
                    <option value="customers.name">customers.name</option>
                    <option value="customers.city">customers.city</option>
                    <option value="none">None (Raw Rows)</option>
                  </select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={query.deduplicateCustomers}
                      onChange={(e) => updateQuery({ deduplicateCustomers: e.target.checked })}
                      className="rounded accent-purple-600"
                    />
                    <span className="text-slate-300 text-[11px]">Deduplicate Customers before join</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={query.guardNullAmounts}
                      onChange={(e) => updateQuery({ guardNullAmounts: e.target.checked })}
                      className="rounded accent-purple-600"
                    />
                    <span className="text-slate-300 text-[11px]">Guard NULL Amounts with COALESCE</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Preview & Hazards Column */}
          <div className="lg:col-span-5 space-y-3">
            {/* Generated SQL Panel */}
            <div className="p-3.5 rounded-2xl bg-[#0a0d1a] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  Generated Equivalent SQL
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Dialect: ANSI SQL</span>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                {generatedSql}
              </pre>
            </div>

            {/* Relational Traps & Hazards Alert */}
            {queryExecution.cartesianExplosion && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cartesian Row Inflation Detected!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Because `customer_id=1` is duplicated in customers table, each order for Alice is duplicated 2x in the JOIN! Enable deduplication to resolve.
                </p>
              </div>
            )}

            {query.joinType === 'LEFT JOIN' && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>LEFT JOIN preserves Devendra Rao (unmatched prospect with ₹0 spend) in results.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SCHEMA AUDIT TAB: Tables & Primary Key Inspection                     */}
      {/* ===================================================================== */}
      {activeTab === 'schema' && (
        <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 space-y-4 shadow-xl">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-2">
            <Key className="w-4 h-4 shrink-0" />
            <span className="font-bold">{pkAnalysis.warning}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customers Table */}
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block">Table: customers ({tables.customers.length} rows)</span>
              <div className="rounded-xl border border-white/10 overflow-x-auto bg-black/30">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="p-2">customer_id</th>
                      <th className="p-2">name</th>
                      <th className="p-2">city</th>
                      <th className="p-2">tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.customers.map((c, i) => (
                      <tr key={i} className={`border-b border-white/5 ${c.customer_id === 1 ? 'bg-amber-500/10 text-amber-200' : ''}`}>
                        <td className="p-2 font-bold">{c.customer_id}</td>
                        <td className="p-2">{c.name}</td>
                        <td className="p-2">{c.city}</td>
                        <td className="p-2">{c.tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders Table */}
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block">Table: orders ({tables.orders.length} rows)</span>
              <div className="rounded-xl border border-white/10 overflow-x-auto bg-black/30">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                      <th className="p-2">order_id</th>
                      <th className="p-2">customer_id</th>
                      <th className="p-2">amount</th>
                      <th className="p-2">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.orders.map((o, i) => (
                      <tr key={i} className={`border-b border-white/5 ${o.amount === null ? 'bg-red-500/10 text-red-200' : ''}`}>
                        <td className="p-2 font-bold">{o.order_id}</td>
                        <td className="p-2">{o.customer_id}</td>
                        <td className="p-2">{o.amount === null ? 'NULL' : `₹${o.amount}`}</td>
                        <td className="p-2">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RESULTS DATA GRID                                                     */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-[#0b0e1b] border border-white/10 overflow-hidden shadow-2xl space-y-0">
        <div className="p-3 bg-[#111425] border-b border-white/10 flex items-center justify-between">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            <TableIcon className="w-3.5 h-3.5 text-purple-400" />
            Query Result Output ({queryExecution.rows.length} rows)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCsv('sql_query_results.csv', queryExecution.rows as Record<string, unknown>[])}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#12162a] border-b border-white/10 text-slate-400">
                {queryExecution.rows.length > 0 && Object.keys(queryExecution.rows[0]).map((col) => (
                  <th key={col} className="p-2.5 border-r border-white/5 font-bold text-slate-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryExecution.rows.map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] text-slate-300">
                  {Object.values(row).map((val, cellIdx) => (
                    <td key={cellIdx} className="p-2.5 border-r border-white/5">
                      {String(val ?? 'NULL')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SUBMISSION BAR                                                        */}
      {/* ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#0f1325] border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Join Mode: <strong className="text-white">{query.joinType}</strong></span>
          <span>•</span>
          <span>Deduplicated: <strong className={query.deduplicateCustomers ? 'text-emerald-400' : 'text-amber-400'}>{query.deduplicateCustomers ? 'YES' : 'NO'}</strong></span>
          <span>•</span>
          <span>Unmatched Preserved: <strong className="text-cyan-400">{queryExecution.unmatchedCount > 0 ? 'YES' : 'NO'}</strong></span>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all"
        >
          <span>Submit Query Execution for Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
