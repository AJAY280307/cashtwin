import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { ForecastPoint } from '../../types/financial';
import { AlertCircle, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  data: ForecastPoint[];
  safetyThreshold: number;
}

export const CashForecastChart: React.FC<Props> = ({ data, safetyThreshold }) => {
  // Format rupee for chart axis and tooltips
  const formatINR = (val: number) => {
    if (val >= 1000 || val <= -1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val}`;
  };

  // Find the first day that drops below safety threshold
  const stressPoint = data.find((d) => d.balance < safetyThreshold);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              30-Day Cash Forecast
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Forward Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Predictive liquidity balance factoring scheduled EMIs, bills, and observed outflows
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-indigo-600 rounded"></span>
            <span className="text-slate-600">Projected Balance</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500"></span>
            <span className="text-slate-600">Safety Buffer (₹{safetyThreshold.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      {/* Stress Callout banner */}
      {stressPoint && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">
              Stress Threshold Breached: Balance is predicted to drop below safety reserve at{' '}
              <strong className="font-extrabold">{stressPoint.label} ({stressPoint.date})</strong>.
            </span>
          </div>
          <Link
            to="/cash-forecast"
            className="font-bold underline underline-offset-2 hover:text-rose-950 flex items-center gap-1 shrink-0 ml-2"
          >
            <span>View 30-Day Breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />

            <YAxis
              tickFormatter={formatINR}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ForecastPoint;
                  const isNegative = pt.balance < 0;
                  const isBelowSafety = pt.balance < safetyThreshold;

                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-sans border border-slate-700 min-w-44">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
                        <span className="font-semibold">{pt.label}</span>
                        <span className="font-mono text-[10px]">{pt.date}</span>
                      </div>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-slate-300">Projected Balance:</span>
                        <span className={`font-bold font-mono text-sm ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ₹{pt.balance.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Safety Minimum:</span>
                        <span className="font-mono">₹{safetyThreshold.toLocaleString('en-IN')}</span>
                      </div>
                      {isBelowSafety && (
                        <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{isNegative ? 'Shortfall / Overdraft Risk' : 'Buffer Depleted'}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Zero balance indicator line */}
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />

            {/* Safety Threshold line */}
            <ReferenceLine
              y={safetyThreshold}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'Safety Threshold',
                position: 'insideTopRight',
                fill: '#b45309',
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {/* Highlighted stress area below 0 */}
            <ReferenceArea y1={-10000} y2={0} {...({ fill: '#fee2e2', fillOpacity: 0.4 } as any)} />

            {/* Area Line */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#balanceGradient)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Red shaded zone represents negative balance (cash shortfall / default risk).</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Source: Real-time Cashflow Simulator
        </div>
      </div>
    </div>
  );
};
