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

interface ResourceItem {
  id: string;
  name: string;
  category: 'compute' | 'database' | 'storage' | 'network';
  unitRatePerHour: number;
  hoursPerMonth: number;
  count: number;
  isIdleWaste: boolean;
  publicExposure: boolean;
  backupEnabled: boolean;
}

export default function CloudPlanningCostLab({ onDirty, onSubmit }: Props) {
  const [resources, setResources] = useState<ResourceItem[]>([
    { id: 'c1', name: 'App VM (c6g.xlarge)', category: 'compute', unitRatePerHour: 2.0, hoursPerMonth: 730, count: 2, isIdleWaste: false, publicExposure: false, backupEnabled: true },
    { id: 'c2', name: 'Staging VM (Unused Test Cluster)', category: 'compute', unitRatePerHour: 2.5, hoursPerMonth: 730, count: 1, isIdleWaste: true, publicExposure: false, backupEnabled: false },
    { id: 'db1', name: 'Managed Postgres Multi-AZ', category: 'database', unitRatePerHour: 3.5, hoursPerMonth: 730, count: 1, isIdleWaste: false, publicExposure: false, backupEnabled: true },
    { id: 's1', name: 'S3 User Uploads Bucket', category: 'storage', unitRatePerHour: 0.8, hoursPerMonth: 730, count: 1, isIdleWaste: false, publicExposure: true, backupEnabled: false }, // Deliberate security risk & missing backup
  ]);

  const [fixedMonthlyFees, setFixedMonthlyFees] = useState<number>(150); // support fee

  const billCalculations = useMemo(() => {
    let rawHourlyTotal = 0;
    let idleWasteCost = 0;
    let missingBackupCount = 0;
    let publicExposureCount = 0;

    resources.forEach(r => {
      const itemCost = r.count * r.unitRatePerHour * r.hoursPerMonth;
      rawHourlyTotal += itemCost;
      if (r.isIdleWaste) idleWasteCost += itemCost;
      if (!r.backupEnabled) missingBackupCount++;
      if (r.publicExposure) publicExposureCount++;
    });

    const totalMonthlyCost = rawHourlyTotal + fixedMonthlyFees;
    const optimizedCost = totalMonthlyCost - idleWasteCost;

    return {
      totalMonthlyCost,
      idleWasteCost,
      optimizedCost,
      missingBackupCount,
      publicExposureCount
    };
  }, [resources, fixedMonthlyFees]);

  const updateResource = (id: string, updates: Partial<ResourceItem>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    onDirty();
  };

  const handleDecommissionWaste = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, count: 0, isIdleWaste: false } : r));
    onDirty();
  };

  const handleFixSecurityAndBackup = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, publicExposure: false, backupEnabled: true } : r));
    onDirty();
  };

  const handleExportCsv = () => {
    const rows = resources.map(r => ({
      resource: r.name,
      category: r.category,
      quantity: r.count,
      rate_per_hour: r.unitRatePerHour,
      hours: r.hoursPerMonth,
      monthly_cost: (r.count * r.unitRatePerHour * r.hoursPerMonth).toFixed(2),
      is_idle_waste: r.isIdleWaste ? 'YES' : 'NO',
      public_exposure: r.publicExposure ? 'HIGH_RISK' : 'SAFE',
      backup_enabled: r.backupEnabled ? 'YES' : 'NO'
    }));
    downloadCsv('finops_cloud_bill.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('finops_cloud_plan.json', {
      resources,
      calculations: billCalculations
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      resources,
      billCalculations
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Lab 12 • Cloud Architecture & FinOps
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Cloud Planning, FinOps & Security Audit Lab</h2>
            <p className="text-sm text-slate-400 mt-1">
              Analyze cloud resource billings, decommission idle zombie workloads, close publicly exposed storage buckets, and ensure mandatory disaster recovery backup policies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Bill CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
            >
              Submit FinOps Plan
            </button>
          </div>
        </div>
      </div>

      {/* Bill & Risk Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Gross Monthly Bill</div>
          <div className="text-2xl font-bold text-white mt-1">${billCalculations.totalMonthlyCost.toFixed(0)}</div>
          <p className="text-xs text-slate-500 mt-1">Includes ${fixedMonthlyFees} base support</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Idle Zombie Waste</div>
          <div className={`text-2xl font-bold mt-1 ${billCalculations.idleWasteCost > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${billCalculations.idleWasteCost.toFixed(0)}
          </div>
          <p className="text-xs text-slate-500 mt-1">{billCalculations.idleWasteCost > 0 ? 'Requires Decommissioning' : '0 Idle Waste'}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Optimized Target Bill</div>
          <div className="text-2xl font-bold text-teal-400 mt-1">${billCalculations.optimizedCost.toFixed(0)}</div>
          <p className="text-xs text-slate-500 mt-1">After eliminating orphan resources</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase">Security & Backup Flags</div>
          <div className={`text-2xl font-bold mt-1 ${billCalculations.publicExposureCount > 0 || billCalculations.missingBackupCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {billCalculations.publicExposureCount + billCalculations.missingBackupCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Risks: {billCalculations.publicExposureCount} Public, {billCalculations.missingBackupCount} No Backup</p>
        </div>
      </div>

      {/* Catalog & Resource Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Provisioned Cloud Resource Inventory</h3>

        <div className="space-y-3">
          {resources.map(r => {
            const itemMonthly = r.count * r.unitRatePerHour * r.hoursPerMonth;
            return (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition ${
                  r.isIdleWaste
                    ? 'bg-rose-950/20 border-rose-800/40'
                    : r.publicExposure
                    ? 'bg-amber-950/20 border-amber-800/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">{r.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-400">
                        {r.category}
                      </span>
                      {r.isIdleWaste && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Idle Zombie Asset
                        </span>
                      )}
                      {r.publicExposure && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Publicly Exposed Bucket
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      Rate: ${r.unitRatePerHour}/hr • Monthly: ${itemMonthly.toFixed(2)} ({r.count} nodes × {r.hoursPerMonth} hrs)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {r.isIdleWaste && (
                      <button
                        onClick={() => handleDecommissionWaste(r.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow"
                      >
                        Decommission
                      </button>
                    )}
                    {(r.publicExposure || !r.backupEnabled) && (
                      <button
                        onClick={() => handleFixSecurityAndBackup(r.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition shadow"
                      >
                        Enforce Policy & Backup
                      </button>
                    )}
                    {!r.isIdleWaste && !r.publicExposure && r.backupEnabled && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        ✓ Compliant & Optimized
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
