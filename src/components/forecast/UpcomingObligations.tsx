import React from 'react';
import { Obligation } from '../../types/financial';
import { CreditCard, Home, Zap, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  obligations: Obligation[];
}

export const UpcomingObligations: React.FC<Props> = ({ obligations }) => {
  const getCategoryIcon = (category: Obligation['category']) => {
    switch (category) {
      case 'EMI':
        return <CreditCard className="w-4 h-4 text-rose-600" />;
      case 'RENT':
        return <Home className="w-4 h-4 text-indigo-600" />;
      case 'UTILITIES':
        return <Zap className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const totalCommitted = obligations.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Upcoming Fixed Obligations
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Committed deductions mapped against cash inflows
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Scheduled</span>
            <span className="text-sm font-extrabold text-slate-900 font-sans">
              ₹{totalCommitted.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {obligations.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>Due: {item.dueDate}</span>
                    <span>&bull;</span>
                    <span className={item.daysRemaining <= 10 ? 'text-amber-600 font-semibold' : ''}>
                      in {item.daysRemaining} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-900 font-sans">
                  ₹{item.amount.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Automated bank mandate validation active</span>
        </span>
        <span className="font-mono text-slate-400">{obligations.length} commitments</span>
      </div>
    </div>
  );
};
