import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { StressCategoryItem } from '../types/financial';
import { StressCategoryGrid } from '../components/heatmap/StressCategoryGrid';
import { Activity, SlidersHorizontal, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StressHeatmap: React.FC = () => {
  const { selectedCustomerId, selectedCustomer } = useCustomer();
  const [items, setItems] = useState<StressCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getStressHeatmap(selectedCustomerId).then((res) => {
      if (mounted) {
        setItems(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedCustomerId]);

  if (loading || items.length === 0) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">
            Generating Financial Stress Heatmap...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Holistic Diagnostics
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              8 Life Categories
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Financial Stress Heatmap
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly understand: <em>"Which part of my financial life needs attention?"</em>
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
          <span>Simulate Relief</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Heatmap Grid & Category Deep Dive */}
      <StressCategoryGrid items={items} />

      {/* Supportive Charter Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <HeartHandshake className="w-6 h-6 text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">
              Supportive, Non-Judgmental Intelligence
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              High pressure indicators are not credit strikes. They are proactive flags giving you time to optimize cashflow before payment deadlines.
            </p>
          </div>
        </div>

        <Link
          to="/recovery-plan"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
        >
          Start 4-Week Plan
        </Link>
      </div>
    </div>
  );
};
