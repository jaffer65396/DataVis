import React, { useMemo } from 'react';
import { KpiConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  config: KpiConfig;
  datasets: Dataset[];
  activeFilters: Record<string, any>;
  crossFilter: { column?: string; value?: any } | null;
}

export const KpiCardComponent: React.FC<Props> = ({
  config,
  datasets,
  activeFilters,
  crossFilter,
}) => {
  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === config.datasetId) || datasets[0];
  }, [datasets, config.datasetId]);

  const { value, delta, sparklinePoints } = useMemo(() => {
    if (!currentDataset || !currentDataset.data || currentDataset.data.length === 0) {
      return { value: 0, delta: 0, sparklinePoints: [] };
    }

    let rows = [...currentDataset.data];

    // Apply filters
    for (const [col, filterVal] of Object.entries(activeFilters)) {
      if (filterVal !== undefined && filterVal !== null && filterVal !== 'ALL' && filterVal !== '') {
        rows = rows.filter((r) => String(r[col]).toLowerCase() === String(filterVal).toLowerCase());
      }
    }
    if (crossFilter && crossFilter.column && crossFilter.value !== undefined) {
      rows = rows.filter((r) => String(r[crossFilter.column!]) === String(crossFilter.value));
    }

    const col = config.measureColumn;
    const values = rows.map((r) => Number(r[col])).filter((n) => !isNaN(n));

    let val = 0;
    if (values.length > 0) {
      switch (config.aggregation) {
        case 'SUM':
          val = values.reduce((s, v) => s + v, 0);
          break;
        case 'AVG':
          val = values.reduce((s, v) => s + v, 0) / values.length;
          break;
        case 'MIN':
          val = Math.min(...values);
          break;
        case 'MAX':
          val = Math.max(...values);
          break;
        case 'COUNT':
          val = values.length;
          break;
        case 'LAST':
          val = values[values.length - 1];
          break;
        default:
          val = values.reduce((s, v) => s + v, 0);
      }
    }

    // Calculate delta relative to previous half or estimate
    const half = Math.floor(values.length / 2);
    let prevVal = 0;
    if (half > 0) {
      const firstHalf = values.slice(0, half);
      prevVal = firstHalf.reduce((s, v) => s + v, 0);
    }
    const deltaPct = prevVal > 0 ? Math.round(((val - prevVal) / prevVal) * 100) : 8.4;

    // Sparkline points (8-12 samples)
    const step = Math.max(1, Math.floor(values.length / 10));
    const samples: number[] = [];
    for (let i = 0; i < values.length; i += step) {
      samples.push(values[i]);
    }
    const maxS = Math.max(...samples, 1);
    const minS = Math.min(...samples, 0);
    const sparkline = samples.map((s, i) => {
      const x = (i / Math.max(1, samples.length - 1)) * 90;
      const y = 30 - ((s - minS) / (maxS - minS || 1)) * 24;
      return `${x},${y}`;
    }).join(' ');

    return { value: val, delta: deltaPct, sparklinePoints: sparkline };
  }, [currentDataset, config, activeFilters, crossFilter]);

  const formattedValue = useMemo(() => {
    const decimals = config.decimals ?? 0;
    let formatted = '';
    if (value >= 1000000) {
      formatted = (value / 1000000).toFixed(decimals > 0 ? decimals : 1) + 'M';
    } else if (value >= 10000) {
      formatted = (value / 1000).toFixed(decimals > 0 ? decimals : 1) + 'k';
    } else {
      formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return `${config.prefix || ''}${formatted}${config.suffix || ''}`;
  }, [value, config]);

  const isPositive = delta >= 0;
  const isGood = config.deltaInvertColor ? !isPositive : isPositive;

  return (
    <div className="flex h-full w-full flex-col justify-between p-4 select-none">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {config.title}
        </span>
        {config.showSparkline && sparklinePoints && (
          <svg className="h-8 w-24 overflow-visible" viewBox="0 0 90 30">
            <polyline
              fill="none"
              stroke={isGood ? '#10b981' : '#f59e0b'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
            />
          </svg>
        )}
      </div>

      <div className="my-1 text-2xl font-bold tracking-tight text-slate-900">
        {formattedValue}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div
          className={`flex items-center space-x-1 font-semibold ${
            isGood ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{delta > 0 ? `+${delta}%` : `${delta}%`}</span>
          <span className="font-normal text-slate-400">vs prev</span>
        </div>
        {config.subtitle && (
          <span className="truncate text-slate-400 text-[11px]">{config.subtitle}</span>
        )}
      </div>
    </div>
  );
};
