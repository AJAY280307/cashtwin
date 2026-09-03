import React from 'react';
import { RiskDriver } from '../../types/financial';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  drivers: RiskDriver[];
}

export const RiskContributionChart: React.FC<Props> = ({ drivers }) => {
  const COLORS = ['#e11d48', '#f97316', '#f59e0b', '#6366f1', '#94a3b8'];

  const chartData = drivers.map((d, index) => ({
    name: d.title,
    value: d.contributionPercentage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Distress Factor Attribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized contribution to overall financial fragility score
          </p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          Ranked Attribution
        </span>
      </div>

      {/* Horizontal stacked bar breakdown */}
      <div className="space-y-4">
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-90"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
              }}
              title={`${item.name}: ${item.value}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {chartData.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 font-sans">
                {item.value}%
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Relative attribution
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
