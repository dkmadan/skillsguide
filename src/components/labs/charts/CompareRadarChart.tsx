'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { seriesColor, CHART_CHROME, CHART_FONT } from './chartTheme';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface RadarSeries {
  label: string;
  data: number[];
}

interface CompareRadarChartProps {
  axes: string[];
  series: RadarSeries[];
  max?: number;
}

/** Multi-axis checklist/quality comparison (e.g. prompt-quality criteria across examples). */
export default function CompareRadarChart({ axes, series, max }: CompareRadarChartProps) {
  const data = {
    labels: axes,
    datasets: series.map((s, i) => {
      const color = seriesColor(i);
      return {
        label: s.label,
        data: s.data,
        borderColor: color,
        backgroundColor: `${color}26`,
        pointBackgroundColor: color,
        borderWidth: 2,
      };
    }),
  };

  return (
    <Radar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: series.length > 1,
            position: 'top',
            labels: {
              color: CHART_CHROME.secondaryInk,
              font: { size: CHART_FONT.size, family: CHART_FONT.family },
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
          },
        },
        scales: {
          r: {
            max,
            angleLines: { color: CHART_CHROME.gridline },
            grid: { color: CHART_CHROME.gridline },
            pointLabels: { color: CHART_CHROME.secondaryInk, font: { size: 10, family: CHART_FONT.family } },
            ticks: { color: CHART_CHROME.mutedInk, backdropColor: 'transparent', font: { size: 9 } },
          },
        },
      }}
    />
  );
}
