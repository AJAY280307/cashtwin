import React from 'react';
import { ResilienceComponent, RiskLevel } from '../../types/financial';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface Props {
  components: ResilienceComponent[];
}

export const HealthBreakdown: React.FC<Props> = ({ components }) => {
  const getStatusBadge = (status: RiskLevel) => {
    switch (status) {
      case 'HEALTHY':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          bar: 'bg-emerald-500',
          label: 'Healthy',
        };
      case 'WATCH':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          bar: 'bg-amber-500',
          label: 'Watch',
        };
      case 'AT_RISK':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          bar: 'bg-orange-500',
          label: 'At Risk',
        };
      case 'HIGH_RISK':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          bar: 'bg-rose-500',
          label: 'Distress Risk',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Resilience Score Dimensions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Five multidimensional pillars calculated to detect distress patterns early
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
          Weighted Model
        </span>
      </div>

      <div className="space-y-4">
        {components.map((comp) => {
          const badge = getStatusBadge(comp.status);
          return (
            <div
              key={comp.id}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {comp.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Weight {comp.weight}%
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-sm font-extrabold font-sans text-slate-900 min-w-16 text-right">
                    {comp.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${badge.bar}`}
                  style={{ width: `${comp.score}%` }}
                />
              </div>

              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>{comp.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
