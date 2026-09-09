import React from 'react';
import {
  createDefaultProject,
  createSaaSTemplate,
  createCommodityTemplate,
} from '../../data/starterTemplates';
import { DashboardProject } from '../../types/project';
import { LayoutTemplate, ArrowRight, Check, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (project: DashboardProject) => void;
}

export const TemplatesModal: React.FC<Props> = ({ isOpen, onClose, onApplyTemplate }) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'sales',
      title: 'Executive Sales & Revenue Command Center',
      category: 'Enterprise Sales & ERP',
      description: 'Comprehensive overview tracking revenue, operating profit margins, regional performance, and top product categories.',
      themeName: 'Corporate Slate',
      tags: ['Sales', 'Profit Margin', 'Donut', 'Bar Chart', 'KPI Sparkline'],
      getProject: createDefaultProject,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'saas',
      title: 'SaaS Subscription & Churn Intelligence',
      category: 'SaaS & Recurring Billing',
      description: 'Real-time MRR/ARR velocity, user seat allocation, churn risk breakdown, and customer Net Promoter Scores (NPS).',
      themeName: 'Emerald FinTech',
      tags: ['MRR', 'Churn Risk', 'NPS', 'Subscriptions'],
      getProject: createSaaSTemplate,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'commodity',
      title: 'Global Commodity Markets & Price Trends',
      category: 'Financial Markets & Energy',
      description: 'Spot market prices, OHLC candlestick spreads, daily trading volume, and energy vs agricultural index comparison.',
      themeName: 'Obsidian Midnight Dark',
      tags: ['Gold', 'Crude Oil', 'Candlestick', 'Trading Volume'],
      getProject: createCommodityTemplate,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  const handleSelect = (tmpl: typeof templates[0]) => {
    const proj = tmpl.getProject();
    onApplyTemplate(proj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Starter Dashboard Templates</h2>
            <p className="text-xs text-slate-500">Jumpstart your analytics with enterprise dashboard templates</p>
          </div>
        </div>

        {/* Templates Cards Grid */}
        <div className="mt-5 space-y-3">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-500 hover:shadow-md bg-white"
            >
              <div className="max-w-md">
                <div className="flex items-center space-x-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${tmpl.badgeColor}`}>
                    {tmpl.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">• {tmpl.themeName}</span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-slate-900">{tmpl.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tmpl.tags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelect(tmpl)}
                className="ml-4 flex items-center space-x-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                <span>Use Template</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
