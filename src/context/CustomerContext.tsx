import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, SimulationInput } from '../types/financial';

interface CustomerContextType {
  customers: Customer[];
  selectedCustomerId: string;
  selectedCustomer: Customer | null;
  setSelectedCustomerId: (id: string) => void;
  simulationPreset: SimulationInput | null;
  setSimulationPreset: (preset: SimulationInput | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'warning' | 'info' | 'success';
    read: boolean;
  }>;
  markNotificationsAsRead: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('U00001');
  const [simulationPreset, setSimulationPreset] = useState<SimulationInput | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<CustomerContextType['notifications']>([]);

  useEffect(() => {
    let mounted = true;
    import('../services/api').then(({ financialApi }) => {
      financialApi.getCustomers().then((res) => {
        if (mounted) {
          setCustomers(res);
          if (res.length > 0) {
            // Default to U00001 if exists, otherwise first
            const hasU1 = res.find(c => c.id === 'U00001');
            setSelectedCustomerId(hasU1 ? 'U00001' : res[0].id);
          }
          setLoading(false);
        }
      }).catch(err => {
        console.error("Failed to load customers:", err);
        if (mounted) setLoading(false);
      });
    });
    return () => { mounted = false; };
  }, []);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Loading CashTwin Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomerId,
        selectedCustomer,
        setSelectedCustomerId,
        simulationPreset,
        setSimulationPreset,
        isSettingsOpen,
        setIsSettingsOpen,
        notifications,
        markNotificationsAsRead,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
