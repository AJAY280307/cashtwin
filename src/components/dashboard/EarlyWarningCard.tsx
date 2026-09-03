import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, HelpCircle, SlidersHorizontal, Clock, AlertCircle } from 'lucide-react';
import { RiskLevel } from '../../types/financial';

interface Props {
  stressDetected: boolean;
  potentialCashGap: number;
  expectedDays: number;
  headline: string;
  riskLevel: RiskLevel;
}

export const EarlyWarningCard: React.FC<Props> = ({
  stressDetected,
  potentialCashGap,
  expectedDays,
  headline,
  riskLevel,
}) => {
  const navigate = useNavigate();

  if (!stressDetected) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">No Imminent Financial Stress Detected</h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Current liquid buffer reserves comfortably meet all scheduled obligations for the next 30 days.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/cash-forecast')}
          className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shrink-0"
        >
          View Trajectory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-rose-50/90 via-orange-50/60 to-white border-2 border-rose-300/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Visual background badge accent */}
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-100/50 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Early Warning Trigger</span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              {headline}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Our continuous predictive engine has detected a projected shortfall before upcoming EMI clearance.
              Taking timely action now will safeguard your credit score and avoid penalty fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <div className="bg-white/80 border border-rose-200 rounded-xl px-4 py-2.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Potential Cash Gap
              </span>
              <span className="text-2xl font-extrabold text-rose-600 tracking-tight font-sans">
                ₹{potentialCashGap.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Expected Within</span>
              </span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                {expectedDays} days
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            id="btn-why-is-this-happening"
            onClick={() => navigate('/early-warning')}
            className="px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-2xs hover:bg-slate-50 transition-all active:scale-98"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>WHY IS THIS HAPPENING?</span>
          </button>

          <button
            type="button"
            id="btn-simulate-action"
            onClick={() => navigate('/simulator')}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm hover:shadow-indigo-100 transition-all active:scale-98"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
            <span>SIMULATE AN ACTION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
