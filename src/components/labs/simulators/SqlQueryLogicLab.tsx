'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { 
  Database, 
  Code2, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ArrowRight, 
  Send,
  Sparkles,
  GitMerge
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

// Relational Tables Data
const customersData = [
  { customer_id: 1, name: 'Alice Sharma', city: 'Bengaluru', tier: 'Gold' },
  { customer_id: 2, name: 'Bhavin Patel', city: 'Mumbai', tier: 'Silver' },
  { customer_id: 3, name: 'Chitra Nair', city: 'Hyderabad', tier: 'Gold' },
  { customer_id: 4, name: 'Devendra Rao', city: 'Pune', tier: 'Bronze' }, // Unmatched customer! (Has 0 orders)
];

const ordersData = [
  { order_id: 101, customer_id: 1, amount: 4500, status: 'Delivered' },
  { order_id: 102, customer_id: 1, amount: 2200, status: 'Delivered' },
  { order_id: 103, customer_id: 2, amount: 8900, status: 'Delivered' },
  { order_id: 104, customer_id: 3, amount: 1500, status: 'Delivered' },
  { order_id: 105, customer_id: 3, amount: 3100, status: 'Delivered' },
];

export default function SqlQueryLogicLab({
  scenario,
  variant,
  onDirty,
  onSubmit
}: SimulatorProps) {
  // Query Block Assembler State
  const [selectedSelect, setSelectedSelect] = useState<'name_sum' | 'name_count' | 'all'>('name_sum');
  const [selectedJoinType, setSelectedJoinType] = useState<'LEFT_JOIN' | 'INNER_JOIN'>('LEFT_JOIN');
  const [selectedWhere, setSelectedWhere] = useState<'none' | 'gold_only' | 'delivered_only'>('none');
  const [selectedGroupBy, setSelectedGroupBy] = useState<'customer_name' | 'city' | 'none'>('customer_name');
  const [selectedOrderBy, setSelectedOrderBy] = useState<'total_desc' | 'name_asc'>('total_desc');

  // Learner prediction check
  const [predictedUnmatchedIncluded, setPredictedUnmatchedIncluded] = useState<boolean>(true);

  // Compile Query Blocks into Generated SQL text
  const generatedSql = useMemo(() => {
    let sql = 'SELECT ';
    if (selectedSelect === 'name_sum') sql += 'c.name, SUM(o.amount) AS total_spent\n';
    else if (selectedSelect === 'name_count') sql += 'c.name, COUNT(o.order_id) AS order_count\n';
    else sql += 'c.name, c.city, o.order_id, o.amount\n';

    sql += 'FROM customers c\n';
    sql += `${selectedJoinType === 'LEFT_JOIN' ? 'LEFT JOIN' : 'INNER JOIN'} orders o ON c.customer_id = o.customer_id\n`;

    if (selectedWhere === 'gold_only') sql += "WHERE c.tier = 'Gold'\n";
    else if (selectedWhere === 'delivered_only') sql += "WHERE o.status = 'Delivered'\n";

    if (selectedGroupBy === 'customer_name') sql += 'GROUP BY c.name\n';
    else if (selectedGroupBy === 'city') sql += 'GROUP BY c.city\n';

    sql += selectedOrderBy === 'total_desc' ? 'ORDER BY total_spent DESC;' : 'ORDER BY c.name ASC;';
    return sql;
  }, [selectedSelect, selectedJoinType, selectedWhere, selectedGroupBy, selectedOrderBy]);

  // Deterministic in-memory execution of the compiled query logic
  const queryResults = useMemo(() => {
    let joinedRows: { name: string; city: string; amount: number; hasOrder: boolean }[] = [];

    customersData.forEach(c => {
      const customerOrders = ordersData.filter(o => o.customer_id === c.customer_id);

      if (customerOrders.length > 0) {
        customerOrders.forEach(o => {
          joinedRows.push({ name: c.name, city: c.city, amount: o.amount, hasOrder: true });
        });
      } else if (selectedJoinType === 'LEFT_JOIN') {
        // Left join retains customer with NULL/0 amount
        joinedRows.push({ name: c.name, city: c.city, amount: 0, hasOrder: false });
      }
    });

    // Grouping
    if (selectedGroupBy === 'customer_name') {
      const groups: Record<string, number> = {};
      joinedRows.forEach(r => {
        groups[r.name] = (groups[r.name] || 0) + r.amount;
      });

      let res = Object.entries(groups).map(([name, total]) => ({
        name,
        total_spent: total
      }));

      if (selectedOrderBy === 'total_desc') {
        res.sort((a, b) => b.total_spent - a.total_spent);
      } else {
        res.sort((a, b) => a.name.localeCompare(b.name));
      }
      return res;
    }

    return joinedRows.map(r => ({ name: r.name, total_spent: r.amount }));
  }, [selectedJoinType, selectedGroupBy, selectedOrderBy]);

  // Check if unmatched customer Devendra Rao is in results
  const unmatchedPresent = queryResults.some(r => r.name === 'Devendra Rao');

  const handleSubmit = () => {
    onSubmit({
      selectedSelect,
      selectedJoinType,
      selectedGroupBy,
      selectedOrderBy,
      unmatchedPresent,
      predictedUnmatchedIncluded,
      generatedSql
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Knowledge & Relational Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Active Join Type</span>
          <span className={`text-lg font-black ${selectedJoinType === 'LEFT_JOIN' ? 'text-purple-300' : 'text-cyan-300'}`}>
            {selectedJoinType === 'LEFT_JOIN' ? 'LEFT JOIN (Preserves All Customers)' : 'INNER JOIN (Orders Only)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {selectedJoinType === 'LEFT_JOIN' ? 'Devendra Rao (0 orders) retained' : 'Devendra Rao excluded'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Result Row Count</span>
          <span className="text-xl font-black text-white">{queryResults.length} Rows</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Aggregated output</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#131728] border border-purple-500/30 bg-purple-950/20">
          <span className="text-xs text-purple-300 font-bold block mb-1">Relational Concept</span>
          <span className="text-base font-black text-purple-200">
            {unmatchedPresent ? 'Outer Join Retention Verified' : 'Inner Intersection Verified'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Deterministic array simulation</span>
        </div>
      </div>

      {/* Main Block Builder and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Visual Query Block Builder */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>1. Relational Query Block Assembler</span>
            </h2>

            {/* Block 1: SELECT */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-300">SELECT BLOCK</span>
                <span className="text-[10px] text-slate-400">Projection &amp; Aggregates</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setSelectedSelect('name_sum'); onDirty(); }}
                  className={`p-2 rounded-xl border font-bold text-left transition-all ${
                    selectedSelect === 'name_sum' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  c.name, SUM(o.amount)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedSelect('name_count'); onDirty(); }}
                  className={`p-2 rounded-xl border font-bold text-left transition-all ${
                    selectedSelect === 'name_count' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  c.name, COUNT(o.order_id)
                </button>
              </div>
            </div>

            {/* Block 2: JOIN */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">JOIN TYPE BLOCK</span>
                <span className="text-[10px] text-slate-400">Relationship Semantics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setSelectedJoinType('LEFT_JOIN'); onDirty(); }}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all flex flex-col gap-0.5 ${
                    selectedJoinType === 'LEFT_JOIN' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>LEFT JOIN</span>
                  <span className="text-[10px] font-normal opacity-80">Retains customers with 0 orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedJoinType('INNER_JOIN'); onDirty(); }}
                  className={`p-2.5 rounded-xl border font-bold text-left transition-all flex flex-col gap-0.5 ${
                    selectedJoinType === 'INNER_JOIN' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>INNER JOIN</span>
                  <span className="text-[10px] font-normal opacity-80">Only customers with placed orders</span>
                </button>
              </div>
            </div>

            {/* Block 3: GROUP BY & ORDER BY */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-xs font-mono font-bold text-amber-300 block">GROUP BY</span>
                <button
                  type="button"
                  onClick={() => { setSelectedGroupBy('customer_name'); onDirty(); }}
                  className={`w-full p-2 rounded-xl border font-bold text-left transition-all ${
                    selectedGroupBy === 'customer_name' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  GROUP BY c.name
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-xs font-mono font-bold text-emerald-300 block">ORDER BY</span>
                <button
                  type="button"
                  onClick={() => { setSelectedOrderBy(selectedOrderBy === 'total_desc' ? 'name_asc' : 'total_desc'); onDirty(); }}
                  className="w-full p-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-left"
                >
                  {selectedOrderBy === 'total_desc' ? 'total_spent DESC' : 'c.name ASC'}
                </button>
              </div>
            </div>

          </div>

          {/* Generated Read-Only SQL Card */}
          <div className="p-5 rounded-3xl bg-[#0e101a] border border-white/10 space-y-2">
            <span className="text-xs font-mono font-extrabold text-purple-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Compiled SQL Query (Display Only)</span>
            </span>
            <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed">
              {generatedSql}
            </pre>
          </div>

        </div>

        {/* Right 5 Cols: Output Table & Prediction */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Query Results Table */}
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Query Result Table ({queryResults.length} rows)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                    <th className="p-2">Customer Name</th>
                    <th className="p-2 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {queryResults.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 font-sans font-semibold text-white flex items-center gap-1.5">
                        <span>{r.name}</span>
                        {r.name === 'Devendra Rao' && (
                          <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">Unmatched</span>
                        )}
                      </td>
                      <td className="p-2 text-right text-purple-300 font-bold">
                        ₹{r.total_spent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification & Submit */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#111425] to-indigo-950/40 border border-purple-500/30 space-y-3">
            <div>
              <span className="text-xs font-extrabold text-white block">Submit Query Logic</span>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Evaluates query structure, join semantics, and aggregate calculations against the 60/25/15 rubric.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-glow-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit &amp; Evaluate Query</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
