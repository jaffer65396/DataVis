import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Code2,
  Copy,
  Check,
  Palette,
  LayoutGrid,
  FileText,
  Sliders,
  BarChart3,
  Play,
  ArrowRight,
  Database,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
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
  ExactPreviewLayout,
  ExecutiveKpiGridLayout,
} from './templates.tsx';
import {
  STYLING_VARIABLES,
  PLACEHOLDER_KPI_DATA,
  PLACEHOLDER_BAR_DATA,
  KpiMetricSchema,
  BarChartSchema,
} from './types.ts';

export const DashboardIndex: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Playground state
  const [kpiVal, setKpiVal] = useState<string>('$612.7k');
  const [kpiTitle, setKpiTitle] = useState<string>('Total Gross Revenue');
  const [headline, setHeadline] = useState<string>('Global Enterprise Sales & Revenue');

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems = [
    { id: 'overview', label: '1. Overview & Architecture', icon: BookOpen },
    { id: 'tokens', label: '2. Design Tokens & Styling', icon: Palette },
    { id: 'schemas', label: '3. Data Schemas & Placeholders', icon: Database },
    { id: 'header-comp', label: '4. Header & Navigation', icon: LayoutGrid },
    { id: 'palette-comp', label: '5. Tooling & Palette Sidebar', icon: Sliders },
    { id: 'tabs-comp', label: '6. Canvas Page Tabs', icon: Layers },
    { id: 'headline-comp', label: '7. Headline Text Widget', icon: FileText },
    { id: 'kpi-comp', label: '8. Metric KPI & Sparkline', icon: BarChart3 },
    { id: 'bar-comp', label: '9. Geographic Bar Chart', icon: BarChart3 },
    { id: 'settings-comp', label: '10. Canvas Settings & Themes', icon: Sliders },
    { id: 'templates', label: '11. Pre-built Layout Templates', icon: LayoutGrid },
    { id: 'integration', label: '12. Live Data Wiring Guide', icon: Code2 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Table of Contents Sidebar */}
      <aside className="flex h-full w-80 flex-col border-r border-slate-800 bg-slate-950 p-4 select-none shrink-0">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Dashboard Index</h2>
              <span className="text-[10px] text-blue-400 font-medium">DataViz Component Catalog</span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              Exit
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-1 pr-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Table of Contents
          </span>
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info badge */}
        <div className="mt-auto pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Target: Cloud SQL & React</span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 font-semibold">
            v1.0 Ready
          </span>
        </div>
      </aside>

      {/* Main Documentation & Interactive Stage */}
      <main className="flex-1 overflow-y-auto bg-slate-900 p-8">
        <div className="mx-auto max-w-5xl space-y-10">

          {/* ==================================================== */}
          {/* SECTION 1: OVERVIEW */}
          {/* ==================================================== */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Consolidated Specification
                </span>
                <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                  DataViz Studio Dashboard Index & Element Catalog
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  This comprehensive index consolidates every UI component, visual chart, KPI card, and control panel shown in the preview image. All elements are modularized, standardized with typed TypeScript schemas, styled with harmonious design tokens, and prepared for seamless connection to live backend databases.
                </p>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <LayoutGrid className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase">7 Core Components</h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Header, Sidebar Palette, Canvas Page Tabs, Headline Display, KPI Card, Bar Chart, and Inspector.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Database className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase">Standardized Schemas</h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Strict TypeScript data contracts for metric aggregations, regional series, and canvas configurations.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Palette className="h-4 w-4" />
                    <h3 className="text-xs font-bold uppercase">4 Built-in Themes</h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Corporate Slate, Obsidian Midnight, Emerald FinTech, and Warm Bronze with unified scales.
                  </p>
                </div>
              </div>

              {/* Live Preview Button */}
              <div className="rounded-2xl border border-blue-900/50 bg-blue-950/30 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Explore Pre-built Layouts</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Check out the 3-column workspace layout or the responsive executive grid.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('templates')}
                  className="flex items-center space-x-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
                >
                  <span>Open Templates</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 2: DESIGN TOKENS & STYLING */}
          {/* ==================================================== */}
          {activeSection === 'tokens' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Visual Foundation
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Design Tokens & Styling Variables
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Standardized color variables, font hierarchies, corner radii, and responsive breakpoints.
                </p>
              </div>

              {/* Color Themes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Theme Color Palettes</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(STYLING_VARIABLES.themes).map(([key, theme]) => (
                    <div key={key} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{theme.name}</span>
                        <div className="flex items-center space-x-1">
                          {theme.chartColors.map((c, i) => (
                            <div key={i} style={{ backgroundColor: c }} className="h-2.5 w-2.5 rounded-full" />
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="block text-[10px] text-slate-600">Primary</span>
                          <span className="font-mono text-slate-300">{theme.primary}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-600">Background</span>
                          <span className="font-mono text-slate-300">{theme.background}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-600">Card Border</span>
                          <span className="font-mono text-slate-300">{theme.cardBorder}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakpoints & Radii */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="text-xs font-semibold text-slate-300">Responsive Breakpoints</h4>
                  <div className="mt-3 space-y-1.5 font-mono text-[11px] text-slate-400">
                    <div className="flex justify-between"><span>sm:</span> <span>640px</span></div>
                    <div className="flex justify-between"><span>md:</span> <span>768px (Tablets / Split view)</span></div>
                    <div className="flex justify-between"><span>lg:</span> <span>1024px (Laptops)</span></div>
                    <div className="flex justify-between"><span>xl:</span> <span>1280px (Canvas Default Width)</span></div>
                    <div className="flex justify-between"><span>2xl:</span> <span>1536px (Ultra-wide)</span></div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="text-xs font-semibold text-slate-300">Mathematical Corner Radii</h4>
                  <div className="mt-3 space-y-1.5 font-mono text-[11px] text-slate-400">
                    <div className="flex justify-between"><span>sm:</span> <span>4px (Badges & Mini tags)</span></div>
                    <div className="flex justify-between"><span>md:</span> <span>8px (Buttons & Controls)</span></div>
                    <div className="flex justify-between"><span>lg:</span> <span>12px (Inner Panels)</span></div>
                    <div className="flex justify-between"><span>xl:</span> <span>16px (Outer Dashboard Cards)</span></div>
                    <div className="flex justify-between"><span>full:</span> <span>9999px (Pills & Dots)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 3: DATA SCHEMAS */}
          {/* ==================================================== */}
          {activeSection === 'schemas' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Data Contracts
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Standardized Data Schemas
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Typed definitions ready for wiring into live PostgreSQL tables, REST APIs, or WebSocket feeds.
                </p>
              </div>

              {/* Schema 1: KPI Metric */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">1. KpiMetricSchema (TypeScript)</h3>
                  <button
                    onClick={() => copyToClipboard(`export interface KpiMetricSchema {\n  id: string;\n  title: string;\n  label: string;\n  value: number;\n  formattedValue?: string;\n  prefix?: string;\n  suffix?: string;\n  trendDirection?: 'up' | 'down' | 'neutral';\n  trendPercentage?: number;\n  sparklineData: number[];\n  sparklineColor?: string;\n}`, 'schema-kpi')}
                    className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode === 'schema-kpi' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode === 'schema-kpi' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-blue-300 leading-relaxed">
{`export interface KpiMetricSchema {
  id: string;              // Unique identifier (e.g. 'kpi-gross-revenue')
  title: string;           // Card header (e.g. 'Total Gross Revenue')
  label: string;           // Subtitle badge (e.g. 'TOTAL REVENUE')
  value: number;           // Raw numeric value (e.g. 612700)
  formattedValue?: string; // Display string (e.g. '$612.7k')
  trendPercentage?: number;// Change metric (e.g. 12.4)
  sparklineData: number[]; // Trend array: [45, 42, 60, 48, 55, 38, 46]
  sparklineColor?: string; // Hex color (e.g. '#10b981')
}`}
                </pre>
              </div>

              {/* Schema 2: Bar Series */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">2. BarChartSchema (TypeScript)</h3>
                  <button
                    onClick={() => copyToClipboard(`export interface BarChartSchema {\n  id: string;\n  title: string;\n  yAxisMin: number;\n  yAxisMax: number;\n  yAxisStep: number;\n  series: {\n    label: string;\n    value: number;\n    formattedValue?: string;\n    color?: string;\n  }[];\n}`, 'schema-bar')}
                    className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode === 'schema-bar' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode === 'schema-bar' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-blue-300 leading-relaxed">
{`export interface BarChartSchema {
  id: string;              // Chart ID (e.g. 'chart-geo-revenue')
  title: string;           // Title (e.g. 'Revenue by Geographic Region')
  yAxisMin: number;        // Minimum tick (e.g. 50100)
  yAxisMax: number;        // Maximum tick (e.g. 200400)
  yAxisStep: number;       // Grid interval (e.g. 50100)
  series: {
    label: string;         // 'North America'
    value: number;         // 200400
    formattedValue?: string;// '200.4k'
    color?: string;        // '#3b82f6'
  }[];
}`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 4: HEADER COMPONENT */}
          {/* ==================================================== */}
          {activeSection === 'header-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #1
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  DataVizHeader Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Top navigation bar featuring brand identity, real-time autosave status, multi-view switcher, and action buttons.
                </p>
              </div>

              {/* Live Preview Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-white">
                <DataVizHeader
                  projectName="Executive Sales & Revenue Perfor..."
                  isSaved={true}
                  onConnectData={() => alert('Connect Data clicked')}
                  onShare={() => alert('Share clicked')}
                />
              </div>

              {/* Usage Snippet */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">import &#123; DataVizHeader &#125; from './components';</span>
                  <button
                    onClick={() => copyToClipboard(`<DataVizHeader\n  projectName="Executive Sales & Revenue Performance"\n  isSaved={true}\n  activeTab="canvas"\n  onSelectTab={(tab) => console.log(tab)}\n  onConnectData={() => handleConnectDatabase()}\n  onShare={() => handleShareDashboard()}\n/>`, 'code-header')}
                    className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode === 'code-header' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode === 'code-header' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<DataVizHeader
  projectName="Executive Sales & Revenue Performance"
  isSaved={true}
  activeTab="canvas"
  onSelectTab={(tab) => console.log(tab)}
  onConnectData={() => handleConnectDatabase()}
  onShare={() => handleShareDashboard()}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 5: PALETTE SIDEBAR */}
          {/* ==================================================== */}
          {activeSection === 'palette-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #2
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  PaletteSidebar Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Left tool palette containing Standard Charts (Vertical Bar, Horizontal Bar, Line & Area, Donut & Pie) and Advanced Analytics (Treemap, Radar, Candlestick, Scatter Plot).
                </p>
              </div>

              {/* Live Preview */}
              <div className="h-[480px] w-72 overflow-hidden rounded-2xl border border-slate-700 bg-white">
                <PaletteSidebar
                  onAddElement={(type) => alert(`Added ${type} chart element`)}
                />
              </div>

              {/* Usage Snippet */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<PaletteSidebar
  activeTab="charts"
  onSelectTab={(tab) => setSidebarTab(tab)}
  onAddElement={(chartType) => handleAddChartToCanvas(chartType)}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 6: CANVAS PAGE TABS */}
          {/* ==================================================== */}
          {activeSection === 'tabs-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #3
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  CanvasPageTabs Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Multi-page navigation switcher supporting tab selection and instant creation of new canvas pages.
                </p>
              </div>

              {/* Live Preview */}
              <div className="overflow-hidden rounded-xl border border-slate-700 bg-white">
                <CanvasPageTabs
                  activePage="Executive Overview"
                  onSelectPage={(p) => alert(`Switched to page: ${p}`)}
                  onAddPage={() => alert('Add page clicked')}
                />
              </div>

              {/* Usage Snippet */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<CanvasPageTabs
  activePage={activePageTitle}
  onSelectPage={(pageName) => setActivePageTitle(pageName)}
  onAddPage={() => handleAddNewDashboardPage()}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 7: HEADLINE TEXT WIDGET */}
          {/* ==================================================== */}
          {activeSection === 'headline-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #4
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  HeadlineTextWidget Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  High-contrast title component matching the "Global Enterprise Sales & Revenue" header box.
                </p>
              </div>

              {/* Playground Controls */}
              <div className="flex items-center space-x-3">
                <label className="text-xs text-slate-400">Custom Title:</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none w-80"
                />
              </div>

              {/* Live Preview */}
              <div className="p-6 rounded-2xl border border-slate-700 bg-slate-100">
                <HeadlineTextWidget title={headline} />
              </div>

              {/* Code */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<HeadlineTextWidget title="${headline}" />`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 8: METRIC KPI CARD */}
          {/* ==================================================== */}
          {activeSection === 'kpi-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #5
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  KpiMetricCard Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Executive KPI card showing drag handle, label, formatted value, and smooth SVG sparkline trend curve.
                </p>
              </div>

              {/* Interactive Playground */}
              <div className="flex flex-wrap gap-4 items-center rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Title:</span>
                  <input
                    type="text"
                    value={kpiTitle}
                    onChange={(e) => setKpiTitle(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Formatted Value:</span>
                  <input
                    type="text"
                    value={kpiVal}
                    onChange={(e) => setKpiVal(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="max-w-md p-6 rounded-2xl border border-slate-700 bg-slate-100">
                <KpiMetricCard
                  data={{
                    ...PLACEHOLDER_KPI_DATA,
                    title: kpiTitle,
                    formattedValue: kpiVal,
                  }}
                />
              </div>

              {/* Code */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<KpiMetricCard
  data={{
    id: 'kpi-revenue',
    title: '${kpiTitle}',
    label: 'TOTAL REVENUE',
    value: 612700,
    formattedValue: '${kpiVal}',
    sparklineData: [45, 42, 60, 48, 55, 38, 46],
    sparklineColor: '#10b981',
  }}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 9: GEOGRAPHIC BAR CHART */}
          {/* ==================================================== */}
          {activeSection === 'bar-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #6
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  GeographicBarChart Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Categorical bar chart showing dual regional columns with values (200.4k in blue and 195.3k in cyan) and horizontal tick marks.
                </p>
              </div>

              {/* Live Preview */}
              <div className="max-w-xl p-6 rounded-2xl border border-slate-700 bg-slate-100">
                <GeographicBarChart data={PLACEHOLDER_BAR_DATA} />
              </div>

              {/* Code */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<GeographicBarChart
  data={{
    id: 'chart-geo',
    title: 'Revenue by Geographic Region',
    yAxisMin: 50100,
    yAxisMax: 200400,
    yAxisStep: 50100,
    series: [
      { label: 'North America', value: 200400, formattedValue: '200.4k', color: '#3b82f6' },
      { label: 'Europe / APAC', value: 195300, formattedValue: '195.3k', color: '#38bdf8' },
    ],
  }}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 10: CANVAS SETTINGS PANEL */}
          {/* ==================================================== */}
          {activeSection === 'settings-comp' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Preview Element #7
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  CanvasSettingsPanel Component
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Right-hand inspector panel controlling canvas dimensions (1280x900), active color themes, and context assistance.
                </p>
              </div>

              {/* Live Preview */}
              <div className="h-[520px] w-80 overflow-hidden rounded-2xl border border-slate-700 bg-white">
                <CanvasSettingsPanel
                  width={1280}
                  height={900}
                  activeTheme="corporate-slate"
                  onSelectTheme={(t) => console.log('Selected theme:', t)}
                />
              </div>

              {/* Code */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-300">
{`<CanvasSettingsPanel
  width={1280}
  height={900}
  activeTheme="corporate-slate"
  onUpdateDimensions={(w, h) => setDimensions({ width: w, height: h })}
  onSelectTheme={(themeId) => handleThemeChange(themeId)}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 11: PRE-BUILT TEMPLATES */}
          {/* ==================================================== */}
          {activeSection === 'templates' && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Ready-To-Use Layouts
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Pre-Built Layout Templates
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Drop-in templates configured with responsive layout containers, grid setups, and flex structures.
                </p>
              </div>

              {/* Template A: Executive KPI Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Template A: Executive KPI & Analytics Grid</h3>
                  <button
                    onClick={() => copyToClipboard(`<ExecutiveKpiGridLayout />`, 'temp-a')}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    {copiedCode === 'temp-a' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode === 'temp-a' ? 'Copied' : 'Copy Template Code'}</span>
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <ExecutiveKpiGridLayout />
                </div>
              </div>

              {/* Template B: Full Image Workspace IDE */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Template B: Complete 3-Column Studio IDE</h3>
                <p className="text-xs text-slate-400">
                  The exact full-screen layout structure corresponding directly to the screenshot.
                </p>
                <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
                  <ExactPreviewLayout />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SECTION 12: WIRING GUIDE */}
          {/* ==================================================== */}
          {activeSection === 'integration' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Integration Guide
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  How to Wire Components to Live Data Endpoints
                </h2>
                <p className="mt-2 text-xs text-slate-400">
                  Step-by-step instructions for connecting live backend data, handling filters, and enabling responsive behavior.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                {/* Step 1 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-bold text-white text-sm">Step 1: Fetch Data from REST API or Database</h4>
                  <p className="mt-1 text-slate-400">
                    Call your Express / Cloud SQL API route (`/api/projects` or `/api/datasets`) inside a React `useEffect`:
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-[11px] text-blue-300">
{`const [kpiData, setKpiData] = useState(PLACEHOLDER_KPI_DATA);

useEffect(() => {
  async function loadMetrics() {
    const res = await fetch('/api/metrics/summary', {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    const data = await res.json();
    setKpiData({
      id: 'kpi-gross-revenue',
      title: 'Total Gross Revenue',
      label: 'TOTAL REVENUE',
      value: data.totalRevenue,
      formattedValue: \`$\${(data.totalRevenue / 1000).toFixed(1)}k\`,
      sparklineData: data.trendSeries,
      sparklineColor: '#10b981',
    });
  }
  loadMetrics();
}, [token]);`}
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-bold text-white text-sm">Step 2: Add New Widgets Dynamically</h4>
                  <p className="mt-1 text-slate-400">
                    To add a new widget type, define its schema in `types.ts`, map it in `components.tsx`, and push it into the page elements array:
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-[11px] text-emerald-300">
{`function handleAddWidget(type: string) {
  const newWidget = {
    id: \`widget_\${Date.now()}\`,
    type: type, // e.g. 'bar_vertical', 'donut', 'kpi'
    x: 40,
    y: 100,
    width: 480,
    height: 300,
  };
  setElements((prev) => [...prev, newWidget]);
}`}
                  </pre>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <h4 className="font-bold text-white text-sm">Step 3: Responsive Behavior & Mobile Stacking</h4>
                  <p className="mt-1 text-slate-400">
                    All components use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`). In mobile viewports, the 3-column layout automatically stacks into a fluid single column, hiding non-critical tooling into overlay drawers:
                  </p>
                  <pre className="mt-2 overflow-x-auto rounded bg-slate-900 p-3 font-mono text-[11px] text-amber-300">
{`{/* Mobile-First Responsive Grid */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <KpiMetricCard data={kpi1} />
  <KpiMetricCard data={kpi2} />
  <KpiMetricCard data={kpi3} />
</div>`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
