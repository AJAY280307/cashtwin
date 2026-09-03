import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { setUseRealBackend, isUsingRealBackend } from '../../services/api';
import { X, Server, Check, RefreshCw, ShieldCheck, Database, Code, Sliders } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
    accessibility,
    updateAccessibility,
  } = useCustomer();
  const [useBackend, setUseBackend] = useState(isUsingRealBackend());
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000/api');
  const [tested, setTested] = useState<boolean | null>(null);

  if (!isSettingsOpen) return null;

  const handleToggleBackend = (enabled: boolean) => {
    setUseBackend(enabled);
    setUseRealBackend(enabled);
  };

  const handleTestConnection = async () => {
    try {
      const res = await fetch(`${backendUrl}/health`, { method: 'GET' });
      setTested(res.ok);
    } catch {
      setTested(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CashTwin Demo & Architecture Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure persona scenario & FastAPI backend integration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5 text-xs">
          {/* Quick Scenario Picker */}
          <div>
            <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px] mb-2">
              Select Demo Scenario Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              {customers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    c.id === selectedCustomerId
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{c.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.riskLevel.replace('_', ' ')} &bull; {c.resilienceScore}/100</div>
                </button>
              ))}
            </div>
          </div>

          {/* FEATURE 9: ACCESSIBILITY MODE CONTROLS */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-800 text-xs">Accessibility Mode</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const allActive = accessibility.largerText && accessibility.highContrast;
                  updateAccessibility({
                    largerText: !allActive,
                    highContrast: !allActive,
                    simplifiedDashboard: !allActive,
                    voiceFriendly: !allActive,
                    reducedComplexity: !allActive,
                  });
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                {accessibility.largerText && accessibility.highContrast ? 'Disable All' : 'Quick Enable All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {/* 1. Larger text */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <span className="font-semibold text-slate-700">Larger Text</span>
                <input
                  type="checkbox"
                  checked={accessibility.largerText}
                  onChange={(e) => updateAccessibility({ largerText: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* 2. High contrast mode */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <span className="font-semibold text-slate-700">High Contrast</span>
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* 3. Simplified dashboard */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <span className="font-semibold text-slate-700">Simplified Dashboard</span>
                <input
                  type="checkbox"
                  checked={accessibility.simplifiedDashboard}
                  onChange={(e) => updateAccessibility({ simplifiedDashboard: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* 4. Voice-friendly interactions */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <span className="font-semibold text-slate-700">Voice Readout</span>
                <input
                  type="checkbox"
                  checked={accessibility.voiceFriendly}
                  onChange={(e) => updateAccessibility({ voiceFriendly: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* 5. Reduced visual complexity */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer sm:col-span-2">
                <span className="font-semibold text-slate-700">Reduced Visual Complexity (Minimalist view)</span>
                <input
                  type="checkbox"
                  checked={accessibility.reducedComplexity}
                  onChange={(e) => updateAccessibility({ reducedComplexity: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* FastAPI Backend Configuration */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-800">FastAPI REST Backend Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBackend}
                  onChange={(e) => handleToggleBackend(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Toggle to connect to an external Python FastAPI service. When disabled, the frontend uses the built-in deterministic financial intelligence mock engine.
            </p>

            {useBackend && (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="http://localhost:8000/api"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs"
                  >
                    Test Ping
                  </button>
                </div>
                {tested !== null && (
                  <div
                    className={`text-[11px] font-semibold ${
                      tested ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {tested
                      ? '✓ FastAPI backend online and responding'
                      : 'ℹ Backend offline; fallback mock engine active'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clean API Endpoint Contract */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-300 text-[11px] font-mono space-y-1">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1.5">
              <Code className="w-3 h-3 text-indigo-400" />
              <span>Registered REST Contract</span>
            </div>
            <div>GET /api/dashboard/&#123;customerId&#125;</div>
            <div>GET /api/financial-health/&#123;customerId&#125;</div>
            <div>GET /api/forecast/&#123;customerId&#125;</div>
            <div>GET /api/early-warning/&#123;customerId&#125;</div>
            <div>POST /api/simulate</div>
            <div>GET /api/recommendations/&#123;customerId&#125;</div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
