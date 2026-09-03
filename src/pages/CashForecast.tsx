import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { ForecastPoint, Obligation } from '../types/financial';
import { ForecastChart } from '../components/forecast/ForecastChart';
import { ForecastInsight } from '../components/forecast/ForecastInsight';
import { UpcomingObligations } from '../components/forecast/UpcomingObligations';
import { SlidersHorizontal, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CashForecast: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    forecast: ForecastPoint[];
    safetyThreshold: number;
    currentBalance: number;
    projectedMinimum: number;
    potentialShortfall: number;
    expectedStressPointDays: number;
    obligations: Obligation[];
    insight: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getForecast(selectedCustomerId).then((res) => {
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
          <span className="text-xs text-slate-500 font-medium">Modeling 30-Day Liquidity Curve...</span>
        </div>
      </div>
    );
  }

  const {
    forecast,
    safetyThreshold,
    currentBalance,
    projectedMinimum,
    potentialShortfall,
    expectedStressPointDays,
    obligations,
    insight,
  } = data;

  return (
    <div className="space-y-6 pb-2">
      {/* Page Heading & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Forward-Looking Cash Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Cash Forecast
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            See how your projected cash position may change over the next 30 days.
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
          <span>Simulate Interventions</span>
        </Link>
      </div>

      {/* Large Recharts Visualization */}
      <div>
        <ForecastChart data={forecast} safetyThreshold={safetyThreshold} />
      </div>

      {/* 4 Position Metrics Cards & Insight */}
      <div>
        <ForecastInsight
          currentPosition={currentBalance}
          projectedMinimum={projectedMinimum}
          potentialShortfall={potentialShortfall}
          expectedStressPointDays={expectedStressPointDays}
          insight={insight}
        />
      </div>

      {/* Upcoming Obligations Breakdown */}
      <div>
        <UpcomingObligations obligations={obligations} />
      </div>
    </div>
  );
};
