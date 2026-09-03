import React from 'react';
import {
  LineChart,
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

interface Props {
  data: ForecastPoint[];
  safetyThreshold: number;
}

export const SimulationChart: React.FC<Props> = ({ data, safetyThreshold }) => {
  const formatINR = (val: number) => {
    if (val >= 1000 || val <= -1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            Trajectory Comparison: Before vs Simulated Interventions
          </h4>
          <p className="text-[11px] text-slate-500">
            Solid emerald line reflects intervened cashflow preserving positive reserve
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-400"></span>
            <span className="text-slate-600">Before Intervention</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 bg-emerald-600 rounded"></span>
            <span className="text-slate-900 font-bold">Simulated Plan</span>
          </div>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ForecastPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs font-sans border border-slate-700 min-w-44">
                      <div className="text-slate-400 border-b border-slate-800 pb-1 mb-2 font-semibold">
                        {pt.label} ({pt.date})
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-rose-300">Before:</span>
                        <span className="font-mono font-bold">₹{pt.balance.toLocaleString('en-IN')}</span>
                      </div>
                      {pt.simulatedBalance !== undefined && (
                        <div className="flex items-center justify-between text-emerald-300 font-bold">
                          <span>Simulated:</span>
                          <span className="font-mono">₹{pt.simulatedBalance.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
            <ReferenceLine
              y={safetyThreshold}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: 'Buffer',
                position: 'insideTopRight',
                fill: '#b45309',
                fontSize: 9,
                fontWeight: 700,
              }}
            />

            <ReferenceArea y1={-15000} y2={0} {...({ fill: '#fee2e2', fillOpacity: 0.35 } as any)} />

            {/* Baseline (Before) Line */}
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* Simulated (After) Line */}
            <Line
              type="monotone"
              dataKey="simulatedBalance"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
