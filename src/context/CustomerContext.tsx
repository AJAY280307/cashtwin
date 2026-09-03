import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Customer,
  SimulationInput,
  AccessibilitySettings,
  EarlyWarningAlert,
  RecoveryPlan,
  FinancialGoal,
  SubscriptionItem,
  ChatMessage,
} from '../types/financial';
import {
  CUSTOMERS,
  DEFAULT_SIMULATION_INPUTS,
  MOCK_ALERT_CENTER_DATA,
  MOCK_RECOVERY_PLANS,
  MOCK_GOALS_DATA,
  MOCK_SUBSCRIPTION_DATA,
  MOCK_DASHBOARD_DATA,
} from '../data/mockData';

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

  // FEATURE 9: ACCESSIBILITY MODE
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  speakText: (text: string) => void;

  // FEATURE 4: ALERT CENTER
  activeAlerts: EarlyWarningAlert[];
  dismissAlert: (alertId: string) => void;
  restoreAllAlerts: () => void;

  // FEATURE 5: RECOVERY PLAN
  recoveryPlan: RecoveryPlan | null;
  toggleRecoveryTask: (taskId: string) => void;

  // FEATURE 6: FINANCIAL GOALS
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  removeGoal: (goalId: string) => void;

  // FEATURE 7: SUBSCRIPTIONS
  subscriptions: SubscriptionItem[];
  toggleSubscriptionActive: (subId: string) => void;

  // FEATURE 8: BACHAT MITRA CO-PILOT
  isMitraOpen: boolean;
  setIsMitraOpen: (open: boolean) => void;
  mitraMessages: ChatMessage[];
  sendMitraMessage: (text: string) => void;
  resetMitraChat: () => void;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  largerText: false,
  highContrast: false,
  simplifiedDashboard: false,
  voiceFriendly: false,
  reducedComplexity: false,
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('U00001');
  const [simulationPreset, setSimulationPreset] = useState<SimulationInput | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Accessibility settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('cashtwin_accessibility');
      return saved ? JSON.parse(saved) : DEFAULT_ACCESSIBILITY;
    } catch {
      return DEFAULT_ACCESSIBILITY;
    }
  });

  const updateAccessibility = (updated: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('cashtwin_accessibility', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not persist accessibility settings:', err);
      }
      return next;
    });
  };

  const speakText = useCallback(
    (text: string) => {
      if (!accessibility.voiceFriendly || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    },
    [accessibility.voiceFriendly]
  );

  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    import('../services/api').then(({ financialApi }) => {
      financialApi.getCustomers().then((res) => {
        if (mounted && res && res.length > 0) {
          setCustomers(res);
          const hasC3 = res.find(c => c.id === 'CUST-003');
          const hasU1 = res.find(c => c.id === 'U00001');
          setSelectedCustomerId(hasC3 ? 'CUST-003' : (hasU1 ? 'U00001' : res[0].id));
          setLoading(false);
        }
      }).catch(err => {
        console.warn("Using offline mock customers:", err);
        if (mounted) {
          setCustomers(CUSTOMERS);
          setLoading(false);
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Cashflow Stress Predicted',
      description: 'Projected balance approaches Γé╣1,200 threshold in 18 days. Action recommended.',
      timestamp: '12m ago',
      type: 'warning' as const,
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Upcoming EMI Reminder',
      description: 'Γé╣12,000 auto-debit scheduled for Nov 02.',
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

  // Dynamic feature states per customer
  const [activeAlerts, setActiveAlerts] = useState<EarlyWarningAlert[]>([]);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);

  // Bachat Mitra Chat State
  const [isMitraOpen, setIsMitraOpen] = useState(false);
  const [mitraMessages, setMitraMessages] = useState<ChatMessage[]>([]);

  // Load customer specific data when selected customer changes
  useEffect(() => {
    // 1. Alerts
    const alerts = MOCK_ALERT_CENTER_DATA[selectedCustomerId] || MOCK_ALERT_CENTER_DATA['CUST-003'];
    setActiveAlerts(alerts.map((a) => ({ ...a, dismissed: false })));

    // 2. Recovery Plan
    const plan = MOCK_RECOVERY_PLANS[selectedCustomerId] || MOCK_RECOVERY_PLANS['CUST-003'];
    setRecoveryPlan(JSON.parse(JSON.stringify(plan)));

    // 3. Goals
    const customerGoals = MOCK_GOALS_DATA[selectedCustomerId] || MOCK_GOALS_DATA['CUST-003'];
    setGoals(JSON.parse(JSON.stringify(customerGoals)));

    // 4. Subscriptions
    const subData = MOCK_SUBSCRIPTION_DATA[selectedCustomerId] || MOCK_SUBSCRIPTION_DATA['CUST-003'];
    setSubscriptions(JSON.parse(JSON.stringify(subData.subscriptions)));

    // 5. Notifications
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
          description: 'Deficit of Γé╣22,400 expected within 6 days. Restructuring urgent.',
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
          description: 'Projected balance approaches Γé╣1,200 threshold in 18 days. Action recommended.',
          timestamp: '12m ago',
          type: 'warning',
          read: false,
        },
        {
          id: 'notif-2',
          title: 'Upcoming EMI Reminder',
          description: 'Γé╣12,000 auto-debit scheduled for Nov 02.',
          timestamp: '2h ago',
          type: 'info',
          read: false,
        },
      ]);
    }

    // 6. Reset Mitra Welcome message tailored to selected persona
    const custName = CUSTOMERS.find((c) => c.id === selectedCustomerId)?.name || 'there';
    const baseDash = MOCK_DASHBOARD_DATA[selectedCustomerId] || MOCK_DASHBOARD_DATA['CUST-003'];
    const greeting = `Namaste ${custName}! I am Bachat Mitra, your AI Financial Co-Pilot. I monitor your cash balance (Γé╣${baseDash.metrics.currentBalance.toLocaleString('en-IN')}) and obligations (Γé╣${baseDash.metrics.upcomingEmi.toLocaleString('en-IN')} due). How can I assist your financial resilience today?`;
    
    setMitraMessages([
      {
        id: 'msg-welcome',
        sender: 'mitra',
        text: greeting,
        timestamp: 'Just now',
      },
    ]);
  }, [selectedCustomerId]);

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a))
    );
  };

  const restoreAllAlerts = () => {
    setActiveAlerts((prev) => prev.map((a) => ({ ...a, dismissed: false })));
  };

  const toggleRecoveryTask = (taskId: string) => {
    setRecoveryPlan((prev) => {
      if (!prev) return null;
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      return {
        ...prev,
        tasks: updatedTasks,
      };
    });
  };

  const addGoal = (newGoal: Omit<FinancialGoal, 'id'>) => {
    const goalWithId: FinancialGoal = {
      ...newGoal,
      id: `goal-custom-${Date.now()}`,
    };
    setGoals((prev) => [goalWithId, ...prev]);
  };

  const removeGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const toggleSubscriptionActive = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, active: !s.active } : s))
    );
  };

  const resetMitraChat = () => {
    const custName = selectedCustomer.name;
    const baseDash = MOCK_DASHBOARD_DATA[selectedCustomerId] || MOCK_DASHBOARD_DATA['CUST-003'];
    setMitraMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'mitra',
        text: `Namaste ${custName}! Conversation refreshed. I'm ready to evaluate your spending, simulate purchases, or guide your recovery plan.`,
        timestamp: 'Just now',
      },
    ]);
  };

  const sendMitraMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMitraMessages((prev) => [...prev, userMsg]);

    // Intelligent context-aware reply generation
    setTimeout(() => {
      const lower = text.toLowerCase();
      const baseDash = MOCK_DASHBOARD_DATA[selectedCustomerId] || MOCK_DASHBOARD_DATA['CUST-003'];
      const currentBalance = baseDash.metrics.currentBalance;
      const upcomingEmi = baseDash.metrics.upcomingEmi;
      const bufferDays = baseDash.metrics.cashBufferDays;

      let replyText = '';
      let actionSuggestion: ChatMessage['actionSuggestion'] = undefined;
      let structuredDetails: ChatMessage['structuredDetails'] = undefined;

      // Match Affordability check (e.g. "Can I afford Γé╣10,000", "Can I afford this purchase?", "10000 purchase")
      const purchaseMatch = text.match(/(?:afford|buy|purchase|spend)[^\d]*(\d[\d,]*)/i) || text.match(/(\d[\d,]*)\s*(?:rupees|rs|inr|purchase|spend)/i);
      
      if (purchaseMatch || lower.includes('can i afford')) {
        const rawAmount = purchaseMatch ? parseInt(purchaseMatch[1].replace(/,/g, ''), 10) : 10000;
        const purchaseAmount = isNaN(rawAmount) ? 10000 : rawAmount;
        const postBalance = currentBalance - purchaseAmount;
        const remainingSafetyMargin = postBalance - upcomingEmi;

        if (remainingSafetyMargin < 0) {
          replyText = `Based on your current financial pressure and upcoming commitments, delaying this Γé╣${purchaseAmount.toLocaleString('en-IN')} purchase is strongly recommended to protect your emergency fund. Your available balance is Γé╣${currentBalance.toLocaleString('en-IN')} and you have a scheduled EMI of Γé╣${upcomingEmi.toLocaleString('en-IN')} in 18 days. Completing this purchase now would create a projected deficit of Γé╣${Math.abs(remainingSafetyMargin).toLocaleString('en-IN')}.`;
          actionSuggestion = {
            label: 'Simulate Delaying Expense',
            route: '/simulator',
            preset: { plannedExpense: 0 },
          };
          structuredDetails = {
            amount: purchaseAmount,
            impactVerdict: 'STRESS_WARNING',
            bufferChange: `${bufferDays}d ΓåÆ ${Math.max(0, bufferDays - 9)}d`,
            recommendationSummary: 'Postpone until emergency buffer recovers above 30 days',
          };
        } else if (remainingSafetyMargin < 5000) {
          replyText = `You can technically cover this Γé╣${purchaseAmount.toLocaleString('en-IN')} purchase, but it will compress your safety margin to Γé╣${remainingSafetyMargin.toLocaleString('en-IN')} after your scheduled Γé╣${upcomingEmi.toLocaleString('en-IN')} EMI. Exercise caution.`;
          actionSuggestion = {
            label: 'Test in What-If Simulator',
            route: '/simulator',
            preset: { plannedExpense: purchaseAmount },
          };
          structuredDetails = {
            amount: purchaseAmount,
            impactVerdict: 'CAUTION',
            bufferChange: `${bufferDays}d ΓåÆ ${Math.max(1, bufferDays - 5)}d`,
            recommendationSummary: 'Tight buffer. Consider splitting into 2 monthly tranches.',
          };
        } else {
          replyText = `Yes, you can comfortably afford this Γé╣${purchaseAmount.toLocaleString('en-IN')} purchase. Even after accounting for your Γé╣${upcomingEmi.toLocaleString('en-IN')} EMI, you retain a healthy reserve of Γé╣${remainingSafetyMargin.toLocaleString('en-IN')}.`;
          structuredDetails = {
            amount: purchaseAmount,
            impactVerdict: 'AFFORDABLE',
            bufferChange: `${bufferDays}d buffer preserved`,
            recommendationSummary: 'Cushion safely absorbs the expenditure',
          };
        }
      } else if (lower.includes('help me save money') || lower.includes('save money')) {
        replyText = `Here are 3 immediate ways to save money without disrupting your lifestyle:\n1. Pause 2 inactive subscriptions (Cult.fit & Hotstar) to save Γé╣1,999/mo.\n2. Cap discretionary dining to Γé╣2,000/week, keeping Γé╣3,500 in your checking account.\n3. Automate a Γé╣1,500 weekly emergency buffer deposit.`;
        actionSuggestion = {
          label: 'Manage Subscriptions',
          route: '/subscriptions',
        };
      } else if (lower.includes('analyze my financial health') || lower.includes('health')) {
        replyText = `Your current Resilience Score is ${selectedCustomer.resilienceScore}/100 (${selectedCustomer.riskLevel.replace('_', ' ')}). Your income stability is strong, but your cash buffer is ${bufferDays} days against an upcoming Γé╣${upcomingEmi.toLocaleString('en-IN')} obligation. Your biggest point of friction is elevated discretionary spending (+18% this month).`;
        actionSuggestion = {
          label: 'View Stress Heatmap',
          route: '/heatmap',
        };
      } else if (lower.includes('why is my risk increasing') || lower.includes('risk')) {
        replyText = `Your financial pressure started increasing in March due to higher discretionary spending and declining net savings. Specifically:
ΓÇó Discretionary expenses rose to Γé╣14,500/mo (up 28%).
ΓÇó Monthly savings rate dropped from 26% down to 6%.
ΓÇó Upcoming EMI represents 65% of your available liquidity.`;
        actionSuggestion = {
          label: 'Inspect Journey Timeline',
          route: '/timeline',
        };
      } else if (lower.includes('recovery plan') || lower.includes('plan')) {
        replyText = `I have generated a 4-Week Financial Recovery Plan tailored to your risk profile. Completing all 4 weekly milestones is projected to restore Γé╣6,500 in monthly liquidity and elevate your resilience score into the Healthy category (+22 points).`;
        actionSuggestion = {
          label: 'Open Recovery Plan',
          route: '/recovery-plan',
        };
      } else if (lower.includes('reduce expenses') || lower.includes('cut expenses')) {
        replyText = `The fastest way to reduce expenses is cutting silent leaks and discretionary outlays. By reducing dining and pausing unused digital passes, you can immediately recover Γé╣5,000 to Γé╣6,500/mo in cash buffer.`;
        actionSuggestion = {
          label: 'Launch What-If Simulator',
          route: '/simulator',
          preset: { discretionarySpending: 3000 },
        };
      } else {
        replyText = `Thank you for sharing. Based on your active profile (${selectedCustomer.name}, Acct ${selectedCustomer.accountNumber}), I'm continuously monitoring your upcoming Γé╣${upcomingEmi.toLocaleString('en-IN')} commitments and liquidity runway. What scenario would you like to explore next?`;
      }

      const mitraMsg: ChatMessage = {
        id: `msg-mitra-${Date.now()}`,
        sender: 'mitra',
        text: replyText,
        timestamp: 'Just now',
        actionSuggestion,
        structuredDetails,
      };

      setMitraMessages((prev) => [...prev, mitraMsg]);
      speakText(replyText);
    }, 400);
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

        // Accessibility
        accessibility,
        updateAccessibility,
        speakText,

        // Alerts
        activeAlerts,
        dismissAlert,
        restoreAllAlerts,

        // Recovery Plan
        recoveryPlan,
        toggleRecoveryTask,

        // Goals
        goals,
        addGoal,
        removeGoal,

        // Subscriptions
        subscriptions,
        toggleSubscriptionActive,

        // Bachat Mitra
        isMitraOpen,
        setIsMitraOpen,
        mitraMessages,
        sendMitraMessage,
        resetMitraChat,
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

