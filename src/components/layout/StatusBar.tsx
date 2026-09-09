import React, { useState } from 'react';
import { Dataset } from '../../types/data';
import { RefreshCw, ZoomIn, ZoomOut, Check, Database, Maximize2 } from 'lucide-react';

interface Props {
  activeDataset?: Dataset;
  elementCount: number;
  canvasWidth: number;
  canvasHeight: number;
  zoomLevel: number;
  onUpdateZoom: (newZoom: number) => void;
  onRefreshData: () => void;
}

export const StatusBar: React.FC<Props> = ({
  activeDataset,
  elementCount,
  canvasWidth,
  canvasHeight,
  zoomLevel,
  onUpdateZoom,
  onRefreshData,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastRefreshed(`Today at ${time}`);
    }, 600);
  };

  return (
    <footer className="flex h-7 w-full items-center justify-between border-t border-slate-200 bg-slate-50 px-4 text-[11px] text-slate-500 select-none">
      {/* Left: Active Dataset stats */}
      <div className="flex items-center space-x-3 truncate">
        <div className="flex items-center space-x-1.5 font-medium text-slate-700">
          <Database className="h-3 w-3 text-blue-600" />
          <span className="truncate max-w-[180px]">{activeDataset?.name || 'No Dataset'}</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>{activeDataset?.rowCount.toLocaleString()} records</span>
        <span className="text-slate-300">|</span>
        <span>{elementCount} {elementCount === 1 ? 'element' : 'elements'}</span>
      </div>

      {/* Center: Canvas info */}
      <div className="hidden sm:flex items-center space-x-2 text-slate-400">
        <span>Canvas: {canvasWidth} × {canvasHeight} px</span>
      </div>

      {/* Right: Refresh & Zoom */}
      <div className="flex items-center space-x-3">
        {/* Data Refresh */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1 hover:text-blue-600 disabled:opacity-50"
            title="Refresh active dataset"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <span className="text-slate-400">({lastRefreshed})</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onUpdateZoom(Math.max(0.5, Math.round((zoomLevel - 0.1) * 10) / 10))}
            className="rounded p-0.5 hover:bg-slate-200"
            title="Zoom Out"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <span className="w-9 text-center font-mono font-medium text-slate-700">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => onUpdateZoom(Math.min(1.5, Math.round((zoomLevel + 0.1) * 10) / 10))}
            className="rounded p-0.5 hover:bg-slate-200"
            title="Zoom In"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
          <button
            onClick={() => onUpdateZoom(1)}
            className="rounded p-0.5 hover:bg-slate-200 ml-1 text-slate-400 hover:text-slate-700"
            title="Reset Zoom to 100%"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
