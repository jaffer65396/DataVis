import React, { useState } from 'react';
import { ChartConfig } from '../../types/project';

interface Props {
  data: Record<string, any>[];
  config: ChartConfig;
  onSelectPoint?: (dimension: string, value: any) => void;
  selectedPoint?: { column?: string; value?: any } | null;
  themeColors?: string[];
}

export const LineAreaChartComponent: React.FC<Props> = ({
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
  const isArea = chartType === 'line_area' || chartType === 'line_stacked_area';
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#2563eb', '#38bdf8', '#10b981']);
  const primaryColor = palette[0];

  const categories = data.map((d) => String(d[xAxisColumn] ?? ''));
  const values = data.map((d) => Number(d[yAxisColumn] || 0));
  const maxVal = Math.max(...values, 0) || 1;
  const minVal = Math.min(...values, 0);

  const width = 500;
  const height = 260;
  const margin = { top: 20, right: 25, bottom: 45, left: 55 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const points = data.map((_, i) => {
    const x = margin.left + (i / Math.max(1, data.length - 1)) * plotWidth;
    const normalizedY = (values[i] - minVal) / (maxVal - minVal || 1);
    const y = height - margin.bottom - normalizedY * plotHeight;
    return { x, y, val: values[i], cat: categories[i] };
  });

  // SVG Line path
  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  // SVG Area path
  const areaPath = isArea && points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${height - margin.bottom} L ${points[0].x},${height - margin.bottom} Z`
    : '';

  const gradId = `line-area-grad-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <div className="relative h-full w-full select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid lines */}
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = height - margin.bottom - pct * plotHeight;
          const val = minVal + pct * (maxVal - minVal);
          return (
            <g key={i}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                {Math.round(val).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {isArea && <path d={areaPath} fill={`url(#${gradId})`} />}

        {/* Line stroke */}
        <path
          d={linePath}
          fill="none"
          stroke={primaryColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, i) => {
          const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === pt.cat;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, pt.cat)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Invisible touch/click hit area */}
              <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />

              {/* Visual point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected || isHovered ? 6 : 4}
                fill={isSelected ? '#ffffff' : primaryColor}
                stroke={isSelected ? '#1e40af' : '#ffffff'}
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all duration-150"
              />

              {/* Value labels */}
              {showLabels && (
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="500"
                  fill="#475569"
                >
                  {pt.val >= 1000 ? (pt.val / 1000).toFixed(1) + 'k' : pt.val.toLocaleString()}
                </text>
              )}

              {/* X Category labels (spaced out if many points) */}
              {(points.length <= 12 || i % Math.ceil(points.length / 8) === 0) && (
                <text
                  x={pt.x}
                  y={height - margin.bottom + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isSelected ? '600' : '400'}
                  fill={isSelected ? '#2563eb' : '#64748b'}
                >
                  {pt.cat.length > 8 ? pt.cat.substring(0, 7) + '…' : pt.cat}
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
            top: Math.max(10, points[hoveredIdx].y - 45),
            left: Math.min(width - 120, Math.max(margin.left, points[hoveredIdx].x - 40)),
          }}
        >
          <div className="font-semibold">{points[hoveredIdx].cat}</div>
          <div className="text-slate-300">
            {yAxisColumn}: <span className="font-bold text-white">{points[hoveredIdx].val.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400">Click to cross-filter</div>
        </div>
      )}
    </div>
  );
};
