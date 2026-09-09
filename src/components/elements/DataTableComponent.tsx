import React, { useState, useMemo } from 'react';
import { TableConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  config: TableConfig;
  datasets: Dataset[];
  activeFilters: Record<string, any>;
  crossFilter: { column?: string; value?: any } | null;
}

export const DataTableComponent: React.FC<Props> = ({
  config,
  datasets,
  activeFilters,
  crossFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === config.datasetId) || datasets[0];
  }, [datasets, config.datasetId]);

  const rawRows = currentDataset?.data || [];
  const columns = config.columns.length > 0 ? config.columns : (currentDataset ? currentDataset.columns.map((c) => c.name).slice(0, 6) : []);

  // Filter and Sort
  const processedRows = useMemo(() => {
    let rows = [...rawRows];

    // Apply global filters
    for (const [col, val] of Object.entries(activeFilters)) {
      if (val !== undefined && val !== null && val !== 'ALL' && val !== '') {
        rows = rows.filter((r) => String(r[col]).toLowerCase() === String(val).toLowerCase());
      }
    }

    // Apply cross-filtering
    if (crossFilter && crossFilter.column && crossFilter.value !== undefined) {
      rows = rows.filter((r) => String(r[crossFilter.column!]) === String(crossFilter.value));
    }

    // Apply search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter((r) => {
        return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
      });
    }

    // Sort
    if (sortColumn) {
      rows.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        const dir = sortDirection === 'asc' ? 1 : -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA || '').localeCompare(String(valB || '')) * dir;
      });
    }

    return rows;
  }, [rawRows, activeFilters, crossFilter, searchTerm, sortColumn, sortDirection]);

  // Color scale min/max
  const colorScaleStats = useMemo(() => {
    if (!config.colorScaleColumn) return null;
    const nums = processedRows.map((r) => Number(r[config.colorScaleColumn!])).filter((n) => !isNaN(n));
    if (nums.length === 0) return null;
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }, [processedRows, config.colorScaleColumn]);

  // Pagination
  const pageSize = config.pageSize || 5;
  const totalPages = Math.max(1, Math.ceil(processedRows.length / pageSize));
  const pagedRows = processedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Column Totals
  const totals = useMemo(() => {
    if (!config.showTotals) return null;
    const res: Record<string, number | null> = {};
    for (const col of columns) {
      const nums = processedRows.map((r) => Number(r[col])).filter((n) => !isNaN(n));
      if (nums.length === processedRows.length && nums.length > 0) {
        res[col] = Math.round(nums.reduce((s, v) => s + v, 0) * 100) / 100;
      } else {
        res[col] = null;
      }
    }
    return res;
  }, [processedRows, columns, config.showTotals]);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'desc') setSortDirection('asc');
      else setSortColumn(null);
    } else {
      setSortColumn(col);
      setSortDirection('desc');
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-3 select-none text-xs">
      {/* Top Search bar */}
      {config.enableSearch && (
        <div className="mb-2 flex items-center justify-between">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-md border border-slate-200 bg-white py-1 pl-8 pr-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-slate-400">
            {processedRows.length} {processedRows.length === 1 ? 'row' : 'rows'}
          </span>
        </div>
      )}

      {/* Table Data Container */}
      <div className="flex-1 overflow-auto rounded border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => config.enableSort && handleSort(col)}
                  className={`px-3 py-2 ${config.enableSort ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                >
                  <div className="flex items-center justify-between space-x-1">
                    <span className="truncate">{config.columnAliases?.[col] || col}</span>
                    {sortColumn === col && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-blue-600" /> : <ChevronDown className="h-3.5 w-3.5 text-blue-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => {
                  const val = row[col];
                  const isNum = typeof val === 'number';
                  let cellStyle: React.CSSProperties = {};

                  if (isNum && config.colorScaleColumn === col && colorScaleStats) {
                    const ratio = Math.max(0, Math.min(1, (val - colorScaleStats.min) / (colorScaleStats.max - colorScaleStats.min || 1)));
                    cellStyle = {
                      backgroundColor: `rgba(16, 185, 129, ${0.1 + ratio * 0.35})`,
                      fontWeight: 600,
                    };
                  }

                  return (
                    <td
                      key={col}
                      style={cellStyle}
                      className={`px-3 py-2 truncate text-slate-700 ${isNum ? 'font-mono text-right' : ''}`}
                    >
                      {isNum ? val.toLocaleString() : String(val ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Totals Row */}
          {totals && (
            <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-semibold text-slate-900">
              <tr>
                {columns.map((col, idx) => (
                  <td key={col} className={`px-3 py-2 ${typeof totals[col] === 'number' ? 'font-mono text-right' : ''}`}>
                    {idx === 0 && totals[col] === null ? 'Total' : totals[col] !== null ? totals[col]?.toLocaleString() : ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-2 flex items-center justify-between pt-1 text-[11px] text-slate-500">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded border border-slate-200 p-1 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="rounded border border-slate-200 p-1 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
