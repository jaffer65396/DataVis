import React, { useMemo } from 'react';
import { FilterConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { Filter } from 'lucide-react';

interface Props {
  config: FilterConfig;
  datasets: Dataset[];
  activeFilters: Record<string, any>;
  onFilterChange: (column: string, value: any) => void;
}

export const FilterControlComponent: React.FC<Props> = ({
  config,
  datasets,
  activeFilters,
  onFilterChange,
}) => {
  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === config.datasetId) || datasets[0];
  }, [datasets, config.datasetId]);

  // Unique options for dropdown
  const options = useMemo(() => {
    if (!currentDataset || !config.targetColumn) return [];
    const values = currentDataset.data.map((r) => r[config.targetColumn]).filter((v) => v !== null && v !== undefined && v !== '');
    return Array.from(new Set(values));
  }, [currentDataset, config.targetColumn]);

  const currentValue = activeFilters[config.targetColumn] ?? config.currentValue ?? 'ALL';

  return (
    <div className="flex h-full w-full items-center justify-between space-x-2 px-3 py-1 select-none">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
        <Filter className="h-3.5 w-3.5 text-blue-600" />
        <span>{config.label || config.targetColumn}</span>
      </div>

      <select
        value={currentValue}
        onChange={(e) => onFilterChange(config.targetColumn, e.target.value)}
        className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="ALL">All {config.targetColumn}s</option>
        {options.map((opt, i) => (
          <option key={i} value={String(opt)}>
            {String(opt)}
          </option>
        ))}
      </select>
    </div>
  );
};
