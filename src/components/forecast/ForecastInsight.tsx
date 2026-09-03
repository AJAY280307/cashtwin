import React from 'react';
import { AlertTriangle, Clock, ArrowDownRight, TrendingDown, Info, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  currentPosition: number;
  projectedMinimum: number;
  potentialShortfall: number;
  expectedStressPointDays: number;
  insight: string;
}

export const ForecastInsight: React.FC<Props> = ({
  currentPosition,
  projectedMinimum,
  potentialShortfall,
  expectedStressPointDays,
  insight,
}) => {
  const metrics = [
    {
      label: 'Current Position',
      value: `₹${currentPosition.toLocaleString('en-IN')}`,
      sub: 'Liquid checking & savings',
      color: 'text-slate-900',
    },
    {
      label: 'Projected Minimum',
      value: `₹${projectedMinimum.toLocaleString('en-IN')}`,
      sub: projectedMinimum < 2000 ? 'Approaching boundary' : 'Safe buffer retained',
      color: projectedMinimum < 2000 ? 'text-amber-600' : 'text-emerald-700',
    },
    {
      label: 'Potential Shortfall',
      value: potentialShortfall > 0 ? `₹${potentialShortfall.toLocaleString('en-IN')}` : '₹0',
      sub: potentialShortfall > 0 ? 'Projected cash gap' : 'No shortfall forecast',
      color: potentialShortfall > 0 ? 'text-rose-600' : 'text-emerald-700',
    },
    {
      label: 'Expected Stress Point',
      value: expectedStressPointDays > 0 ? `${expectedStressPointDays} days` : 'None',
      sub: expectedStressPointDays > 0 ? 'Intervention window' : 'Comfortable horizon',
      color: expectedStressPointDays > 0 && expectedStressPointDays <= 20 ? 'text-orange-600' : 'text-slate-900',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Position Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
          >
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {m.label}
            </div>
            <div className={`text-2xl font-extrabold tracking-tight font-sans mt-2 ${m.color}`}>
              {m.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Insight Card */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Predictive Insight
            </div>
            <p className="text-sm font-medium text-slate-800 mt-0.5 leading-snug">
              "{insight}"
            </p>
          </div>
        </div>

        {potentialShortfall > 0 && (
          <Link
            to="/simulator"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shrink-0 shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-200" />
            <span>Simulate Preventive Adjustment</span>
          </Link>
        )}
      </div>
    </div>
  );
};
