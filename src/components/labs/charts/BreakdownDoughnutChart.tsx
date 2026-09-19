'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { seriesColor, CHART_CHROME, CHART_FONT } from './chartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BreakdownDoughnutChartProps {
  labels: string[];
  values: number[];
  /** Center label, e.g. a total. */
  centerLabel?: string;
  centerValue?: string;
}

/**
 * Categorical share breakdown. Capped visually at the palette's first 6
 * slots — fold additional categories into "Other" before charting.
 */
export default function BreakdownDoughnutChart({ labels, values, centerLabel, centerValue }: BreakdownDoughnutChartProps) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => seriesColor(i)),
        borderColor: '#111425',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="relative h-full w-full">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: CHART_CHROME.secondaryInk,
                font: { size: CHART_FONT.size, family: CHART_FONT.family },
                boxWidth: 10,
                usePointStyle: true,
                padding: 10,
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
        }}
      />
      {centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ right: '33%' }}>
          <span className="text-lg font-black text-white">{centerValue}</span>
          {centerLabel && <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
