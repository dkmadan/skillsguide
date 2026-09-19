'use client';

import { useMemo, useState } from 'react';
import { LabScenarioVariant, LabDifficulty } from '@/lib/labs/types';
import { useUndoableState } from '@/lib/labs/useUndoableState';
import { downloadCsv, downloadJson } from '@/lib/labs/exportHelper';
import ChartFrame from '@/components/labs/charts/ChartFrame';
import TrendLineChart from '@/components/labs/charts/TrendLineChart';
import CompareBarChart from '@/components/labs/charts/CompareBarChart';
import SimClock from '@/components/labs/SimClock';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FileJson,
  Send,
  Sun,
  Battery,
  CloudOff,
  Zap,
} from 'lucide-react';

interface SimulatorProps {
  scenario?: LabScenarioVariant;
  variant: LabDifficulty;
  onDirty: () => void;
  onSubmit: (answers: Record<string, unknown>) => void;
}

interface RawPoint {
  hour: number;
  durationHours: number;
  loadKw: number;
  solarNorm: number;
}

interface BatteryCard {
  id: string;
  timeLabel: string;
  socPct: number;
  note: string;
  correctAnswer: 'charging' | 'discharging' | 'idle';
}

interface Fixture {
  points: RawPoint[];
  defaultSolarCapacityKw: number;
  batteryCards: BatteryCard[];
  narrative: string;
}

// Three genuinely different sampling patterns — beginner uses uniform 2-hour
// steps, intermediate and challenge use deliberately mismatched time
// intervals (finer during the day, coarser at night) so energy integration
// must respect each point's own duration rather than assuming a fixed step.
const FIXTURES: Record<LabDifficulty, Fixture> = {
  beginner: {
    narrative: 'A single rooftop array on a community campus with a clean, evenly sampled telemetry feed.',
    defaultSolarCapacityKw: 45,
    points: [
      { hour: 0, durationHours: 2, loadKw: 12, solarNorm: 0 },
      { hour: 2, durationHours: 2, loadKw: 10, solarNorm: 0 },
      { hour: 4, durationHours: 2, loadKw: 11, solarNorm: 0 },
      { hour: 6, durationHours: 2, loadKw: 18, solarNorm: 0.1 },
      { hour: 8, durationHours: 2, loadKw: 35, solarNorm: 0.4 },
      { hour: 10, durationHours: 2, loadKw: 50, solarNorm: 0.8 },
      { hour: 12, durationHours: 2, loadKw: 55, solarNorm: 1.0 },
      { hour: 14, durationHours: 2, loadKw: 52, solarNorm: 0.9 },
      { hour: 16, durationHours: 2, loadKw: 42, solarNorm: 0.5 },
      { hour: 18, durationHours: 2, loadKw: 30, solarNorm: 0.1 },
      { hour: 20, durationHours: 2, loadKw: 24, solarNorm: 0 },
      { hour: 22, durationHours: 2, loadKw: 16, solarNorm: 0 },
    ],
    batteryCards: [
      { id: 'bc1', timeLabel: '10:00', socPct: 42, note: 'Solar output is climbing above campus load; battery SoC has risen from 38% to 42% over the last snapshot.', correctAnswer: 'charging' },
      { id: 'bc2', timeLabel: '19:00', socPct: 55, note: 'Solar output has dropped near zero while campus load is still 30 kW; SoC has fallen from 61% to 55%.', correctAnswer: 'discharging' },
      { id: 'bc3', timeLabel: '02:00', socPct: 20, note: 'Solar output is zero and the battery has been held at a flat 20% reserve floor for the last three snapshots.', correctAnswer: 'idle' },
    ],
  },
  intermediate: {
    narrative: 'A mixed-load campus whose telemetry samples hourly during the day and every 2-4 hours overnight.',
    defaultSolarCapacityKw: 50,
    points: [
      { hour: 0, durationHours: 4, loadKw: 11, solarNorm: 0 },
      { hour: 4, durationHours: 2, loadKw: 14, solarNorm: 0 },
      { hour: 6, durationHours: 1, loadKw: 20, solarNorm: 0.15 },
      { hour: 7, durationHours: 1, loadKw: 28, solarNorm: 0.3 },
      { hour: 8, durationHours: 1, loadKw: 38, solarNorm: 0.5 },
      { hour: 9, durationHours: 1, loadKw: 46, solarNorm: 0.7 },
      { hour: 10, durationHours: 1, loadKw: 52, solarNorm: 0.85 },
      { hour: 11, durationHours: 1, loadKw: 56, solarNorm: 0.95 },
      { hour: 12, durationHours: 1, loadKw: 58, solarNorm: 1.0 },
      { hour: 13, durationHours: 1, loadKw: 55, solarNorm: 0.95 },
      { hour: 14, durationHours: 1, loadKw: 50, solarNorm: 0.85 },
      { hour: 15, durationHours: 1, loadKw: 44, solarNorm: 0.6 },
      { hour: 16, durationHours: 2, loadKw: 36, solarNorm: 0.35 },
      { hour: 18, durationHours: 2, loadKw: 26, solarNorm: 0.05 },
      { hour: 20, durationHours: 4, loadKw: 16, solarNorm: 0 },
    ],
    batteryCards: [
      { id: 'ic1', timeLabel: '09:00', socPct: 47, note: 'Generation crossed above load one hour ago; SoC rose from 41% to 47% since the prior snapshot.', correctAnswer: 'charging' },
      { id: 'ic2', timeLabel: '12:30', socPct: 61, note: 'Generation and load are within 1 kW of each other this hour; SoC moved from 60% to 61%.', correctAnswer: 'charging' },
      { id: 'ic3', timeLabel: '20:00', socPct: 33, note: 'Load exceeds generation by 16 kW this window; SoC dropped from 40% to 33%.', correctAnswer: 'discharging' },
      { id: 'ic4', timeLabel: '02:00', socPct: 20, note: 'No generation, and the battery has been held flat at the 20% reserve floor for several hours.', correctAnswer: 'idle' },
    ],
  },
  challenge: {
    narrative: 'A campus with a passing midday cloud bank, sampled at irregular 1-3 hour intervals.',
    defaultSolarCapacityKw: 55,
    points: [
      { hour: 0, durationHours: 3, loadKw: 13, solarNorm: 0 },
      { hour: 3, durationHours: 3, loadKw: 12, solarNorm: 0 },
      { hour: 6, durationHours: 2, loadKw: 22, solarNorm: 0.2 },
      { hour: 8, durationHours: 1, loadKw: 34, solarNorm: 0.5 },
      { hour: 9, durationHours: 1, loadKw: 44, solarNorm: 0.7 },
      { hour: 10, durationHours: 1, loadKw: 50, solarNorm: 0 }, // passing cloud bank: zero generation, mid-day
      { hour: 11, durationHours: 1, loadKw: 54, solarNorm: 0.9 },
      { hour: 12, durationHours: 1, loadKw: 58, solarNorm: 1.0 },
      { hour: 13, durationHours: 1, loadKw: 55, solarNorm: 0.95 },
      { hour: 14, durationHours: 2, loadKw: 48, solarNorm: 0.6 },
      { hour: 16, durationHours: 2, loadKw: 34, solarNorm: 0.2 },
      { hour: 18, durationHours: 3, loadKw: 24, solarNorm: 0 },
      { hour: 21, durationHours: 3, loadKw: 15, solarNorm: 0 },
    ],
    batteryCards: [
      { id: 'cc1', timeLabel: '09:00', socPct: 45, note: 'Generation is well above load; SoC rose from 36% to 45% since the prior snapshot.', correctAnswer: 'charging' },
      { id: 'cc2', timeLabel: '10:00', socPct: 39, note: 'The cloud bank just zeroed generation while load stayed at 50 kW; SoC fell from 45% to 39%.', correctAnswer: 'discharging' },
      { id: 'cc3', timeLabel: '11:00', socPct: 47, note: 'The cloud bank cleared and generation jumped back above load; SoC rose from 39% to 47%.', correctAnswer: 'charging' },
      { id: 'cc4', timeLabel: '22:00', socPct: 20, note: 'No generation, and the battery has been held flat at the 20% reserve floor overnight.', correctAnswer: 'idle' },
      { id: 'cc5', timeLabel: '13:30', socPct: 88, note: 'Battery is near full capacity; the last three snapshots show SoC unchanged at 88% despite continued surplus generation (charge controller has capped it).', correctAnswer: 'idle' },
    ],
  },
};

function computeEnergyKwh(kw: number, hours: number): number {
  return kw * hours;
}

interface ComputedPoint extends RawPoint {
  solarNormEffective: number;
  solarGenKw: number;
  stepLoadKwh: number;
  stepSolarKwh: number;
  selfUseKwh: number;
  surplusKwh: number;
  deficitKwh: number;
}

function computeSeries(points: RawPoint[], solarCapacityKw: number, cloudCoverOverride: boolean) {
  const peakIdx = points.reduce((best, p, i) => (p.solarNorm > points[best].solarNorm ? i : best), 0);
  let totalLoadKwh = 0;
  let totalSolarKwh = 0;
  let totalSelfConsumedKwh = 0;
  let totalGridExportKwh = 0;
  let totalGridImportKwh = 0;

  const computed: ComputedPoint[] = points.map((p, i) => {
    const solarNormEffective = cloudCoverOverride && i === peakIdx ? 0 : p.solarNorm;
    const solarGenKw = solarNormEffective * solarCapacityKw;
    // Energy integration respects each point's own duration — not a fixed
    // step — so mismatched time intervals still sum correctly.
    const stepLoadKwh = computeEnergyKwh(p.loadKw, p.durationHours);
    const stepSolarKwh = computeEnergyKwh(solarGenKw, p.durationHours);
    const selfUseKwh = Math.min(stepLoadKwh, stepSolarKwh);
    const surplusKwh = Math.max(0, stepSolarKwh - stepLoadKwh);
    const deficitKwh = Math.max(0, stepLoadKwh - stepSolarKwh);

    totalLoadKwh += stepLoadKwh;
    totalSolarKwh += stepSolarKwh;
    totalSelfConsumedKwh += selfUseKwh;
    totalGridExportKwh += surplusKwh;
    totalGridImportKwh += deficitKwh;

    return { ...p, solarNormEffective, solarGenKw, stepLoadKwh, stepSolarKwh, selfUseKwh, surplusKwh, deficitKwh };
  });

  const selfSufficiencyPct = totalLoadKwh > 0 ? (totalSelfConsumedKwh / totalLoadKwh) * 100 : 0;
  return { points: computed, totalLoadKwh, totalSolarKwh, totalSelfConsumedKwh, totalGridExportKwh, totalGridImportKwh, selfSufficiencyPct };
}

interface EnergyConfig {
  solarCapacityKw: number;
  cloudCoverOverride: boolean;
  batteryCardAnswers: Record<string, '' | 'charging' | 'discharging' | 'idle'>;
}

export default function CleanEnergyDataExplorerLab({ variant, onDirty, onSubmit }: SimulatorProps) {
  const fixture = FIXTURES[variant];
  const initial: EnergyConfig = {
    solarCapacityKw: fixture.defaultSolarCapacityKw,
    cloudCoverOverride: false,
    batteryCardAnswers: Object.fromEntries(fixture.batteryCards.map((c) => [c.id, ''])),
  };
  const { state, set, undo, redo, reset, canUndo, canRedo, stepIndex } = useUndoableState<EnergyConfig>(initial);
  const [step, setStep] = useState(fixture.points.length - 1);
  const [assumptionsNotes, setAssumptionsNotes] = useState(
    `${fixture.narrative} Self-use is calculated as min(load, generation) at each interval; energy is summed as kW x that interval's own duration in hours, not a fixed step.`
  );

  const update = (patch: Partial<EnergyConfig>) => { set((prev) => ({ ...prev, ...patch })); onDirty(); };
  const setBatteryAnswer = (id: string, ans: 'charging' | 'discharging' | 'idle') => {
    update({ batteryCardAnswers: { ...state.batteryCardAnswers, [id]: ans } });
  };

  const full = useMemo(() => computeSeries(fixture.points, state.solarCapacityKw, state.cloudCoverOverride), [fixture.points, state.solarCapacityKw, state.cloudCoverOverride]);
  const revealed = full.points.slice(0, step + 1);
  const revealedTotals = useMemo(() => {
    return revealed.reduce(
      (acc, p) => ({
        totalLoadKwh: acc.totalLoadKwh + p.stepLoadKwh,
        totalSolarKwh: acc.totalSolarKwh + p.stepSolarKwh,
        totalSelfConsumedKwh: acc.totalSelfConsumedKwh + p.selfUseKwh,
        totalGridImportKwh: acc.totalGridImportKwh + p.deficitKwh,
        totalGridExportKwh: acc.totalGridExportKwh + p.surplusKwh,
      }),
      { totalLoadKwh: 0, totalSolarKwh: 0, totalSelfConsumedKwh: 0, totalGridImportKwh: 0, totalGridExportKwh: 0 }
    );
  }, [revealed]);
  const revealedSelfSufficiencyPct = revealedTotals.totalLoadKwh > 0 ? (revealedTotals.totalSelfConsumedKwh / revealedTotals.totalLoadKwh) * 100 : 0;

  const workedExampleKwh = computeEnergyKwh(2, 3); // spec check: 2 kW for 3 hours = 6 kWh

  const correctBatteryCount = fixture.batteryCards.filter((c) => state.batteryCardAnswers[c.id] === c.correctAnswer).length;

  const handleExportCsv = () => {
    downloadCsv('clean_energy_telemetry.csv', full.points.map((p) => ({
      hour_utc: `${p.hour}:00`,
      duration_hours: p.durationHours,
      load_kw: p.loadKw,
      solar_gen_kw: p.solarGenKw.toFixed(1),
      load_kwh: p.stepLoadKwh.toFixed(1),
      solar_kwh: p.stepSolarKwh.toFixed(1),
      self_consumed_kwh: p.selfUseKwh.toFixed(1),
      grid_import_kwh: p.deficitKwh.toFixed(1),
      grid_export_kwh: p.surplusKwh.toFixed(1),
    })));
  };

  const handleExportJson = () => {
    downloadJson('clean_energy_assumptions.json', {
      variant,
      solarCapacityKw: state.solarCapacityKw,
      cloudCoverOverride: state.cloudCoverOverride,
      totals: full,
      batteryCardAnswers: state.batteryCardAnswers,
      assumptionsNotes,
      workedExampleKwh,
    });
  };

  const handleSubmit = () => {
    onSubmit({
      variant,
      solarCapacityKw: state.solarCapacityKw,
      cloudCoverOverride: state.cloudCoverOverride,
      points: full.points,
      totals: {
        totalLoadKwh: full.totalLoadKwh,
        totalSolarKwh: full.totalSolarKwh,
        totalSelfConsumedKwh: full.totalSelfConsumedKwh,
        totalGridExportKwh: full.totalGridExportKwh,
        totalGridImportKwh: full.totalGridImportKwh,
        selfSufficiencyPct: full.selfSufficiencyPct,
      },
      batteryCardAnswers: state.batteryCardAnswers,
      assumptionsNotes,
      workedExampleKwh,
      undoStepsExplored: stepIndex,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Campus Load (revealed)</span>
          <span className="text-xl font-black text-slate-200">{revealedTotals.totalLoadKwh.toFixed(1)} kWh</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Solar Generation</span>
          <span className="text-xl font-black text-amber-300">{revealedTotals.totalSolarKwh.toFixed(1)} kWh</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{state.solarCapacityKw} kWp array</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-xs text-purple-300 font-bold block mb-1">Self-Sufficiency</span>
          <span className="text-xl font-black text-purple-200">{revealedSelfSufficiencyPct.toFixed(1)}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#131728] border border-white/10">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Grid Import (deficit)</span>
          <span className="text-xl font-black text-cyan-300">{revealedTotals.totalGridImportKwh.toFixed(1)} kWh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-purple-400" />
                <span>1. Day Simulation ({fixture.narrative})</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={undo} disabled={!canUndo} title="Undo last config change"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={redo} disabled={!canRedo} title="Redo"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-30 transition-colors">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => { reset(); setStep(fixture.points.length - 1); onDirty(); }} title="Reset"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <SimClock
              label="Time of Day"
              step={step}
              maxStep={fixture.points.length - 1}
              stepLabel={(s) => `${fixture.points[s]?.hour ?? 0}:00`}
              onAdvance={() => setStep((s) => Math.min(fixture.points.length - 1, s + 1))}
              onReset={() => setStep(0)}
            />

            <div>
              <div className="flex justify-between text-slate-300 mb-1 text-xs">
                <span>Solar Array Peak Capacity</span>
                <span className="font-mono text-amber-400 font-bold">{state.solarCapacityKw} kWp</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={state.solarCapacityKw}
                onChange={(e) => update({ solarCapacityKw: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500" />
            </div>

            <button type="button" onClick={() => update({ cloudCoverOverride: !state.cloudCoverOverride })}
              className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[11px] font-bold transition-colors ${state.cloudCoverOverride ? 'bg-slate-500/20 border-slate-400/40 text-slate-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
              <CloudOff className="w-3.5 h-3.5" />
              <span>{state.cloudCoverOverride ? 'Cloud Cover Override: peak-hour generation forced to zero' : 'Test: force zero generation at peak solar hour'}</span>
            </button>
            <p className="text-[10px] text-slate-500">Formula check: {computeEnergyKwh(2, 3)} kWh = 2 kW load x 3 hours (energy = power x time, computed by the same function used above).</p>
          </div>

          <ChartFrame
            title="Load vs Solar Generation Curves"
            icon={<Zap className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Hour', 'Load (kW)', 'Solar Gen (kW)']}
            tableRows={revealed.map((p) => [`${p.hour}:00`, p.loadKw, Math.round(p.solarGenKw)])}
          >
            <TrendLineChart
              labels={revealed.map((p) => `${p.hour}:00`)}
              series={[
                { label: 'Campus Load (kW)', data: revealed.map((p) => p.loadKw) },
                { label: 'Solar Generation (kW)', data: revealed.map((p) => Math.round(p.solarGenKw)), fill: true },
              ]}
              yLabel="kW"
            />
          </ChartFrame>

          <ChartFrame
            title="Surplus / Deficit per Interval"
            icon={<Battery className="w-4 h-4 text-purple-400" />}
            tableHeaders={['Hour', 'Surplus (kWh)', 'Deficit (kWh)']}
            tableRows={revealed.map((p) => [`${p.hour}:00`, p.surplusKwh.toFixed(1), p.deficitKwh.toFixed(1)])}
          >
            <CompareBarChart
              labels={revealed.map((p) => `${p.hour}:00`)}
              series={[
                { label: 'Surplus (kWh)', data: revealed.map((p) => Math.round(p.surplusKwh * 10) / 10) },
                { label: 'Deficit (kWh)', data: revealed.map((p) => Math.round(p.deficitKwh * 10) / 10) },
              ]}
              yLabel="kWh"
            />
          </ChartFrame>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Battery className="w-3.5 h-3.5 text-purple-400" />
              <span>2. Battery Telemetry Case Cards (interpretation only)</span>
            </h3>
            <div className="space-y-2">
              {fixture.batteryCards.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{c.timeLabel} — SoC {c.socPct}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{c.note}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['charging', 'discharging', 'idle'] as const).map((opt) => (
                      <button key={opt} type="button" onClick={() => setBatteryAnswer(c.id, opt)}
                        className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${state.batteryCardAnswers[c.id] === opt ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-black/20 border-white/10 text-slate-400'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">{correctBatteryCount}/{fixture.batteryCards.length} interpreted so far (feedback shown after submission).</p>
          </div>

          <div className="p-5 rounded-3xl bg-[#111425] border border-white/10 space-y-2">
            <label htmlFor="assumptions-notes" className="text-xs font-extrabold text-white">3. Assumptions Summary</label>
            <textarea id="assumptions-notes" rows={4} value={assumptionsNotes}
              onChange={(e) => { setAssumptionsNotes(e.target.value); onDirty(); }}
              className="w-full text-xs p-3 rounded-xl bg-black/30 border border-white/15 text-slate-200 focus:outline-none focus:border-purple-500/50" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleExportCsv}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <Download className="w-3.5 h-3.5" /><span>CSV</span>
            </button>
            <button type="button" onClick={handleExportJson}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-bold transition-colors">
              <FileJson className="w-3.5 h-3.5" /><span>JSON</span>
            </button>
          </div>

          <button type="button" onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Submit Energy Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
