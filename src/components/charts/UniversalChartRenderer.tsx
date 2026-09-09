import React, { useMemo } from 'react';
import { ChartConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { aggregateChartData } from '../../engine/dataEngine';
import { BarChartComponent } from './BarChartComponent';
import { LineAreaChartComponent } from './LineAreaChartComponent';
import { PieDonutChartComponent } from './PieDonutChartComponent';
import {
  RadarChartComponent,
  TreemapChartComponent,
  CandlestickChartComponent,
  ScatterBubbleChartComponent,
} from './AdvancedChartsComponent';

interface Props {
  config: ChartConfig;
  datasets: Dataset[];
  activeFilters: Record<string, any>;
  crossFilter: { column?: string; value?: any } | null;
  onSelectPoint?: (dimension: string, value: any) => void;
  themeColors?: string[];
}

export const UniversalChartRenderer: React.FC<Props> = ({
  config,
  datasets,
  activeFilters,
  crossFilter,
  onSelectPoint,
  themeColors,
}) => {
  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === config.datasetId) || datasets[0];
  }, [datasets, config.datasetId]);

  const chartData = useMemo(() => {
    if (!currentDataset) return [];
    return aggregateChartData(currentDataset.data, config, activeFilters, crossFilter);
  }, [currentDataset, config, activeFilters, crossFilter]);

  if (!currentDataset) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4 text-xs text-slate-400">
        No dataset bound to this chart
      </div>
    );
  }

  const { chartType } = config;

  switch (chartType) {
    case 'bar_vertical':
    case 'bar_horizontal':
    case 'bar_grouped':
    case 'bar_stacked':
      return (
        <BarChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );

    case 'line':
    case 'line_curved':
    case 'line_area':
    case 'line_stacked_area':
      return (
        <LineAreaChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );

    case 'pie':
    case 'donut':
      return (
        <PieDonutChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );

    case 'radar':
      return (
        <RadarChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );

    case 'treemap':
      return (
        <TreemapChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );

    case 'candlestick':
      return (
        <CandlestickChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
        />
      );

    case 'scatter':
    case 'bubble':
      return (
        <ScatterBubbleChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          themeColors={themeColors}
        />
      );

    default:
      return (
        <BarChartComponent
          data={chartData}
          config={config}
          onSelectPoint={onSelectPoint}
          selectedPoint={crossFilter}
          themeColors={themeColors}
        />
      );
  }
};
