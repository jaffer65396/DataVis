import React, { useState } from 'react';
import { ChartConfig } from '../../types/project';

interface Props {
  data: Record<string, any>[];
  config: ChartConfig;
  onSelectPoint?: (dimension: string, value: any) => void;
  selectedPoint?: { column?: string; value?: any } | null;
  themeColors?: string[];
}

/**
 * Radar Chart Component
 */
export const RadarChartComponent: React.FC<Props> = ({
  data,
  config,
  onSelectPoint,
  selectedPoint,
  themeColors,
}) => {
  const { xAxisColumn, yAxisColumn, colorPalette } = config;
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#8b5cf6']);
  const color = palette[0];

  const categories = data.map((d) => String(d[xAxisColumn] ?? ''));
  const values = data.map((d) => Number(d[yAxisColumn] || 0));
  const maxVal = Math.max(...values, 0) || 1;

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const count = categories.length;

  if (count === 0) return <div className="text-center text-xs text-slate-400">No data</div>;

  const angles = categories.map((_, i) => (i / count) * 2 * Math.PI - Math.PI / 2);
  const polygonPoints = values.map((val, i) => {
    const r = (val / maxVal) * radius;
    return {
      x: center + r * Math.cos(angles[i]),
      y: center + r * Math.sin(angles[i]),
      val,
      cat: categories[i],
    };
  });

  const polygonStr = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative flex h-full w-full items-center justify-center select-none">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full max-h-[260px] w-auto">
        {/* Background web rings */}
        {[0.25, 0.5, 0.75, 1].map((pct, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * pct}
            fill="none"
            stroke="#e2e8f0"
            strokeDasharray="2 2"
          />
        ))}

        {/* Spokes */}
        {angles.map((ang, i) => {
          const x2 = center + radius * Math.cos(ang);
          const y2 = center + radius * Math.sin(ang);
          const labelX = center + (radius + 16) * Math.cos(ang);
          const labelY = center + (radius + 16) * Math.sin(ang);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" />
              <text
                x={labelX}
                y={labelY + 4}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
                className="font-medium"
              >
                {categories[i].substring(0, 8)}
              </text>
            </g>
          );
        })}

        {/* Value Polygon */}
        <polygon
          points={polygonStr}
          fill={color}
          fillOpacity="0.25"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Points */}
        {polygonPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill="#ffffff"
            stroke={color}
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, pt.cat)}
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * Treemap Component
 */
export const TreemapChartComponent: React.FC<Props> = ({
  data,
  config,
  onSelectPoint,
  selectedPoint,
  themeColors,
}) => {
  const { xAxisColumn, yAxisColumn, colorPalette } = config;
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']);

  const values = data.map((d) => Math.max(1, Number(d[yAxisColumn] || 1)));
  const total = values.reduce((sum, v) => sum + v, 0) || 1;

  return (
    <div className="flex h-full w-full flex-wrap gap-1.5 p-1 select-none overflow-hidden">
      {data.map((row, i) => {
        const cat = String(row[xAxisColumn] ?? '');
        const val = Number(row[yAxisColumn] || 0);
        const pct = Math.round((val / total) * 100);
        const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === cat;
        const color = palette[i % palette.length];

        return (
          <div
            key={i}
            className={`flex flex-col justify-between rounded p-2.5 cursor-pointer transition-all duration-150 hover:brightness-105 ${
              isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''
            }`}
            style={{
              flex: `1 1 ${Math.max(18, Math.min(48, pct * 2))}%`,
              backgroundColor: color,
              minHeight: '75px',
              opacity: isSelected ? 1 : selectedPoint ? 0.4 : 0.9,
            }}
            onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, cat)}
          >
            <span className="font-semibold text-white text-xs truncate drop-shadow-sm">{cat}</span>
            <div className="flex items-baseline justify-between text-white/90 text-[11px] font-mono">
              <span>{val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toLocaleString()}</span>
              <span>{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Candlestick (Financial OHLC) Component
 */
export const CandlestickChartComponent: React.FC<Props> = ({
  data,
  config,
  onSelectPoint,
  selectedPoint,
}) => {
  const { xAxisColumn } = config;
  const width = 500;
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 40, left: 55 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Extract High, Low, Open, Close
  const records = data.map((d) => ({
    cat: String(d[xAxisColumn] ?? ''),
    open: Number(d.Open || d.SpotPrice || 100),
    high: Number(d.High || Math.max(d.Open || 100, d.Close || 100) * 1.05),
    low: Number(d.Low || Math.min(d.Open || 100, d.Close || 100) * 0.95),
    close: Number(d.Close || d.SpotPrice || 100),
  }));

  const allLows = records.map((r) => r.low);
  const allHighs = records.map((r) => r.high);
  const minVal = Math.min(...allLows, 0) || 1;
  const maxVal = Math.max(...allHighs, 100) || 100;

  const step = plotWidth / records.length;
  const candleWidth = Math.max(6, Math.min(22, step - 8));

  return (
    <div className="relative h-full w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - margin.bottom - pct * plotHeight;
          const val = minVal + pct * (maxVal - minVal);
          return (
            <g key={idx}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={margin.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Candles */}
        {records.map((c, i) => {
          const isUp = c.close >= c.open;
          const candleColor = isUp ? '#10b981' : '#ef4444';
          const x = margin.left + i * step + step / 2;

          const yHigh = height - margin.bottom - ((c.high - minVal) / (maxVal - minVal)) * plotHeight;
          const yLow = height - margin.bottom - ((c.low - minVal) / (maxVal - minVal)) * plotHeight;
          const yOpen = height - margin.bottom - ((c.open - minVal) / (maxVal - minVal)) * plotHeight;
          const yClose = height - margin.bottom - ((c.close - minVal) / (maxVal - minVal)) * plotHeight;

          const boxTop = Math.min(yOpen, yClose);
          const boxHeight = Math.max(2, Math.abs(yClose - yOpen));

          return (
            <g
              key={i}
              className="cursor-pointer"
              onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, c.cat)}
            >
              {/* High-Low Wick */}
              <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.5" />

              {/* Open-Close Body */}
              <rect
                x={x - candleWidth / 2}
                y={boxTop}
                width={candleWidth}
                height={boxHeight}
                fill={candleColor}
                rx={1}
              />

              {/* X Category */}
              <text
                x={x}
                y={height - margin.bottom + 16}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
              >
                {c.cat.length > 7 ? c.cat.substring(0, 6) + '…' : c.cat}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Scatter and Bubble Plot
 */
export const ScatterBubbleChartComponent: React.FC<Props> = ({
  data,
  config,
  onSelectPoint,
  themeColors,
}) => {
  const { xAxisColumn, yAxisColumn, secondaryYAxisColumn, colorPalette } = config;
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#2563eb']);
  const color = palette[0];

  const width = 500;
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 40, left: 55 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const xVals = data.map((d) => Number(d[xAxisColumn] || 0));
  const yVals = data.map((d) => Number(d[yAxisColumn] || 0));
  const rVals = secondaryYAxisColumn ? data.map((d) => Number(d[secondaryYAxisColumn] || 1)) : [];

  const minX = Math.min(...xVals, 0);
  const maxX = Math.max(...xVals, 1) || 1;
  const minY = Math.min(...yVals, 0);
  const maxY = Math.max(...yVals, 1) || 1;
  const maxR = rVals.length > 0 ? Math.max(...rVals, 1) : 1;

  return (
    <div className="relative h-full w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - margin.bottom - pct * plotHeight;
          return (
            <line key={idx} x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
          );
        })}

        {data.map((row, i) => {
          const x = margin.left + ((xVals[i] - minX) / (maxX - minX || 1)) * plotWidth;
          const y = height - margin.bottom - ((yVals[i] - minY) / (maxY - minY || 1)) * plotHeight;
          const radius = rVals.length > 0 ? Math.max(4, Math.min(18, (rVals[i] / maxR) * 18)) : 6;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={radius}
              fill={color}
              fillOpacity="0.6"
              stroke={color}
              strokeWidth="1.5"
              className="cursor-pointer hover:fill-opacity-90"
            />
          );
        })}
      </svg>
    </div>
  );
};
