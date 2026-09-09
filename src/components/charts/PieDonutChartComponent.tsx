import React, { useState } from 'react';
import { ChartConfig } from '../../types/project';

interface Props {
  data: Record<string, any>[];
  config: ChartConfig;
  onSelectPoint?: (dimension: string, value: any) => void;
  selectedPoint?: { column?: string; value?: any } | null;
  themeColors?: string[];
}

export const PieDonutChartComponent: React.FC<Props> = ({
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

  const { xAxisColumn, yAxisColumn, chartType, showLegend, colorPalette, donutHoleSize } = config;
  const isDonut = chartType === 'donut';
  const palette = colorPalette && colorPalette.length > 0 ? colorPalette : (themeColors || ['#2563eb', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']);

  const categories = data.map((d) => String(d[xAxisColumn] ?? ''));
  const values = data.map((d) => Math.max(0, Number(d[yAxisColumn] || 0)));
  const total = values.reduce((sum, v) => sum + v, 0) || 1;

  const size = 260;
  const center = size / 2;
  const outerRadius = 95;
  const innerRadius = isDonut ? (donutHoleSize ? (donutHoleSize / 100) * outerRadius : 55) : 0;

  // Calculate arc angles
  let currentAngle = -Math.PI / 2; // Start from top
  const slices = data.map((_, i) => {
    const angleSpan = (values[i] / total) * (2 * Math.PI);
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle = endAngle;

    const startX = center + outerRadius * Math.cos(startAngle);
    const startY = center + outerRadius * Math.sin(startAngle);
    const endX = center + outerRadius * Math.cos(endAngle);
    const endY = center + outerRadius * Math.sin(endAngle);

    const innerStartX = center + innerRadius * Math.cos(endAngle);
    const innerStartY = center + innerRadius * Math.sin(endAngle);
    const innerEndX = center + innerRadius * Math.cos(startAngle);
    const innerEndY = center + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angleSpan > Math.PI ? 1 : 0;

    let path = '';
    if (innerRadius > 0) {
      path = `M ${startX} ${startY} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY} L ${innerStartX} ${innerStartY} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY} Z`;
    } else {
      path = `M ${center} ${center} L ${startX} ${startY} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    }

    const midAngle = startAngle + angleSpan / 2;
    const pct = Math.round((values[i] / total) * 100);

    return {
      path,
      color: palette[i % palette.length],
      category: categories[i],
      value: values[i],
      pct,
      midAngle,
    };
  });

  return (
    <div className="flex h-full w-full items-center justify-between overflow-hidden select-none">
      {/* SVG Pie Chart */}
      <div className="relative flex h-full flex-1 items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full max-h-[260px] w-auto overflow-visible">
          {slices.map((slice, i) => {
            const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === slice.category;
            const isHovered = hoveredIdx === i;
            // Pop out hovered/selected slice slightly
            const popDistance = isSelected || isHovered ? 6 : 0;
            const popX = popDistance * Math.cos(slice.midAngle);
            const popY = popDistance * Math.sin(slice.midAngle);

            return (
              <g
                key={i}
                transform={`translate(${popX}, ${popY})`}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, slice.category)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <path
                  d={slice.path}
                  fill={slice.color}
                  opacity={isSelected ? 1 : selectedPoint ? 0.35 : isHovered ? 0.95 : 0.88}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* Donut Center Total Label */}
          {isDonut && (
            <g>
              <text x={center} y={center - 4} textAnchor="middle" fontSize="12" fontWeight="500" fill="#64748b">
                Total
              </text>
              <text x={center} y={center + 16} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">
                {total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total.toLocaleString()}
              </text>
            </g>
          )}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div className="pointer-events-none absolute bottom-2 z-20 rounded-md bg-slate-900/95 px-2.5 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm">
            <div className="font-semibold">{slices[hoveredIdx].category}</div>
            <div className="text-slate-300">
              {slices[hoveredIdx].value.toLocaleString()} ({slices[hoveredIdx].pct}%)
            </div>
            <div className="text-[10px] text-slate-400">Click to filter</div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex max-h-[220px] w-48 flex-col justify-center space-y-1.5 overflow-y-auto px-2 text-xs">
          {slices.map((slice, i) => {
            const isSelected = selectedPoint?.column === xAxisColumn && selectedPoint?.value === slice.category;
            return (
              <div
                key={i}
                className={`flex cursor-pointer items-center justify-between rounded px-1.5 py-1 transition-colors hover:bg-slate-100 ${
                  isSelected ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600'
                }`}
                onClick={() => onSelectPoint && onSelectPoint(xAxisColumn, slice.category)}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="truncate">{slice.category}</span>
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-400">{slice.pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
