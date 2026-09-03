import React from 'react';
import { SimulationInput } from '../../types/financial';
import { RotateCcw, Sparkles, Sliders, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  input: SimulationInput;
  defaults: SimulationInput;
  onChange: (newInput: SimulationInput) => void;
  onReset: () => void;
  onApplyPreset: (preset: Partial<SimulationInput>, label: string) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export const SimulationControls: React.FC<Props> = ({
  input,
  defaults,
  onChange,
  onReset,
  onApplyPreset,
  onRunSimulation,
  isSimulating,
}) => {
  const updateField = (field: keyof SimulationInput, value: number) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const discretionaryDelta = defaults.discretionarySpending - input.discretionarySpending;
  const emiDelta = defaults.monthlyEmi - input.monthlyEmi;
  const plannedExpenseDelta = defaults.plannedExpense - input.plannedExpense;
  const savingsDelta = input.monthlySavings - defaults.monthlySavings;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Adjust Your Financial Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate proactive adjustments to test risk mitigation before commitments lock in
            </p>
          </div>

          <button
            type="button"
            id="reset-simulation-btn"
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Decision Presets */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
            <span>Recommended Scenario Presets</span>
            <span className="text-indigo-600 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3" /> 1-Click Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              id="preset-cut-discretionary"
              onClick={() =>
                onApplyPreset(
                  { discretionarySpending: Math.max(0, defaults.discretionarySpending - 5000) },
                  'Cut Discretionary Spending by ₹5,000'
                )
              }
              className="px-2.5 py-2 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                <span>Reduce Discretionary</span>
                <span className="text-[10px] text-emerald-600 font-extrabold">-₹5k</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">Immediate cashflow relief</div>
            </button>

            <button
              type="button"
              id="preset-defer-expense"
              onClick={() =>
                onApplyPreset({ plannedExpense: 0 }, 'Defer Major Planned Expense (₹10,000)')
              }
              className="px-2.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                <span>Defer Major Purchase</span>
                <span className="text-[10px] text-emerald-600 font-extrabold">Pause</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">Postpone non-essential buys</div>
            </button>

            <button
              type="button"
              id="preset-restructure-emi"
              onClick={() =>
                onApplyPreset(
                  { monthlyEmi: Math.max(5000, defaults.monthlyEmi - 3000) },
                  'EMI Restructure: Tenure Extension'
                )
              }
              className="px-2.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                <span>Tenure Extension</span>
                <span className="text-[10px] text-indigo-600 font-extrabold">Bank Assist</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">Reduce monthly EMI strain</div>
            </button>
          </div>
        </div>

        {/* 4 Interactive Controls */}
        <div className="space-y-5">
          {/* 1. Monthly discretionary spending */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-discretionary"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly Discretionary Spending
                </label>
                <span className="text-[11px] text-slate-500">
                  Dining, entertainment, shopping & non-essentials (Baseline: ₹{defaults.discretionarySpending.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ₹{input.discretionarySpending.toLocaleString('en-IN')}
                </span>
                {discretionaryDelta !== 0 && (
                  <span
                    className={`block text-[10px] font-bold ${
                      discretionaryDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {discretionaryDelta > 0 ? `Savings: +₹${discretionaryDelta.toLocaleString('en-IN')}` : `Excess: ₹${Math.abs(discretionaryDelta).toLocaleString('en-IN')}`}
                  </span>
                )}
              </div>
            </div>

            <input
              id="slider-discretionary"
              type="range"
              min={0}
              max={15000}
              step={500}
              value={input.discretionarySpending}
              onChange={(e) => updateField('discretionarySpending', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0 (Strict Pause)</span>
              <span>₹7,500</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* 2. Monthly EMI */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-emi"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly EMI (Loan Restructuring Option)
                </label>
                <span className="text-[11px] text-slate-500">
                  Simulate bank-approved tenure extension or principal relief (Baseline: ₹{defaults.monthlyEmi.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ₹{input.monthlyEmi.toLocaleString('en-IN')}
                </span>
                {emiDelta !== 0 && (
                  <span
                    className={`block text-[10px] font-bold ${
                      emiDelta > 0 ? 'text-emerald-600' : 'text-slate-600'
                    }`}
                  >
                    {emiDelta > 0 ? `Monthly Relief: ₹${emiDelta.toLocaleString('en-IN')}` : `Extra payment`}
                  </span>
                )}
              </div>
            </div>

            <input
              id="slider-emi"
              type="range"
              min={5000}
              max={20000}
              step={500}
              value={input.monthlyEmi}
              onChange={(e) => updateField('monthlyEmi', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹5,000 (Max Tenure Extension)</span>
              <span>₹12,000</span>
              <span>₹20,000 (Accelerated)</span>
            </div>
          </div>

          {/* 3. Planned expense */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-planned"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Planned Big-Ticket Expense
                </label>
                <span className="text-[11px] text-slate-500">
                  Simulate deferring or pacing major scheduled purchases (Baseline: ₹{defaults.plannedExpense.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ₹{input.plannedExpense.toLocaleString('en-IN')}
                </span>
                {plannedExpenseDelta !== 0 && (
                  <span
                    className={`block text-[10px] font-bold ${
                      plannedExpenseDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {plannedExpenseDelta > 0 ? `Deferred: ₹${plannedExpenseDelta.toLocaleString('en-IN')}` : `Increased`}
                  </span>
                )}
              </div>
            </div>

            <input
              id="slider-planned"
              type="range"
              min={0}
              max={30000}
              step={1000}
              value={input.plannedExpense}
              onChange={(e) => updateField('plannedExpense', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0 (Postponed)</span>
              <span>₹15,000</span>
              <span>₹30,000</span>
            </div>
          </div>

          {/* 4. Monthly savings */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-savings"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly Emergency Savings Allocation
                </label>
                <span className="text-[11px] text-slate-500">
                  Targeted liquid cushion replenishment (Baseline: ₹{defaults.monthlySavings.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  ₹{input.monthlySavings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <input
              id="slider-savings"
              type="range"
              min={0}
              max={15000}
              step={500}
              value={input.monthlySavings}
              onChange={(e) => updateField('monthlySavings', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0</span>
              <span>₹7,500</span>
              <span>₹15,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Real-time dynamic stress evaluation</span>
        </div>

        <button
          type="button"
          id="btn-run-simulation"
          onClick={onRunSimulation}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm hover:shadow-indigo-100 transition-all active:scale-98"
        >
          <span>{isSimulating ? 'Recalculating...' : 'RUN SIMULATION'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
