/**
 * ============================================================================
 * DATAVIZ STUDIO - COMPREHENSIVE DASHBOARD INDEX & COMPONENT CATALOG
 * ============================================================================
 *
 * This Index file consolidates all visual and functional preview elements
 * depicted in the DataViz Studio workspace interface, structured specifically
 * to enable easy, rapid dashboard creation.
 *
 * ----------------------------------------------------------------------------
 * TABLE OF CONTENTS & MODULE MAPPINGS
 * ----------------------------------------------------------------------------
 * 1. DESIGN TOKENS & STYLING VARIABLES
 *    - Color Palettes: Corporate Slate, Obsidian Midnight, Emerald FinTech, Warm Bronze
 *    - Typography Scale: Display, Title, Subtitle, Body, Caption, Badge
 *    - Spacing & Grid: 4px, 8px, 12px, 16px, 24px, 32px
 *    - Radii: 4px, 8px, 12px, 16px, 9999px
 *    - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 *
 * 2. STANDARDIZED DATA SCHEMAS
 *    - KpiMetricSchema: Metric title, label, value, sparkline array, color
 *    - BarChartSchema: Category labels, values, color accents, axis steps
 *    - CanvasConfigSchema: Dimensions, grid size, active theme, multi-pages
 *
 * 3. PLACEHOLDER DATASETS
 *    - PLACEHOLDER_KPI_DATA: Gross revenue ($612.7k) with trend points
 *    - PLACEHOLDER_BAR_DATA: Regional breakdown (North America, Europe/APAC)
 *    - PLACEHOLDER_PAGES: 'Executive Overview', 'Profitability & Margins'
 *
 * 4. MODULAR REUSABLE PREVIEW COMPONENTS
 *    - DataVizHeader: Top navigation with project name, saved state, & actions
 *    - PaletteSidebar: Left tool palette for standard charts & advanced analytics
 *    - CanvasPageTabs: Multi-page navigation tabs with "+ New Page" trigger
 *    - HeadlineTextWidget: High-contrast dashboard title display
 *    - KpiMetricCard: Metric KPI card with drag handle and SVG sparkline
 *    - GeographicBarChart: Categorical vertical bar chart with y-axis grid lines
 *    - CanvasSettingsPanel: Dimensions manager (1280x900) & theme inspector
 *
 * 5. PRE-BUILT LAYOUT TEMPLATES
 *    - ExactPreviewLayout: Direct 3-column workspace replication from screenshot
 *    - ExecutiveKpiGridLayout: Responsive executive dashboard grid
 *
 * 6. INTERACTIVE DOCUMENTATION & PLAYGROUND
 *    - DashboardIndex: Full interactive component catalog & live testing sandbox
 *
 * ----------------------------------------------------------------------------
 * QUICK START USAGE EXAMPLE
 * ----------------------------------------------------------------------------
 * ```tsx
 * import {
 *   KpiMetricCard,
 *   GeographicBarChart,
 *   PLACEHOLDER_KPI_DATA,
 *   PLACEHOLDER_BAR_DATA
 * } from './dashboard-index';
 *
 * export function MyDashboard() {
 *   return (
 *     <div className="p-6 space-y-6 bg-slate-100 min-h-screen">
 *       <KpiMetricCard data={PLACEHOLDER_KPI_DATA} />
 *       <GeographicBarChart data={PLACEHOLDER_BAR_DATA} />
 *     </div>
 *   );
 * }
 * ```
 *
 * ----------------------------------------------------------------------------
 * WIRING TO LIVE DATA (PostgreSQL / Express API)
 * ----------------------------------------------------------------------------
 * ```tsx
 * const [kpi, setKpi] = useState(PLACEHOLDER_KPI_DATA);
 *
 * useEffect(() => {
 *   fetch('/api/metrics/revenue', { headers: { Authorization: `Bearer ${token}` } })
 *     .then(res => res.json())
 *     .then(data => setKpi({
 *       id: 'kpi-live',
 *       title: 'Total Gross Revenue',
 *       label: 'TOTAL REVENUE',
 *       value: data.total,
 *       formattedValue: `$${(data.total / 1000).toFixed(1)}k`,
 *       sparklineData: data.trendPoints,
 *       sparklineColor: '#10b981'
 *     }));
 * }, []);
 * ```
 */

// Export Data Schemas & Styling Tokens
export * from './types.ts';

// Export Modular Reusable Preview Components
export * from './components.tsx';

// Export Pre-Built Layout Templates
export * from './templates.tsx';

// Export Interactive Index Explorer Component
export { DashboardIndex } from './DashboardIndex.tsx';
