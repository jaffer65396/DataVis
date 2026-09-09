import React, { useState, useRef } from 'react';
import { DashboardElement, ThemeConfig } from '../../types/project';
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripHorizontal,
} from 'lucide-react';

interface Props {
  element: DashboardElement;
  isSelected: boolean;
  theme: ThemeConfig;
  onSelect: (e: React.MouseEvent) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleLock: (id: string) => void;
  onChangeZIndex: (id: string, delta: number) => void;
  children: React.ReactNode;
}

export const CanvasElementWrapper: React.FC<Props> = ({
  element,
  isSelected,
  theme,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDuplicate,
  onDelete,
  onToggleLock,
  onChangeZIndex,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number } | null>(null);

  // Snap to 8px grid
  const snap = (val: number) => Math.round(val / 8) * 8;

  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(e);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x,
      initialY: element.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      const newX = Math.max(0, snap(dragRef.current.initialX + dx));
      const newY = Math.max(0, snap(dragRef.current.initialY + dy));
      onUpdatePosition(element.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialW: element.width,
      initialH: element.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = moveEvent.clientX - resizeRef.current.startX;
      const dy = moveEvent.clientY - resizeRef.current.startY;
      const newW = Math.max(120, snap(resizeRef.current.initialW + dx));
      const newH = Math.max(60, snap(resizeRef.current.initialH + dy));
      onUpdateSize(element.id, newW, newH);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (element.hidden) return null;

  const isTransparentBackground = element.type === 'text' || element.type === 'shape';

  return (
    <div
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: isSelected ? 50 : element.zIndex,
      }}
      className={`group transition-shadow duration-150 ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-xl'
          : 'hover:ring-1 hover:ring-slate-300 shadow-sm'
      }`}
    >
      {/* Container Box */}
      <div
        style={{
          backgroundColor: isTransparentBackground ? 'transparent' : theme.cardBackgroundColor,
          borderColor: isTransparentBackground ? 'transparent' : theme.cardBorderColor,
          borderRadius: isTransparentBackground ? '0px' : '10px',
        }}
        className={`relative flex h-full w-full flex-col overflow-hidden border ${
          isTransparentBackground ? '' : 'shadow-xs'
        }`}
      >
        {/* Element Header / Drag Bar */}
        {element.type !== 'text' && element.type !== 'shape' && (
          <div
            onMouseDown={handleMouseDownDrag}
            className={`flex h-8 w-full cursor-move items-center justify-between border-b border-slate-100 px-3 select-none ${
              isSelected ? 'bg-slate-50' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-1.5 truncate">
              <GripHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate text-[11px] font-semibold text-slate-700">
                {element.title}
              </span>
            </div>

            {/* Quick action icons when selected or hovered */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(element.id);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                title={element.locked ? 'Unlock element' : 'Lock element'}
              >
                {element.locked ? <Lock className="h-3 w-3 text-amber-600" /> : <Unlock className="h-3 w-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(element.id);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeZIndex(element.id, 1);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                title="Bring Forward"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeZIndex(element.id, -1);
                }}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                title="Send Backward"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Element Content Body */}
        <div className="relative flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Resize Handle at Bottom-Right */}
      {isSelected && !element.locked && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-blue-600 shadow-md hover:scale-125 transition-transform"
        />
      )}
    </div>
  );
};
