import React from 'react';
import { SimulationResult as SimResultType, RiskLevel } from '../../types/financial';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Info, ShieldAlert } from 'lucide-react';
import { SimulationChart } from './SimulationChart';

interface Props {
  result: SimResultType;
  safetyThreshold: number;
}

export const SimulationResult: React.FC<Props> = ({ result, safetyThreshold }) => {
  const { before, after, crisisPrevented, explanation, forecastPoints } = result;

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

  const formatLevel = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return 'LOW RISK';
      case 'WATCH':
        return 'WATCH';
      case 'AT_RISK':
        return 'AT RISK';
      case 'HIGH_RISK':
        return 'HIGH RISK';
    }
  };

  return (
    <div className="space-y-5">
      {/* Prominent Prevention Banner */}
      {crisisPrevented ? (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-extrabold text-emerald-950 tracking-tight font-sans">
                  🟢 POTENTIAL CRISIS PREVENTED
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Deficit Averted
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
                  ⚠️ RESIDUAL CASH SHORTFALL DETECTED
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

      {/* BEFORE vs AFTER Executive Comparison Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Simulation Impact: Before vs After
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Measurable improvement across key solvency and liquidity indicators
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
            Side-by-Side Delta
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3 text-right">Baseline (Before)</th>
                <th className="py-2.5 px-3 text-right text-indigo-600">Simulated (After)</th>
                <th className="py-2.5 px-3 text-right">Net Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {/* Risk Score */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">Risk Score</div>
                  <div className="text-[10px] text-slate-400">Lower indicates safer cushion</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-700 text-sm">
                  {before.riskScore}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 text-base">
                  {after.riskScore}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    -{before.riskScore - after.riskScore} pts
                  </span>
                </td>
              </tr>

              {/* Cash Gap */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">Cash Gap / Shortfall</div>
                  <div className="text-[10px] text-slate-400">Projected 30-day deficit</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-rose-600 text-sm">
                  ₹{before.cashGap.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 text-base">
                  ₹{after.cashGap.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +₹{(before.cashGap - after.cashGap).toLocaleString('en-IN')} recovered
                  </span>
                </td>
              </tr>

              {/* Minimum Balance */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">Minimum Balance</div>
                  <div className="text-[10px] text-slate-400">Lowest forecasted cash point</div>
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-700 text-sm">
                  ₹{before.minimumBalance.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 text-base">
                  ₹{after.minimumBalance.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +₹{(after.minimumBalance - before.minimumBalance).toLocaleString('en-IN')} cushion
                  </span>
                </td>
              </tr>

              {/* Risk Level */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">Risk Classification</div>
                  <div className="text-[10px] text-slate-400">Early warning triage level</div>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRiskBadge(before.riskLevel)}`}>
                    {formatLevel(before.riskLevel)}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRiskBadge(after.riskLevel)}`}>
                    {formatLevel(after.riskLevel)}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-xs font-bold text-emerald-600">
                    {before.riskLevel !== after.riskLevel ? 'Stabilized' : 'Maintained'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual line forecast chart */}
      <SimulationChart data={forecastPoints} safetyThreshold={safetyThreshold} />

      {/* Responsible Banking Warning Clause */}
      {after.cashGap > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Additional financial support may be required.</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Consider speaking with your bank about available repayment assistance or restructuring options.
            CashTwin will never recommend predatory high-interest borrowing or promise automatic credit approval.
          </p>
        </div>
      )}
    </div>
  );
};
