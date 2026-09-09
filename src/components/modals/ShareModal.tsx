import React, { useState } from 'react';
import { Share2, Copy, Check, X, Globe, Lock, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, projectName }) => {
  const [accessLevel, setAccessLevel] = useState<'view' | 'interactive' | 'password'>('interactive');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href.split('?')[0];
  const shareUrl = `${currentUrl}?share=true&access=${accessLevel}`;
  const iframeCode = `<iframe src="${shareUrl}" width="1280" height="900" frameborder="0" allowfullscreen></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
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
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Share & Embed Dashboard</h2>
            <p className="text-xs text-slate-500">Provide direct interactive links or embed on internal portals</p>
          </div>
        </div>

        {/* Access Level Selector */}
        <div className="mt-5 space-y-2 text-xs">
          <label className="font-semibold text-slate-700">Access Permissions</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setAccessLevel('interactive')}
              className={`flex flex-col items-center justify-center rounded-lg border p-2.5 transition-all ${
                accessLevel === 'interactive'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="h-4 w-4 mb-1 text-blue-600" />
              <span>Interactive</span>
            </button>
            <button
              onClick={() => setAccessLevel('view')}
              className={`flex flex-col items-center justify-center rounded-lg border p-2.5 transition-all ${
                accessLevel === 'view'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Eye className="h-4 w-4 mb-1 text-emerald-600" />
              <span>View Only</span>
            </button>
            <button
              onClick={() => setAccessLevel('password')}
              className={`flex flex-col items-center justify-center rounded-lg border p-2.5 transition-all ${
                accessLevel === 'password'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock className="h-4 w-4 mb-1 text-amber-600" />
              <span>Passcode</span>
            </button>
          </div>
        </div>

        {/* Shareable Link Input */}
        <div className="mt-4 text-xs">
          <label className="font-semibold text-slate-700">Public Live URL</label>
          <div className="mt-1 flex space-x-1.5">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-900 transition-colors"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Embed IFrame Code */}
        <div className="mt-4 text-xs">
          <label className="font-semibold text-slate-700">HTML IFrame Embed Snippet</label>
          <div className="mt-1 flex space-x-1.5">
            <input
              type="text"
              readOnly
              value={iframeCode}
              className="flex-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600"
            />
            <button
              onClick={handleCopyIframe}
              className="flex items-center space-x-1 rounded bg-slate-800 px-3 py-1.5 font-semibold text-white hover:bg-slate-900 transition-colors"
            >
              {copiedIframe ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedIframe ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
