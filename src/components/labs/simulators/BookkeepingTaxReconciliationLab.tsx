'use client';

import React, { useState, useMemo } from 'react';
import { LabScenarioVariant } from '@/lib/labs/types';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';

interface Props {
  scenario?: LabScenarioVariant;
  variant: 'beginner' | 'intermediate' | 'challenge';
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface JournalEntry {
  id: string;
  account: string;
  debit: number;
  credit: number;
}

interface InvoiceMatch {
  id: string;
  vendor: string;
  internalAmount: number;
  portal2bAmount: number;
  taxBase: number;
  tax10Pct: number;
  isEligibleItc: boolean;
  userStatus: 'matched' | 'disputed' | 'unreviewed';
}

export default function BookkeepingTaxReconciliationLab({ onDirty, onSubmit }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: 'j1', account: 'Cash / Bank Account', debit: 1100, credit: 0 },
    { id: 'j2', account: 'Sales Revenue Account', debit: 0, credit: 1000 },
    { id: 'j3', account: 'GST Output Tax Payable (10%)', debit: 0, credit: 100 },
  ]);

  const [invoices, setInvoices] = useState<InvoiceMatch[]>([
    { id: 'inv_201', vendor: 'Apex Office Supplies', internalAmount: 1100, portal2bAmount: 1100, taxBase: 1000, tax10Pct: 100, isEligibleItc: true, userStatus: 'matched' },
    { id: 'inv_202', vendor: 'Cloud Host International', internalAmount: 2200, portal2bAmount: 1980, taxBase: 2000, tax10Pct: 200, isEligibleItc: true, userStatus: 'disputed' }, // Mismatched 2B credit
    { id: 'inv_203', vendor: 'Executive Luxury Resort', internalAmount: 880, portal2bAmount: 880, taxBase: 800, tax10Pct: 80, isEligibleItc: false, userStatus: 'disputed' }, // Ineligible personal recreation credit
  ]);

  const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
    let deb = 0;
    let cred = 0;
    entries.forEach(e => {
      deb += e.debit;
      cred += e.credit;
    });
    return { totalDebit: deb, totalCredit: cred, isBalanced: deb === cred && deb > 0 };
  }, [entries]);

  const updateInvoiceStatus = (id: string, status: InvoiceMatch['userStatus']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, userStatus: status } : inv));
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = invoices.map(i => ({
      invoice_id: i.id,
      vendor: i.vendor,
      internal_amount: i.internalAmount,
      portal_amount: i.portal2bAmount,
      tax_base: i.taxBase,
      tax_10pct: i.tax10Pct,
      eligible_itc: i.isEligibleItc ? 'YES' : 'NO',
      reconciliation_status: i.userStatus
    }));
    downloadCsv('bookkeeping_gst_reconciliation.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('bookkeeping_reconciliation_summary.json', {
      journal: { entries, totalDebit, totalCredit, isBalanced },
      invoices
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      entries,
      totalDebit,
      totalCredit,
      isBalanced,
      invoices
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lab 24 • Accounting & Indirect Tax (GST)
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Bookkeeping & Tax Reconciliation Lab (10% Educational Model)</h2>
            <p className="text-sm text-slate-400 mt-1">
              Verify double-entry balance (Debit = Credit). Reconcile purchase register against Form 2B, flag invoice mismatch exceptions, and block ineligible Input Tax Credit (ITC).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Ledger CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
            >
              Submit Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Double Entry Balancer Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Total Debits</div>
          <div className="text-2xl font-bold text-white mt-1">${totalDebit.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Bank / Assets / Expenses</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Total Credits</div>
          <div className="text-2xl font-bold text-white mt-1">${totalCredit.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Revenues / Tax Liabilities</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Journal Status</div>
          <div className={`text-xl font-bold mt-1 ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isBalanced ? 'BALANCED (0 Var)' : 'UNBALANCED'}
          </div>
          <p className="text-xs text-slate-500 mt-1">{isBalanced ? 'Debit equals Credit' : 'Trial balance error'}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Tax Rule Base (10%)</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">$100.00</div>
          <p className="text-xs text-slate-500 mt-1">10% tax on $1,000 base</p>
        </div>
      </div>

      {/* 2B Invoice Reconciliation Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Purchase Register vs Government 2B Reconciliation</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3 text-right">Internal Books</th>
                <th className="p-3 text-right">Portal 2B Rec</th>
                <th className="p-3 text-right">10% Tax</th>
                <th className="p-3 text-center">Eligible ITC</th>
                <th className="p-3 text-center">Action Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map(inv => {
                const hasDiscrepancy = inv.internalAmount !== inv.portal2bAmount;
                return (
                  <tr key={inv.id} className={hasDiscrepancy || !inv.isEligibleItc ? 'bg-amber-950/10' : ''}>
                    <td className="p-3 font-mono text-slate-300">{inv.id}</td>
                    <td className="p-3 font-semibold text-white">{inv.vendor}</td>
                    <td className="p-3 text-right font-mono">${inv.internalAmount}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">${inv.portal2bAmount}</td>
                    <td className="p-3 text-right font-mono text-cyan-400">${inv.tax10Pct}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.isEligibleItc ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {inv.isEligibleItc ? 'Eligible' : 'Blocked'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={inv.userStatus}
                        onChange={e => updateInvoiceStatus(inv.id, e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="matched">Accept Match</option>
                        <option value="disputed">Flag Mismatch / Ineligible</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
