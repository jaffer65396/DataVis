import React, { useState } from 'react';
import {
  DataVizHeader,
  PaletteSidebar,
  CanvasPageTabs,
  HeadlineTextWidget,
  KpiMetricCard,
  GeographicBarChart,
  CanvasSettingsPanel,
} from './components.tsx';
import {
  KpiMetricSchema,
  BarChartSchema,
  PLACEHOLDER_KPI_DATA,
  PLACEHOLDER_BAR_DATA,
} from './types.ts';

// =========================================================================
// TEMPLATE 1: EXACT PREVIEW WORKSPACE (Full 3-Column IDE Layout)
// =========================================================================
/**
 * ExactPreviewLayout
 * Directly re-creates the entire workspace shown in the screenshot:
 * - Top Header: Brand, Title, Status, View Switcher, Data & Share actions
 * - Left Palette: Standard Charts, Advanced Analytics, Items, Layers, Data
 * - Center Canvas: Dot grid background, Page Tabs, Headline, KPI Card, Bar Chart
 * - Right Inspector: Canvas Dimensions & Theme Selection
 */
export interface ExactPreviewLayoutProps {
  kpiData?: KpiMetricSchema;
  barData?: BarChartSchema;
  headlineTitle?: string;
  onConnectData?: () => void;
  onShare?: () => void;
}

export const ExactPreviewLayout: React.FC<ExactPreviewLayoutProps> = ({
  kpiData = PLACEHOLDER_KPI_DATA,
  barData = PLACEHOLDER_BAR_DATA,
  headlineTitle = 'Global Enterprise Sales & Revenue',
  onConnectData,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'dataprep' | 'templates'>('canvas');
  const [activePage, setActivePage] = useState('Executive Overview');
  const [canvasTheme, setCanvasTheme] = useState('corporate-slate');
  const [dimensions, setDimensions] = useState({ width: 1280, height: 900 });

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* 1. Header */}
      <DataVizHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onConnectData={onConnectData}
        onShare={onShare}
      />

      {/* 2. Three-Column Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Palette & Layer Tools */}
        <PaletteSidebar
          onAddElement={(type) => {
            console.log(`Adding ${type} widget to canvas`);
          }}
        />

        {/* Center: Canvas Workspace */}
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
          {/* Page Tabs */}
          <CanvasPageTabs
            activePage={activePage}
            onSelectPage={setActivePage}
            onAddPage={() => alert('Created new canvas page')}
          />

          {/* Canvas Viewport with Dot Grid */}
          <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
            {/* The Scalable Canvas Container */}
            <div
              style={{
                width: `${dimensions.width}px`,
                minHeight: `${dimensions.height}px`,
                backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
              }}
              className="relative rounded-xl border border-slate-300/80 bg-white p-8 shadow-sm transition-all"
            >
              <div className="max-w-2xl space-y-6">
                {/* 1. Headline Display */}
                <HeadlineTextWidget title={headlineTitle} />

                {/* 2. Metric KPI Card */}
                <KpiMetricCard data={kpiData} />

                {/* 3. Geographic Bar Chart */}
                <GeographicBarChart data={barData} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Settings & Themes */}
        <CanvasSettingsPanel
          width={dimensions.width}
          height={dimensions.height}
          activeTheme={canvasTheme}
          onUpdateDimensions={(w, h) => setDimensions({ width: w, height: h })}
          onSelectTheme={setCanvasTheme}
        />
      </div>
    </div>
  );
};

// =========================================================================
// TEMPLATE 2: EXECUTIVE KPI & ANALYTICS DASHBOARD GRID
// =========================================================================
/**
 * ExecutiveKpiGridLayout
 * A modern responsive multi-card layout:
 * - Top Headline Bar
 * - Row of 3 KPI Cards
 * - Dual-Column Analytical Charts
 */
export interface ExecutiveKpiGridLayoutProps {
  kpis?: KpiMetricSchema[];
  primaryBarData?: BarChartSchema;
}

export const ExecutiveKpiGridLayout: React.FC<ExecutiveKpiGridLayoutProps> = ({
  kpis = [
    PLACEHOLDER_KPI_DATA,
    {
      id: 'kpi-mrr',
      title: 'Net Monthly Recurring',
      label: 'NET ARR / MRR',
      value: 184500,
      formattedValue: '$184.5k',
      trendDirection: 'up',
      sparklineData: [20, 25, 22, 38, 45, 52, 60],
      sparklineColor: '#3b82f6',
    },
    {
      id: 'kpi-customers',
      title: 'Active Enterprise Seats',
      label: 'ACTIVE ACCOUNTS',
      value: 12450,
      formattedValue: '12,450',
      trendDirection: 'up',
      sparklineData: [40, 42, 45, 48, 50, 55, 64],
      sparklineColor: '#8b5cf6',
    },
  ],
  primaryBarData = PLACEHOLDER_BAR_DATA,
}) => {
  return (
    <div className="w-full space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
      {/* Title */}
      <HeadlineTextWidget title="Executive Enterprise Performance Dashboard" />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiMetricCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GeographicBarChart data={primaryBarData} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              REGIONAL ANALYSIS
            </span>
            <h3 className="mt-1 text-base font-bold text-slate-800">
              Growth Acceleration Highlights
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              North America and EMEA regions accounted for 72.4% of all enterprise volume, outperforming quarterly targets by +14.8%.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 flex justify-between text-xs font-semibold text-slate-700">
            <span>Forecast Accuracy</span>
            <span className="text-emerald-600 font-bold">98.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
