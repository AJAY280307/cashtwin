import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SettingsModal } from './SettingsModal';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = (pathname: string) => {
    switch (pathname) {
      case '/':
        return {
          title: 'Resilience Dashboard',
          subtitle: 'Proactive early-warning surveillance & liquidity horizon',
        };
      case '/financial-health':
        return {
          title: 'Financial Health',
          subtitle: 'Explainable decomposition of resilience pillars and debt ratios',
        };
      case '/cash-forecast':
        return {
          title: 'Cash Forecast',
          subtitle: 'Deterministic 30-day balance trajectory & obligations timeline',
        };
      case '/early-warning':
        return {
          title: 'Early Warning Engine',
          subtitle: 'Root-cause attribution and pre-default diagnostic factors',
        };
      case '/simulator':
        return {
          title: 'What-If Simulator',
          subtitle: 'Interactive intervention testbed — measure crisis prevention live',
        };
      case '/recommendations':
        return {
          title: 'Personalized Interventions',
          subtitle: 'Responsible, non-predatory action plan based on risk drivers',
        };
      default:
        return {
          title: 'CashTwin',
          subtitle: 'Proactive Financial Intelligence',
        };
    }
  };

  const meta = getPageMeta(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar for Desktop & Mobile */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-w-0 min-h-screen">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Responsible Banking Footer */}
        <footer className="border-t border-slate-200/80 bg-white px-4 sm:px-8 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-800 tracking-tight">CASHTWIN</span>
              <span>&bull;</span>
              <span className="text-slate-400">
                DETECT &rarr; PREDICT &rarr; EXPLAIN &rarr; SIMULATE &rarr; INTERVENE &rarr; PREVENT
              </span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-slate-400">
              <span>Zero Predatory Lending</span>
              <span>&bull;</span>
              <span>Explainable AI Attribution</span>
              <span>&bull;</span>
              <span>Bank Hardship Protection</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Settings / Demo Persona Modal */}
      <SettingsModal />
    </div>
  );
};
