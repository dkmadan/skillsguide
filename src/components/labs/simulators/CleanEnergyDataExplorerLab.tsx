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

export default function CleanEnergyDataExplorerLab({ onDirty, onSubmit }: Props) {
  const [solarCapacityKw, setSolarCapacityKw] = useState<number>(45); // 45 kW array
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState<number>(60); // 60 kWh battery
  const [energySummaryNotes, setEnergySummaryNotes] = useState<string>('Campus peak solar production occurs between 11:00 and 15:00 UTC, cleanly offsetting midday HVAC cooling loads.');

  // Hourly profile: 24 hours
  // Base hourly load (kW) and Normalized solar irradiance (0.0 to 1.0)
  const hourlyData = useMemo(() => {
    // 24 hours: midnight to 23:00
    const profile = [
      { hour: 0, loadKw: 12, solarNorm: 0.0 },
      { hour: 2, loadKw: 10, solarNorm: 0.0 },
      { hour: 4, loadKw: 11, solarNorm: 0.0 },
      { hour: 6, loadKw: 18, solarNorm: 0.1 },
      { hour: 8, loadKw: 35, solarNorm: 0.4 },
      { hour: 10, loadKw: 50, solarNorm: 0.8 },
      { hour: 12, loadKw: 55, solarNorm: 1.0 },
      { hour: 14, loadKw: 52, solarNorm: 0.9 },
      { hour: 16, loadKw: 42, solarNorm: 0.5 },
      { hour: 18, loadKw: 30, solarNorm: 0.1 },
      { hour: 20, loadKw: 24, solarNorm: 0.0 },
      { hour: 22, loadKw: 16, solarNorm: 0.0 },
    ];

    let totalLoadKwh = 0;
    let totalSolarKwh = 0;
    let totalSelfConsumedKwh = 0;
    let totalGridExportKwh = 0;
    let totalGridImportKwh = 0;

    const computed = profile.map(pt => {
      // Step is 2 hours
      const solarGenKw = pt.solarNorm * solarCapacityKw;
      const stepLoadKwh = pt.loadKw * 2;
      const stepSolarKwh = solarGenKw * 2;

      const selfUseKwh = Math.min(stepLoadKwh, stepSolarKwh);
      const surplusKwh = Math.max(0, stepSolarKwh - stepLoadKwh);
      const deficitKwh = Math.max(0, stepLoadKwh - stepSolarKwh);

      totalLoadKwh += stepLoadKwh;
      totalSolarKwh += stepSolarKwh;
      totalSelfConsumedKwh += selfUseKwh;
      totalGridExportKwh += surplusKwh;
      totalGridImportKwh += deficitKwh;

      return {
        ...pt,
        solarGenKw,
        stepLoadKwh,
        stepSolarKwh,
        selfUseKwh,
        surplusKwh,
        deficitKwh
      };
    });

    const solarSelfSufficiencyPct = totalLoadKwh > 0 ? (totalSelfConsumedKwh / totalLoadKwh) * 100 : 0;

    return {
      points: computed,
      totalLoadKwh,
      totalSolarKwh,
      totalSelfConsumedKwh,
      totalGridExportKwh,
      totalGridImportKwh,
      solarSelfSufficiencyPct
    };
  }, [solarCapacityKw]);

  const handleExportCsv = () => {
    const rows = hourlyData.points.map(p => ({
      hour_utc: `${p.hour}:00`,
      load_kw: p.loadKw,
      solar_gen_kw: p.solarGenKw.toFixed(1),
      load_kwh: p.stepLoadKwh,
      solar_kwh: p.stepSolarKwh.toFixed(1),
      self_consumed_kwh: p.selfUseKwh.toFixed(1),
      grid_import_kwh: p.deficitKwh.toFixed(1),
      grid_export_kwh: p.surplusKwh.toFixed(1)
    }));
    downloadCsv('clean_energy_telemetry.csv', rows);
  };

  const handleExportJson = () => {
    downloadJson('clean_energy_analysis.json', {
      solarCapacityKw,
      batteryCapacityKwh,
      summary: {
        totalLoadKwh: hourlyData.totalLoadKwh,
        totalSolarKwh: hourlyData.totalSolarKwh,
        totalSelfConsumedKwh: hourlyData.totalSelfConsumedKwh,
        selfSufficiencyPct: hourlyData.solarSelfSufficiencyPct.toFixed(1)
      },
      energySummaryNotes
    });
  };

  const handleFinalSubmit = () => {
    onSubmit({
      solarCapacityKw,
      batteryCapacityKwh,
      hourlyData,
      energySummaryNotes
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lab 30 • Renewable Energy & Sustainability
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Clean Energy Data Explorer & Grid Micro-Simulation</h2>
            <p className="text-sm text-slate-400 mt-1">
              Model campus load profiles against rooftop solar PV generation: <code>Energy (kWh) = Power (kW) × Time (hrs)</code>. Optimize self-consumption and analyze battery storage arbitrage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export Telemetry CSV
            </button>
            <button
              onClick={handleFinalSubmit}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
            >
              Submit Energy Audit
            </button>
          </div>
        </div>
      </div>

      {/* KPI Energy Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Daily Campus Load</div>
          <div className="text-2xl font-bold text-white mt-1">{hourlyData.totalLoadKwh} kWh</div>
          <p className="text-xs text-slate-500 mt-1">Base building HVAC & labs</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Solar PV Generation</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{Math.round(hourlyData.totalSolarKwh)} kWh</div>
          <p className="text-xs text-slate-500 mt-1">Capacity: {solarCapacityKw} kW peak array</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Clean Self-Sufficiency</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {hourlyData.solarSelfSufficiencyPct.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Self-consumed clean power</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 uppercase">Grid Dependence (Import)</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{Math.round(hourlyData.totalGridImportKwh)} kWh</div>
          <p className="text-xs text-slate-500 mt-1">Off-peak nighttime pull</p>
        </div>
      </div>

      {/* Generation vs Load Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">24-Hour Load vs Solar Production Curves</h3>

          {/* Bar chart representation */}
          <div className="space-y-2">
            {hourlyData.points.map(pt => (
              <div key={pt.hour} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono text-slate-400 shrink-0">{pt.hour}:00</span>
                <div className="flex-1 flex gap-1 h-5 bg-slate-950 rounded p-0.5">
                  {/* Load bar */}
                  <div
                    className="bg-sky-600 rounded-sm"
                    style={{ width: `${Math.min(100, (pt.loadKw / 60) * 100)}%` }}
                    title={`Load: ${pt.loadKw} kW`}
                  />
                  {/* Solar bar */}
                  <div
                    className="bg-amber-400 rounded-sm"
                    style={{ width: `${Math.min(100, (pt.solarGenKw / 60) * 100)}%` }}
                    title={`Solar: ${pt.solarGenKw.toFixed(1)} kW`}
                  />
                </div>
                <span className="w-24 text-right font-mono text-[11px] text-slate-400 shrink-0">
                  {pt.solarGenKw.toFixed(0)} / {pt.loadKw} kW
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-600" />
              <span>Campus Electricity Demand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span>Rooftop Solar PV Output</span>
            </div>
          </div>
        </div>

        {/* Capacity Slider & Summary */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-white">Microgrid Sizing Controls</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Solar Array Peak Capacity</span>
                <span className="font-mono text-amber-400 font-bold">{solarCapacityKw} kWp</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={solarCapacityKw}
                onChange={e => { setSolarCapacityKw(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>BESS Battery Storage</span>
                <span className="font-mono text-emerald-400 font-bold">{batteryCapacityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="10"
                value={batteryCapacityKwh}
                onChange={e => { setBatteryCapacityKwh(parseInt(e.target.value)); onDirty(); }}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 block mb-1">Energy Audit Memo & Assumptions</label>
              <textarea
                rows={4}
                value={energySummaryNotes}
                onChange={e => { setEnergySummaryNotes(e.target.value); onDirty(); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
