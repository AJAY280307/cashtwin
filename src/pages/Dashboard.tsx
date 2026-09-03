import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { CustomerDashboardData } from '../types/financial';
import { MOCK_DASHBOARD_DATA } from '../data/mockData';
import { ResilienceScore } from '../components/dashboard/ResilienceScore';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CashForecastChart } from '../components/dashboard/CashForecastChart';
import { EarlyWarningCard } from '../components/dashboard/EarlyWarningCard';
import { QuickRecommendation } from '../components/dashboard/QuickRecommendation';
import { MonthlyFinancialStory } from '../components/dashboard/MonthlyFinancialStory';
import { Wallet, DollarSign, CreditCard, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { selectedCustomerId } = useCustomer();
  const [data, setData] = useState<CustomerDashboardData | null>(
    MOCK_DASHBOARD_DATA[selectedCustomerId] || MOCK_DASHBOARD_DATA['CUST-003']
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    financialApi.getDashboard(selectedCustomerId).then((res) => {
      if (mounted && res) {
        setData(res);
        setLoading(false);
      }
    }).catch(err => {
      console.warn("Dashboard fetch fallback to mock:", err);
      if (mounted) {
        setData(MOCK_DASHBOARD_DATA[selectedCustomerId] || MOCK_DASHBOARD_DATA['CUST-003']);
        setLoading(false);
      }
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
          <span className="text-xs text-slate-500 font-medium">Loading CashTwin Intelligence...</span>
        </div>
      </div>
    );
  }

  const { customer, resilienceScore, riskLevel, resilienceMessage, metrics, forecast, safetyThreshold, earlyWarning, quickRecommendation } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Executive Summary
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Resilience Overview
          </h2>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Proactive Early Warning Engine Active</span>
        </div>
      </div>

      {/* Hero Financial Health Section + Early Warning Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ResilienceScore
            score={resilienceScore}
            riskLevel={riskLevel}
            message={resilienceMessage}
          />
        </div>

        <div className="lg:col-span-7">
          <EarlyWarningCard
            stressDetected={earlyWarning.stressDetected}
            potentialCashGap={earlyWarning.potentialCashGap}
            expectedDays={earlyWarning.expectedDays}
            headline={earlyWarning.headline}
            riskLevel={riskLevel}
          />
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Balance"
          value={`₹${metrics.currentBalance.toLocaleString('en-IN')}`}
          subtext="Liquid deposits available"
          icon={Wallet}
          variant="default"
        />

        <MetricCard
          title="Monthly Income"
          value={`₹${metrics.monthlyIncome.toLocaleString('en-IN')}`}
          subtext="Verified recurrent payroll"
          icon={DollarSign}
          variant="default"
        />

        <MetricCard
          title="Upcoming EMI"
          value={`₹${metrics.upcomingEmi.toLocaleString('en-IN')}`}
          subtext="Due within 18 days"
          icon={CreditCard}
          variant={metrics.upcomingEmi > metrics.currentBalance * 0.5 ? 'alert' : 'default'}
          tag={metrics.upcomingEmi > metrics.currentBalance * 0.5 ? 'High Burden' : undefined}
        />

        <MetricCard
          title="Cash Buffer"
          value={`${metrics.cashBufferDays} days`}
          subtext={metrics.cashBufferDays < 20 ? 'Below 30d safety baseline' : 'Healthy operating cushion'}
          icon={Calendar}
          variant={metrics.cashBufferDays < 20 ? 'warning' : 'default'}
          tag={metrics.cashBufferDays < 20 ? 'Tight' : 'Comfortable'}
        />
      </div>

      {/* FEATURE 10: AI Monthly Financial Story */}
      <div>
        <MonthlyFinancialStory />
      </div>

      {/* 30-Day Cash Forecast Section */}
      <div>
        <CashForecastChart data={forecast} safetyThreshold={safetyThreshold} />
      </div>

      {/* Dashboard Quick Recommendation Banner */}
      <div>
        <QuickRecommendation
          actionText={quickRecommendation.actionText}
          impactText={quickRecommendation.impactText}
        />
      </div>
    </div>
  );
};
