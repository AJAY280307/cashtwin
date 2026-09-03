import React, { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { FinancialJourneyPoint } from '../types/financial';
import { JourneyTimelineCard } from '../components/timeline/JourneyTimelineCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Calendar,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinancialTimeline: React.FC = () => {
  const { selectedCustomerId, selectedCustomer, accessibility } = useCustomer();
  const [timeline, setTimeline] = useState<FinancialJourneyPoint[]>([]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(2); // Default to March (Early Warning)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    financialApi.getTimeline(selectedCustomerId).then((data) => {
      if (mounted) {
        setTimeline(data);
        // Default to March (index 2) or latest stressed point
        const warnIdx = data.findIndex(
          (p) => p.status === 'Early Warning' || p.status === 'Moderate Risk'
        );
        setSelectedMonthIndex(warnIdx !== -1 ? warnIdx : data.length - 1);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedCustomerId]);

  if (loading || timeline.length === 0) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">
            Loading Financial Journey Timeline...
          </span>
        </div>
      </div>
    );
  }

  const activePoint = timeline[selectedMonthIndex] || timeline[0];
  const initialPoint = timeline[0];
  const scoreDelta = activePoint.healthScore - initialPoint.healthScore;

  // Chart formatting data
  const chartData = timeline.map((p) => ({
    name: p.shortMonth,
    fullMonth: p.month,
    score: p.healthScore,
    income: p.monthlyIncome,
    expenses: p.monthlyExpenses,
    savings: p.netSavings,
    bufferDays: p.bufferDays,
    status: p.status,
  }));

  return (
    <div className="space-y-6 pb-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Historical Diagnostics
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              Multi-Month Trajectory
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Financial Journey Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand how financial resilience evolved over time and where early warning signals first emerged
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-200" />
          <span>Test Corrective Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Prominent AI Insight Callout Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-indigo-50/50 to-white border-2 border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  AI Journey Attribution
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {activePoint.month} Snapshot
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                "{activePoint.aiInsight}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Score Drift
              </span>
              <span
                className={`text-xs font-extrabold font-mono flex items-center gap-1 ${
                  scoreDelta < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {scoreDelta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts since Jan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Month Cards */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>Click any month to inspect historical diagnosis</span>
          <span className="text-indigo-600 font-semibold text-[11px]">
            Selected: {activePoint.month} ({activePoint.status})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {timeline.map((point, idx) => (
            <JourneyTimelineCard
              key={point.month}
              point={point}
              isSelected={idx === selectedMonthIndex}
              onSelect={() => setSelectedMonthIndex(idx)}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* Charts Section: Health Score Trend + Cashflow Inflow vs Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CHART: Resilience Score Trajectory */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Financial Resilience Score Trajectory
                </h3>
                <p className="text-[11px] text-slate-500">
                  Proactive degradation curve (100 = Maximum Solvency, &lt;50 = Distress Risk)
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                5-Month Trend
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[20, 100]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800 space-y-1">
                            <div className="font-bold text-indigo-300">{d.fullMonth}</div>
                            <div>Score: <span className="font-mono font-bold text-white">{d.score}/100</span></div>
                            <div>Status: <span className="font-semibold text-amber-300">{d.status}</span></div>
                            <div>Buffer: <span className="font-mono text-slate-300">{d.bufferDays} days</span></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Critical inflection point observed in <strong>March</strong></span>
            <span className="font-mono text-[11px] text-indigo-600 font-semibold">
              Peak: 88 &rarr; Low: 48
            </span>
          </div>
        </div>

        {/* RIGHT CHART: Inflows vs Outflows and Monthly Net Savings */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Income vs Expenses & Net Buffer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Discretionary spending outpaced income starting in April
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800 space-y-1">
                            <div className="font-bold text-indigo-300">{d.fullMonth}</div>
                            <div>Income: ₹{d.income.toLocaleString('en-IN')}</div>
                            <div>Expenses: ₹{d.expenses.toLocaleString('en-IN')}</div>
                            <div className={d.savings >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              Net Savings: ₹{d.savings.toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Net Monthly Deficit: <strong>-₹4,600 (May)</strong></span>
            <Link to="/recovery-plan" className="text-indigo-600 font-bold hover:underline">
              Fix Deficit &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Drill-down for the Selected Month */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Detailed Diagnosis: {activePoint.month}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Root causes that drove the {activePoint.status} indicator during this period
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500">Recorded Runway:</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800">
              {activePoint.bufferDays} Days
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Monthly Inflow
            </span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-1 block">
              ₹{activePoint.monthlyIncome.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              Verified salary credit
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Monthly Outflow
            </span>
            <span className="text-lg font-extrabold text-slate-900 font-mono mt-1 block">
              ₹{activePoint.monthlyExpenses.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
              Fixed debts + Discretionary outlays
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Net Savings / Burn
            </span>
            <span
              className={`text-lg font-extrabold font-mono mt-1 block ${
                activePoint.netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {activePoint.netSavings >= 0 ? '+' : ''}₹
              {activePoint.netSavings.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {activePoint.netSavings >= 0 ? 'Surplus channeled to reserves' : 'Drew down on liquid buffer'}
            </span>
          </div>
        </div>

        {/* Contributing Factors Pills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Key Contributing Drivers Identified by CashTwin AI:
          </h4>
          <div className="flex flex-wrap gap-2">
            {activePoint.contributingFactors.map((factor, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <span>{factor}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Prevention CTA Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Proactive intervention today stops May's projected distress before contractual late fees occur.
            </span>
          </div>

          <Link
            to="/recovery-plan"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            <span>View 4-Week Recovery Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
