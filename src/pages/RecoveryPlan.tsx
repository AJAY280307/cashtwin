import React, { useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  RotateCcw,
  ListTodo,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecoveryPlan: React.FC = () => {
  const { recoveryPlan, toggleRecoveryTask, selectedCustomer } = useCustomer();
  const [selectedWeek, setSelectedWeek] = useState<number | 'ALL'>('ALL');

  if (!recoveryPlan) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading personalized recovery plan...
      </div>
    );
  }

  const tasks = recoveryPlan.tasks;
  const completedTasks = tasks.filter((t) => t.completed);
  const upcomingTasks = tasks.filter((t) => !t.completed);
  const progressPercent = Math.round((completedTasks.length / tasks.length) * 100);

  // Group tasks by week
  const filteredTasks = selectedWeek === 'ALL' ? tasks : tasks.filter((t) => t.week === selectedWeek);

  const weekTitles: Record<number, string> = {
    1: 'Week 1: Review Unnecessary Spending',
    2: 'Week 2: Reduce Discretionary Expenses',
    3: 'Week 3: Build Emergency Savings',
    4: 'Week 4: Review EMI Commitments',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Personalized Action Roadmap
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              4-Week Structured Plan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Your Financial Recovery Plan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted weekly milestones to restore buffer runway and permanently lower distress risk
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <span>Simulate Outcome</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Hero Progress Tracker Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Progress Bar & Summary */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Plan Completion Progress
              </span>
              <span className="text-lg font-extrabold font-mono text-indigo-600">
                {progressPercent}% Done ({completedTasks.length}/{tasks.length} Actions)
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {progressPercent === 100
                ? '🎉 Congratulations! You have completed all recovery actions. Your financial cushion is fully restored.'
                : `Complete the remaining ${upcomingTasks.length} tasks to reach a healthy 30-day liquidity buffer.`}
            </p>
          </div>

          {/* Estimated Financial Improvement KPI Tile */}
          <div className="md:col-span-4 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-center sm:text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Estimated Financial Improvement
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
              +₹{recoveryPlan.totalEstimatedImprovement.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500"> / month</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{recoveryPlan.resilienceBoost} Resilience Score Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedWeek('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedWeek === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All 4 Weeks ({tasks.length})
        </button>
        {[1, 2, 3, 4].map((wk) => {
          const wkTasks = tasks.filter((t) => t.week === wk);
          const wkDone = wkTasks.filter((t) => t.completed).length;
          return (
            <button
              key={wk}
              type="button"
              onClick={() => setSelectedWeek(wk)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                selectedWeek === wk
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Week {wk}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedWeek === wk
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {wkDone}/{wkTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-6">
        {[1, 2, 3, 4]
          .filter((wk) => selectedWeek === 'ALL' || selectedWeek === wk)
          .map((wk) => {
            const wkTasks = tasks.filter((t) => t.week === wk);
            if (wkTasks.length === 0) return null;

            return (
              <div key={wk} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono">
                      W{wk}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {weekTitles[wk]}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {wkTasks.filter((t) => t.completed).length}/{wkTasks.length} completed
                  </span>
                </div>

                <div className="space-y-3">
                  {wkTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleRecoveryTask(task.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3.5 select-none ${
                        task.completed
                          ? 'bg-emerald-50/40 border-emerald-200 opacity-90'
                          : 'bg-slate-50/50 border-slate-200/80 hover:bg-white hover:border-indigo-200 hover:shadow-2xs'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                        className="mt-0.5 shrink-0 focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-600 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-xs font-bold ${
                              task.completed
                                ? 'text-emerald-950 line-through'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                              task.completed
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}
                          >
                            {task.impact}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                            Category: {task.category}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-[10px] font-bold text-emerald-700">
                            Est. Savings: ₹{task.estimatedSavings.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Guidance Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Need help executing these steps?</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Bachat Mitra can guide you step-by-step or draft bank restructuring requests on your behalf.
            </p>
          </div>
        </div>

        <Link
          to="/subscriptions"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors"
        >
          Start with Subscriptions &rarr;
        </Link>
      </div>
    </div>
  );
};
