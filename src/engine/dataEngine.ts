import { Dataset, ColumnMeta, TransformationStep } from '../types/data';
import { ChartConfig } from '../types/project';
import * as XLSX from 'xlsx';
import { detectColumnMeta } from '../data/sampleDatasets';

/**
 * Evaluates a basic arithmetic/string expression for calculated columns
 * E.g. "[Revenue] - [Profit]" or "[GrossRevenue] * 0.2" or "UPPER([Region])"
 */
export function evaluateFormula(formula: string, row: Record<string, any>): any {
  if (!formula) return null;
  try {
    let expr = formula;
    // Replace [ColumnName] with row['ColumnName']
    const colMatches = expr.match(/\[(.*?)\]/g);
    if (colMatches) {
      for (const colMatch of colMatches) {
        const colName = colMatch.replace(/^\[|\]$/g, '');
        const val = row[colName];
        const safeVal = typeof val === 'number' ? val : (typeof val === 'string' ? JSON.stringify(val) : 0);
        expr = expr.replace(colMatch, String(safeVal));
      }
    }

    // Support simple helper functions
    expr = expr.replace(/ROUND\(([^,]+),\s*(\d+)\)/gi, 'Math.round(($1) * Math.pow(10, $2)) / Math.pow(10, $2)');
    expr = expr.replace(/ABS\(([^)]+)\)/gi, 'Math.abs($1)');
    expr = expr.replace(/UPPER\(([^)]+)\)/gi, 'String($1).toUpperCase()');
    expr = expr.replace(/LOWER\(([^)]+)\)/gi, 'String($1).toLowerCase()');

    // Safe evaluation using Function
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${expr});`)();
    return typeof result === 'number' && !isNaN(result) ? Math.round(result * 100) / 100 : result;
  } catch (err) {
    return null;
  }
}

/**
 * Applies a transformation pipeline to dataset records
 */
export function applyTransformations(
  initialData: Record<string, any>[],
  steps: TransformationStep[]
): Record<string, any>[] {
  let result = [...initialData];

  for (const step of steps) {
    const { type, params } = step;

    if (type === 'filter' && params.column && params.condition) {
      result = result.filter((row) => {
        const val = row[params.column!];
        const target = params.value;
        switch (params.condition) {
          case '=':
            return String(val).toLowerCase() === String(target).toLowerCase();
          case '!=':
            return String(val).toLowerCase() !== String(target).toLowerCase();
          case '>':
            return Number(val) > Number(target);
          case '>=':
            return Number(val) >= Number(target);
          case '<':
            return Number(val) < Number(target);
          case '<=':
            return Number(val) <= Number(target);
          case 'contains':
            return String(val).toLowerCase().includes(String(target).toLowerCase());
          case 'not_contains':
            return !String(val).toLowerCase().includes(String(target).toLowerCase());
          case 'is_null':
            return val === null || val === undefined || val === '';
          case 'not_null':
            return val !== null && val !== undefined && val !== '';
          default:
            return true;
        }
      });
    } else if (type === 'sort' && params.column) {
      const dir = params.sortDirection === 'desc' ? -1 : 1;
      result = [...result].sort((a, b) => {
        const valA = a[params.column!];
        const valB = b[params.column!];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }
        return String(valA || '').localeCompare(String(valB || '')) * dir;
      });
    } else if (type === 'rename' && params.column && params.newColumnName) {
      result = result.map((row) => {
        const newRow = { ...row };
        newRow[params.newColumnName!] = newRow[params.column!];
        delete newRow[params.column!];
        return newRow;
      });
    } else if (type === 'calculated_column' && params.newColumnName && params.formula) {
      result = result.map((row) => {
        return {
          ...row,
          [params.newColumnName!]: evaluateFormula(params.formula!, row),
        };
      });
    } else if (type === 'replace_null' && params.column) {
      result = result.map((row) => {
        if (row[params.column!] === null || row[params.column!] === undefined || row[params.column!] === '') {
          return { ...row, [params.column!]: params.replaceValue };
        }
        return row;
      });
    } else if (type === 'drop_duplicates' && params.column) {
      const seen = new Set();
      result = result.filter((row) => {
        const key = row[params.column!];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (type === 'aggregate' && params.groupBy && params.aggregations) {
      const groups: Record<string, Record<string, any>[]> = {};
      for (const row of result) {
        const groupKey = params.groupBy.map((col) => String(row[col] ?? '')).join(' | ');
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(row);
      }

      result = Object.entries(groups).map(([_, groupRows]) => {
        const aggRow: Record<string, any> = {};
        for (const col of params.groupBy!) {
          aggRow[col] = groupRows[0][col];
        }
        for (const agg of params.aggregations!) {
          const vals = groupRows.map((r) => Number(r[agg.column])).filter((n) => !isNaN(n));
          if (agg.agg === 'SUM') {
            aggRow[agg.alias] = vals.reduce((sum, v) => sum + v, 0);
          } else if (agg.agg === 'AVG') {
            aggRow[agg.alias] = vals.length > 0 ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) / 100 : 0;
          } else if (agg.agg === 'MIN') {
            aggRow[agg.alias] = vals.length > 0 ? Math.min(...vals) : 0;
          } else if (agg.agg === 'MAX') {
            aggRow[agg.alias] = vals.length > 0 ? Math.max(...vals) : 0;
          } else if (agg.agg === 'COUNT') {
            aggRow[agg.alias] = groupRows.length;
          }
        }
        return aggRow;
      });
    }
  }

  return result;
}

/**
 * Prepares chart data: applies active filters + cross-filters + groups/aggregates
 */
export function aggregateChartData(
  rawData: Record<string, any>[],
  config: ChartConfig,
  activeFilters: Record<string, any> = {},
  crossFilter: { column?: string; value?: any } | null = null
): Record<string, any>[] {
  if (!rawData || rawData.length === 0) return [];

  let data = [...rawData];

  // 1. Apply global / canvas filters
  for (const [col, val] of Object.entries(activeFilters)) {
    if (val !== undefined && val !== null && val !== 'ALL' && val !== '') {
      data = data.filter((row) => {
        if (Array.isArray(val)) {
          return val.length === 0 || val.includes(row[col]);
        }
        return String(row[col]).toLowerCase() === String(val).toLowerCase();
      });
    }
  }

  // 2. Apply cross-filtering if set and not self-filtering
  if (crossFilter && crossFilter.column && crossFilter.value !== undefined) {
    if (crossFilter.column !== config.xAxisColumn) {
      data = data.filter((row) => String(row[crossFilter.column!]) === String(crossFilter.value));
    }
  }

  const { xAxisColumn, yAxisColumn, secondaryYAxisColumn, groupByColumn, aggregation } = config;

  if (!xAxisColumn) return data;

  // If no aggregation needed, return sorted/limited
  if (aggregation === 'NONE' || !yAxisColumn) {
    return data.slice(0, config.limit || 50);
  }

  // 3. Group by X-Axis (and optional secondary group)
  const grouped: Record<string, { x: any; yVals: number[]; secVals: number[]; groupKey?: any }> = {};

  for (const row of data) {
    const xVal = row[xAxisColumn] ?? 'Unknown';
    const yVal = Number(row[yAxisColumn]);
    const secVal = secondaryYAxisColumn ? Number(row[secondaryYAxisColumn]) : 0;
    const group = groupByColumn ? row[groupByColumn] : undefined;
    const key = group !== undefined ? `${xVal}___${group}` : String(xVal);

    if (!grouped[key]) {
      grouped[key] = { x: xVal, yVals: [], secVals: [], groupKey: group };
    }
    if (!isNaN(yVal)) grouped[key].yVals.push(yVal);
    if (!isNaN(secVal)) grouped[key].secVals.push(secVal);
  }

  const calculateAgg = (vals: number[], agg: string) => {
    if (vals.length === 0) return 0;
    switch (agg) {
      case 'SUM':
        return Math.round(vals.reduce((s, v) => s + v, 0) * 100) / 100;
      case 'AVG':
        return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) / 100;
      case 'MIN':
        return Math.min(...vals);
      case 'MAX':
        return Math.max(...vals);
      case 'COUNT':
        return vals.length;
      default:
        return vals[0];
    }
  };

  let aggregated = Object.values(grouped).map((item) => {
    const res: Record<string, any> = {
      [xAxisColumn]: item.x,
      [yAxisColumn]: calculateAgg(item.yVals, aggregation),
    };
    if (secondaryYAxisColumn && config.secondaryAggregation) {
      res[secondaryYAxisColumn] = calculateAgg(item.secVals, config.secondaryAggregation);
    }
    if (item.groupKey !== undefined && groupByColumn) {
      res[groupByColumn] = item.groupKey;
    }
    return res;
  });

  // 4. Sort
  if (config.sortBy) {
    const sortCol = config.sortBy === 'xAxis' ? xAxisColumn : yAxisColumn;
    const dir = config.sortDirection === 'asc' ? 1 : -1;
    aggregated.sort((a, b) => {
      const vA = a[sortCol];
      const vB = b[sortCol];
      if (typeof vA === 'number' && typeof vB === 'number') return (vA - vB) * dir;
      return String(vA).localeCompare(String(vB)) * dir;
    });
  }

  // 5. Limit
  if (config.limit && config.limit > 0) {
    aggregated = aggregated.slice(0, config.limit);
  }

  return aggregated;
}

/**
 * File Parsers
 */
export async function parseCsvFile(content: string, fileName: string): Promise<Dataset> {
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) throw new Error('File is empty');

  // Detect delimiter (, or ; or \t)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

  // Parse headers
  const headers = firstLine.split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim());

  const data: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const rowValues = lines[i].split(delimiter).map((v) => v.replace(/^["']|["']$/g, '').trim());
    const row: Record<string, any> = {};
    headers.forEach((h, idx) => {
      const val = rowValues[idx] ?? '';
      row[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
    });
    data.push(row);
  }

  const columns = detectColumnMeta(data);
  return {
    id: `ds_${Date.now()}`,
    name: fileName.replace(/\.[^/.]+$/, ''),
    sourceType: 'file',
    sourceName: fileName,
    columns,
    data,
    rowCount: data.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function parseExcelFile(arrayBuffer: ArrayBuffer, fileName: string): Promise<Dataset> {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as Record<string, any>[];

  if (!rawJson || rawJson.length === 0) throw new Error('Excel sheet contains no data');

  const columns = detectColumnMeta(rawJson);
  return {
    id: `ds_${Date.now()}`,
    name: `${fileName.replace(/\.[^/.]+$/, '')} (${firstSheetName})`,
    sourceType: 'file',
    sourceName: fileName,
    columns,
    data: rawJson,
    rowCount: rawJson.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function parseJsonData(content: string, fileName: string): Dataset {
  const parsed = JSON.parse(content);
  const data = Array.isArray(parsed) ? parsed : [parsed];
  if (data.length === 0) throw new Error('JSON contains no array records');

  const columns = detectColumnMeta(data);
  return {
    id: `ds_${Date.now()}`,
    name: fileName.replace(/\.[^/.]+$/, ''),
    sourceType: 'file',
    sourceName: fileName,
    columns,
    data,
    rowCount: data.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
