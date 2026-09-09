export type ElementType = 
  | 'chart'
  | 'kpi'
  | 'table'
  | 'text'
  | 'shape'
  | 'image'
  | 'filter'
  | 'divider';

export type ChartType =
  | 'bar_vertical'
  | 'bar_horizontal'
  | 'bar_grouped'
  | 'bar_stacked'
  | 'line'
  | 'line_curved'
  | 'line_area'
  | 'line_stacked_area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'funnel'
  | 'heatmap'
  | 'waterfall'
  | 'treemap'
  | 'candlestick'
  | 'gauge';

export interface ChartConfig {
  chartType: ChartType;
  datasetId: string;
  xAxisColumn: string;
  yAxisColumn: string;
  secondaryYAxisColumn?: string;
  groupByColumn?: string;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'NONE';
  secondaryAggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  showLegend: boolean;
  showGrid: boolean;
  showLabels: boolean;
  colorPalette: string[];
  donutHoleSize?: number;
  curveType?: 'linear' | 'monotone' | 'step';
  xAxisTitle?: string;
  yAxisTitle?: string;
  targetValue?: number; // for gauge
  maxGaugeValue?: number;
}

export interface KpiConfig {
  datasetId: string;
  measureColumn: string;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'LAST';
  comparisonColumn?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  showSparkline: boolean;
  sparklineDateColumn?: string;
  deltaType?: 'percentage' | 'absolute';
  deltaInvertColor?: boolean; // e.g. lower churn is good
  title: string;
  subtitle?: string;
}

export interface TableConfig {
  datasetId: string;
  columns: string[];
  columnAliases?: Record<string, string>;
  pageSize: number;
  enableSearch: boolean;
  enableSort: boolean;
  showTotals: boolean;
  colorScaleColumn?: string;
  colorScaleType?: 'green' | 'blue' | 'red';
}

export interface TextConfig {
  content: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  backgroundColor?: string;
  isHeader?: boolean;
}

export interface ShapeConfig {
  shapeType: 'rectangle' | 'rounded_rectangle' | 'circle' | 'arrow' | 'badge';
  fillColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  text?: string;
  textColor?: string;
}

export interface FilterConfig {
  datasetId: string;
  targetColumn: string;
  filterType: 'select' | 'multi_select' | 'slider' | 'search' | 'date_range';
  label: string;
  currentValue?: any;
}

export interface DashboardElement {
  id: string;
  type: ElementType;
  title: string;
  x: number; // in pixels or grid units
  y: number;
  width: number;
  height: number;
  zIndex: number;
  locked: boolean;
  hidden: boolean;
  chartConfig?: ChartConfig;
  kpiConfig?: KpiConfig;
  tableConfig?: TableConfig;
  textConfig?: TextConfig;
  shapeConfig?: ShapeConfig;
  filterConfig?: FilterConfig;
}

export interface DashboardPage {
  id: string;
  title: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  elements: DashboardElement[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  textColor: string;
  mutedTextColor: string;
  chartPalette: string[];
  fontFamily: string;
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  author: string;
  changeSummary: string;
  snapshotJson: string;
}

export interface DashboardProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activePageId: string;
  themeId: string;
  pages: DashboardPage[];
  datasets: string[]; // dataset IDs included
  versions: ProjectVersion[];
}
