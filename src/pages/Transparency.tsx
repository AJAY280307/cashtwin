import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import {
  ShieldCheck,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Sliders,
  Sparkles,
  Info,
  Trash2,
  HeartHandshake,
} from 'lucide-react';

export const Transparency: React.FC = () => {
  const { selectedCustomer, accessibility, activeAlerts, goals, subscriptions } = useCustomer();

  const [consents, setConsents] = useState({
    cashflowAnalytics: true,
    predictiveAlerts: true,
    anonymizedBenchmarking: true,
    thirdPartySharing: false, // Permanently false
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const toggleConsent = (key: keyof typeof consents) => {
    if (key === 'thirdPartySharing') return; // Cannot be enabled
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadData = () => {
    const exportPayload = {
      exportMetadata: {
        platform: 'CashTwin AI Financial Distress Prevention Platform',
        exportedAt: new Date().toISOString(),
        customerAccount: selectedCustomer.accountNumber,
        customerName: selectedCustomer.name,
      },
      customerProfile: selectedCustomer,
      dataPermissions: consents,
      activeGoals: goals,
      subscriptions: subscriptions,
      earlyWarningAlerts: activeAlerts,
      privacyCommitment: {
        zeroPredatoryLending: true,
        zeroCreditBureauSharing: true,
        thirdPartyAdSales: false,
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CashTwin_Data_Export_${selectedCustomer.id}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Responsible AI Governance
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
              Full Transparency
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Your Data & AI Transparency
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete openness into what data is analyzed, how models work, and how your privacy is protected
          </p>
        </div>

        <button
          type="button"
          id="btn-download-my-data"
          onClick={handleDownloadData}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Download My Data (JSON)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center space-x-2 animate-in fade-in duration-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your complete CashTwin data package has been exported and downloaded.</span>
        </div>
      )}

      {cacheCleared && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-900 flex items-center space-x-2 animate-in fade-in duration-100">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>Local modeling session cache cleared. Baseline parameters refreshed.</span>
        </div>
      )}

      {/* 2-Column Core Architecture: What We Analyze & Why */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Information is Analyzed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Eye className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              1. What Financial Information is Analyzed
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Current Balance & Inflows: </strong>
                Verified recurring payroll credits and available checking liquidity.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Contractual Obligations: </strong>
                Scheduled EMIs, rent, utility auto-debits, and insurance premiums.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Discretionary Spending Outlays: </strong>
                Aggregated lifestyle, dining, entertainment, and recurring subscriptions.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Historical Buffer Burn Rates: </strong>
                Rate at which liquid emergency savings expand or contract across prior months.
              </div>
            </li>
          </ul>
        </div>

        {/* Why it is Analyzed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              2. Why It is Analyzed
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Early Distress Detection: </strong>
                To identify cashflow deficits 14 to 30 days before auto-debit failure occurs.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Explainable Root Causes: </strong>
                To transparently show <em>why</em> risk increased (e.g. higher discretionary spend vs declining savings).
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
              <div>
                <strong className="text-slate-900">Credit Score Protection: </strong>
                To enable voluntary budget trimming or bank restructuring without penalty fees.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* What the AI Does vs What the AI Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What AI Does */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">What CashTwin AI DOES</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Calculates forward-looking 30-day deterministic balance trajectories.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Allows interactive "What-If" simulation before making large purchases.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Generates structured 4-week recovery roadmaps with concrete savings steps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Answers live queries via Bachat Mitra AI Co-Pilot with context awareness.</span>
            </li>
          </ul>
        </div>

        {/* What AI Does NOT Do */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 text-rose-800">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-extrabold text-slate-900">What CashTwin AI DOES NOT Do</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Does NOT</strong> sell high-interest emergency debt or predatory payday loans.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Does NOT</strong> report distress flags or early warnings to credit rating agencies.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Does NOT</strong> sell, share, or broker customer data to third-party advertisers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Does NOT</strong> execute debits, transfers, or account changes without consent.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* User Controls, Consent & Privacy Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              User Privacy Controls & Permissions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Granularly configure how your financial data is processed
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Modeling Cache</span>
          </button>
        </div>

        <div className="space-y-3 divide-y divide-slate-100 text-xs">
          {/* Toggle 1: Cashflow Analytics */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Deterministic Cashflow Modeling</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Allows CashTwin to project 30-day balance trajectories based on historical obligations.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consents.cashflowAnalytics}
                onChange={() => toggleConsent('cashflowAnalytics')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Toggle 2: Predictive Early Alerts */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Predictive Early Warning Alerts</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Surfaces proactive notifications when liquidity buffer drops below 30 days.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consents.predictiveAlerts}
                onChange={() => toggleConsent('predictiveAlerts')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Toggle 3: Anonymized Benchmarking */}
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Anonymized Cohort Benchmarks</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Calculates category benchmarks against anonymized peer cohorts to calibrate realistic savings.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consents.anonymizedBenchmarking}
                onChange={() => toggleConsent('anonymizedBenchmarking')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Toggle 4: Third-Party Sharing (Strictly Locked Off) */}
          <div className="pt-3 flex items-center justify-between opacity-60">
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Third-Party Data Sharing</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  Permanently Disabled
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                CashTwin strictly prohibits sharing customer telemetry with third-party advertisers or loan brokers.
              </p>
            </div>
            <div className="w-9 h-5 bg-slate-200 rounded-full relative cursor-not-allowed">
              <div className="w-4 h-4 bg-white rounded-full absolute top-[2px] left-[2px] border border-slate-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
