import React, { useEffect, useState } from 'react';
import { financialApi } from '../services/api';
import { AdvisorDashboardData, AdvisorCustomerRecord, RiskLevel } from '../types/financial';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  PieChart as PieIcon,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const BankSupport: React.FC = () => {
  const [data, setData] = useState<AdvisorDashboardData | null>(null);
  const [records, setRecords] = useState<AdvisorCustomerRecord[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    financialApi.getAdvisorDashboard().then((res) => {
      setData(res);
      setRecords(res.customerRecords);
    });
  }, []);

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading Responsible Banking Portal...
      </div>
    );
  }

  const handleActionClick = (customerAlias: string, actionType: string) => {
    setActionNotice(`Proactive outreach queued for ${customerAlias}: ${actionType}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AT_RISK':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'HIGH_RISK':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getStatusBadge = (status: AdvisorCustomerRecord['outreachStatus']) => {
    switch (status) {
      case 'NEEDS_OUTREACH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'IN_CONVERSATION':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ASSISTANCE_OFFERED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'STABILIZED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const filteredRecords = records.filter((r) => {
    if (selectedStatusFilter === 'ALL') return true;
    return r.outreachStatus === selectedStatusFilter;
  });

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Responsible Banking Portal
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Proactive Distress Prevention
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Financial Support Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            High-level advisor & relationship desk view to offer non-punitive restructuring and early assistance
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero-Penalty Standard Active</span>
        </div>
      </div>

      {/* Critical Ethical Charter Warning Banner (Mandatory Requirement) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-start space-x-3.5">
          <HeartHandshake className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-white tracking-tight">
              Ethical Banking & Customer Hardship Protection Charter
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              <strong>Mandatory Protocol: </strong> This dashboard is strictly for proactive assistance and distress prevention. Customer accounts cannot be penalized, scored down, reported to credit bureaus, or denied essential services based on early warning indicators. Relationship managers must use this portal solely to extend restructuring, grace windows, and financial counseling.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {actionNotice && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-900 flex items-center space-x-2 animate-in fade-in duration-100">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4 Core Top-Level Advisor KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Customers Needing Support
          </span>
          <span className="text-2xl font-extrabold font-mono text-rose-600 mt-1 block">
            {data.customersNeedingSupport}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Out of {data.totalMonitoredAccounts.toLocaleString('en-IN')} monitored accounts (5.0%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Intervention Effectiveness
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 block">
            {data.interventionEffectivenessRate}%
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Averted delinquency post-outreach
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Prevented Defaults (YTD)
          </span>
          <span className="text-2xl font-extrabold font-mono text-indigo-600 mt-1 block">
            {data.preventedDelinquenciesCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Zero credit bureau notations
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Avg Early Warning Horizon
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
            18.4 Days
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Lead time before payment deadlines
          </span>
        </div>
      </div>

      {/* Visual Analytics: Early Warning Distribution + Risk Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Early Warning Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Early Warning Portfolio Distribution
                </h3>
                <p className="text-[11px] text-slate-500">
                  Customer accounts segmented by cash runway buffer
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {data.riskDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </span>
                    <span className="font-mono text-slate-900">
                      {item.count} accts ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <strong>Key takeaway: </strong> 83% of the customer base maintains healthy or watch status. Early assistance focuses on the 17% in stress horizons.
          </div>
        </div>

        {/* RIGHT: Risk Trends Over Time */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  5-Month Proactive Intervention Trajectory
                </h3>
                <p className="text-[11px] text-slate-500">
                  At-risk cohort accounts vs stabilized accounts post-assistance
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Cohort Analytics
              </span>
            </div>

            <div className="h-60 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.cohortRiskTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="stabilizedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="atRiskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-xl space-y-1">
                            <div className="font-bold text-indigo-300">{d.month}</div>
                            <div className="text-rose-400">At-Risk Identified: {d.atRiskCount}</div>
                            <div className="text-emerald-400">Successfully Stabilized: {d.stabilizedCount}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="atRiskCount" stroke="#F43F5E" strokeWidth={2} fillOpacity={1} fill="url(#atRiskGrad)" name="At-Risk" />
                  <Area type="monotone" dataKey="stabilizedCount" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#stabilizedGrad)" name="Stabilized" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Steady increase in stabilized accounts over successive quarters</span>
            <span className="font-mono text-emerald-600 font-bold">+28% efficiency</span>
          </div>
        </div>
      </div>

      {/* Anonymized Customer Cohort Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Customer Accounts Queued for Proactive Assistance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Anonymized accounts identified with liquidity buffer deficits
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('NEEDS_OUTREACH')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedStatusFilter === 'NEEDS_OUTREACH'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              Needs Outreach
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('IN_CONVERSATION')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedStatusFilter === 'IN_CONVERSATION'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              In Dialogue
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Account Alias</th>
                <th className="py-2.5 px-3">Health Status</th>
                <th className="py-2.5 px-3">Runway</th>
                <th className="py-2.5 px-3">Primary Stress Driver</th>
                <th className="py-2.5 px-3">Outreach Status</th>
                <th className="py-2.5 px-3">Support Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{r.alias}</div>
                    <div className="text-[10px] font-mono text-slate-400">{r.anonymousId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(
                        r.riskLevel
                      )}`}
                    >
                      {r.riskLevel.replace('_', ' ')} &bull; {r.resilienceScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={r.bufferDaysRemaining < 7 ? 'text-rose-600' : 'text-slate-700'}>
                      {r.bufferDaysRemaining} days
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs text-slate-600 text-[11px] leading-snug">
                    {r.primaryStressDriver}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        r.outreachStatus
                      )}`}
                    >
                      {r.outreachStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => handleActionClick(r.alias, r.recommendedIntervention)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition-colors whitespace-nowrap"
                    >
                      Offer Restructuring &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
