// Shared chart theme for all lab visualizations.
//
// Categorical series colors are the validated CVD-safe dark palette (8 hues,
// fixed order — see dataviz skill `references/palette.md`). Never cycle or
// reorder these per-chart; always assign by series index in this fixed order
// so identity stays consistent across a lab's panels.
export const SERIES_COLORS = [
  '#3987e5', // 1 blue
  '#d95926', // 2 orange
  '#199e70', // 3 aqua
  '#c98500', // 4 yellow
  '#d55181', // 5 magenta
  '#008300', // 6 green
  '#9085e9', // 7 violet
  '#e66767', // 8 red
] as const;

export function seriesColor(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

// Fixed status roles — never reused as a categorical series color.
export const STATUS_COLORS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
} as const;

// Single-hue sequential ramp (magnitude), light -> dark step, for heatmap-like
// or ordered-intensity encodings.
export const SEQUENTIAL_BLUE = [
  '#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b',
] as const;

// Diverging pair (blue <-> red) with neutral midpoint, for over/under or
// surplus/deficit encodings. Equal step count per arm.
export const DIVERGING_POSITIVE = '#3987e5';
export const DIVERGING_NEGATIVE = '#e66767';
export const DIVERGING_NEUTRAL = '#383835';

// Chrome tokens matched to the lab shell's existing dark surfaces
// (bg-[#090b14] page / bg-[#111425] panels) rather than the skill's reference
// warm-gray chrome, so charts sit flush inside the existing card system.
export const CHART_CHROME = {
  gridline: 'rgba(255,255,255,0.07)',
  axisLine: 'rgba(255,255,255,0.14)',
  primaryInk: '#f1f5f9', // slate-100
  secondaryInk: '#94a3b8', // slate-400
  mutedInk: '#64748b', // slate-500
  tooltipBg: '#0d101e',
  tooltipBorder: 'rgba(255,255,255,0.12)',
} as const;

export const CHART_FONT = {
  family: "'ui-sans-serif', system-ui, -apple-system, 'Segoe UI', sans-serif",
  size: 11,
  weight: 600,
} as const;
