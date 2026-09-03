import React from 'react';
import { RiskLevel } from '../../types/financial';
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldAlert, ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  currentStage: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'DISTRESS' | 'CRISIS';
  scoreExplanation: string;
  showCta?: boolean;
}

export const RiskJourney: React.FC<Props> = ({ currentStage, scoreExplanation, showCta = false }) => {
  const stages = [
    {
      id: 'HEALTHY',
      title: 'Healthy',
      sub: 'Buffer > 30 days',
      color: 'border-emerald-400 bg-emerald-50 text-emerald-800',
      activeColor: 'ring-2 ring-emerald-500 bg-emerald-600 text-white',
      desc: 'Comfortable savings buffer, positive cash flow, manageable debt.',
    },
    {
      id: 'WATCH',
      title: 'Watch',
      sub: 'Buffer 20–30 days',
      color: 'border-amber-400 bg-amber-50 text-amber-800',
      activeColor: 'ring-2 ring-amber-500 bg-amber-500 text-white',
      desc: 'Minor cashflow volatility, increasing discretionary outlays.',
    },
    {
      id: 'AT_RISK',
      title: 'At Risk',
      sub: 'Buffer 10–20 days',
      color: 'border-orange-400 bg-orange-50 text-orange-800',
      activeColor: 'ring-2 ring-orange-500 bg-orange-500 text-white',
      desc: 'Projected deficit within 30 days. Action immediately effective.',
    },
    {
      id: 'DISTRESS',
      title: 'Potential Distress',
      sub: 'Buffer < 7 days',
      color: 'border-rose-400 bg-rose-50 text-rose-800',
      activeColor: 'ring-2 ring-rose-600 bg-rose-600 text-white',
      desc: 'Critical shortfall predicted. Loan restructuring required.',
    },
    {
      id: 'CRISIS',
      title: 'Crisis',
      sub: 'Overdue / Default',
      color: 'border-rose-600 bg-rose-100 text-rose-900',
      activeColor: 'ring-2 ring-rose-800 bg-rose-900 text-white',
      desc: 'Missed payments, penalty interest, credit profile damage.',
    },
  ];

  const currentIdx = stages.findIndex(
    (s) => s.id === currentStage || (currentStage === 'AT_RISK' && s.id === 'AT_RISK')
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Financial Risk Journey & Prevention Timeline
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Active Stage Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            CashTwin identifies distress before stage progression occurs
          </p>
        </div>

        {showCta && (
          <Link
            to="/simulator"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            <span>TEST AN INTERVENTION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Visual Timeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const isCurrent = stage.id === currentStage || (currentStage === 'AT_RISK' && stage.id === 'AT_RISK');
          const isPast = idx < currentIdx;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-indigo-400 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-400'
                  : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? stage.activeColor
                        : isPast
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-indigo-600 text-white shadow-2xs">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900">{stage.title}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{stage.sub}</div>
              </div>

              <div className="text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100 leading-snug">
                {stage.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory Transparent Box */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Transparent Scoring Standard: </strong>
          {scoreExplanation}
          <div className="mt-1 text-slate-500">
            Unlike opaque legacy credit scores that punish customers after default, CashTwin is forward-looking and designed specifically to keep customers safely in the <strong>Healthy</strong> and <strong>Watch</strong> stages.
          </div>
        </div>
      </div>
    </div>
  );
};
