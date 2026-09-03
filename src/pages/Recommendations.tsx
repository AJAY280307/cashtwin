import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { Recommendation } from '../types/financial';
import { RecommendationCard } from '../components/recommendations/RecommendationCard';
import { ShieldCheck, HeartHandshake, AlertCircle, Sparkles, PhoneCall, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Recommendations: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getRecommendations(selectedCustomerId).then((res) => {
      if (mounted) {
        setRecommendations(res);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [selectedCustomerId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Curating Personalized Action Plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Targeted Interventions
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Personalized Action Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Actions tailored directly to your top financial risk drivers to prevent distress before crisis.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Non-Predatory Banking Standard</span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>

      {/* Responsible Banking Charter Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 text-[11px] font-bold uppercase tracking-wider border border-slate-700">
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
              <span>Responsible Finance Commitment</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Protecting Borrowers, Not Selling New Debt
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              CashTwin is built on the strict principle that financial distress should never be answered with high-interest emergency borrowing or predatory fees. If reasonable adjustments are insufficient, our system connects you directly with your bank's restructuring desk.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl text-xs space-y-1">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Bank Support Line</div>
              <div className="text-white font-mono font-bold">1800-200-TWIN</div>
              <div className="text-[10px] text-indigo-300">Dedicated Hardship Care</div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>We do not guarantee credit or promise loan approvals. All guidance is advisory.</span>
          <span className="font-mono text-slate-500">RBI Regulatory Compliance Framework</span>
        </div>
      </div>
    </div>
  );
};
