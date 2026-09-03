import React from 'react';
import { FinancialRatios } from '../../types/financial';
import { Wallet, CreditCard, DollarSign, PiggyBank, Percent, Calendar } from 'lucide-react';

interface Props {
  ratios: FinancialRatios;
}

export const FinancialMetrics: React.FC<Props> = ({ ratios }) => {
  const metrics = [
    {
      label: 'Monthly Income',
      value: `₹${ratios.monthlyIncome.toLocaleString('en-IN')}`,
      icon: DollarSign,
      note: 'Verified net monthly inflow',
    },
    {
      label: 'Monthly Expenses',
      value: `₹${ratios.monthlyExpenses.toLocaleString('en-IN')}`,
      icon: Wallet,
      note: 'Fixed & recurring outlays',
    },
    {
      label: 'Liquid Savings',
      value: `₹${ratios.savings.toLocaleString('en-IN')}`,
      icon: PiggyBank,
      note: 'Available in checking & deposit',
    },
    {
      label: 'Monthly EMI',
      value: `₹${ratios.monthlyEmi.toLocaleString('en-IN')}`,
      icon: CreditCard,
      note: 'Active contractual loan deductions',
    },
    {
      label: 'Debt-to-Income',
      value: `${ratios.debtToIncomeRatio.toFixed(1)}%`,
      icon: Percent,
      note: ratios.debtToIncomeRatio > 35 ? 'Elevated ratio' : 'Moderate debt burden',
      highlight: ratios.debtToIncomeRatio > 35 ? 'text-rose-600' : 'text-slate-900',
    },
    {
      label: 'Expense-to-Income',
      value: `${ratios.expenseToIncomeRatio.toFixed(1)}%`,
      icon: Percent,
      note: `${(100 - ratios.expenseToIncomeRatio).toFixed(1)}% retained cash margin`,
      highlight: ratios.expenseToIncomeRatio > 70 ? 'text-amber-600' : 'text-slate-900',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Core Financial Metrics Grid
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key balance sheet fundamentals examined by the CashTwin early detection algorithm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {metrics.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className={`text-xl font-extrabold tracking-tight font-sans ${item.highlight || 'text-slate-900'}`}>
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {item.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
