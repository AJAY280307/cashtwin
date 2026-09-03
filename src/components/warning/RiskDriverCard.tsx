import React, { useState } from 'react';
import { RiskDriver } from '../../types/financial';
import { ChevronDown, ChevronUp, AlertTriangle, Eye, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  driver: RiskDriver;
  rank: number;
}

export const RiskDriverCard: React.FC<Props> = ({ driver, rank }) => {
  const [expanded, setExpanded] = useState(rank === 1); // Expand the #1 ranked driver by default

  const getSeverityStyle = (severity: RiskDriver['severity']) => {
    switch (severity) {
      case 'high':
        return {
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          bar: 'bg-rose-500',
          indicator: 'text-rose-600',
        };
      case 'medium':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500',
          indicator: 'text-amber-600',
        };
      case 'low':
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          bar: 'bg-indigo-500',
          indicator: 'text-indigo-600',
        };
    }
  };

  const style = getSeverityStyle(driver.severity);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        expanded
          ? 'bg-white border-indigo-200 shadow-sm'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Header toggle */}
      <button
        type="button"
        id={`risk-driver-toggle-${rank}`}
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
        aria-expanded={expanded}
      >
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-xs text-slate-800 shrink-0">
            #{rank}
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {driver.title}
              </h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${style.badge}`}>
                {driver.severity} priority
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate mt-0.5">
              Click to view observed banking pattern and diagnostic reasoning
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          {/* Horizontal Contribution Bar Preview */}
          <div className="hidden sm:flex flex-col items-end w-28">
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700 mb-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Contribution</span>
              <span className="font-mono">{driver.contributionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${style.bar}`}
                style={{ width: `${driver.contributionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-1 text-slate-400 hover:text-slate-600">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expanded Breakdown */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3.5 text-xs animate-in fade-in duration-150">
          {/* Mobile Contribution bar */}
          <div className="sm:hidden pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Contribution Share</span>
              <span className="font-mono">{driver.contributionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${style.bar}`}
                style={{ width: `${driver.contributionPercentage}%` }}
              />
            </div>
          </div>

          {/* Observed Pattern */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Observed Pattern</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">
              {driver.observedPattern}
            </p>
          </div>

          {/* Impact */}
          <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Predicted Impact</span>
            </div>
            <p className="text-rose-950 leading-relaxed font-medium">
              {driver.impact}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recommended Action</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                {driver.recommendedAction}
              </p>
            </div>

            <Link
              to="/simulator"
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 shrink-0 transition-colors shadow-2xs"
            >
              <span>Simulate Fix</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
