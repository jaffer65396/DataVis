import React, { useRef, useEffect } from 'react';
import { DashboardPage, DashboardElement, ThemeConfig } from '../../types/project';
import { Dataset } from '../../types/data';
import { CanvasElementWrapper } from './CanvasElementWrapper';
import { UniversalChartRenderer } from '../charts/UniversalChartRenderer';
import { KpiCardComponent } from '../elements/KpiCardComponent';
import { DataTableComponent } from '../elements/DataTableComponent';
import { TextComponent, ShapeComponent } from '../elements/TextShapeComponent';
import { FilterControlComponent } from '../elements/FilterControlComponent';
import { Plus, Copy, Trash2, XCircle } from 'lucide-react';

interface Props {
  page: DashboardPage;
  pages: DashboardPage[];
  activePageId: string;
  datasets: Dataset[];
  theme: ThemeConfig;
  selectedElementId: string | null;
  activeFilters: Record<string, any>;
  crossFilter: { column?: string; value?: any } | null;
  zoomLevel: number;
  onSelectElement: (id: string | null) => void;
  onUpdateElementPosition: (id: string, x: number, y: number) => void;
  onUpdateElementSize: (id: string, width: number, height: number) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onToggleLockElement: (id: string) => void;
  onChangeZIndex: (id: string, delta: number) => void;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDuplicatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onFilterChange: (column: string, value: any) => void;
  onCrossFilterSelect: (column: string, value: any) => void;
  onClearCrossFilter: () => void;
}

export const DashboardCanvas: React.FC<Props> = ({
  page,
  pages,
  activePageId,
  datasets,
  theme,
  selectedElementId,
  activeFilters,
  crossFilter,
  zoomLevel,
  onSelectElement,
  onUpdateElementPosition,
  onUpdateElementSize,
  onDuplicateElement,
  onDeleteElement,
  onToggleLockElement,
  onChangeZIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onFilterChange,
  onCrossFilterSelect,
  onClearCrossFilter,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener (Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectElement(null);
      } else if (e.key === 'Delete' && selectedElementId) {
        // Prevent deleting if focus is inside an input or textarea
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          onDeleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, onDeleteElement, onSelectElement]);

  const renderElementContent = (el: DashboardElement) => {
    switch (el.type) {
      case 'chart':
        return el.chartConfig ? (
          <UniversalChartRenderer
            config={el.chartConfig}
            datasets={datasets}
            activeFilters={activeFilters}
            crossFilter={crossFilter}
            onSelectPoint={(col, val) => onCrossFilterSelect(col, val)}
            themeColors={theme.chartPalette}
          />
        ) : null;

      case 'kpi':
        return el.kpiConfig ? (
          <KpiCardComponent
            config={el.kpiConfig}
            datasets={datasets}
            activeFilters={activeFilters}
            crossFilter={crossFilter}
          />
        ) : null;

      case 'table':
        return el.tableConfig ? (
          <DataTableComponent
            config={el.tableConfig}
            datasets={datasets}
            activeFilters={activeFilters}
            crossFilter={crossFilter}
          />
        ) : null;

      case 'text':
        return el.textConfig ? <TextComponent config={el.textConfig} /> : null;

      case 'shape':
        return el.shapeConfig ? <ShapeComponent config={el.shapeConfig} /> : null;

      case 'filter':
        return el.filterConfig ? (
          <FilterControlComponent
            config={el.filterConfig}
            datasets={datasets}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
          />
        ) : null;

      default:
        return <div className="p-4 text-xs text-slate-400">Unknown element</div>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-100">
      {/* Top Page Tabs & Cross-filter indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-1.5 shadow-xs">
        {/* Page Switcher */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {pages.map((p) => {
            const isActive = p.id === activePageId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPage(p.id)}
                className={`group flex cursor-pointer items-center space-x-2 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{p.title}</span>
                {isActive && pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(p.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-600"
                    title="Delete page"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicatePage(p.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-blue-600"
                    title="Duplicate page"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={onAddPage}
            className="flex items-center space-x-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            title="Add Page"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Page</span>
          </button>
        </div>

        {/* Cross Filter Active Indicator Banner */}
        {crossFilter && (
          <div className="flex items-center space-x-2 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
            <span>
              Filtered by: <span className="font-bold">{crossFilter.column} = {String(crossFilter.value)}</span>
            </span>
            <button
              onClick={onClearCrossFilter}
              className="rounded-full p-0.5 hover:bg-amber-100"
              title="Clear cross-filter"
            >
              <XCircle className="h-3.5 w-3.5 text-amber-600" />
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Scroll Area */}
      <div
        ref={canvasRef}
        onClick={(e) => {
          // If clicked directly on canvas background, deselect
          if (e.target === canvasRef.current || (e.target as HTMLElement).id === 'canvas-board') {
            onSelectElement(null);
          }
        }}
        className="relative flex-1 overflow-auto p-6"
      >
        <div
          id="canvas-board"
          style={{
            width: `${page.canvasWidth}px`,
            minHeight: `${page.canvasHeight}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            backgroundColor: page.backgroundColor || theme.backgroundColor,
            backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
          className="relative mx-auto rounded-xl border border-slate-300 shadow-xl transition-transform"
        >
          {page.elements.map((element) => (
            <CanvasElementWrapper
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              theme={theme}
              onSelect={(e) => {
                e.stopPropagation();
                onSelectElement(element.id);
              }}
              onUpdatePosition={onUpdateElementPosition}
              onUpdateSize={onUpdateElementSize}
              onDuplicate={onDuplicateElement}
              onDelete={onDeleteElement}
              onToggleLock={onToggleLockElement}
              onChangeZIndex={onChangeZIndex}
            >
              {renderElementContent(element)}
            </CanvasElementWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};
