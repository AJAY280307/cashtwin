import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { EarlyWarningAlert } from '../types/financial';
import { PrioritizedAlertCard } from '../components/alerts/PrioritizedAlertCard';
import {
  Bell,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  RotateCcw,
  CheckCircle2,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlertCenter: React.FC = () => {
  const { activeAlerts, dismissAlert, restoreAllAlerts, selectedCustomer } = useCustomer();
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<EarlyWarningAlert | null>(null);

  const visibleAlerts = activeAlerts.filter((a) => !a.dismissed);
  const filteredAlerts = visibleAlerts.filter((a) => {
    if (priorityFilter === 'ALL') return true;
    return a.priority === priorityFilter;
  });

  const highCount = visibleAlerts.filter((a) => a.priority === 'HIGH').length;
  const mediumCount = visibleAlerts.filter((a) => a.priority === 'MEDIUM').length;
  const lowCount = visibleAlerts.filter((a) => a.priority === 'LOW').length;
  const dismissedCount = activeAlerts.filter((a) => a.dismissed).length;

  return (
    <div className="space-y-6 pb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Proactive Alert Hub
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
              Early Intervention Signals
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Financial Early Warning Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized notifications designed to protect your credit and liquidity before fees or missed debits occur
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {dismissedCount > 0 && (
            <button
              type="button"
              onClick={restoreAllAlerts}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Dismissed ({dismissedCount})</span>
            </button>
          )}

          <Link
            to="/recovery-plan"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>Take Action Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Reassurance & Non-Judgmental Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 text-xs text-emerald-950 flex items-start space-x-3">
        <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">You are in control: </strong>
          CashTwin alerts are supportive, confidential diagnostic flags. No credit agencies are notified, and no account penalties are ever applied. We highlight changes early so you have weeks of breathing room to adjust smoothly.
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPriorityFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priorityFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Active Alerts ({visibleAlerts.length})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('HIGH')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priorityFilter === 'HIGH'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            High Priority ({highCount})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('MEDIUM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priorityFilter === 'MEDIUM'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Medium Priority ({mediumCount})
          </button>
          <button
            type="button"
            onClick={() => setPriorityFilter('LOW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              priorityFilter === 'LOW'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            Low Priority ({lowCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Monitoring {selectedCustomer.name} &bull; Acct {selectedCustomer.accountNumber}
        </span>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900">All Clear!</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {priorityFilter !== 'ALL'
              ? `No ${priorityFilter.toLowerCase()} priority alerts active at this moment.`
              : 'You have addressed or dismissed all current early warning signals.'}
          </p>
          {dismissedCount > 0 && (
            <button
              type="button"
              onClick={restoreAllAlerts}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              Restore Dismissed Alerts
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <PrioritizedAlertCard
              key={alert.id}
              alert={alert}
              onDismiss={dismissAlert}
              onViewDetails={(a) => setSelectedAlertForModal(a)}
            />
          ))}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Early Warning Diagnostic Detail
              </span>
              <button
                type="button"
                onClick={() => setSelectedAlertForModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <h3 className="text-base font-bold text-slate-900">
                {selectedAlertForModal.title}
              </h3>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-500 block text-[10px] uppercase mb-1">
                  Root Cause Analysis
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedAlertForModal.problemDetected}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <span className="font-bold text-indigo-700 block text-[10px] uppercase mb-1">
                  CashTwin Recommended Action
                </span>
                <p className="text-indigo-950 font-semibold leading-relaxed">
                  {selectedAlertForModal.suggestedAction}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAlertForModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              {selectedAlertForModal.actionRoute && (
                <Link
                  to={selectedAlertForModal.actionRoute}
                  onClick={() => setSelectedAlertForModal(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Go to Action &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
