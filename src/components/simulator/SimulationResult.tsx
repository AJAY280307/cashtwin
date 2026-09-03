import React from 'react';
import { SimulationResult as SimResultType, RiskLevel } from '../../types/financial';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Info,
  ShieldAlert,
  Gauge,
  Calendar,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { SimulationChart } from './SimulationChart';

interface Props {
  result: SimResultType;
  safetyThreshold: number;
}

export const SimulationResult: React.FC<Props> = ({ result, safetyThreshold }) => {
  const { before, after, savingsImpact, crisisPrevented, explanation, forecastPoints } = result;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AT_RISK':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'HIGH_RISK':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getPressureLabel = (score: number) => {
    if (score < 30) return { text: 'Low Pressure', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score < 60) return { text: 'Moderate Pressure', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score < 80) return { text: 'High Pressure', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { text: 'Severe Pressure', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const beforePressure = getPressureLabel(before.pressureScore || 70);
  const afterPressure = getPressureLabel(after.pressureScore || 30);

  return (
    <div className="space-y-5">
      {/* Prominent Prevention / Stress Banner */}
      {crisisPrevented ? (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-extrabold text-emerald-950 tracking-tight font-sans">
                  POTENTIAL CRISIS PREVENTED
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Buffer Preserved
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-900 mt-1 leading-snug">
                "{explanation}"
              </p>
            </div>
          </div>
        </div>
      ) : after.cashGap > 0 ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-extrabold text-rose-950 tracking-tight font-sans">
                  RESIDUAL CASH SHORTFALL DETECTED
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Gap: ₹{after.cashGap.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs font-semibold text-rose-900 mt-1 leading-snug">
                "{explanation}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
          <div className="text-xs text-slate-700 font-medium">
            {explanation}
          </div>
        </div>
      )}

      {/* 4 CORE KPI IMPACT TILES (Risk Score, Savings Impact, Financial Pressure, Emergency Fund) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Risk Score Change */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Risk Score
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-base font-extrabold font-mono text-slate-400 line-through">
              {before.riskScore}
            </span>
            <span className="text-xs text-slate-400">&rarr;</span>
            <span
              className={`text-lg font-extrabold font-mono ${
                after.riskScore <= before.riskScore ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {after.riskScore}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
            {after.riskScore <= before.riskScore
              ? `-${before.riskScore - after.riskScore} pts risk drop`
              : `+${after.riskScore - before.riskScore} pts risk hike`}
          </span>
        </div>

        {/* 2. Savings Impact */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Savings Impact
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span
              className={`text-lg font-extrabold font-mono ${
                savingsImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {savingsImpact >= 0 ? '+' : ''}₹{Math.abs(savingsImpact).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
            {savingsImpact >= 0 ? 'Monthly buffer gained' : 'Net liquidity drawn down'}
          </span>
        </div>

        {/* 3. Financial Pressure */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Financial Pressure
          </span>
          <div className="mt-1">
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded border inline-block ${afterPressure.color}`}
            >
              {afterPressure.text}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Baseline: {beforePressure.text}
          </span>
        </div>

        {/* 4. Emergency Fund Runway */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Emergency Runway
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-base font-extrabold font-mono text-slate-400 line-through">
              {before.runwayDays || 14}d
            </span>
            <span className="text-xs text-slate-400">&rarr;</span>
            <span
              className={`text-lg font-extrabold font-mono ${
                (after.runwayDays || 14) >= (before.runwayDays || 14)
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {after.runwayDays || 14} days
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
            {(after.runwayDays || 14) >= 30 ? 'Safe cushion achieved' : 'Target: 30 days'}
          </span>
        </div>
      </div>

      {/* Current Financial Health vs Simulated Financial Health Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Current Financial Health vs Simulated Financial Health
            </h3>
            <p className="text-[11px] text-slate-500">
              Live side-by-side indicator changes across your account
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
            Interactive Delta
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Metric</th>
                <th className="py-2 px-3 text-right">Current Baseline</th>
                <th className="py-2 px-3 text-right text-indigo-600">Simulated Outlook</th>
                <th className="py-2 px-3 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Risk Level */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900">Health Category</div>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(before.riskLevel)}`}>
                    {before.riskLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(after.riskLevel)}`}>
                    {after.riskLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[11px] text-emerald-600">
                  {after.riskLevel !== before.riskLevel ? 'Stage Upgraded' : 'Maintained'}
                </td>
              </tr>

              {/* Cash Gap */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900">Projected 30d Shortfall</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                  ₹{before.cashGap.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                  ₹{after.cashGap.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +₹{Math.max(0, before.cashGap - after.cashGap).toLocaleString('en-IN')} recovered
                  </span>
                </td>
              </tr>

              {/* Minimum Balance */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900">Projected Low Point</div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-700">
                  ₹{before.minimumBalance.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-600">
                  ₹{after.minimumBalance.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-[11px] font-semibold text-slate-600">
                  {after.minimumBalance >= safetyThreshold ? '✓ Above safety line' : 'Below threshold'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trajectory Simulation Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <SimulationChart data={forecastPoints} safetyThreshold={safetyThreshold} />
      </div>
    </div>
  );
};
