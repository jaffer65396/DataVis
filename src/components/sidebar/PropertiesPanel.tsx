import React from 'react';
import { DashboardElement, ThemeConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { BUILTIN_THEMES } from '../../data/starterTemplates';
import { Settings, Sliders, Palette, Layout, Type } from 'lucide-react';

interface Props {
  selectedElement: DashboardElement | null;
  datasets: Dataset[];
  theme: ThemeConfig;
  canvasWidth: number;
  canvasHeight: number;
  onUpdateElement: (updated: DashboardElement) => void;
  onChangeTheme: (themeId: string) => void;
  onUpdateCanvasSize: (width: number, height: number) => void;
}

export const PropertiesPanel: React.FC<Props> = ({
  selectedElement,
  datasets,
  theme,
  canvasWidth,
  canvasHeight,
  onUpdateElement,
  onChangeTheme,
  onUpdateCanvasSize,
}) => {
  if (!selectedElement) {
    // Canvas & Theme Properties
    return (
      <div className="flex h-full w-72 flex-col border-l border-slate-200 bg-white p-4 select-none text-xs">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Layout className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-slate-800">Dashboard Canvas Settings</span>
        </div>

        <div className="mt-4 space-y-4">
          {/* Canvas Size */}
          <div>
            <label className="font-semibold text-slate-600">Canvas Dimensions</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400">Width (px)</span>
                <input
                  type="number"
                  value={canvasWidth}
                  onChange={(e) => onUpdateCanvasSize(Number(e.target.value), canvasHeight)}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Height (px)</span>
                <input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => onUpdateCanvasSize(canvasWidth, Number(e.target.value))}
                  className="w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <Palette className="h-3.5 w-3.5 text-blue-600" />
              <label className="font-semibold text-slate-600">Visual Theme</label>
            </div>
            <div className="space-y-2">
              {BUILTIN_THEMES.map((t) => {
                const isActive = t.id === theme.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onChangeTheme(t.id)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2 text-left transition-all ${
                      isActive ? 'border-blue-500 bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-xs">{t.name}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {t.chartPalette.slice(0, 5).map((c, i) => (
                          <span key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    {isActive && <span className="text-[11px] font-bold text-blue-600">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-slate-500 text-[11px] leading-relaxed border border-slate-200">
            💡 Select any chart, KPI card, or element on the canvas to configure its dimensions, metrics, and styling.
          </div>
        </div>
      </div>
    );
  }

  const currentDataset = datasets.find((d) => {
    if (selectedElement.chartConfig) return d.id === selectedElement.chartConfig.datasetId;
    if (selectedElement.kpiConfig) return d.id === selectedElement.kpiConfig.datasetId;
    if (selectedElement.tableConfig) return d.id === selectedElement.tableConfig.datasetId;
    return false;
  }) || datasets[0];

  const columns = currentDataset?.columns || [];

  return (
    <div className="flex h-full w-72 flex-col border-l border-slate-200 bg-white p-4 select-none text-xs overflow-y-auto">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <Sliders className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-slate-800 truncate">
          {selectedElement.title}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Title Editor */}
        <div>
          <label className="font-semibold text-slate-600">Element Title</label>
          <input
            type="text"
            value={selectedElement.title}
            onChange={(e) => onUpdateElement({ ...selectedElement, title: e.target.value })}
            className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Dataset Binding (for Charts, KPIs, Tables) */}
        {(selectedElement.type === 'chart' || selectedElement.type === 'kpi' || selectedElement.type === 'table') && (
          <div>
            <label className="font-semibold text-slate-600">Data Source</label>
            <select
              value={currentDataset?.id}
              onChange={(e) => {
                const dsId = e.target.value;
                if (selectedElement.chartConfig) {
                  onUpdateElement({
                    ...selectedElement,
                    chartConfig: { ...selectedElement.chartConfig, datasetId: dsId },
                  });
                } else if (selectedElement.kpiConfig) {
                  onUpdateElement({
                    ...selectedElement,
                    kpiConfig: { ...selectedElement.kpiConfig, datasetId: dsId },
                  });
                } else if (selectedElement.tableConfig) {
                  onUpdateElement({
                    ...selectedElement,
                    tableConfig: { ...selectedElement.tableConfig, datasetId: dsId },
                  });
                }
              }}
              className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CHART CONFIGURATION */}
        {selectedElement.type === 'chart' && selectedElement.chartConfig && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Chart Type */}
            <div>
              <label className="font-semibold text-slate-600">Chart Type</label>
              <select
                value={selectedElement.chartConfig.chartType}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    chartConfig: { ...selectedElement.chartConfig!, chartType: e.target.value as any },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              >
                <option value="bar_vertical">Vertical Bar</option>
                <option value="bar_horizontal">Horizontal Bar</option>
                <option value="line_area">Line / Area</option>
                <option value="donut">Donut</option>
                <option value="pie">Pie</option>
                <option value="treemap">Treemap</option>
                <option value="radar">Radar</option>
                <option value="candlestick">Candlestick</option>
                <option value="scatter">Scatter Plot</option>
              </select>
            </div>

            {/* X-Axis / Category Column */}
            <div>
              <label className="font-semibold text-slate-600">Dimension (X-Axis)</label>
              <select
                value={selectedElement.chartConfig.xAxisColumn}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    chartConfig: { ...selectedElement.chartConfig!, xAxisColumn: e.target.value },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              >
                {columns.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Y-Axis / Measure Column */}
            <div>
              <label className="font-semibold text-slate-600">Measure (Y-Axis)</label>
              <select
                value={selectedElement.chartConfig.yAxisColumn}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    chartConfig: { ...selectedElement.chartConfig!, yAxisColumn: e.target.value },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              >
                {columns.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Aggregation */}
            <div>
              <label className="font-semibold text-slate-600">Aggregation</label>
              <select
                value={selectedElement.chartConfig.aggregation}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    chartConfig: { ...selectedElement.chartConfig!, aggregation: e.target.value as any },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              >
                <option value="SUM">SUM</option>
                <option value="AVG">AVG</option>
                <option value="COUNT">COUNT</option>
                <option value="MIN">MIN</option>
                <option value="MAX">MAX</option>
                <option value="NONE">NONE (Raw records)</option>
              </select>
            </div>

            {/* Display Toggles */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.chartConfig.showLabels}
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      chartConfig: { ...selectedElement.chartConfig!, showLabels: e.target.checked },
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span>Show Data Labels</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.chartConfig.showGrid}
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      chartConfig: { ...selectedElement.chartConfig!, showGrid: e.target.checked },
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span>Show Grid Lines</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.chartConfig.showLegend}
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      chartConfig: { ...selectedElement.chartConfig!, showLegend: e.target.checked },
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span>Show Legend</span>
              </label>
            </div>
          </div>
        )}

        {/* KPI CONFIGURATION */}
        {selectedElement.type === 'kpi' && selectedElement.kpiConfig && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-600">Metric Column</label>
              <select
                value={selectedElement.kpiConfig.measureColumn}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    kpiConfig: { ...selectedElement.kpiConfig!, measureColumn: e.target.value },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              >
                {columns.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600">Prefix</label>
                <input
                  type="text"
                  value={selectedElement.kpiConfig.prefix || ''}
                  placeholder="$"
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      kpiConfig: { ...selectedElement.kpiConfig!, prefix: e.target.value },
                    });
                  }}
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Suffix</label>
                <input
                  type="text"
                  value={selectedElement.kpiConfig.suffix || ''}
                  placeholder="%"
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      kpiConfig: { ...selectedElement.kpiConfig!, suffix: e.target.value },
                    });
                  }}
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
                />
              </div>
            </div>

            <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={selectedElement.kpiConfig.showSparkline}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    kpiConfig: { ...selectedElement.kpiConfig!, showSparkline: e.target.checked },
                  });
                }}
                className="rounded text-blue-600"
              />
              <span>Display Sparkline Trend</span>
            </label>
          </div>
        )}

        {/* TABLE CONFIGURATION */}
        {selectedElement.type === 'table' && selectedElement.tableConfig && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-600">Rows Per Page</label>
              <input
                type="number"
                value={selectedElement.tableConfig.pageSize}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    tableConfig: { ...selectedElement.tableConfig!, pageSize: Number(e.target.value) },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.tableConfig.enableSearch}
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      tableConfig: { ...selectedElement.tableConfig!, enableSearch: e.target.checked },
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span>Enable Search Bar</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedElement.tableConfig.showTotals}
                  onChange={(e) => {
                    onUpdateElement({
                      ...selectedElement,
                      tableConfig: { ...selectedElement.tableConfig!, showTotals: e.target.checked },
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span>Show Totals Row</span>
              </label>
            </div>
          </div>
        )}

        {/* TEXT CONFIGURATION */}
        {selectedElement.type === 'text' && selectedElement.textConfig && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-600">Text Content</label>
              <textarea
                rows={3}
                value={selectedElement.textConfig.content}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    textConfig: { ...selectedElement.textConfig!, content: e.target.value },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 p-2 text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600">Font Size (px)</label>
              <input
                type="number"
                value={selectedElement.textConfig.fontSize}
                onChange={(e) => {
                  onUpdateElement({
                    ...selectedElement,
                    textConfig: { ...selectedElement.textConfig!, fontSize: Number(e.target.value) },
                  });
                }}
                className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-slate-800"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
