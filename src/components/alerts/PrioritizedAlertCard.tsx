import React from 'react';
import { EarlyWarningAlert } from '../../types/financial';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  alert: EarlyWarningAlert;
  onDismiss: (id: string) => void;
  onViewDetails?: (alert: EarlyWarningAlert) => void;
}

export const PrioritizedAlertCard: React.FC<Props> = ({ alert, onDismiss, onViewDetails }) => {
  const getPriorityConfig = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH':
        return {
          label: 'HIGH PRIORITY',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          border: 'border-rose-200 hover:border-rose-300',
          headerBg: 'bg-rose-50/50',
          icon: AlertTriangle,
          iconColor: 'text-rose-600',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM PRIORITY',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          border: 'border-amber-200 hover:border-amber-300',
          headerBg: 'bg-amber-50/50',
          icon: AlertCircle,
          iconColor: 'text-amber-600',
        };
      case 'LOW':
        return {
          label: 'LOW PRIORITY',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          border: 'border-indigo-200 hover:border-indigo-300',
          headerBg: 'bg-indigo-50/50',
          icon: Info,
          iconColor: 'text-indigo-600',
        };
    }
  };

  const config = getPriorityConfig(alert.priority);
  const Icon = config.icon;

  if (alert.dismissed) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl border ${config.border} p-5 shadow-xs transition-all flex flex-col justify-between`}
    >
      <div>
        {/* Header with Priority Pill and Dismiss X */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className={`p-1.5 rounded-lg ${config.headerBg} border border-slate-100`}>
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}
            >
              {config.label}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
              {alert.category} &bull; {alert.timestamp}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(alert.id)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
          {alert.title}
        </h4>

        {/* 3 Structured Sections: Problem Detected, Why It Matters, Suggested Action */}
        <div className="mt-3.5 space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
              Problem Detected
            </span>
            <p className="text-slate-700 font-medium leading-relaxed">
              {alert.problemDetected}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
              Why It Matters
            </span>
            <p className="text-slate-700 font-medium leading-relaxed">
              {alert.whyItMatters}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
            <span className="text-[10px] uppercase font-bold text-indigo-700 block tracking-wider mb-0.5">
              Suggested Action
            </span>
            <p className="font-semibold leading-relaxed">
              {alert.suggestedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onDismiss(alert.id)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Dismiss
        </button>

        {alert.actionRoute ? (
          <Link
            to={alert.actionRoute}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs"
          >
            <span>{alert.actionLabel || 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(alert)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
