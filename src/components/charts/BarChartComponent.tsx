import React, { useState } from 'react';
import { ChartConfig } from '../../types/project';

interface Props {
  data: Record<string, any>[];
  config: ChartConfig;
  onSelectPoint?: (dimension: string, value: any) => void;
  selectedPoint?: { column?: string; value?: any } | null;
  themeColors?: string[];
}

export const BarChartComponent: React.FC<Props> = ({
  data,
  config,
  onSelectPoint,
  selectedPoint,
  themeColors,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
        No data available for current selection
      </div>
    );
  }

  const { xAxisColumn, yAxisColumn, chartType, showGrid, showLabels, colorPalette } = config;
  const isHorizontal = chartType === 'bar_horizontal';
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#2563eb', '#38bdf8', '#10b981', '#f59e0b']);

  // Extract values
  const categories = data.map((d) => String(d[xAxisColumn] ?? ''));
  const values = data.map((d) => Number(d[yAxisColumn] || 0));
  const maxVal = Math.max(...values, 0) || 1;

  const width = 500;
  const height = 260;
  const margin = isHorizontal 
    ? { top: 20, right: 40, bottom: 20, left: 100 }
    : { top: 20, right: 20, bottom: 45, left: 55 };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  if (isHorizontal) {
    const barHeight = Math.max(12, Math.min(28, plotHeight / categories.length - 8));
    const step = plotHeight / categories.length;

    return (
      <div className="relative h-full w-full select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
          {/* Grid lines */}
          {showGrid && [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const x = margin.left + pct * plotWidth;
            return (
              <g key={i}>
                <line x1={x} y1={margin.top} x2={x} y2={height - margin.bottom} stroke="#e2e8f0" strokeDasharray="3 3" />
                <text x={x} y={height - margin.bottom + 14} textAnchor="middle" fontSize="10" fill="#94a3b8">
                  {Math.round(pct * maxVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((row, i) => {
            const val = Number(row[yAxisColumn] || 0);
            const barW = Math.max(2, (val / maxVal) * plotWidth);
            const y = margin.top + i * step + (step - barHeight) / 2;
            const cat = categories[i];
            const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === cat;
            const isHovered = hoveredIdx === i;
            const barColor = palette[i % palette.length];

            return (
              <g
                key={i}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, cat)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Category label */}
                <text
                  x={margin.left - 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight={isSelected ? '600' : '400'}
                  fill={isSelected ? '#2563eb' : '#475569'}
                  className="truncate"
                >
                  {cat.length > 12 ? cat.substring(0, 11) + '…' : cat}
                </text>

                {/* Bar rect */}
                <rect
                  x={margin.left}
                  y={y}
                  width={barW}
                  height={barHeight}
                  rx={4}
                  fill={barColor}
                  opacity={isSelected ? 1 : selectedPoint ? 0.35 : isHovered ? 0.9 : 0.85}
                  stroke={isSelected ? '#1e40af' : 'none'}
                  strokeWidth={isSelected ? 2 : 0}
                />

                {/* Value label */}
                {showLabels && (
                  <text
                    x={margin.left + barW + 6}
                    y={y + barHeight / 2 + 4}
                    fontSize="10"
                    fontWeight="500"
                    fill="#475569"
                  >
                    {val.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="pointer-events-none absolute z-20 rounded-md bg-slate-900/95 px-2.5 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
            style={{
              top: margin.top + hoveredIdx * (plotHeight / categories.length),
              left: Math.min(width - 120, margin.left + 50),
            }}
          >
            <div className="font-semibold">{categories[hoveredIdx]}</div>
            <div className="text-slate-300">
              {yAxisColumn}: <span className="font-bold text-white">{values[hoveredIdx].toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-slate-400">Click to cross-filter</div>
          </div>
        )}
      </div>
    );
  }

  // Vertical Bar Chart
  const barWidth = Math.max(14, Math.min(48, plotWidth / categories.length - 12));
  const step = plotWidth / categories.length;

  return (
    <div className="relative h-full w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        {/* Y Axis Grid lines */}
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = height - margin.bottom - pct * plotHeight;
          return (
            <g key={i}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                {Math.round(pct * maxVal).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Vertical Bars */}
        {data.map((row, i) => {
          const val = Number(row[yAxisColumn] || 0);
          const barH = Math.max(2, (val / maxVal) * plotHeight);
          const x = margin.left + i * step + (step - barWidth) / 2;
          const y = height - margin.bottom - barH;
          const cat = categories[i];
          const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === cat;
          const isHovered = hoveredIdx === i;
          const barColor = palette[i % palette.length];

          return (
            <g
              key={i}
              className="cursor-pointer transition-all duration-150"
              onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, cat)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Bar Rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={barColor}
                opacity={isSelected ? 1 : selectedPoint ? 0.35 : isHovered ? 0.9 : 0.85}
                stroke={isSelected ? '#1e40af' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
              />

              {/* Value Label */}
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="500"
                  fill="#475569"
                >
                  {val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toLocaleString()}
                </text>
              )}

              {/* Category X Label */}
              <text
                x={x + barWidth / 2}
                y={height - margin.bottom + 16}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isSelected ? '600' : '400'}
                fill={isSelected ? '#2563eb' : '#64748b'}
                transform={`rotate(-20, ${x + barWidth / 2}, ${height - margin.bottom + 16})`}
              >
                {cat.length > 9 ? cat.substring(0, 8) + '…' : cat}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="pointer-events-none absolute z-20 rounded-md bg-slate-900/95 px-2.5 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
          style={{
            top: 20,
            left: Math.min(width - 120, Math.max(margin.left, margin.left + hoveredIdx * step)),
          }}
        >
          <div className="font-semibold">{categories[hoveredIdx]}</div>
          <div className="text-slate-300">
            {yAxisColumn}: <span className="font-bold text-white">{values[hoveredIdx].toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400">Click to cross-filter</div>
        </div>
      )}
    </div>
  );
};
