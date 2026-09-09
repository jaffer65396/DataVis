import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Share2,
  Play,
  Database,
  SlidersHorizontal,
  LayoutTemplate,
  History,
  CheckCircle2,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface Props {
  projectName: string;
  isSaved: boolean;
  activeView: 'canvas' | 'dataprep' | 'templates' | 'index';
  onRenameProject: (newName: string) => void;
  onSelectView: (view: 'canvas' | 'dataprep' | 'templates' | 'index') => void;
  onOpenDataSourcesModal: () => void;
  onOpenExportModal: () => void;
  onOpenShareModal: () => void;
  onOpenVersionModal: () => void;
  onTogglePresentationMode: () => void;
  onSaveProject: () => void;
}

export const Header: React.FC<Props> = ({
  projectName,
  isSaved,
  activeView,
  onRenameProject,
  onSelectView,
  onOpenDataSourcesModal,
  onOpenExportModal,
  onOpenShareModal,
  onOpenVersionModal,
  onTogglePresentationMode,
  onSaveProject,
}) => {
  const { user, signInWithGoogle, signOutUser, loading } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectName);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Sign in failed');
    }
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onRenameProject(titleInput.trim());
    } else {
      setTitleInput(projectName);
    }
  };

  return (
    <header className="flex h-13 w-full items-center justify-between border-b border-slate-200 bg-white px-4 select-none shadow-xs">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 hidden sm:inline">
            DataViz <span className="text-blue-600">Studio</span>
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Project Name editable */}
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="rounded border border-blue-500 px-2 py-0.5 text-xs font-semibold text-slate-800 focus:outline-none"
          />
        ) : (
          <div
            onClick={() => {
              setTitleInput(projectName);
              setIsEditingTitle(true);
            }}
            className="group flex cursor-pointer items-center space-x-1.5 rounded px-2 py-1 hover:bg-slate-100"
            title="Click to rename project"
          >
            <span className="text-xs font-semibold text-slate-800 max-w-[200px] truncate">
              {projectName}
            </span>
            <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>
        )}

        {/* Save Status Badge */}
        <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-medium">
          <CheckCircle2 className="h-3 w-3" />
          <span className="hidden md:inline">{isSaved ? 'Saved' : 'Saving...'}</span>
        </div>
      </div>

      {/* Center: Workspace Mode Switcher */}
      <div className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
        <button
          onClick={() => onSelectView('canvas')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeView === 'canvas' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Dashboard Canvas</span>
        </button>

        <button
          onClick={() => onSelectView('dataprep')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeView === 'dataprep' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Data Prep & ETL</span>
        </button>

        <button
          onClick={() => onSelectView('templates')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeView === 'templates' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          <span>Templates</span>
        </button>

        <button
          onClick={() => onSelectView('index')}
          className={`flex items-center space-x-1.5 rounded-md px-3 py-1 transition-all ${
            activeView === 'index' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Consolidated Dashboard Component Index & Catalog"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Component Index</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenDataSourcesModal}
          className="flex items-center space-x-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="Import files or connect databases"
        >
          <Database className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline">Connect Data</span>
        </button>

        <button
          onClick={onOpenVersionModal}
          className="flex items-center space-x-1 rounded-md border border-slate-200 p-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          title="Version History & Restore"
        >
          <History className="h-3.5 w-3.5 text-slate-500" />
        </button>

        <button
          onClick={onOpenShareModal}
          className="flex items-center space-x-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="Share & Embed Dashboard"
        >
          <Share2 className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center space-x-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          title="Export to PNG, SVG, PDF, or HTML"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onTogglePresentationMode}
          className="flex items-center space-x-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          title="View full presentation mode"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Present</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* User Account / Google Sign-In */}
        {user ? (
          <div className="flex items-center space-x-2 pl-1">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-full border border-slate-200 shadow-xs"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-800 leading-tight max-w-[120px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium leading-none">Cloud Synced</span>
            </div>
            <button
              onClick={signOutUser}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex items-center space-x-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            title="Sign in with Google to sync dashboards & datasets"
          >
            <LogIn className="h-3.5 w-3.5 text-blue-600" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
