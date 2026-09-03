import React from 'react';
import { FinancialJourneyPoint } from '../../types/financial';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  point: FinancialJourneyPoint;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export const JourneyTimelineCard: React.FC<Props> = ({
  point,
  isSelected,
  onSelect,
  index,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Stable':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Early Warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Moderate Risk':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Intervention Recommended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
        isSelected
          ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
          : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-700" />
      )}

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold font-mono">
            {index + 1}
          </span>
          <span className="font-extrabold text-sm text-slate-900">{point.month}</span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
            point.status
          )}`}
        >
          {point.status}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Health Score
          </span>
          <span className={`text-base font-extrabold font-mono px-2 py-0.5 rounded border inline-block mt-0.5 ${getScoreColor(point.healthScore)}`}>
            {point.healthScore}/100
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Buffer Days
          </span>
          <span className="text-xs font-bold text-slate-700 font-mono">
            {point.bufferDays} days
          </span>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-600 line-clamp-2 leading-relaxed italic bg-slate-50 p-2 rounded-lg border border-slate-100">
        "{point.aiInsight}"
      </div>
    </button>
  );
};
