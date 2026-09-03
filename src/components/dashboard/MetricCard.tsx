import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  variant?: 'default' | 'alert' | 'accent' | 'warning';
  tag?: string;
}

export const MetricCard: React.FC<Props> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  tag,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'alert':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
          accent: 'border-l-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
          accent: 'border-l-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'accent':
        return {
          iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          accent: 'border-l-indigo-500',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
          accent: 'border-l-slate-300',
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">{title}</span>
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${styles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            {value}
          </div>
          {tag && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles.badge}`}>
              {tag}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-medium">
        {subtext}
      </div>
    </div>
  );
};
