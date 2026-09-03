import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import {
  CreditCard,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Pause,
  Play,
  Scissors,
  Check,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export const Subscriptions: React.FC = () => {
  const { subscriptions, toggleSubscriptionActive, selectedCustomer } = useCustomer();
  const [filter, setFilter] = useState<'ALL' | 'UNUSED' | 'ACTIVE'>('ALL');

  const totalMonthlySpend = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.monthlyCost, 0);

  const unusedSubscriptions = subscriptions.filter((s) => s.isUnused && s.active);
  const unusedMonthlySpend = unusedSubscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
  const potentialMonthlySavings = unusedMonthlySpend;

  // Subscription Health Score: 100 minus (unused ratio * 100)
  const healthScore = totalMonthlySpend > 0
    ? Math.max(10, Math.round(100 - (unusedMonthlySpend / totalMonthlySpend) * 80))
    : 100;

  const filteredSubs = subscriptions.filter((s) => {
    if (filter === 'UNUSED') return s.isUnused;
    if (filter === 'ACTIVE') return s.active;
    return true;
  });

  // Group by category for cost comparison
  const categoryMap: Record<string, number> = {};
  subscriptions
    .filter((s) => s.active)
    .forEach((s) => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + s.monthlyCost;
    });

  const categoryChartData = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Subscription Intelligence
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              Auto-Recurring Audit
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Smart Subscription Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify silent recurring drains, pause inactive memberships, and optimize annual plans
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <span>Simulate Savings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Prominent Insight Hero Banner (Requested Exact Format) */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-white border-2 border-indigo-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                CashTwin AI Insight
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
                "You are spending ₹{totalMonthlySpend.toLocaleString('en-IN')} per month on recurring subscriptions."
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {unusedSubscriptions.length > 0
                  ? `Of this, ₹${unusedMonthlySpend.toLocaleString('en-IN')}/mo is going towards ${unusedSubscriptions.length} subscriptions that have had zero usage for over 30 days.`
                  : 'All your current active subscriptions have recorded recent activity.'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Potential Annual Savings
            </span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 block">
              ₹{(potentialMonthlySavings * 12).toLocaleString('en-IN')} / yr
            </span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Monthly Spend
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
            ₹{totalMonthlySpend.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {subscriptions.filter((s) => s.active).length} active recurring plans
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Unused Inactive Spend
          </span>
          <span className="text-xl font-extrabold font-mono text-rose-600 mt-1 block">
            ₹{unusedMonthlySpend.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">
            {unusedSubscriptions.length} subscriptions inactive
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Potential Monthly Savings
          </span>
          <span className="text-xl font-extrabold font-mono text-emerald-600 mt-1 block">
            ₹{potentialMonthlySavings.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
            Immediate cashflow gain
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Subscription Health Score
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span
              className={`text-xl font-extrabold font-mono ${
                healthScore >= 80
                  ? 'text-emerald-600'
                  : healthScore >= 60
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {healthScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {healthScore < 60 ? 'Heavy recurring waste' : 'Well-optimized'}
          </span>
        </div>
      </div>

      {/* Cost Comparison by Category Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Subscription Cost Comparison by Category
            </h3>
            <p className="text-[11px] text-slate-500">
              Compare recurring overhead distribution across life categories
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Monthly Breakdown
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2 rounded-lg text-xs font-mono shadow-lg">
                        <div className="font-bold text-indigo-300">{d.category}</div>
                        <div>Monthly: ₹{d.amount.toLocaleString('en-IN')}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscriptions List with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              All Tracked Recurring Subscriptions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated audit of debits detected from bank feed
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({subscriptions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('UNUSED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === 'UNUSED'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Unused ({unusedSubscriptions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ACTIVE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filter === 'ACTIVE'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Active ({subscriptions.filter((s) => s.active).length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {filteredSubs.map((sub) => (
            <div
              key={sub.id}
              className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-opacity ${
                !sub.active ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {sub.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">{sub.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {sub.category}
                    </span>
                    {sub.isUnused && sub.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        Unused for {sub.lastUsedDaysAgo} days
                      </span>
                    )}
                    {!sub.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Paused / Cancelled
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    <strong className="text-slate-700">AI Recommendation: </strong>
                    {sub.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono text-slate-900 block">
                    ₹{sub.monthlyCost.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </span>
                  {sub.potentialMonthlySavings > 0 && sub.active && (
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      Save ₹{sub.potentialMonthlySavings.toLocaleString('en-IN')}/mo
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleSubscriptionActive(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    sub.active
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {sub.active ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause / Cancel</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
