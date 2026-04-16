"use client";

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Create Reusable Gradient Function
function getGradient(ctx: CanvasRenderingContext2D, chartArea: any, startColor: string, endColor: string) {
  let gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

interface ChartViewProps {
  type: 'line' | 'bar';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | any; // allow gradients
    gradientStart?: string;
    gradientEnd?: string;
    borderWidth?: number;
    borderRadius?: number;
    borderSkipped?: boolean;
    fill?: boolean | { target: string, above: string };
    tension?: number; // for smooth curves
  }[];
  title?: string;
}

export function ChartView({ type, labels, datasets, title }: ChartViewProps) {
  // Attach gradients if configured in datasets via a function ref
  const data = {
    labels,
    datasets: datasets.map(ds => ({
      ...ds,
      borderWidth: ds.borderWidth ?? (type === 'line' ? 3 : 0),
      // Soft rounded bars by default for bar charts
      borderRadius: ds.borderRadius ?? (type === 'bar' ? 6 : 0),
      borderSkipped: ds.borderSkipped ?? false,
      // Smooth curves by default for line charts
      tension: ds.tension ?? (type === 'line' ? 0.4 : 0),
      pointRadius: type === 'line' ? 0 : undefined,
      pointHoverRadius: type === 'line' ? 6 : undefined,
    }))
  };

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          color: '#86868b', // Apple gray Text
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 13,
            weight: 500,
          }
        }
      },
      title: {
        display: !!title,
        text: title || '',
        color: '#1d1d1f',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 18,
          weight: 600,
        },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Apple glass effect
        titleColor: '#1d1d1f',
        bodyColor: '#1d1d1f',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        titleFont: { family: 'Inter, system-ui, sans-serif', size: 14, weight: 600 },
        bodyFont: { family: 'Inter, system-ui, sans-serif', size: 13, weight: 400 },
        padding: 14,
        cornerRadius: 12,
        boxPadding: 6,
        usePointStyle: true,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
             let label = context.dataset.label || '';
             if (label) { label += ': '; }
             if (context.parsed.y !== null) {
                 label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
             }
             return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { 
          color: '#86868b', 
          font: { family: 'Inter, system-ui, sans-serif', size: 12 },
          maxRotation: 0,
          padding: 10
        },
      },
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(0, 0, 0, 0.04)', 
          drawBorder: false,
        },
        border: { display: false },
        ticks: { 
          color: '#86868b', 
          font: { family: 'Inter, system-ui, sans-serif', size: 12 }, 
          maxTicksLimit: 6,
          padding: 10,
          callback: function(value: any) {
             // Abbreviate large numbers for clean Y axis
             if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
             if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
             return value;
          }
        },
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 400,
      easing: 'easeOutQuart' as const,
    }
  }), [title]);

  return (
    <div className="w-full h-[400px] md:h-[450px]">
      {type === 'line' ? (
        <Line data={data as any} options={options as any} />
      ) : (
        <Bar data={data as any} options={options as any} />
      )}
    </div>
  );
}
