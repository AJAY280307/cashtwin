import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { FinancialGoal, GoalCategory } from '../types/financial';
import { GoalCard } from '../components/goals/GoalCard';
import {
  Target,
  Plus,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinancialGoals: React.FC = () => {
  const { goals, addGoal, removeGoal, selectedCustomer } = useCustomer();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New goal form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Emergency Fund');
  const [targetAmount, setTargetAmount] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(3000);

  // Calculate excessive pressure warning on form
  const monthlyIncome = selectedCustomer.monthlyIncome;
  const contributionRatio = (monthlyContribution / monthlyIncome) * 100;
  const createsExcessivePressure =
    contributionRatio > 18 || (selectedCustomer.riskLevel === 'AT_RISK' && monthlyContribution > 4500);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const monthsNeeded = Math.ceil(
      Math.max(0, targetAmount - currentSavings) / (monthlyContribution || 1)
    );
    const date = new Date();
    date.setMonth(date.getMonth() + monthsNeeded);
    const completionMonth = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    let riskImpact: FinancialGoal['riskImpact'] = 'SAFE';
    let warningMessage: string | undefined = undefined;

    if (createsExcessivePressure) {
      riskImpact = 'EXCESSIVE_PRESSURE';
      warningMessage = `⚠️ Excessive Financial Pressure: Contributing ₹${monthlyContribution.toLocaleString('en-IN')}/mo consumes ${contributionRatio.toFixed(1)}% of your monthly income and leaves your cash buffer exposed. Consider reducing to ₹${Math.round(monthlyIncome * 0.08).toLocaleString('en-IN')}/mo.`;
    } else if (contributionRatio > 10) {
      riskImpact = 'MODERATE_PRESSURE';
      warningMessage = 'Moderate cash commitment. Ensure discretionary expenses remain capped.';
    }

    addGoal({
      title,
      category,
      targetAmount,
      currentSavings,
      monthlyContribution,
      estimatedCompletionDate: completionMonth,
      riskImpact,
      warningMessage,
      isRecommended: category === 'Emergency Fund' || category === 'Debt Reduction',
    });

    // Reset and close
    setTitle('');
    setTargetAmount(50000);
    setCurrentSavings(5000);
    setMonthlyContribution(3000);
    setIsModalOpen(false);
  };

  const totalMonthlyGoalDrain = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentSavings, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Resilience-Linked Planning
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              Health-Aware Goals
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Financial Goals & Buffer Safeguards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track aspirations while ensuring goal contributions do not cause cashflow strain or default risk
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Accumulated Towards Goals
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
            ₹{totalSaved.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Across {goals.length} active goals
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Monthly Goal Commitments
          </span>
          <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
            ₹{totalMonthlyGoalDrain.toLocaleString('en-IN')} / mo
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {((totalMonthlyGoalDrain / monthlyIncome) * 100).toFixed(0)}% of monthly payroll
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Liquidity Health Status
          </span>
          <span className="text-base font-extrabold text-indigo-700 mt-1 block">
            {selectedCustomer.riskLevel === 'HEALTHY'
              ? 'Safe Allocation Margin'
              : 'Pacing Advised'}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Automatic stress prevention checks active
          </span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onRemove={removeGoal} />
        ))}
      </div>

      {/* Modal: Create New Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Financial Goal</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Education Fund"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-indigo-600"
                >
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Buy a Laptop">Buy a Laptop</option>
                  <option value="Education">Education</option>
                  <option value="Travel">Travel</option>
                  <option value="Debt Reduction">Debt Reduction</option>
                  <option value="Home Down Payment">Home Down Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Monthly Contribution (₹)</label>
                  <span className="font-mono font-bold text-indigo-600">
                    ₹{monthlyContribution.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={500}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹500</span>
                  <span>₹12,500</span>
                  <span>₹25,000</span>
                </div>
              </div>

              {/* Real-time Health Pressure Warning in Form */}
              {createsExcessivePressure && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug">
                    <strong className="font-bold">Excessive Pressure Warning: </strong>
                    Allocating ₹{monthlyContribution.toLocaleString('en-IN')}/month ({contributionRatio.toFixed(0)}% of income) when liquid buffer is tight risks triggering an overdraft.
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
