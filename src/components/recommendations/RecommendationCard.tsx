import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recommendation } from '../../types/financial';
import { useCustomer } from '../../context/CustomerContext';
import { SlidersHorizontal, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<Props> = ({ recommendation }) => {
  const navigate = useNavigate();
  const { setSimulationPreset } = useCustomer();

  const handleSimulate = () => {
    if (recommendation.suggestedSimulation) {
      setSimulationPreset({
        discretionarySpending: recommendation.suggestedSimulation.discretionarySpending ?? 8000,
        monthlyEmi: recommendation.suggestedSimulation.monthlyEmi ?? 12000,
        plannedExpense: recommendation.suggestedSimulation.plannedExpense ?? 10000,
        monthlySavings: recommendation.suggestedSimulation.monthlySavings ?? 3000,
      });
    }
    navigate('/simulator');
  };

  const getPriorityStyle = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 2:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span
              className={`text-xs font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getPriorityStyle(
                recommendation.priority
              )}`}
            >
              Priority {recommendation.priority}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {recommendation.title}
            </h3>
          </div>

          <button
            type="button"
            id={`btn-simulate-rec-${recommendation.id}`}
            onClick={handleSimulate}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shrink-0 transition-colors shadow-2xs active:scale-98"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>SIMULATE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Problem Description */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
            Identified Problem
          </span>
          <p className="text-slate-800 leading-relaxed font-medium">
            {recommendation.problem}
          </p>
        </div>

        {/* Recommended Action */}
        <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
          <span className="font-bold text-indigo-700 uppercase tracking-wider block text-[10px] mb-0.5">
            Recommended Action
          </span>
          <p className="text-slate-900 leading-relaxed font-semibold">
            {recommendation.action}
          </p>
        </div>

        {/* Expected Impact & Risk Trajectory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
            <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[10px] mb-0.5">
              Expected Solvency Impact
            </span>
            <p className="text-emerald-950 font-medium">
              {recommendation.expectedImpact}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
              Risk Level Transition
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                {recommendation.riskReduction.from}
              </span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {recommendation.riskReduction.to}
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Reason */}
        <div className="text-[11px] text-slate-500 flex items-start space-x-2 pt-1">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700 font-semibold">Reasoning: </strong>
            {recommendation.reason}
          </span>
        </div>
      </div>
    </div>
  );
};
