import React, { useState, useMemo } from 'react';
import { Dataset, TransformationStep } from '../../types/data';
import { applyTransformations } from '../../engine/dataEngine';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Play,
  FileCode,
  ArrowRight,
  Database,
  CheckCircle,
  Filter,
  ArrowDownAZ,
  Calculator,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  datasets: Dataset[];
  onUpdateDataset: (updated: Dataset) => void;
  onClose: () => void;
}

export const DataPrepView: React.FC<Props> = ({ datasets, onUpdateDataset, onClose }) => {
  const [selectedDsId, setSelectedDsId] = useState<string>(datasets[0]?.id || '');
  const [steps, setSteps] = useState<TransformationStep[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM current_dataset WHERE Revenue > 25000');
  const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // New Step Form State
  const [newStepType, setNewStepType] = useState<TransformationStep['type']>('filter');
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [filterCond, setFilterCond] = useState<string>('>');
  const [filterVal, setFilterVal] = useState<string>('20000');
  const [calcColName, setCalcColName] = useState<string>('ProfitMarginPct');
  const [calcFormula, setCalcFormula] = useState<string>('ROUND(([Profit] / [Revenue]) * 100, 1)');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === selectedDsId) || datasets[0];
  }, [datasets, selectedDsId]);

  // Set default target column when dataset changes
  React.useEffect(() => {
    if (currentDataset?.columns.length) {
      setTargetColumn(currentDataset.columns[0].name);
    }
  }, [currentDataset]);

  // Compute transformed preview
  const transformedRows = useMemo(() => {
    if (!currentDataset) return [];
    return applyTransformations(currentDataset.data, steps);
  }, [currentDataset, steps]);

  const handleAddStep = () => {
    if (!currentDataset) return;
    let newStep: TransformationStep;

    if (newStepType === 'filter') {
      newStep = {
        id: `step_${Date.now()}`,
        type: 'filter',
        description: `Filter: ${targetColumn} ${filterCond} ${filterVal}`,
        params: {
          column: targetColumn,
          condition: filterCond as any,
          value: !isNaN(Number(filterVal)) ? Number(filterVal) : filterVal,
        },
      };
    } else if (newStepType === 'sort') {
      newStep = {
        id: `step_${Date.now()}`,
        type: 'sort',
        description: `Sort by: ${targetColumn} (${sortDir.toUpperCase()})`,
        params: {
          column: targetColumn,
          sortDirection: sortDir,
        },
      };
    } else if (newStepType === 'calculated_column') {
      newStep = {
        id: `step_${Date.now()}`,
        type: 'calculated_column',
        description: `Add Column [${calcColName}] = ${calcFormula}`,
        params: {
          newColumnName: calcColName,
          formula: calcFormula,
        },
      };
    } else if (newStepType === 'drop_duplicates') {
      newStep = {
        id: `step_${Date.now()}`,
        type: 'drop_duplicates',
        description: `Drop duplicates on column [${targetColumn}]`,
        params: { column: targetColumn },
      };
    } else {
      return;
    }

    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const handleApplyToDataset = () => {
    if (!currentDataset) return;
    const updated: Dataset = {
      ...currentDataset,
      data: transformedRows,
      rowCount: transformedRows.length,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDataset(updated);
    alert(`Applied transformation pipeline! Dataset now has ${transformedRows.length} rows.`);
  };

  const handleRunSql = () => {
    setQueryError(null);
    setQueryResult(null);
    if (!currentDataset) return;

    try {
      // Basic SQL evaluator for SELECT / WHERE / ORDER BY
      const clean = sqlQuery.trim();
      let res = [...currentDataset.data];

      // Parse WHERE clause if present
      const whereMatch = clean.match(/where\s+(.+?)(?:\s+order\s+by|\s+group\s+by|\s*$)/i);
      if (whereMatch) {
        const whereCond = whereMatch[1];
        const [col, op, ...valParts] = whereCond.split(/\s+/);
        const valStr = valParts.join(' ').replace(/['"]/g, '');
        const valNum = Number(valStr);

        res = res.filter((row) => {
          const cell = row[col];
          if (op === '>') return Number(cell) > valNum;
          if (op === '>=') return Number(cell) >= valNum;
          if (op === '<') return Number(cell) < valNum;
          if (op === '<=') return Number(cell) <= valNum;
          if (op === '=' || op === '==') return String(cell).toLowerCase() === valStr.toLowerCase();
          if (op === '!=') return String(cell).toLowerCase() !== valStr.toLowerCase();
          return true;
        });
      }

      setQueryResult(res);
    } catch (err: any) {
      setQueryError(err.message || 'SQL execution failed');
    }
  };

  const activeColumns = transformedRows.length > 0 ? Object.keys(transformedRows[0]) : [];

  return (
    <div className="flex h-full w-full flex-col bg-slate-100 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Data Preparation & Transformation Pipeline</h1>
            <p className="text-[11px] text-slate-500">Visual ETL, schema analysis, formula engine, and query execution</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dataset Selector */}
          <div className="flex items-center space-x-1 text-xs">
            <Database className="h-4 w-4 text-slate-400" />
            <select
              value={selectedDsId}
              onChange={(e) => {
                setSelectedDsId(e.target.value);
                setSteps([]);
              }}
              className="rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name} ({ds.rowCount} rows)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleApplyToDataset}
            disabled={steps.length === 0}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Apply Transformations</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        {/* Left: Transformation Pipeline Step Builder */}
        <div className="flex w-96 flex-col rounded-xl border border-slate-200 bg-white shadow-xs p-4 overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transformation Steps ({steps.length})
          </h2>

          {/* Active Steps List */}
          <div className="mt-2 space-y-2">
            {steps.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No transformation steps added yet. Add a step below to clean or enrich your data.
              </div>
            ) : (
              steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 p-2 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">{step.description}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveStep(step.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Remove step"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add New Step Form */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-xs">
            <span className="font-bold text-slate-800">Add Transformation</span>

            <div className="mt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Operation</label>
                <select
                  value={newStepType}
                  onChange={(e) => setNewStepType(e.target.value as any)}
                  className="mt-1 w-full rounded border border-slate-200 p-1.5 text-xs text-slate-800"
                >
                  <option value="filter">Filter Rows (Condition)</option>
                  <option value="sort">Sort Records</option>
                  <option value="calculated_column">Add Calculated Field (Formula)</option>
                  <option value="drop_duplicates">Drop Duplicate Records</option>
                </select>
              </div>

              {/* Filter form */}
              {newStepType === 'filter' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Column</label>
                    <select
                      value={targetColumn}
                      onChange={(e) => setTargetColumn(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                    >
                      {currentDataset?.columns.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500">Operator</label>
                      <select
                        value={filterCond}
                        onChange={(e) => setFilterCond(e.target.value)}
                        className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                      >
                        <option value=">">&gt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<">&lt;</option>
                        <option value="<=">&lt;=</option>
                        <option value="=">=</option>
                        <option value="!=">!=</option>
                        <option value="contains">contains</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] font-semibold text-slate-500">Threshold / Value</label>
                      <input
                        type="text"
                        value={filterVal}
                        onChange={(e) => setFilterVal(e.target.value)}
                        className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Calculated Field form */}
              {newStepType === 'calculated_column' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">New Column Name</label>
                    <input
                      type="text"
                      value={calcColName}
                      onChange={(e) => setCalcColName(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Formula Expression</label>
                    <input
                      type="text"
                      value={calcFormula}
                      onChange={(e) => setCalcFormula(e.target.value)}
                      placeholder="[Revenue] - [Profit]"
                      className="mt-1 w-full rounded border border-slate-200 p-1.5 font-mono text-slate-800"
                    />
                    <div className="mt-1 text-[10px] text-slate-400">
                      Use [Column] brackets with +, -, *, /, ROUND(), UPPER()
                    </div>
                  </div>
                </div>
              )}

              {/* Sort form */}
              {newStepType === 'sort' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Column</label>
                    <select
                      value={targetColumn}
                      onChange={(e) => setTargetColumn(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                    >
                      {currentDataset?.columns.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Direction</label>
                    <select
                      value={sortDir}
                      onChange={(e) => setSortDir(e.target.value as any)}
                      className="mt-1 w-full rounded border border-slate-200 p-1.5 text-slate-800"
                    >
                      <option value="desc">Descending (High to Low)</option>
                      <option value="asc">Ascending (Low to High)</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddStep}
                className="mt-2 flex w-full items-center justify-center space-x-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Step to Pipeline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Data Preview & SQL Console */}
        <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-xs p-4 overflow-hidden">
          {/* Tabs: Live Preview vs SQL Runner */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">
                Live Data Preview ({transformedRows.length} records)
              </span>
            </div>

            {/* Quick stats pills */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
              <span className="rounded bg-slate-100 px-2 py-0.5">
                {activeColumns.length} columns
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5">
                {steps.length} active filters/steps
              </span>
            </div>
          </div>

          {/* Table Preview */}
          <div className="flex-1 overflow-auto mt-3 rounded border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                <tr>
                  {activeColumns.map((col) => (
                    <th key={col} className="px-3 py-2 whitespace-nowrap bg-slate-50">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transformedRows.slice(0, 40).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {activeColumns.map((col) => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={col}
                          className={`px-3 py-1.5 whitespace-nowrap text-slate-700 ${
                            isNum ? 'font-mono text-right' : ''
                          }`}
                        >
                          {isNum ? val.toLocaleString() : String(val ?? '')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom: SQL Query Runner Console */}
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <FileCode className="h-4 w-4 text-blue-600" />
                <span>SQL Query Runner</span>
              </div>
              <button
                onClick={handleRunSql}
                className="flex items-center space-x-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-900"
              >
                <Play className="h-3 w-3" />
                <span>Execute SQL</span>
              </button>
            </div>
            <input
              type="text"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 bg-white p-2 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
            {queryResult && (
              <div className="mt-2 text-xs text-emerald-600 font-medium">
                ✓ Query executed successfully ({queryResult.length} rows matched)
              </div>
            )}
            {queryError && (
              <div className="mt-2 text-xs text-rose-600 font-medium">
                ✕ {queryError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
