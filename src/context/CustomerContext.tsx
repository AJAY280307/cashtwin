import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, SimulationInput } from '../types/financial';
import { CUSTOMERS, DEFAULT_SIMULATION_INPUTS } from '../data/mockData';

interface CustomerContextType {
  customers: Customer[];
  selectedCustomerId: string;
  selectedCustomer: Customer;
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
  // Default to CUST-003 (Rahul Verma - At Risk scenario from the hackathon prompt)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-003');
  const [simulationPreset, setSimulationPreset] = useState<SimulationInput | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const selectedCustomer =
    CUSTOMERS.find((c) => c.id === selectedCustomerId) || CUSTOMERS[2];

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Cashflow Stress Predicted',
      description: 'Projected balance approaches ₹1,200 threshold in 18 days. Action recommended.',
      timestamp: '12m ago',
      type: 'warning' as const,
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Upcoming EMI Reminder',
      description: '₹12,000 auto-debit scheduled for Nov 02.',
      timestamp: '2h ago',
      type: 'info' as const,
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Resilience Score Recalculated',
      description: 'Score updated to 64/100 following monthly expenditure pattern analysis.',
      timestamp: '1d ago',
      type: 'info' as const,
      read: true,
    },
  ]);

  // When customer changes, update notifications to match their context
  useEffect(() => {
    if (selectedCustomerId === 'CUST-001') {
      setNotifications([
        {
          id: 'notif-c1',
          title: 'Optimal Resilience Maintained',
          description: 'Cash buffer covers 48 days of obligations. No intervention needed.',
          timestamp: '1h ago',
          type: 'success',
          read: false,
        },
      ]);
    } else if (selectedCustomerId === 'CUST-002') {
      setNotifications([
        {
          id: 'notif-c2',
          title: 'Discretionary Outlay Spikes',
          description: 'Seasonal expenses could tighten end-of-month cushion.',
          timestamp: '30m ago',
          type: 'warning',
          read: false,
        },
      ]);
    } else if (selectedCustomerId === 'CUST-004') {
      setNotifications([
        {
          id: 'notif-c4',
          title: 'Critical Liquidity Alert',
          description: 'Deficit of ₹22,400 expected within 6 days. Restructuring urgent.',
          timestamp: '5m ago',
          type: 'warning',
          read: false,
        },
      ]);
    } else {
      setNotifications([
        {
          id: 'notif-1',
          title: 'Cashflow Stress Predicted',
          description: 'Projected balance approaches ₹1,200 threshold in 18 days. Action recommended.',
          timestamp: '12m ago',
          type: 'warning',
          read: false,
        },
        {
          id: 'notif-2',
          title: 'Upcoming EMI Reminder',
          description: '₹12,000 auto-debit scheduled for Nov 02.',
          timestamp: '2h ago',
          type: 'info',
          read: false,
        },
      ]);
    }
  }, [selectedCustomerId]);

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <CustomerContext.Provider
      value={{
        customers: CUSTOMERS,
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
