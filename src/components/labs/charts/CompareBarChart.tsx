'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { seriesColor, CHART_CHROME, CHART_FONT, STATUS_COLORS } from './chartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface BarSeries {
  label: string;
  data: number[];
  /** Optional per-bar status override (e.g. flag a value as critical). Same length as data. */
  statusOverride?: (keyof typeof STATUS_COLORS | null)[];
}

interface CompareBarChartProps {
  labels: (string | number)[];
  series: BarSeries[];
  horizontal?: boolean;
  yLabel?: string;
  stacked?: boolean;
}

/** Grouped/stacked bar chart for magnitude comparisons across categories. */
export default function CompareBarChart({ labels, series, horizontal = false, yLabel, stacked = false }: CompareBarChartProps) {
  const data = {
    labels,
    datasets: series.map((s, i) => {
      const base = seriesColor(i);
      const colors = s.statusOverride
        ? s.data.map((_, idx) => (s.statusOverride?.[idx] ? STATUS_COLORS[s.statusOverride[idx] as keyof typeof STATUS_COLORS] : base))
        : base;
      return {
        label: s.label,
        data: s.data,
        backgroundColor: colors,
        borderRadius: 4,
        maxBarThickness: 34,
      };
    }),
  };

  return (
    <Bar
      data={data}
      options={{
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: series.length > 1,
            position: 'top',
            labels: {
              color: CHART_CHROME.secondaryInk,
              font: { size: CHART_FONT.size, weight: CHART_FONT.weight as never, family: CHART_FONT.family },
              boxWidth: 10,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: CHART_CHROME.tooltipBg,
            borderColor: CHART_CHROME.tooltipBorder,
            borderWidth: 1,
            titleColor: CHART_CHROME.primaryInk,
            bodyColor: CHART_CHROME.secondaryInk,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            stacked,
            grid: { color: horizontal ? CHART_CHROME.gridline : 'transparent' },
            border: { color: CHART_CHROME.axisLine },
            ticks: { color: CHART_CHROME.mutedInk, font: { size: 10, family: CHART_FONT.family } },
          },
          y: {
            stacked,
            grid: { color: horizontal ? 'transparent' : CHART_CHROME.gridline },
            border: { color: CHART_CHROME.axisLine },
            ticks: { color: CHART_CHROME.mutedInk, font: { size: 10, family: CHART_FONT.family } },
            title: yLabel ? { display: true, text: yLabel, color: CHART_CHROME.mutedInk, font: { size: 10 } } : undefined,
          },
        },
      }}
    />
  );
}
