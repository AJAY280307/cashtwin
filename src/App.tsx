import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerProvider } from './context/CustomerContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { FinancialHealth } from './pages/FinancialHealth';
import { CashForecast } from './pages/CashForecast';
import { EarlyWarning } from './pages/EarlyWarning';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Recommendations } from './pages/Recommendations';

export default function App() {
  return (
    <CustomerProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="financial-health" element={<FinancialHealth />} />
            <Route path="cash-forecast" element={<CashForecast />} />
            <Route path="early-warning" element={<EarlyWarning />} />
            <Route path="simulator" element={<WhatIfSimulator />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </CustomerProvider>
  );
}
