import React, { useEffect, useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { financialApi } from '../../services/api';
import { MonthlyStoryData } from '../../types/financial';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MonthlyFinancialStory: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [story, setStory] = useState<MonthlyStoryData | null>(null);

  useEffect(() => {
    financialApi.getMonthlyStory(selectedCustomerId).then((res) => {
      setStory(res);
    });
  }, [selectedCustomerId]);

  if (!story) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-indigo-500/20">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Month */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
              Your Monthly Financial Story
            </h3>
            <p className="text-[11px] text-slate-400">
              Proactive retrospective analysis powered by CashTwin AI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 text-indigo-300 border border-slate-700">
            {story.month}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {story.healthStatus}
          </span>
        </div>
      </div>

      {/* Core Narrative Quote (Requested Exact Format) */}
      <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
        <p className="text-sm sm:text-base font-bold text-indigo-100 leading-snug italic">
          "{story.headline}"
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-rose-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Spending: +{story.spendingChangePercent}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Savings: {story.savingsChangePercent}%</span>
          </div>
        </div>
      </div>

      {/* 3 Structured Pillars: What Improved, What Needs Attention, Recommended Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* What Improved */}
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>What Improved</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {story.whatImproved.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Needs Attention */}
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
            <AlertTriangle className="w-4 h-4" />
            <span>What Needs Attention</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {story.whatNeedsAttention.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">&bull;</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-indigo-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2.5">
              <Bookmark className="w-4 h-4" />
              <span>Recommended Next Steps</span>
            </div>
            <div className="space-y-2.5">
              {story.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-bold text-white leading-tight">{step.title}</div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {step.description}
                  </div>
                  <Link
                    to={step.route}
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 mt-1"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
