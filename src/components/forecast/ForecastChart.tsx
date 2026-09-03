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
  Legend,
} from 'recharts';
import { ForecastPoint } from '../../types/financial';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  data: ForecastPoint[];
  safetyThreshold: number;
}

export const ForecastChart: React.FC<Props> = ({ data, safetyThreshold }) => {
  const formatINR = (val: number) => {
    if (val >= 1000 || val <= -1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val}`;
  };

  const minPoint = data.reduce(
    (min, pt) => (pt.balance < min.balance ? pt : min),
    data[0]
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              30-Day Forward Balance Trajectory
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Deterministic Daily Projection
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluates daily income deposits, committed debt service, and variable spending decay
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-3 h-1 bg-indigo-600 rounded"></span>
            <span className="text-slate-700">Projected Balance</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500"></span>
            <span className="text-slate-700">Safety Buffer (₹{safetyThreshold.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-3 h-0.5 bg-slate-400"></span>
            <span className="text-slate-700">Zero Balance Line</span>
          </div>
        </div>
      </div>

      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -5, bottom: 5 }}>
            <defs>
              <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
            />

            <YAxis
              tickFormatter={formatINR}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#475569', fontSize: 11 }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ForecastPoint;
                  const isNegative = pt.balance < 0;
                  const isBelowSafety = pt.balance < safetyThreshold;

                  return (
                    <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl text-xs font-sans border border-slate-700 min-w-52">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 mb-2.5">
                        <span className="font-bold text-slate-200">{pt.label}</span>
                        <span className="font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                          {pt.date}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">Predicted Balance:</span>
                          <span className={`font-mono font-bold text-sm ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                            ₹{pt.balance.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>Safety Threshold:</span>
                          <span className="font-mono">₹{safetyThreshold.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>Net Runway:</span>
                          <span className="font-mono">
                            {isNegative ? 'Deficit' : `+${Math.max(0, pt.balance - safetyThreshold).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>

                      {isBelowSafety && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{isNegative ? 'Default Risk Zone Active' : 'Liquidity Cushion Depleted'}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Zero line */}
            <ReferenceLine
              y={0}
              stroke="#64748b"
              strokeWidth={1.5}
              label={{
                value: 'Zero Line (₹0)',
                position: 'insideBottomLeft',
                fill: '#64748b',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Safety Threshold */}
            <ReferenceLine
              y={safetyThreshold}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `Safety Target (₹${safetyThreshold.toLocaleString('en-IN')})`,
                position: 'insideTopRight',
                fill: '#b45309',
                fontSize: 11,
                fontWeight: 700,
              }}
            />

            {/* Deficit Shaded Zone */}
            <ReferenceArea
              y1={-15000}
              y2={0}
              {...({
                fill: '#fee2e2',
                fillOpacity: 0.45,
                stroke: '#fca5a5',
                strokeDasharray: '3 3',
              } as any)}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#forecastAreaGrad)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span>
            Projected trough occurs at <strong>{minPoint.label}</strong> with an estimated balance of{' '}
            <strong className={minPoint.balance < 0 ? 'text-rose-600' : 'text-slate-800'}>
              ₹{minPoint.balance.toLocaleString('en-IN')}
            </strong>.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Recharts Predictive Render
        </span>
      </div>
    </div>
  );
};
