import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { FinancialHealthData } from '../types/financial';
import { ResilienceScore } from '../components/dashboard/ResilienceScore';
import { HealthBreakdown } from '../components/health/HealthBreakdown';
import { FinancialMetrics } from '../components/health/FinancialMetrics';
import { RiskJourney } from '../components/health/RiskJourney';
import { ShieldCheck, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinancialHealth: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [data, setData] = useState<FinancialHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getFinancialHealth(selectedCustomerId).then((res) => {
      if (mounted) {
        setData(res);
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

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Calculating Health Pillars...</span>
        </div>
      </div>
    );
  }

  const { resilienceScore, riskLevel, components, ratios, timelineStatus, scoreExplanation } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Explainable Resilience Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Health Diagnostic
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of solvency, debt ratios, and income stability factors
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
          <span>Simulate Score Improvement</span>
        </Link>
      </div>

      {/* Hero Resilience Score & Trend Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ResilienceScore
            score={resilienceScore}
            riskLevel={riskLevel}
            message="The resilience score evaluates liquid cushions against fixed contractual claims."
          />
        </div>

        <div className="lg:col-span-7">
          <FinancialMetrics ratios={ratios} />
        </div>
      </div>

      {/* 5 Component Breakdown Cards & Progress Bars */}
      <div>
        <HealthBreakdown components={components} />
      </div>

      {/* Financial Trend Visual Timeline */}
      <div>
        <RiskJourney
          currentStage={timelineStatus}
          scoreExplanation={scoreExplanation}
          showCta={true}
        />
      </div>
    </div>
  );
};
