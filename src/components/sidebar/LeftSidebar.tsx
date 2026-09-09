import React, { useState } from 'react';
import { ElementType, ChartType, DashboardElement } from '../../types/project';
import { Dataset } from '../../types/data';
import {
  BarChart2,
  LineChart,
  PieChart,
  Table,
  Layers,
  Database,
  Type,
  Square,
  Filter,
  PlusCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  datasets: Dataset[];
  elements: DashboardElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (type: ElementType, chartType?: ChartType) => void;
  onToggleHideElement: (id: string) => void;
  onToggleLockElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onOpenDataSourcesModal: () => void;
  onOpenDataPrepModal: () => void;
}

type TabType = 'charts' | 'kpis' | 'elements' | 'layers' | 'data';

export const LeftSidebar: React.FC<Props> = ({
  datasets,
  elements,
  selectedElementId,
  onSelectElement,
  onAddElement,
  onToggleHideElement,
  onToggleLockElement,
  onDeleteElement,
  onOpenDataSourcesModal,
  onOpenDataPrepModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('charts');

  return (
    <div className="flex h-full w-72 flex-col border-r border-slate-200 bg-white select-none">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 text-xs">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex flex-1 items-center justify-center space-x-1 rounded py-1.5 font-medium transition-all ${
            activeTab === 'charts' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Add Visualizations"
        >
          <BarChart2 className="h-3.5 w-3.5" />
          <span>Charts</span>
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex flex-1 items-center justify-center space-x-1 rounded py-1.5 font-medium transition-all ${
            activeTab === 'elements' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Add Components"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Items</span>
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-1 items-center justify-center space-x-1 rounded py-1.5 font-medium transition-all ${
            activeTab === 'layers' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Layer Management"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Layers</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`flex flex-1 items-center justify-center space-x-1 rounded py-1.5 font-medium transition-all ${
            activeTab === 'data' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Datasets & Sources"
        >
          <Database className="h-3.5 w-3.5" />
          <span>Data</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {/* CHARTS TAB */}
        {activeTab === 'charts' && (
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Standard Charts
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddElement('chart', 'bar_vertical')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <BarChart2 className="h-5 w-5 mb-1 text-blue-600" />
                  <span className="font-medium text-[11px]">Vertical Bar</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'bar_horizontal')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <BarChart2 className="h-5 w-5 mb-1 text-sky-600 rotate-90" />
                  <span className="font-medium text-[11px]">Horizontal Bar</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'line_area')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <LineChart className="h-5 w-5 mb-1 text-emerald-600" />
                  <span className="font-medium text-[11px]">Line & Area</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'donut')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <PieChart className="h-5 w-5 mb-1 text-amber-500" />
                  <span className="font-medium text-[11px]">Donut & Pie</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Advanced Analytics
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddElement('chart', 'treemap')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <Square className="h-5 w-5 mb-1 text-indigo-600" />
                  <span className="font-medium text-[11px]">Treemap</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'radar')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <Compass className="h-5 w-5 mb-1 text-purple-600" />
                  <span className="font-medium text-[11px]">Radar</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'candlestick')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <BarChart2 className="h-5 w-5 mb-1 text-rose-500" />
                  <span className="font-medium text-[11px]">Candlestick</span>
                </button>
                <button
                  onClick={() => onAddElement('chart', 'scatter')}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all"
                >
                  <PlusCircle className="h-5 w-5 mb-1 text-teal-600" />
                  <span className="font-medium text-[11px]">Scatter Plot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Data Metrics & Grids
              </span>
              <div className="mt-1.5 space-y-2">
                <button
                  onClick={() => onAddElement('kpi')}
                  className="flex w-full items-center space-x-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-100 text-emerald-700">
                    $
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">KPI Metric Card</div>
                    <div className="text-[11px] text-slate-400">Value, sparkline, and trend delta</div>
                  </div>
                </button>

                <button
                  onClick={() => onAddElement('table')}
                  className="flex w-full items-center space-x-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-700">
                    <Table className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Interactive Data Table</div>
                    <div className="text-[11px] text-slate-400">Sorting, search, pagination, totals</div>
                  </div>
                </button>

                <button
                  onClick={() => onAddElement('filter')}
                  className="flex w-full items-center space-x-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-100 text-amber-700">
                    <Filter className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Filter Control</div>
                    <div className="text-[11px] text-slate-400">Interactive dropdown filter</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Text & Figures
              </span>
              <div className="mt-1.5 space-y-2">
                <button
                  onClick={() => onAddElement('text')}
                  className="flex w-full items-center space-x-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-700">
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Header & Text Box</div>
                    <div className="text-[11px] text-slate-400">Custom labels and section titles</div>
                  </div>
                </button>

                <button
                  onClick={() => onAddElement('shape')}
                  className="flex w-full items-center space-x-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-indigo-700">
                    <Square className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-xs">Shape Container</div>
                    <div className="text-[11px] text-slate-400">Card backgrounds and badges</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <div className="space-y-1">
            <div className="mb-2 flex items-center justify-between text-slate-500">
              <span className="font-semibold text-[11px] uppercase tracking-wider">Canvas Hierarchy</span>
              <span className="text-[10px]">{elements.length} items</span>
            </div>
            {elements.length === 0 ? (
              <div className="py-6 text-center text-slate-400">No elements on page</div>
            ) : (
              elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onClick={() => onSelectElement(el.id)}
                    className={`flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs transition-colors ${
                      isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate max-w-[140px]">{el.title}</span>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHideElement(el.id);
                        }}
                        className="hover:text-slate-700 p-0.5"
                      >
                        {el.hidden ? <EyeOff className="h-3 w-3 text-rose-500" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLockElement(el.id);
                        }}
                        className="hover:text-slate-700 p-0.5"
                      >
                        {el.locked ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement(el.id);
                        }}
                        className="hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DATA TAB */}
        {activeTab === 'data' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Active Datasets
              </span>
              <button
                onClick={onOpenDataSourcesModal}
                className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Data</span>
              </button>
            </div>

            <div className="space-y-2">
              {datasets.map((ds) => (
                <div
                  key={ds.id}
                  className="rounded-lg border border-slate-200 p-2.5 transition-all hover:border-slate-300 bg-white shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{ds.name}</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ds.rowCount.toLocaleString()} rows • {ds.columns.length} cols</span>
                    <span className="capitalize text-slate-400">{ds.sourceType}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={onOpenDataPrepModal}
                className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Compass className="h-3.5 w-3.5 text-blue-600" />
                <span>Open Data Prep & Transform</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
