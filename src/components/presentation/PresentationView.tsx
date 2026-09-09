import React from 'react';
import { DashboardProject, ThemeConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { UniversalChartRenderer } from '../charts/UniversalChartRenderer';
import { KpiCardComponent } from '../elements/KpiCardComponent';
import { DataTableComponent } from '../elements/DataTableComponent';
import { TextComponent, ShapeComponent } from '../elements/TextShapeComponent';
import { FilterControlComponent } from '../elements/FilterControlComponent';
import { X, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

interface Props {
  project: DashboardProject;
  theme: ThemeConfig;
  datasets: Dataset[];
  activePageId: string;
  activeFilters: Record<string, any>;
  crossFilter: { column?: string; value?: any } | null;
  onSelectPage: (id: string) => void;
  onFilterChange: (col: string, val: any) => void;
  onCrossFilterSelect: (col: string, val: any) => void;
  onClearCrossFilter: () => void;
  onExit: () => void;
}

export const PresentationView: React.FC<Props> = ({
  project,
  theme,
  datasets,
  activePageId,
  activeFilters,
  crossFilter,
  onSelectPage,
  onFilterChange,
  onCrossFilterSelect,
  onClearCrossFilter,
  onExit,
}) => {
  const activePage = project.pages.find((p) => p.id === activePageId) || project.pages[0];

  return (
    <div
      style={{ backgroundColor: activePage.backgroundColor || theme.backgroundColor }}
      className="fixed inset-0 z-50 flex flex-col select-none overflow-hidden"
    >
      {/* Presentation Top Floating Toolbar */}
      <div className="flex h-12 w-full items-center justify-between border-b border-slate-200/40 bg-white/90 px-6 backdrop-blur-md shadow-xs">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-sm tracking-tight text-slate-900">
            {project.name}
          </span>

          {/* Page switch tabs */}
          <div className="flex items-center space-x-1">
            {project.pages.map((p) => {
              const isCurrent = p.id === activePageId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPage(p.id)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    isCurrent ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Cross-filter indicator */}
        {crossFilter && (
          <div className="flex items-center space-x-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
            <span>
              Filtered by: <span className="font-bold">{crossFilter.column} = {String(crossFilter.value)}</span>
            </span>
            <button onClick={onClearCrossFilter} className="rounded-full p-0.5 hover:bg-amber-100">
              <XCircle className="h-3.5 w-3.5 text-amber-600" />
            </button>
          </div>
        )}

        {/* Right: Exit Presentation Mode */}
        <button
          onClick={onExit}
          className="flex items-center space-x-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          <span>Exit Presentation</span>
        </button>
      </div>

      {/* Main Presentation Surface */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        <div
          style={{
            width: `${activePage.canvasWidth}px`,
            minHeight: `${activePage.canvasHeight}px`,
            backgroundColor: theme.cardBackgroundColor,
          }}
          className="relative rounded-2xl border border-slate-200 shadow-2xl p-6"
        >
          {activePage.elements.map((el) => {
            if (el.hidden) return null;
            const isTransparent = el.type === 'text' || el.type === 'shape';

            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  zIndex: el.zIndex,
                }}
              >
                <div
                  style={{
                    backgroundColor: isTransparent ? 'transparent' : theme.cardBackgroundColor,
                    borderColor: isTransparent ? 'transparent' : theme.cardBorderColor,
                    borderRadius: isTransparent ? '0px' : '10px',
                  }}
                  className={`flex h-full w-full flex-col overflow-hidden ${
                    isTransparent ? '' : 'border shadow-xs'
                  }`}
                >
                  {/* Element Title */}
                  {el.type !== 'text' && el.type !== 'shape' && (
                    <div className="flex h-8 w-full items-center border-b border-slate-100 px-3 font-semibold text-[11px] text-slate-700">
                      {el.title}
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="flex-1 overflow-hidden">
                    {el.type === 'chart' && el.chartConfig && (
                      <UniversalChartRenderer
                        config={el.chartConfig}
                        datasets={datasets}
                        activeFilters={activeFilters}
                        crossFilter={crossFilter}
                        onSelectPoint={(col, val) => onCrossFilterSelect(col, val)}
                        themeColors={theme.chartPalette}
                      />
                    )}
                    {el.type === 'kpi' && el.kpiConfig && (
                      <KpiCardComponent
                        config={el.kpiConfig}
                        datasets={datasets}
                        activeFilters={activeFilters}
                        crossFilter={crossFilter}
                      />
                    )}
                    {el.type === 'table' && el.tableConfig && (
                      <DataTableComponent
                        config={el.tableConfig}
                        datasets={datasets}
                        activeFilters={activeFilters}
                        crossFilter={crossFilter}
                      />
                    )}
                    {el.type === 'text' && el.textConfig && <TextComponent config={el.textConfig} />}
                    {el.type === 'shape' && el.shapeConfig && <ShapeComponent config={el.shapeConfig} />}
                    {el.type === 'filter' && el.filterConfig && (
                      <FilterControlComponent
                        config={el.filterConfig}
                        datasets={datasets}
                        activeFilters={activeFilters}
                        onFilterChange={onFilterChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
