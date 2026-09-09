import React, { useState } from 'react';
import {
  BarChart3,
  Database,
  SlidersHorizontal,
  LayoutTemplate,
  History,
  Share2,
  CheckCircle2,
  BarChart2,
  PieChart,
  LineChart,
  Compass,
  CandlestickChart,
  ScatterChart,
  Plus,
  GripVertical,
  Layers,
  FolderTree,
  TableProperties,
  Lightbulb,
} from 'lucide-react';
import {
  KpiMetricSchema,
  BarChartSchema,
  STYLING_VARIABLES,
  PLACEHOLDER_KPI_DATA,
  PLACEHOLDER_BAR_DATA,
} from './types.ts';

// =========================================================================
// 1. TOP HEADER & WORKSPACE TOOLBAR
// =========================================================================
/**
 * Header Component
 * Replicates the top navigation bar from the image.
 *
 * @param projectName - Displayed title of the active project
 * @param isSaved - Boolean indicating sync/save status
 * @param activeTab - Current workspace view mode ('canvas' | 'dataprep' | 'templates')
 * @param onConnectData - Callback triggered when "Connect Data" is clicked
 * @param onShare - Callback triggered when "Share" is clicked
 */
export interface DataVizHeaderProps {
  projectName?: string;
  isSaved?: boolean;
  activeTab?: 'canvas' | 'dataprep' | 'templates';
  onSelectTab?: (tab: 'canvas' | 'dataprep' | 'templates') => void;
  onConnectData?: () => void;
  onShare?: () => void;
}

export const DataVizHeader: React.FC<DataVizHeaderProps> = ({
  projectName = 'Executive Sales & Revenue Perfor...',
  isSaved = true,
  activeTab = 'canvas',
  onSelectTab,
  onConnectData,
  onShare,
}) => {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs select-none">
      {/* Brand & Project Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900">
            DataViz <span className="text-blue-600">Studio</span>
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-700 max-w-[200px] truncate">
            {projectName}
          </span>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            <span>{isSaved ? 'Saved' : 'Saving...'}</span>
          </div>
        </div>
      </div>

      {/* Center View Switcher */}
      <div className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
        <button
          onClick={() => onSelectTab?.('canvas')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeTab === 'canvas'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Dashboard Canvas</span>
        </button>

        <button
          onClick={() => onSelectTab?.('dataprep')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeTab === 'dataprep'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Data Prep & ETL</span>
        </button>

        <button
          onClick={() => onSelectTab?.('templates')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          <span>Templates</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onConnectData}
          className="flex items-center space-x-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Database className="h-3.5 w-3.5 text-blue-600" />
          <span>Connect Data</span>
        </button>

        <button
          className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Version History"
        >
          <History className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onShare}
          className="flex items-center space-x-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
};

// =========================================================================
// 2. PALETTE & TOOLING SIDEBAR
// =========================================================================
/**
 * Left Palette Sidebar
 * Offers drag-and-drop or click-to-add items grouped by:
 * - Standard Charts: Vertical Bar, Horizontal Bar, Line & Area, Donut & Pie
 * - Advanced Analytics: Treemap, Radar, Candlestick, Scatter Plot
 */
export interface PaletteSidebarProps {
  activeTab?: 'charts' | 'items' | 'layers' | 'data';
  onSelectTab?: (tab: 'charts' | 'items' | 'layers' | 'data') => void;
  onAddElement?: (type: string) => void;
}

export const PaletteSidebar: React.FC<PaletteSidebarProps> = ({
  activeTab = 'charts',
  onSelectTab,
  onAddElement,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTab = (t: 'charts' | 'items' | 'layers' | 'data') => {
    setCurrentTab(t);
    onSelectTab?.(t);
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white select-none">
      {/* Top Sidebar Tabs */}
      <div className="flex border-b border-slate-200 px-2 pt-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => handleTab('charts')}
          className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 transition-all ${
            currentTab === 'charts'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Charts</span>
        </button>
        <button
          onClick={() => handleTab('items')}
          className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 transition-all ${
            currentTab === 'items'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Items</span>
        </button>
        <button
          onClick={() => handleTab('layers')}
          className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 transition-all ${
            currentTab === 'layers'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Layers</span>
        </button>
        <button
          onClick={() => handleTab('data')}
          className={`flex items-center space-x-1.5 px-3 py-2 border-b-2 transition-all ${
            currentTab === 'data'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TableProperties className="h-3.5 w-3.5" />
          <span>Data</span>
        </button>
      </div>

      {/* Palette Tooling Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Section 1: Standard Charts */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            STANDARD CHARTS
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onAddElement?.('bar_vertical')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <BarChart2 className="h-6 w-6 text-blue-600 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Vertical Bar</span>
            </button>

            <button
              onClick={() => onAddElement?.('bar_horizontal')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex flex-col space-y-1 items-center justify-center h-6 w-6">
                <div className="h-1 w-5 rounded bg-blue-600" />
                <div className="h-1 w-3.5 rounded bg-blue-500" />
                <div className="h-1 w-4.5 rounded bg-blue-600" />
              </div>
              <span className="mt-2 text-xs font-medium text-slate-700">Horizontal Bar</span>
            </button>

            <button
              onClick={() => onAddElement?.('line')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <LineChart className="h-6 w-6 text-emerald-500 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Line & Area</span>
            </button>

            <button
              onClick={() => onAddElement?.('donut')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <PieChart className="h-6 w-6 text-amber-500 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Donut & Pie</span>
            </button>
          </div>
        </div>

        {/* Section 2: Advanced Analytics */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ADVANCED ANALYTICS
          </span>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onAddElement?.('treemap')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <FolderTree className="h-6 w-6 text-indigo-500 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Treemap</span>
            </button>

            <button
              onClick={() => onAddElement?.('radar')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-fuchsia-300 hover:bg-fuchsia-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <Compass className="h-6 w-6 text-fuchsia-500 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Radar</span>
            </button>

            <button
              onClick={() => onAddElement?.('candlestick')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-rose-300 hover:bg-rose-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <CandlestickChart className="h-6 w-6 text-rose-500 group-hover:scale-105 transition-transform" />
              <span className="mt-2 text-xs font-medium text-slate-700">Candlestick</span>
            </button>

            <button
              onClick={() => onAddElement?.('scatter')}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-xs transition-all group cursor-pointer"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-teal-500 text-teal-500 font-bold text-xs">
                +
              </div>
              <span className="mt-2 text-xs font-medium text-slate-700">Scatter Plot</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

// =========================================================================
// 3. CANVAS PAGE TABS
// =========================================================================
/**
 * Canvas Page Tabs
 * Displays multi-page tabs above the canvas ('Executive Overview', 'Profitability & Margins', etc.)
 */
export interface CanvasPageTabsProps {
  activePage?: string;
  onSelectPage?: (page: string) => void;
  onAddPage?: () => void;
}

export const CanvasPageTabs: React.FC<CanvasPageTabsProps> = ({
  activePage = 'Executive Overview',
  onSelectPage,
  onAddPage,
}) => {
  return (
    <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-1.5 select-none">
      <button
        onClick={() => onSelectPage?.('Executive Overview')}
        className={`rounded-t-lg border-t-2 px-4 py-2 text-xs font-semibold transition-colors ${
          activePage === 'Executive Overview'
            ? 'border-blue-600 bg-white text-blue-600 shadow-2xs'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        Executive Overview
      </button>

      <button
        onClick={() => onSelectPage?.('Profitability & Margins')}
        className={`rounded-t-lg border-t-2 px-4 py-2 text-xs font-semibold transition-colors ${
          activePage === 'Profitability & Margins'
            ? 'border-blue-600 bg-white text-blue-600 shadow-2xs'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        Profitability & Margins
      </button>

      <button
        onClick={onAddPage}
        className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors ml-1"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Page</span>
      </button>
    </div>
  );
};

// =========================================================================
// 4. HEADLINE / TITLE TEXT WIDGET
// =========================================================================
export interface HeadlineTextWidgetProps {
  title?: string;
}

export const HeadlineTextWidget: React.FC<HeadlineTextWidgetProps> = ({
  title = 'Global Enterprise Sales & Revenue',
}) => {
  return (
    <div className="relative rounded-xl border border-dashed border-blue-400/70 bg-white/70 backdrop-blur-xs px-6 py-4 shadow-2xs">
      <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {title}
      </h1>
    </div>
  );
};

// =========================================================================
// 5. METRIC KPI CARD WITH TREND SPARKLINE
// =========================================================================
/**
 * Metric KPI Card
 * Exactly matches the preview card:
 * - Drag handle `::: Total Gross Revenue`
 * - Small tracked label `TOTAL REVENUE`
 * - Large high-contrast metric `$612.7k`
 * - Elegant SVG sparkline trend
 */
export interface KpiMetricCardProps {
  data?: KpiMetricSchema;
}

export const KpiMetricCard: React.FC<KpiMetricCardProps> = ({
  data = PLACEHOLDER_KPI_DATA,
}) => {
  // SVG Sparkline calculation
  const points = data.sparklineData;
  const width = 120;
  const height = 44;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const pathCoordinates = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' L ');

  const pathD = `M ${pathCoordinates}`;

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md select-none">
      {/* Drag handle header */}
      <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-400">
        <GripVertical className="h-3 w-3" />
        <span>{data.title}</span>
      </div>

      {/* Main Metric content row */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            {data.label}
          </span>
          <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            {data.formattedValue || `${data.prefix || ''}${data.value}${data.suffix || ''}`}
          </div>
        </div>

        {/* Sparkline curve */}
        <div className="pb-1">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
          >
            <path
              d={pathD}
              fill="none"
              stroke={data.sparklineColor || '#10b981'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. GEOGRAPHIC REGIONAL REVENUE BAR CHART
// =========================================================================
/**
 * Geographic Revenue Bar Chart
 * Displays vertical grouped/colored bars with exact callouts (200.4k, 195.3k)
 * and horizontal grid ticks (50,100 to 200,400).
 */
export interface GeographicBarChartProps {
  data?: BarChartSchema;
}

export const GeographicBarChart: React.FC<GeographicBarChartProps> = ({
  data = PLACEHOLDER_BAR_DATA,
}) => {
  const yTicks = [200400, 150300, 100200, 50100];
  const max = 220000;

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs select-none">
      {/* Drag handle header */}
      <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-400">
        <GripVertical className="h-3 w-3" />
        <span>{data.title}</span>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-4 flex h-64 w-full">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between pr-3 text-right text-[11px] font-medium text-slate-400">
          {yTicks.map((tick) => (
            <span key={tick}>{tick.toLocaleString()}</span>
          ))}
          <span className="opacity-0">0</span>
        </div>

        {/* Bars Container with horizontal dashed grid lines */}
        <div className="relative flex-1 border-b border-slate-200">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yTicks.map((tick) => (
              <div key={tick} className="w-full border-b border-dashed border-slate-100" />
            ))}
            <div className="w-full" />
          </div>

          {/* Vertical Bars */}
          <div className="absolute inset-0 flex items-end justify-around px-8">
            {data.series.map((item, idx) => {
              const heightPercent = (item.value / max) * 100;
              return (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  {/* Value callout pill above bar */}
                  <span className="text-xs font-semibold text-slate-700">
                    {item.formattedValue || item.value}
                  </span>

                  {/* Vertical bar */}
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      width: '64px',
                      backgroundColor: item.color || '#3b82f6',
                    }}
                    className="rounded-t-lg transition-all hover:opacity-90 shadow-xs"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7. CANVAS SETTINGS & THEME INSPECTOR
// =========================================================================
/**
 * Right Properties / Canvas Settings Panel
 * Manages dimensions (1280x900) and theme selection presets.
 */
export interface CanvasSettingsPanelProps {
  width?: number;
  height?: number;
  activeTheme?: string;
  onUpdateDimensions?: (w: number, h: number) => void;
  onSelectTheme?: (themeId: string) => void;
}

export const CanvasSettingsPanel: React.FC<CanvasSettingsPanelProps> = ({
  width = 1280,
  height = 900,
  activeTheme = 'corporate-slate',
  onUpdateDimensions,
  onSelectTheme,
}) => {
  const [wVal, setWVal] = useState(width);
  const [hVal, setHVal] = useState(height);
  const [currentTheme, setCurrentTheme] = useState(activeTheme);

  const handleThemeChange = (id: string) => {
    setCurrentTheme(id);
    onSelectTheme?.(id);
  };

  const themesList = [
    {
      id: 'corporate-slate',
      name: 'Corporate Slate',
      dots: ['#3b82f6', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'],
    },
    {
      id: 'obsidian-midnight',
      name: 'Obsidian Midnight',
      dots: ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f43f5e'],
    },
    {
      id: 'emerald-fintech',
      name: 'Emerald FinTech',
      dots: ['#059669', '#10b981', '#34d399', '#06b6d4', '#6366f1'],
    },
    {
      id: 'warm-bronze',
      name: 'Warm Bronze',
      dots: ['#d97706', '#f59e0b', '#fbbf24', '#14b8a6', '#0284c7'],
    },
  ];

  return (
    <aside className="flex h-full w-80 flex-col border-l border-slate-200 bg-white p-5 select-none overflow-y-auto">
      {/* Title */}
      <div className="flex items-center space-x-2 text-slate-800">
        <LayoutTemplate className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-semibold">Dashboard Canvas Settings</h2>
      </div>

      {/* Canvas Dimensions Section */}
      <div className="mt-6">
        <span className="text-xs font-semibold text-slate-700">Canvas Dimensions</span>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-slate-500">Width (px)</label>
            <input
              type="number"
              value={wVal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWVal(val);
                onUpdateDimensions?.(val, hVal);
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-500">Height (px)</label>
            <input
              type="number"
              value={hVal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHVal(val);
                onUpdateDimensions?.(wVal, val);
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Theme Section */}
      <div className="mt-6">
        <div className="flex items-center space-x-1.5">
          <div className="h-3 w-3 rounded-full border border-blue-500" />
          <span className="text-xs font-semibold text-slate-700">Visual Theme</span>
        </div>

        <div className="mt-3 space-y-2.5">
          {themesList.map((t) => {
            const isActive = currentTheme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/20 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">{t.name}</div>
                  <div className="mt-1.5 flex items-center space-x-1">
                    {t.dots.map((dotColor, dIdx) => (
                      <div
                        key={dIdx}
                        style={{ backgroundColor: dotColor }}
                        className="h-2 w-2 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {isActive && (
                  <span className="text-xs font-bold text-blue-600">Active</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper Callout Box */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Select any chart, KPI card, or element on the canvas to configure its dimensions, metrics, and styling.
          </p>
        </div>
      </div>
    </aside>
  );
};
