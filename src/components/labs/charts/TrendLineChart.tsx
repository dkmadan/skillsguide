'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { seriesColor, CHART_CHROME, CHART_FONT } from './chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export interface TrendSeries {
  label: string;
  data: (number | null)[];
  fill?: boolean;
}

interface TrendLineChartProps {
  labels: (string | number)[];
  series: TrendSeries[];
  yLabel?: string;
  suggestedMin?: number;
}

/**
 * Single-axis trend/time line chart. Never pass two series of different
 * scale — index or split into small multiples instead of a second y-axis.
 */
export default function TrendLineChart({ labels, series, yLabel, suggestedMin }: TrendLineChartProps) {
  const data = {
    labels,
    datasets: series.map((s, i) => {
      const color = seriesColor(i);
      return {
        label: s.label,
        data: s.data,
        borderColor: color,
        backgroundColor: s.fill ? `${color}26` : color,
        pointBackgroundColor: color,
        pointBorderColor: CHART_CHROME.tooltipBg,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        fill: Boolean(s.fill),
        tension: 0.3,
      };
    }),
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
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
            grid: { color: CHART_CHROME.gridline },
            border: { color: CHART_CHROME.axisLine },
            ticks: { color: CHART_CHROME.mutedInk, font: { size: 10, family: CHART_FONT.family } },
          },
          y: {
            suggestedMin,
            grid: { color: CHART_CHROME.gridline },
            border: { color: CHART_CHROME.axisLine },
            ticks: { color: CHART_CHROME.mutedInk, font: { size: 10, family: CHART_FONT.family } },
            title: yLabel ? { display: true, text: yLabel, color: CHART_CHROME.mutedInk, font: { size: 10 } } : undefined,
          },
        },
      }}
    />
  );
}
