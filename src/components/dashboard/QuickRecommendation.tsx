import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

interface Props {
  actionText: string;
  impactText: string;
}

export const QuickRecommendation: React.FC<Props> = ({ actionText, impactText }) => {
  const navigate = useNavigate();
  const { setSimulationPreset } = useCustomer();

  const handleSimulateQuick = () => {
    // Set preset to reduce discretionary spending by 5000 (from 8000 to 3000)
    setSimulationPreset({
      discretionarySpending: 3000,
      monthlyEmi: 12000,
      plannedExpense: 10000,
      monthlySavings: 3000,
    });
    navigate('/simulator');
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Primary Recommended Intervention
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" />
              <span>High Impact</span>
            </span>
          </div>
          <p
            className="text-sm font-semibold text-slate-900 mt-1 leading-snug recommendation-text"
            style={{
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              lineHeight: 1.5,
            }}
          >
            "{actionText}"
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {impactText}
            </span>
            <span className="text-xs text-slate-500">
              Zero additional borrowing required
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        id="btn-quick-recommendation-test"
        onClick={handleSimulateQuick}
        className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center justify-center space-x-2 transition-colors shrink-0 group active:scale-98"
      >
        <span>Test This in Simulator</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
