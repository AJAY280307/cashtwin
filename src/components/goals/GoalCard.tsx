import React from 'react';
import { FinancialGoal } from '../../types/financial';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  PiggyBank,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react';

interface Props {
  goal: FinancialGoal;
  onRemove?: (id: string) => void;
}

export const GoalCard: React.FC<Props> = ({ goal, onRemove }) => {
  const progressPercent = Math.min(
    100,
    Math.round((goal.currentSavings / goal.targetAmount) * 100)
  );

  const getPressureBadge = (impact: FinancialGoal['riskImpact']) => {
    switch (impact) {
      case 'EXCESSIVE_PRESSURE':
        return {
          label: 'EXCESSIVE PRESSURE WARNING',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          border: 'border-rose-300',
          barColor: 'bg-rose-500',
        };
      case 'MODERATE_PRESSURE':
        return {
          label: 'MODERATE PRESSURE',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          border: 'border-amber-200',
          barColor: 'bg-amber-500',
        };
      case 'SAFE':
        return {
          label: 'HEALTHY ALLOCATION',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          border: 'border-slate-200/90',
          barColor: 'bg-emerald-500',
        };
    }
  };

  const pressure = getPressureBadge(goal.riskImpact);

  return (
    <div
      className={`bg-white rounded-2xl border ${pressure.border} p-5 shadow-xs transition-all flex flex-col justify-between`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${pressure.badge}`}
          >
            {pressure.label}
          </span>
          {onRemove && !goal.isRecommended && (
            <button
              type="button"
              onClick={() => onRemove(goal.id)}
              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
              title="Delete Goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
          {goal.title}
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          Category: {goal.category}
        </span>

        {/* Progress Bar & Numbers */}
        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-extrabold font-mono text-slate-900">
              ₹{goal.currentSavings.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              of ₹{goal.targetAmount.toLocaleString('en-IN')} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-300 ${pressure.barColor}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid: Monthly contribution + Completion Date */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Monthly Outflow
            </span>
            <span className="text-sm font-extrabold text-slate-800 font-mono mt-0.5 block">
              ₹{goal.monthlyContribution.toLocaleString('en-IN')}/mo
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Est. Completion
            </span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
              {goal.estimatedCompletionDate}
            </span>
          </div>
        </div>

        {/* Dynamic Excessive Pressure Warning */}
        {goal.warningMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {goal.warningMessage}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span>Connected to Live Cash Runway</span>
        {goal.isRecommended && (
          <span className="text-indigo-600 font-bold">Recommended Buffer</span>
        )}
      </div>
    </div>
  );
};
