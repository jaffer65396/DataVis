/**
 * DataViz Studio - Dashboard Index & Component Library Specification
 * Standardized Data Schemas, Styling Tokens, and Layout Types
 */

// ==========================================
// 1. STYLING TOKENS & DESIGN VARIABLES
// ==========================================

export interface ColorPalette {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  chartColors: string[];
}

export const STYLING_VARIABLES = {
  // Theme Presets matching image
  themes: {
    corporateSlate: {
      id: 'corporate-slate',
      name: 'Corporate Slate',
      primary: '#2563eb', // Blue 600
      primaryHover: '#1d4ed8',
      secondary: '#0ea5e9', // Sky 500
      accent: '#8b5cf6', // Purple 500
      background: '#f1f5f9', // Slate 100
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0', // Slate 200
      textPrimary: '#0f172a', // Slate 900
      textSecondary: '#475569', // Slate 600
      textMuted: '#94a3b8', // Slate 400
      chartColors: ['#3b82f6', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'],
    },
    obsidianMidnight: {
      id: 'obsidian-midnight',
      name: 'Obsidian Midnight',
      primary: '#38bdf8',
      primaryHover: '#0284c7',
      secondary: '#818cf8',
      accent: '#f43f5e',
      background: '#0b0f19',
      cardBg: '#111827',
      cardBorder: '#1f2937',
      textPrimary: '#f9fafb',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',
      chartColors: ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f43f5e'],
    },
    emeraldFinTech: {
      id: 'emerald-fintech',
      name: 'Emerald FinTech',
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#10b981',
      accent: '#0284c7',
      background: '#f0fdf4',
      cardBg: '#ffffff',
      cardBorder: '#d1fae5',
      textPrimary: '#064e3b',
      textSecondary: '#047857',
      textMuted: '#6ee7b7',
      chartColors: ['#059669', '#10b981', '#34d399', '#06b6d4', '#6366f1'],
    },
    warmBronze: {
      id: 'warm-bronze',
      name: 'Warm Bronze',
      primary: '#d97706',
      primaryHover: '#b45309',
      secondary: '#f59e0b',
      accent: '#0d9488',
      background: '#fffbeb',
      cardBg: '#ffffff',
      cardBorder: '#fde68a',
      textPrimary: '#78350f',
      textSecondary: '#92400e',
      textMuted: '#b45309',
      chartColors: ['#d97706', '#f59e0b', '#fbbf24', '#14b8a6', '#0284c7'],
    },
  },

  // Typography Scale
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    display: { fontSize: '1.75rem', fontWeight: 700, lineHeight: '2.25rem' }, // 28px
    title: { fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.75rem' }, // 20px
    subtitle: { fontSize: '1rem', fontWeight: 500, lineHeight: '1.5rem' }, // 16px
    body: { fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.25rem' }, // 14px
    caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: '1rem' }, // 12px
    badge: { fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.05em' }, // 10px
  },

  // Spacing & Layout Grid
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // Border Radii
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Standard Breakpoints for Responsive Behavior
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ==========================================
// 2. STANDARDIZED DATA SCHEMAS
// ==========================================

/**
 * Metric KPI Card Data Schema
 * Connects directly to real-time aggregations or summary endpoints
 */
export interface KpiMetricSchema {
  id: string;
  title: string; // e.g. "TOTAL GROSS REVENUE"
  label: string; // e.g. "TOTAL REVENUE"
  value: number; // e.g. 612700
  formattedValue?: string; // e.g. "$612.7k"
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "k"
  trendDirection?: 'up' | 'down' | 'neutral';
  trendPercentage?: number; // e.g. +14.2%
  sparklineData: number[]; // Array of trendline data points
  sparklineColor?: string; // Hex color or CSS variable
}

/**
 * Categorical Bar Chart Data Schema
 * Connects to grouped regional sales, category breakdowns, or time buckets
 */
export interface BarSeriesItem {
  label: string; // e.g. "North America", "EMEA"
  value: number; // e.g. 200400
  formattedValue?: string; // e.g. "200.4k"
  color?: string; // Bar fill color
  secondaryValue?: number; // Optional comparison target
}

export interface BarChartSchema {
  id: string;
  title: string; // e.g. "Revenue by Geographic Region"
  yAxisMin: number; // e.g. 50100
  yAxisMax: number; // e.g. 200400
  yAxisStep: number; // e.g. 50100
  series: BarSeriesItem[];
}

/**
 * Canvas Layout Configuration Schema
 */
export interface CanvasConfigSchema {
  width: number; // e.g. 1280
  height: number; // e.g. 900
  gridSize: number; // e.g. 20 (px between dots)
  showGrid: boolean;
  activeThemeId: string;
  activePageTitle: string;
  pages: { id: string; title: string; isActive: boolean }[];
}

// ==========================================
// 3. PLACEHOLDER / DEFAULT DATASETS
// ==========================================

export const PLACEHOLDER_KPI_DATA: KpiMetricSchema = {
  id: 'kpi-gross-revenue',
  title: 'Total Gross Revenue',
  label: 'TOTAL REVENUE',
  value: 612700,
  formattedValue: '$612.7k',
  prefix: '$',
  suffix: 'k',
  trendDirection: 'up',
  trendPercentage: 12.4,
  // Coordinates for the exact sparkline curve displayed in the image
  sparklineData: [45, 42, 60, 48, 55, 38, 46],
  sparklineColor: '#10b981', // Emerald green
};

export const PLACEHOLDER_BAR_DATA: BarChartSchema = {
  id: 'chart-geo-revenue',
  title: 'Revenue by Geographic Region',
  yAxisMin: 50100,
  yAxisMax: 200400,
  yAxisStep: 50100,
  series: [
    {
      label: 'North America',
      value: 200400,
      formattedValue: '200.4k',
      color: '#3b82f6', // Rich blue
    },
    {
      label: 'Europe / APAC',
      value: 195300,
      formattedValue: '195.3k',
      color: '#38bdf8', // Cyan / Light Blue
    },
  ],
};

export const PLACEHOLDER_PAGES = [
  { id: 'page-1', title: 'Executive Overview', isActive: true },
  { id: 'page-2', title: 'Profitability & Margins', isActive: false },
];
