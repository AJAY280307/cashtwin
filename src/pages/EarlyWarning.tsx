import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { EarlyWarningData, RiskLevel } from '../../src/types/financial';
import { RiskDriverCard } from '../components/warning/RiskDriverCard';
import { RiskContributionChart } from '../components/warning/RiskContributionChart';
import { RiskJourney } from '../components/health/RiskJourney';
import { AlertTriangle, Clock, SlidersHorizontal, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EarlyWarning: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [data, setData] = useState<EarlyWarningData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getEarlyWarning(selectedCustomerId).then((res) => {
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
          <span className="text-xs text-slate-500 font-medium">Analyzing Distress Signals...</span>
        </div>
      </div>
    );
  }

  const { riskLevel, potentialStressDays, potentialCashGap, drivers, journeyStage, journeyMessage } = data;

  const formatRiskStatus = (level: RiskLevel) => {
    switch (level) {
      case 'HIGH_RISK':
        return 'HIGH FINANCIAL STRESS RISK';
      case 'AT_RISK':
        return 'AT RISK OF FINANCIAL STRESS';
      case 'WATCH':
        return 'WATCH STATUS: MINOR VOLATILITY';
      case 'HEALTHY':
        return 'HEALTHY: RESILIENT RESERVES';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Explainable Attribution Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Early Warning Diagnostics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Root-cause breakdown of emerging liquidity pressure before non-payment occurs
          </p>
        </div>

        <Link
          to="/simulator"
          id="btn-test-intervention-top"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto active:scale-98"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
          <span>TEST AN INTERVENTION</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Prominent High Financial Stress Risk Header Card */}
      <div className="bg-white rounded-2xl border-2 border-rose-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Status: {formatRiskStatus(riskLevel)}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Proactive Distress Projection Summary
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              CashTwin predicts cashflow friction {potentialStressDays > 0 ? `${potentialStressDays} days in advance` : 'proactively'}, allowing corrective action before credit bureau reporting or late fee levies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3 text-center min-w-36">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Potential Cash Gap
              </span>
              <span className="text-2xl font-extrabold text-rose-700 font-sans tracking-tight">
                ₹{potentialCashGap.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-center min-w-36">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Potential Stress In
              </span>
              <span className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                {potentialStressDays > 0 ? `${potentialStressDays} DAYS` : '0 DAYS'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Attribution Chart */}
      <div>
        <RiskContributionChart drivers={drivers} />
      </div>

      {/* WHY IS THIS HAPPENING? Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>WHY IS THIS HAPPENING?</span>
              <span className="text-xs font-semibold text-slate-400">({drivers.length} Ranked Drivers)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by proportional impact on predicted cash shortfall
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Click any factor to view pattern evidence & remedy
          </span>
        </div>

        <div className="space-y-3">
          {drivers.map((driver, index) => (
            <RiskDriverCard key={driver.id} driver={driver} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* Financial Risk Journey & Timeline */}
      <div>
        <div className="mb-2">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Early Intervention Window
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            "{journeyMessage}"
          </div>
        </div>

        <RiskJourney
          currentStage={journeyStage}
          scoreExplanation="Risk status is evaluated continuously across transaction feeds and schedule dates to detect early degradation."
          showCta={true}
        />
      </div>
    </div>
  );
};
