import React from 'react';
import { SimulationInput } from '../../types/financial';
import {
  RotateCcw,
  Sparkles,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  PiggyBank,
  AlertCircle,
  Scissors,
} from 'lucide-react';

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
  const savingsDelta = (input.monthlySavings || 0) - (defaults.monthlySavings || 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Interactive Scenario Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Test real-world 'What-If' scenarios and see instant before-and-after health impacts
            </p>
          </div>

          <button
            type="button"
            id="reset-simulation-btn"
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* 5 Core Preset Scenarios Required by Feature 2 */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              1-Click Instant Scenarios
            </span>
            <span className="text-[10px] text-slate-400">Deterministic Models</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* 1. What if I lose 20% of my income? */}
            <button
              type="button"
              id="preset-income-loss"
              onClick={() =>
                onApplyPreset(
                  {
                    incomeReductionPercent: 20,
                    largePurchaseAmount: 0,
                  },
                  'What if I lose 20% of my income?'
                )
              }
              className="p-2.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700 flex items-center justify-between">
                <span>Lose 20% Income</span>
                <span className="text-[10px] text-rose-600 font-extrabold">-20%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Test job loss or salary cut</div>
            </button>

            {/* 2. What if my EMI increases? */}
            <button
              type="button"
              id="preset-emi-increase"
              onClick={() =>
                onApplyPreset(
                  {
                    monthlyEmi: defaults.monthlyEmi + 3000,
                    incomeReductionPercent: 0,
                    largePurchaseAmount: 0,
                  },
                  'What if my EMI increases by ₹3,000?'
                )
              }
              className="p-2.5 rounded-lg bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                <span>EMI Increases</span>
                <span className="text-[10px] text-amber-700 font-extrabold">+₹3,000</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Rate hike / shorter tenure</div>
            </button>

            {/* 3. What if I reduce my monthly expenses? */}
            <button
              type="button"
              id="preset-cut-discretionary"
              onClick={() =>
                onApplyPreset(
                  {
                    discretionarySpending: Math.max(0, defaults.discretionarySpending - 5000),
                    incomeReductionPercent: 0,
                    largePurchaseAmount: 0,
                  },
                  'What if I reduce monthly expenses by ₹5,000?'
                )
              }
              className="p-2.5 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
                <span>Reduce Expenses</span>
                <span className="text-[10px] text-emerald-600 font-extrabold">-₹5,000</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Discretionary trimming</div>
            </button>

            {/* 4. What if I save ₹5,000 more every month? */}
            <button
              type="button"
              id="preset-save-more"
              onClick={() =>
                onApplyPreset(
                  {
                    monthlySavings: (defaults.monthlySavings || 3000) + 5000,
                    incomeReductionPercent: 0,
                    largePurchaseAmount: 0,
                  },
                  'What if I save ₹5,000 more every month?'
                )
              }
              className="p-2.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
                <span>Save ₹5,000 More</span>
                <span className="text-[10px] text-indigo-600 font-extrabold">+₹5k/mo</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Accelerate buffer build</div>
            </button>

            {/* 5. What happens if I make a large purchase? */}
            <button
              type="button"
              id="preset-large-purchase"
              onClick={() =>
                onApplyPreset(
                  {
                    largePurchaseAmount: 10000,
                    incomeReductionPercent: 0,
                  },
                  'What happens if I make a ₹10,000 purchase?'
                )
              }
              className="p-2.5 rounded-lg bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all group sm:col-span-2 lg:col-span-2"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                <span>Make Large Purchase</span>
                <span className="text-[10px] text-purple-700 font-extrabold">₹10,000 Outflow</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Test appliance / laptop cash shock</div>
            </button>
          </div>
        </div>

        {/* Interactive Sliders & Fine Tuning */}
        <div className="space-y-4">
          {/* Income Loss Slider */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-income-loss"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Income Reduction (% Shock)
                </label>
                <span className="text-[10px] text-slate-500">
                  Simulate partial salary loss, furloughs, or reduced business revenue
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {input.incomeReductionPercent || 0}%
                </span>
                {(input.incomeReductionPercent || 0) > 0 && (
                  <span className="block text-[10px] font-bold text-rose-600">
                    -{(input.incomeReductionPercent || 0)}% income drop
                  </span>
                )}
              </div>
            </div>
            <input
              id="slider-income-loss"
              type="range"
              min={0}
              max={50}
              step={5}
              value={input.incomeReductionPercent || 0}
              onChange={(e) => updateField('incomeReductionPercent', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0% (Full Income)</span>
              <span>20%</span>
              <span>50% (Severe Cut)</span>
            </div>
          </div>

          {/* Large Purchase Shock Input */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-large-purchase"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Large Upfront Purchase
                </label>
                <span className="text-[10px] text-slate-500">
                  Test the liquidity impact of an immediate one-time expense
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  ₹{(input.largePurchaseAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <input
              id="slider-large-purchase"
              type="range"
              min={0}
              max={40000}
              step={2500}
              value={input.largePurchaseAmount || 0}
              onChange={(e) => updateField('largePurchaseAmount', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0</span>
              <span>₹10,000 (Gadget)</span>
              <span>₹25,000</span>
              <span>₹40,000</span>
            </div>
          </div>

          {/* Monthly Discretionary Spending */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-discretionary"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly Discretionary Spending
                </label>
                <span className="text-[10px] text-slate-500">
                  Dining, entertainment, shopping (Baseline: ₹{defaults.discretionarySpending.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  ₹{input.discretionarySpending.toLocaleString('en-IN')}
                </span>
                {discretionaryDelta !== 0 && (
                  <span
                    className={`block text-[10px] font-bold ${
                      discretionaryDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {discretionaryDelta > 0 ? `Saved: +₹${discretionaryDelta.toLocaleString('en-IN')}` : `Excess`}
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

          {/* Monthly EMI */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-emi"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly Contractual EMI
                </label>
                <span className="text-[10px] text-slate-500">
                  Test interest rate hikes or tenure extensions (Baseline: ₹{defaults.monthlyEmi.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  ₹{input.monthlyEmi.toLocaleString('en-IN')}
                </span>
                {emiDelta !== 0 && (
                  <span
                    className={`block text-[10px] font-bold ${
                      emiDelta > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {emiDelta > 0 ? `Relief: ₹${emiDelta.toLocaleString('en-IN')}` : `Hike: +₹${Math.abs(emiDelta).toLocaleString('en-IN')}`}
                  </span>
                )}
              </div>
            </div>
            <input
              id="slider-emi"
              type="range"
              min={5000}
              max={22000}
              step={500}
              value={input.monthlyEmi}
              onChange={(e) => updateField('monthlyEmi', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹5k (Tenure Flex)</span>
              <span>₹12k (Normal)</span>
              <span>₹22k (Rate Spike)</span>
            </div>
          </div>

          {/* Monthly Savings Allocation */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label
                  htmlFor="slider-savings"
                  className="text-xs font-bold text-slate-900 block"
                >
                  Monthly Savings Allocation
                </label>
                <span className="text-[10px] text-slate-500">
                  Emergency cushion replenishment (Baseline: ₹{(defaults.monthlySavings || 3000).toLocaleString('en-IN')})
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  ₹{(input.monthlySavings || 0).toLocaleString('en-IN')}
                </span>
                {savingsDelta !== 0 && (
                  <span className={`block text-[10px] font-bold ${savingsDelta > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {savingsDelta > 0 ? `+₹${savingsDelta.toLocaleString('en-IN')}/mo extra` : ''}
                  </span>
                )}
              </div>
            </div>
            <input
              id="slider-savings"
              type="range"
              min={0}
              max={20000}
              step={500}
              value={input.monthlySavings || 0}
              onChange={(e) => updateField('monthlySavings', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>₹0</span>
              <span>₹8,000 (+₹5k Target)</span>
              <span>₹20,000</span>
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
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98"
        >
          <span>{isSimulating ? 'Recalculating...' : 'RUN SIMULATION'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
