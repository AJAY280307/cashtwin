import React, { useState, useEffect } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { financialApi } from '../services/api';
import { SimulationInput, SimulationResult as SimResultType } from '../types/financial';
import { SimulationControls } from '../components/simulator/SimulationControls';
import { SimulationResult } from '../components/simulator/SimulationResult';
import { SlidersHorizontal, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const { selectedCustomerId, simulationPreset, setSimulationPreset } = useCustomer();

  const [customerDefaults, setCustomerDefaults] = useState<SimulationInput>({
    discretionarySpending: 8000,
    monthlyEmi: 12000,
    plannedExpense: 10000,
    monthlySavings: 3000,
  });

  const [input, setInput] = useState<SimulationInput>(customerDefaults);
  const [result, setResult] = useState<SimResultType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePresetNotification, setActivePresetNotification] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Safety threshold reference
  const safetyThreshold = selectedCustomerId === 'U00001' ? 15000 : 5000;

  useEffect(() => {
    let mounted = true;
    financialApi.getDashboard(selectedCustomerId).then((res) => {
      if (mounted) {
        // Derive defaults safely from backend data
        const defaults: SimulationInput = {
          discretionarySpending: Math.max(0, (res.metrics.monthlyIncome * 0.2)),
          monthlyEmi: res.metrics.upcomingEmi,
          plannedExpense: 0,
          monthlySavings: 0,
        };
        setCustomerDefaults(defaults);
        
        if (simulationPreset) {
          setInput((prev) => ({
            ...prev,
            ...simulationPreset,
          }));
          setSimulationPreset(null);
        } else {
          setInput(defaults);
        }
        setIsLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, [selectedCustomerId]);

  // Run calculation whenever input changes or user triggers run
  const executeSimulation = async (currentInput: SimulationInput) => {
    setIsSimulating(true);
    try {
      const res = await financialApi.simulate(selectedCustomerId, currentInput);
      setResult(res);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      executeSimulation(input);
    }
  }, [input, isLoaded, selectedCustomerId]);

  const handleApplyPreset = (preset: Partial<SimulationInput>, label: string) => {
    const updated = {
      ...input,
      ...preset,
    };
    setInput(updated);
    setActivePresetNotification(`Preset applied: ${label}`);
    setTimeout(() => setActivePresetNotification(null), 3500);
  };

  const handleReset = () => {
    setInput(customerDefaults);
    setActivePresetNotification('Parameters reset to actual account baseline.');
    setTimeout(() => setActivePresetNotification(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive Decision Engine
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              PREDICT → SIMULATE → PREVENT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            What-If Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test financial decisions before making them. Measure risk reduction and cash recovery in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No actual money moved or credit checks performed</span>
        </div>
      </div>

      {/* Preset Toast Notification */}
      {activePresetNotification && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-900 flex items-center justify-between animate-in fade-in duration-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{activePresetNotification}</span>
          </div>
          <span className="text-[10px] text-indigo-500 font-mono">Simulated</span>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Adjust Your Financial Plan */}
        <div className="lg:col-span-6">
          <SimulationControls
            input={input}
            defaults={customerDefaults}
            onChange={setInput}
            onReset={handleReset}
            onApplyPreset={handleApplyPreset}
            onRunSimulation={() => executeSimulation(input)}
            isSimulating={isSimulating}
          />
        </div>

        {/* RIGHT COLUMN: Simulation Result (Before vs After) */}
        <div className="lg:col-span-6">
          {result ? (
            <SimulationResult result={result} safetyThreshold={safetyThreshold} />
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Run simulation to view before/after impact.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
