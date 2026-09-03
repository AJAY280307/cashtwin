import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  TrendingDown,
  AlertTriangle,
  SlidersHorizontal,
  Lightbulb,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { CustomerSelector } from './CustomerSelector';
import { useCustomer } from '../../context/CustomerContext';

interface Props {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  const { setIsSettingsOpen } = useCustomer();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      to: '/financial-health',
      label: 'Financial Health',
      icon: Activity,
      badge: undefined,
    },
    {
      to: '/cash-forecast',
      label: 'Cash Forecast',
      icon: TrendingDown,
      badge: undefined,
    },
    {
      to: '/early-warning',
      label: 'Early Warning',
      icon: AlertTriangle,
      badge: 'Action',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      to: '/simulator',
      label: 'What-If Simulator',
      icon: SlidersHorizontal,
      badge: 'Interactive',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    },
    {
      to: '/recommendations',
      label: 'Recommendations',
      icon: Lightbulb,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <NavLink to="/" className="flex items-center space-x-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight font-sans">
                    Cash<span className="text-indigo-600">Twin</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    BANK AI
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Proactive Distress Prevention
                </div>
              </div>
            </NavLink>
            <button
              type="button"
              id="close-mobile-nav-btn"
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Philosophy Banner */}
          <div className="mx-4 mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center justify-between">
              <span>Intervention Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[11px] font-medium text-slate-600 leading-snug">
              Predict &bull; Explain &bull; Simulate &bull; Prevent
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 mb-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Customer Switcher & Settings */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
          <CustomerSelector variant="sidebar" />

          <button
            type="button"
            id="open-settings-drawer-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Demo Controls & API</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">FastAPI</span>
          </button>
        </div>
      </aside>
    </>
  );
};
