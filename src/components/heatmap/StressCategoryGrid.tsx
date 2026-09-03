import React, { useState } from 'react';
import { StressCategoryItem, StressPressureLevel } from '../../types/financial';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
  DollarSign,
  CreditCard,
  PiggyBank,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  items: StressCategoryItem[];
}

export const StressCategoryGrid: React.FC<Props> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<StressCategoryItem>(items[1] || items[0]); // default to Spending (High)

  const getPressureConfig = (level: StressPressureLevel) => {
    switch (level) {
      case 'HIGH':
        return {
          label: 'HIGH PRESSURE',
          bg: 'bg-rose-50 border-rose-200 hover:border-rose-400',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          barColor: 'bg-rose-500',
          indicator: 'Urgent Attention Required',
          dot: 'bg-rose-500',
        };
      case 'MODERATE':
        return {
          label: 'MODERATE PRESSURE',
          bg: 'bg-amber-50 border-amber-200 hover:border-amber-400',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          barColor: 'bg-amber-500',
          indicator: 'Watch & Optimize',
          dot: 'bg-amber-500',
        };
      case 'LOW':
        return {
          label: 'LOW PRESSURE',
          bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          barColor: 'bg-emerald-500',
          indicator: 'Resilient Baseline',
          dot: 'bg-emerald-500',
        };
    }
  };

  const highPressureCount = items.filter((i) => i.pressureLevel === 'HIGH').length;
  const moderateCount = items.filter((i) => i.pressureLevel === 'MODERATE').length;
  const lowCount = items.filter((i) => i.pressureLevel === 'LOW').length;

  return (
    <div className="space-y-6">
      {/* Overview Counter Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Financial Life Stress Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded pressure attribution across 8 core liquidity pillars
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>{highPressureCount} High Pressure</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{moderateCount} Moderate</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{lowCount} Resilient</span>
          </div>
        </div>
      </div>

      {/* 8 Category Heatmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {items.map((item) => {
          const config = getPressureConfig(item.pressureLevel);
          const isSelected = selectedCategory.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCategory(item)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white ring-2 ring-indigo-500 border-indigo-400 shadow-md scale-[1.01]'
                  : `${config.bg} shadow-2xs`
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                    {item.category}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}
                  >
                    {item.pressureLevel}
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-sm font-extrabold font-mono text-slate-900">
                    {item.metricValue}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {item.metricLabel}
                  </span>
                </div>
              </div>

              {/* Mini Pressure Meter */}
              <div className="mt-4 pt-2.5 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Pressure Index</span>
                  <span className="font-mono font-bold">{item.pressureScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${config.barColor}`}
                    style={{ width: `${item.pressureScore}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 line-clamp-1 font-medium">
                  {item.statusDescription}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Deep-Dive Inspection Card */}
      {selectedCategory && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm animate-in fade-in duration-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Heatmap Deep-Dive
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    getPressureConfig(selectedCategory.pressureLevel).badge
                  }`}
                >
                  {selectedCategory.pressureLevel} PRESSURE
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
                {selectedCategory.category}: Pressure Analysis
              </h3>
            </div>

            <Link
              to={selectedCategory.routeLink}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shrink-0 self-start sm:self-auto shadow-xs"
            >
              <span>Take Recommended Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Observed Metric
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-1 block">
                {selectedCategory.metricValue}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {selectedCategory.metricLabel}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Benchmark
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block leading-snug">
                {selectedCategory.benchmark}
              </span>
              <span className="text-[11px] text-indigo-600 mt-0.5 block font-medium">
                Safe financial baseline
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Why It Matters
              </span>
              <span className="text-xs text-slate-700 mt-1 block leading-relaxed">
                {selectedCategory.whyItMatters}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-3">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 leading-relaxed">
              <strong className="font-bold">Suggested Immediate Action: </strong>
              {selectedCategory.suggestedAction}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
