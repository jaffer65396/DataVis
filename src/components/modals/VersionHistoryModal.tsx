import React, { useState } from 'react';
import { ProjectVersion, DashboardProject } from '../../types/project';
import { History, Plus, RotateCcw, X, Clock, User, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  versions: ProjectVersion[];
  onCreateVersion: (summary: string) => void;
  onRestoreVersion: (version: ProjectVersion) => void;
}

export const VersionHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  versions,
  onCreateVersion,
  onRestoreVersion,
}) => {
  const [newSummary, setNewSummary] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newSummary.trim()) return;
    onCreateVersion(newSummary.trim());
    setNewSummary('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Project Version History</h2>
            <p className="text-xs text-slate-500">Track changes, create restore checkpoints, and rollback</p>
          </div>
        </div>

        {/* Create new snapshot section */}
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-1 font-semibold text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Version Snapshot</span>
            </button>
          ) : (
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">Change Description</label>
              <input
                type="text"
                placeholder="E.g. Added regional profitability and KPI cards"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="rounded px-3 py-1 font-medium text-slate-500 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newSummary.trim()}
                  className="rounded bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  Save Version
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Versions Timeline List */}
        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1 text-xs">
          {versions.map((ver, idx) => {
            const isLatest = idx === versions.length - 1;
            return (
              <div
                key={ver.id}
                className="flex items-start justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">Version {ver.versionNumber}</span>
                    {isLatest && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-slate-600 font-medium">{ver.changeSummary}</p>
                  <div className="mt-1 flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(ver.timestamp).toLocaleString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{ver.author || 'User'}</span>
                    </span>
                  </div>
                </div>

                {!isLatest && (
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="flex items-center space-x-1 rounded border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    title="Restore this version"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
