import React from 'react';
import { RiskLevel } from '../../types/financial';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  score: number;
  riskLevel: RiskLevel;
  message: string;
}

export const ResilienceScore: React.FC<Props> = ({ score, riskLevel, message }) => {
  // SVG circular gauge math
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return {
          stroke: '#10b981', // emerald-500
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          label: 'HEALTHY',
          icon: ShieldCheck,
        };
      case 'WATCH':
        return {
          stroke: '#f59e0b', // amber-500
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          label: 'WATCH',
          icon: AlertTriangle,
        };
      case 'AT_RISK':
        return {
          stroke: '#f97316', // orange-500
          text: 'text-orange-700',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          label: 'AT RISK',
          icon: AlertTriangle,
        };
      case 'HIGH_RISK':
        return {
          stroke: '#e11d48', // rose-600
          text: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          label: 'HIGH RISK / DISTRESS',
          icon: ShieldAlert,
        };
    }
  };

  const riskInfo = getRiskColor(riskLevel);
  const StatusIcon = riskInfo.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Background soft ambient highlight */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-slate-50 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Financial Resilience Score
            </h3>
          </div>
          <Link
            to="/financial-health"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 group"
          >
            <span>Breakdown</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Circular Gauge and Score Center */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-6 py-2">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="#f1f5f9"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={riskInfo.stroke}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {score}
              </div>
              <div className="text-[11px] font-semibold text-slate-400">/ 100</div>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-2.5 shadow-2xs">
              <span className={`flex items-center gap-1.5 ${riskInfo.text}`}>
                <StatusIcon className="w-4 h-4" />
                <span>Status: {riskInfo.label}</span>
              </span>
            </div>

            <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-md">
              "{message}"
            </p>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Calculated across cash buffer, debt load, and 30-day liquidity volatility.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium">Model: Distress Predictive Baseline v2.4</span>
        <span className="font-mono text-[11px]">Dynamic Stress Evaluation</span>
      </div>
    </div>
  );
};
