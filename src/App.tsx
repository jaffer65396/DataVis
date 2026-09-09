import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DashboardProject,
  DashboardPage,
  DashboardElement,
  ElementType,
  ChartType,
  ProjectVersion,
} from './types/project';
import { Dataset } from './types/data';
import { INITIAL_DATASETS } from './data/sampleDatasets';
import {
  createDefaultProject,
  BUILTIN_THEMES,
} from './data/starterTemplates';
import { Header } from './components/layout/Header';
import { StatusBar } from './components/layout/StatusBar';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { PropertiesPanel } from './components/sidebar/PropertiesPanel';
import { DashboardCanvas } from './components/canvas/DashboardCanvas';
import { DataPrepView } from './components/views/DataPrepView';
import { DataSourceModal } from './components/modals/DataSourceModal';
import { ExportModal } from './components/modals/ExportModal';
import { ShareModal } from './components/modals/ShareModal';
import { VersionHistoryModal } from './components/modals/VersionHistoryModal';
import { TemplatesModal } from './components/modals/TemplatesModal';
import { PresentationView } from './components/presentation/PresentationView';
import { DashboardIndex } from './dashboard-index/DashboardIndex.tsx';
import { useAuth } from './context/AuthContext.tsx';
import {
  saveProjectToDb,
  loadProjectsFromDb,
  saveDatasetToDb,
  loadDatasetsFromDb,
  saveProjectVersionToDb,
} from './services/api.ts';

const STORAGE_KEY = 'dataviz_studio_project_v1';
const DATASETS_KEY = 'dataviz_studio_datasets_v1';

export default function App() {
  // 1. Initial State from localStorage or defaults
  const [project, setProject] = useState<DashboardProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return createDefaultProject();
  });

  const [datasets, setDatasets] = useState<Dataset[]>(() => {
    try {
      const saved = localStorage.getItem(DATASETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_DATASETS;
  });

  // Undo / Redo history
  const [history, setHistory] = useState<DashboardProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Active view
  const [activeView, setActiveView] = useState<'canvas' | 'dataprep' | 'templates' | 'index'>('canvas');
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Canvas selection & interactive filters
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [crossFilter, setCrossFilter] = useState<{ column?: string; value?: any } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSaved, setIsSaved] = useState(true);

  // Cloud Auth & Database State
  const { user, token } = useAuth();
  const [hasSyncedRemote, setHasSyncedRemote] = useState(false);

  // Modals
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  // Active theme
  const currentTheme = useMemo(() => {
    return BUILTIN_THEMES.find((t) => t.id === project.themeId) || BUILTIN_THEMES[0];
  }, [project.themeId]);

  // Active page
  const activePage = useMemo(() => {
    return project.pages.find((p) => p.id === project.activePageId) || project.pages[0];
  }, [project.pages, project.activePageId]);

  // Selected element
  const selectedElement = useMemo(() => {
    if (!selectedElementId) return null;
    return activePage.elements.find((el) => el.id === selectedElementId) || null;
  }, [activePage.elements, selectedElementId]);

  // Initial Sync from Cloud SQL upon authentication
  useEffect(() => {
    if (!token) return;
    let isCancelled = false;

    async function syncRemoteData() {
      try {
        const [dbProjects, dbDatasets] = await Promise.all([
          loadProjectsFromDb(token),
          loadDatasetsFromDb(token),
        ]);

        if (isCancelled) return;

        if (dbProjects && dbProjects.length > 0) {
          setProject(dbProjects[0]);
        } else {
          // Persist current project to PostgreSQL
          await saveProjectToDb(project, token);
        }

        if (dbDatasets && dbDatasets.length > 0) {
          setDatasets(dbDatasets);
        } else {
          // Seed initial datasets to PostgreSQL
          for (const ds of datasets) {
            await saveDatasetToDb(ds, token, project.id);
          }
        }
        setHasSyncedRemote(true);
      } catch (err) {
        console.error('Remote DB sync error:', err);
      }
    }

    syncRemoteData();
    return () => {
      isCancelled = true;
    };
  }, [token]);

  // Autosave to localStorage & Cloud SQL Database
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
        localStorage.setItem(DATASETS_KEY, JSON.stringify(datasets));

        if (token) {
          await saveProjectToDb(project, token);
          for (const ds of datasets) {
            await saveDatasetToDb(ds, token, project.id);
          }
        }
        setIsSaved(true);
      } catch (err) {
        console.error('Autosave error:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [project, datasets, token]);

  // Push project mutation to history
  const updateProject = useCallback((newProject: DashboardProject) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), project]);
    setHistoryIndex((prev) => prev + 1);
    setProject(newProject);
  }, [project, historyIndex]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex >= 0) {
      const prev = history[historyIndex];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
    }
  };

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // Page Actions
  const handleSelectPage = (id: string) => {
    setProject((prev) => ({ ...prev, activePageId: id }));
    setSelectedElementId(null);
  };

  const handleAddPage = () => {
    const newPageNum = project.pages.length + 1;
    const newPage: DashboardPage = {
      id: `page_${Date.now()}`,
      title: `Page ${newPageNum}`,
      canvasWidth: 1280,
      canvasHeight: 900,
      backgroundColor: currentTheme.backgroundColor,
      elements: [],
    };
    updateProject({
      ...project,
      pages: [...project.pages, newPage],
      activePageId: newPage.id,
    });
  };

  const handleDuplicatePage = (pageId: string) => {
    const target = project.pages.find((p) => p.id === pageId);
    if (!target) return;
    const duplicated: DashboardPage = {
      ...target,
      id: `page_${Date.now()}`,
      title: `${target.title} (Copy)`,
      elements: target.elements.map((el) => ({ ...el, id: `el_${Date.now()}_${Math.random()}` })),
    };
    updateProject({
      ...project,
      pages: [...project.pages, duplicated],
      activePageId: duplicated.id,
    });
  };

  const handleDeletePage = (pageId: string) => {
    if (project.pages.length <= 1) return;
    const filtered = project.pages.filter((p) => p.id !== pageId);
    updateProject({
      ...project,
      pages: filtered,
      activePageId: filtered[0].id,
    });
  };

  // Element Actions
  const handleAddElement = (type: ElementType, chartType?: ChartType) => {
    const defaultDs = datasets[0];
    const defaultCol = defaultDs?.columns[0]?.name || 'Category';
    const measureCol = defaultDs?.columns.find((c) => c.type === 'number')?.name || 'Revenue';

    // Position new element in a free spot or centered
    const count = activePage.elements.length;
    const x = 24 + ((count % 3) * 320);
    const y = 80 + Math.floor(count / 3) * 220;

    let width = 360;
    let height = 240;

    const newElement: DashboardElement = {
      id: `el_${Date.now()}`,
      type,
      title: type === 'chart' ? `${chartType?.replace('_', ' ').toUpperCase()} Visual` : `New ${type.toUpperCase()}`,
      x,
      y,
      width,
      height,
      zIndex: count + 1,
      locked: false,
      hidden: false,
    };

    if (type === 'chart') {
      newElement.width = 460;
      newElement.height = 300;
      newElement.chartConfig = {
        chartType: chartType || 'bar_vertical',
        datasetId: defaultDs.id,
        xAxisColumn: defaultCol,
        yAxisColumn: measureCol,
        aggregation: 'SUM',
        showLegend: true,
        showGrid: true,
        showLabels: true,
        colorPalette: currentTheme.chartPalette,
        donutHoleSize: 55,
      };
    } else if (type === 'kpi') {
      newElement.width = 280;
      newElement.height = 130;
      newElement.kpiConfig = {
        datasetId: defaultDs.id,
        measureColumn: measureCol,
        aggregation: 'SUM',
        prefix: '$',
        decimals: 0,
        showSparkline: true,
        title: measureCol,
        subtitle: 'Enterprise metric',
        deltaType: 'percentage',
      };
    } else if (type === 'table') {
      newElement.width = 600;
      newElement.height = 280;
      newElement.tableConfig = {
        datasetId: defaultDs.id,
        columns: defaultDs.columns.map((c) => c.name).slice(0, 5),
        pageSize: 5,
        enableSearch: true,
        enableSort: true,
        showTotals: true,
        colorScaleColumn: measureCol,
        colorScaleType: 'green',
      };
    } else if (type === 'text') {
      newElement.width = 400;
      newElement.height = 60;
      newElement.textConfig = {
        content: 'Executive Performance Summary',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        textColor: currentTheme.textColor,
        isHeader: true,
      };
    } else if (type === 'shape') {
      newElement.width = 300;
      newElement.height = 150;
      newElement.shapeConfig = {
        shapeType: 'rounded_rectangle',
        fillColor: '#3b82f6',
        borderRadius: 8,
        opacity: 0.1,
      };
    } else if (type === 'filter') {
      newElement.width = 220;
      newElement.height = 50;
      newElement.filterConfig = {
        datasetId: defaultDs.id,
        targetColumn: defaultCol,
        filterType: 'select',
        label: defaultCol,
        currentValue: 'ALL',
      };
    }

    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, elements: [...p.elements, newElement] };
      }
      return p;
    });

    updateProject({ ...project, pages: updatedPages });
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElementPosition = (id: string, x: number, y: number) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === id ? { ...el, x, y } : el)),
        };
      }
      return p;
    });
    setProject({ ...project, pages: updatedPages });
  };

  const handleUpdateElementSize = (id: string, width: number, height: number) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === id ? { ...el, width, height } : el)),
        };
      }
      return p;
    });
    setProject({ ...project, pages: updatedPages });
  };

  const handleDuplicateElement = (id: string) => {
    const target = activePage.elements.find((el) => el.id === id);
    if (!target) return;
    const duplicated: DashboardElement = {
      ...target,
      id: `el_${Date.now()}`,
      title: `${target.title} (Copy)`,
      x: target.x + 24,
      y: target.y + 24,
      zIndex: target.zIndex + 1,
    };
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, elements: [...p.elements, duplicated] };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
    setSelectedElementId(duplicated.id);
  };

  const handleDeleteElement = (id: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, elements: p.elements.filter((el) => el.id !== id) };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleToggleLockElement = (id: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el)),
        };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
  };

  const handleToggleHideElement = (id: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === id ? { ...el, hidden: !el.hidden } : el)),
        };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
  };

  const handleChangeZIndex = (id: string, delta: number) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) =>
            el.id === id ? { ...el, zIndex: Math.max(1, el.zIndex + delta) } : el
          ),
        };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
  };

  const handleUpdateElement = (updated: DashboardElement) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          elements: p.elements.map((el) => (el.id === updated.id ? updated : el)),
        };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
  };

  const handleChangeTheme = (themeId: string) => {
    updateProject({ ...project, themeId });
  };

  const handleUpdateCanvasSize = (canvasWidth: number, canvasHeight: number) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, canvasWidth, canvasHeight };
      }
      return p;
    });
    updateProject({ ...project, pages: updatedPages });
  };

  // Filters & Cross Filtering
  const handleFilterChange = (column: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [column]: value }));
  };

  const handleCrossFilterSelect = (column: string, value: any) => {
    if (crossFilter?.column === column && crossFilter?.value === value) {
      setCrossFilter(null);
    } else {
      setCrossFilter({ column, value });
    }
  };

  // Versioning
  const handleCreateVersion = async (summary: string) => {
    const newVer: ProjectVersion = {
      id: `ver_${Date.now()}`,
      versionNumber: (project.versions.length || 0) + 1,
      timestamp: new Date().toISOString(),
      author: user?.displayName || user?.email || 'User',
      changeSummary: summary,
      snapshotJson: JSON.stringify(project),
    };
    updateProject({
      ...project,
      versions: [...project.versions, newVer],
    });

    if (token) {
      try {
        await saveProjectVersionToDb(project.id, newVer, token);
      } catch (err) {
        console.error('Failed to save version to database:', err);
      }
    }
  };

  const handleRestoreVersion = (ver: ProjectVersion) => {
    if (!ver.snapshotJson) return;
    try {
      const restored = JSON.parse(ver.snapshotJson);
      updateProject(restored);
      setIsVersionModalOpen(false);
      alert(`Restored Version ${ver.versionNumber} successfully!`);
    } catch {
      alert('Failed to restore version snapshot');
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased">
      {/* 1. Header Toolbar */}
      <Header
        projectName={project.name}
        isSaved={isSaved}
        activeView={activeView}
        onRenameProject={(newName) => updateProject({ ...project, name: newName })}
        onSelectView={(v) => {
          if (v === 'templates') setIsTemplatesModalOpen(true);
          else setActiveView(v);
        }}
        onOpenDataSourcesModal={() => setIsDataSourceModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onTogglePresentationMode={() => setIsPresentationMode(true)}
        onSaveProject={() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
          setIsSaved(true);
        }}
      />

      {/* 2. Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {activeView === 'canvas' && (
          <>
            {/* Left Sidebar: Palette & Layers */}
            <LeftSidebar
              datasets={datasets}
              elements={activePage.elements}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onAddElement={handleAddElement}
              onToggleHideElement={handleToggleHideElement}
              onToggleLockElement={handleToggleLockElement}
              onDeleteElement={handleDeleteElement}
              onOpenDataSourcesModal={() => setIsDataSourceModalOpen(true)}
              onOpenDataPrepModal={() => setActiveView('dataprep')}
            />

            {/* Center: Dashboard Canvas */}
            <div className="flex-1 overflow-hidden">
              <DashboardCanvas
                page={activePage}
                pages={project.pages}
                activePageId={project.activePageId}
                datasets={datasets}
                theme={currentTheme}
                selectedElementId={selectedElementId}
                activeFilters={activeFilters}
                crossFilter={crossFilter}
                zoomLevel={zoomLevel}
                onSelectElement={setSelectedElementId}
                onUpdateElementPosition={handleUpdateElementPosition}
                onUpdateElementSize={handleUpdateElementSize}
                onDuplicateElement={handleDuplicateElement}
                onDeleteElement={handleDeleteElement}
                onToggleLockElement={handleToggleLockElement}
                onChangeZIndex={handleChangeZIndex}
                onSelectPage={handleSelectPage}
                onAddPage={handleAddPage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                onFilterChange={handleFilterChange}
                onCrossFilterSelect={handleCrossFilterSelect}
                onClearCrossFilter={() => setCrossFilter(null)}
              />
            </div>

            {/* Right: Properties Inspector */}
            <PropertiesPanel
              selectedElement={selectedElement}
              datasets={datasets}
              theme={currentTheme}
              canvasWidth={activePage.canvasWidth}
              canvasHeight={activePage.canvasHeight}
              onUpdateElement={handleUpdateElement}
              onChangeTheme={handleChangeTheme}
              onUpdateCanvasSize={handleUpdateCanvasSize}
            />
          </>
        )}

        {/* Data Prep View */}
        {activeView === 'dataprep' && (
          <DataPrepView
            datasets={datasets}
            onUpdateDataset={(updated) => {
              setDatasets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
            }}
            onClose={() => setActiveView('canvas')}
          />
        )}

        {/* Component Index & Consolidated Catalog View */}
        {activeView === 'index' && (
          <DashboardIndex onClose={() => setActiveView('canvas')} />
        )}
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar
        activeDataset={datasets[0]}
        elementCount={activePage.elements.length}
        canvasWidth={activePage.canvasWidth}
        canvasHeight={activePage.canvasHeight}
        zoomLevel={zoomLevel}
        onUpdateZoom={setZoomLevel}
        onRefreshData={() => {
          // Bumps timestamp & triggers fresh calculation
          setProject((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
        }}
      />

      {/* 4. Presentation Fullscreen Overlay */}
      {isPresentationMode && (
        <PresentationView
          project={project}
          theme={currentTheme}
          datasets={datasets}
          activePageId={project.activePageId}
          activeFilters={activeFilters}
          crossFilter={crossFilter}
          onSelectPage={handleSelectPage}
          onFilterChange={handleFilterChange}
          onCrossFilterSelect={handleCrossFilterSelect}
          onClearCrossFilter={() => setCrossFilter(null)}
          onExit={() => setIsPresentationMode(false)}
        />
      )}

      {/* 5. Modals */}
      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        onAddDataset={(newDs) => {
          setDatasets((prev) => [newDs, ...prev]);
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        activePage={activePage}
        datasets={datasets}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectName={project.name}
      />

      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={project.versions}
        onCreateVersion={handleCreateVersion}
        onRestoreVersion={handleRestoreVersion}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onApplyTemplate={(tmpl) => {
          updateProject(tmpl);
          setActiveView('canvas');
        }}
      />
    </div>
  );
}
