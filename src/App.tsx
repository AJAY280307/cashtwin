import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerProvider } from './context/CustomerContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { FinancialHealth } from './pages/FinancialHealth';
import { CashForecast } from './pages/CashForecast';
import { EarlyWarning } from './pages/EarlyWarning';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Recommendations } from './pages/Recommendations';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { FinancialTimeline } from './pages/FinancialTimeline';
import { StressHeatmap } from './pages/StressHeatmap';
import { AlertCenter } from './pages/AlertCenter';
import { RecoveryPlan } from './pages/RecoveryPlan';
import { FinancialGoals } from './pages/FinancialGoals';
import { Subscriptions } from './pages/Subscriptions';
import { BankSupport } from './pages/BankSupport';
import { Transparency } from './pages/Transparency';

export default function App() {
  return (
    <CustomerProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="timeline" element={<FinancialTimeline />} />
              <Route path="heatmap" element={<StressHeatmap />} />
              <Route path="alert-center" element={<AlertCenter />} />
              <Route path="recovery-plan" element={<RecoveryPlan />} />
              <Route path="goals" element={<FinancialGoals />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="bank-support" element={<BankSupport />} />
              <Route path="transparency" element={<Transparency />} />
              <Route path="financial-health" element={<FinancialHealth />} />
              <Route path="cash-forecast" element={<CashForecast />} />
              <Route path="early-warning" element={<EarlyWarning />} />
              <Route path="simulator" element={<WhatIfSimulator />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </CustomerProvider>
  );
}
