import axios from 'axios';
import {
  Customer,
  CustomerDashboardData,
  FinancialHealthData,
  EarlyWarningData,
  Recommendation,
  Obligation,
  SimulationInput,
  SimulationResult,
  FinancialJourneyPoint,
  StressCategoryItem,
  EarlyWarningAlert,
  RecoveryPlan,
  FinancialGoal,
  SubscriptionAnalytics,
  MonthlyStoryData,
  AdvisorDashboardData,
  DataPrivacyConsent,
} from '../types/financial';
import {
  CUSTOMERS,
  MOCK_DASHBOARD_DATA,
  MOCK_FINANCIAL_HEALTH,
  MOCK_EARLY_WARNING,
  MOCK_OBLIGATIONS,
  MOCK_RECOMMENDATIONS,
  MOCK_TIMELINE_DATA,
  MOCK_STRESS_HEATMAP,
  MOCK_ALERT_CENTER_DATA,
  MOCK_RECOVERY_PLANS,
  MOCK_GOALS_DATA,
  MOCK_SUBSCRIPTION_DATA,
  MOCK_MONTHLY_STORY,
  MOCK_ADVISOR_DATA,
  MOCK_PRIVACY_DATA,
  calculateSimulation,
} from '../data/mockData';

// Base API configuration (ready for future FastAPI backend)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Flag to indicate whether to connect to real FastAPI or use fast client mock
let useRealBackend = false;

export function setUseRealBackend(enabled: boolean) {
  useRealBackend = enabled;
}

export function isUsingRealBackend(): boolean {
  return useRealBackend;
}

/**
 * API Service Layer for CashTwin
 */
export const financialApi = {
  /**
   * Fetch list of demo customers
   */
  async getCustomers(): Promise<Customer[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<Customer[]>('/customers');
        return response.data;
      } catch (err) {
        console.warn('Backend unavailable, falling back to local mock data:', err);
      }
    }
    return Promise.resolve(CUSTOMERS);
  },

  /**
   * Fetch customer dashboard overview
   * Endpoint: GET /api/dashboard/{customerId}
   */
  async getDashboard(customerId: string): Promise<CustomerDashboardData> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<CustomerDashboardData>(`/dashboard/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /dashboard/${customerId}, using mock data:`, err);
      }
    }
    const data = MOCK_DASHBOARD_DATA[customerId] || MOCK_DASHBOARD_DATA['CUST-003'];
    return Promise.resolve(data);
  },

  /**
   * Fetch deep financial resilience breakdown
   * Endpoint: GET /api/financial-health/{customerId}
   */
  async getFinancialHealth(customerId: string): Promise<FinancialHealthData> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<FinancialHealthData>(`/financial-health/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /financial-health/${customerId}, using mock data:`, err);
      }
    }
    const data = MOCK_FINANCIAL_HEALTH[customerId] || MOCK_FINANCIAL_HEALTH['CUST-003'];
    return Promise.resolve(data);
  },

  /**
   * Fetch 30-day cash forecast & obligations
   * Endpoint: GET /api/forecast/{customerId}
   */
  async getForecast(customerId: string) {
    if (useRealBackend) {
      try {
        const response = await apiClient.get(`/forecast/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /forecast/${customerId}, using mock data:`, err);
      }
    }
    const dashboard = MOCK_DASHBOARD_DATA[customerId] || MOCK_DASHBOARD_DATA['CUST-003'];
    const obligations = MOCK_OBLIGATIONS[customerId] || MOCK_OBLIGATIONS['CUST-003'];

    const minBalance = dashboard.forecast.reduce(
      (min, pt) => (pt.balance < min ? pt.balance : min),
      dashboard.forecast[0].balance
    );

    return Promise.resolve({
      forecast: dashboard.forecast,
      safetyThreshold: dashboard.safetyThreshold,
      currentBalance: dashboard.metrics.currentBalance,
      projectedMinimum: minBalance,
      potentialShortfall: dashboard.earlyWarning.potentialCashGap,
      expectedStressPointDays: dashboard.earlyWarning.expectedDays,
      obligations,
      insight:
        dashboard.earlyWarning.potentialCashGap > 0
          ? 'Your projected balance is approaching the safety threshold because upcoming obligations are temporarily higher than available cash flow.'
          : 'Your projected cashflow comfortably maintains a positive buffer balance through the next 30 days.',
    });
  },

  /**
   * Fetch early warning drivers and explainability
   * Endpoint: GET /api/early-warning/{customerId}
   */
  async getEarlyWarning(customerId: string): Promise<EarlyWarningData> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<EarlyWarningData>(`/early-warning/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /early-warning/${customerId}, using mock data:`, err);
      }
    }
    const data = MOCK_EARLY_WARNING[customerId] || MOCK_EARLY_WARNING['CUST-003'];
    return Promise.resolve(data);
  },

  /**
   * Test a What-If financial simulation
   * Endpoint: POST /api/simulate
   */
  async simulate(customerId: string, input: SimulationInput): Promise<SimulationResult> {
    if (useRealBackend) {
      try {
        const response = await apiClient.post<SimulationResult>('/simulate', {
          customerId,
          ...input,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend call failed for /simulate, using client calculator:', err);
      }
    }
    const result = calculateSimulation(customerId, input);
    return Promise.resolve(result);
  },

  /**
   * Fetch personalized action plan recommendations
   * Endpoint: GET /api/recommendations/{customerId}
   */
  async getRecommendations(customerId: string): Promise<Recommendation[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<Recommendation[]>(`/recommendations/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /recommendations/${customerId}, using mock data:`, err);
      }
    }
    const recs = MOCK_RECOMMENDATIONS[customerId] || MOCK_RECOMMENDATIONS['CUST-003'];
    return Promise.resolve(recs);
  },

  /**
   * FEATURE 1: Fetch Financial Journey Timeline
   * Endpoint: GET /api/timeline/{customerId}
   */
  async getTimeline(customerId: string): Promise<FinancialJourneyPoint[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<FinancialJourneyPoint[]>(`/timeline/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /timeline/${customerId}, using mock data:`, err);
      }
    }
    const timeline = MOCK_TIMELINE_DATA[customerId] || MOCK_TIMELINE_DATA['CUST-003'];
    return Promise.resolve(timeline);
  },

  /**
   * FEATURE 3: Fetch Financial Stress Heatmap
   * Endpoint: GET /api/stress-heatmap/{customerId}
   */
  async getStressHeatmap(customerId: string): Promise<StressCategoryItem[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<StressCategoryItem[]>(`/stress-heatmap/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /stress-heatmap/${customerId}, using mock data:`, err);
      }
    }
    const heatmap = MOCK_STRESS_HEATMAP[customerId] || MOCK_STRESS_HEATMAP['CUST-003'];
    return Promise.resolve(heatmap);
  },

  /**
   * FEATURE 4: Fetch Early Warning Alert Center
   * Endpoint: GET /api/alerts/{customerId}
   */
  async getAlerts(customerId: string): Promise<EarlyWarningAlert[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<EarlyWarningAlert[]>(`/alerts/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /alerts/${customerId}, using mock data:`, err);
      }
    }
    const alerts = MOCK_ALERT_CENTER_DATA[customerId] || MOCK_ALERT_CENTER_DATA['CUST-003'];
    return Promise.resolve(alerts);
  },

  /**
   * FEATURE 5: Fetch Personalized Recovery Plan
   * Endpoint: GET /api/recovery-plan/{customerId}
   */
  async getRecoveryPlan(customerId: string): Promise<RecoveryPlan> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<RecoveryPlan>(`/recovery-plan/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /recovery-plan/${customerId}, using mock data:`, err);
      }
    }
    const plan = MOCK_RECOVERY_PLANS[customerId] || MOCK_RECOVERY_PLANS['CUST-003'];
    return Promise.resolve(plan);
  },

  /**
   * FEATURE 6: Fetch Financial Goals
   * Endpoint: GET /api/goals/{customerId}
   */
  async getGoals(customerId: string): Promise<FinancialGoal[]> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<FinancialGoal[]>(`/goals/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /goals/${customerId}, using mock data:`, err);
      }
    }
    const goals = MOCK_GOALS_DATA[customerId] || MOCK_GOALS_DATA['CUST-003'];
    return Promise.resolve(goals);
  },

  /**
   * FEATURE 7: Fetch Subscription Analytics
   * Endpoint: GET /api/subscriptions/{customerId}
   */
  async getSubscriptions(customerId: string): Promise<SubscriptionAnalytics> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<SubscriptionAnalytics>(`/subscriptions/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /subscriptions/${customerId}, using mock data:`, err);
      }
    }
    const subs = MOCK_SUBSCRIPTION_DATA[customerId] || MOCK_SUBSCRIPTION_DATA['CUST-003'];
    return Promise.resolve(subs);
  },

  /**
   * FEATURE 10: Fetch Monthly Financial Story
   * Endpoint: GET /api/monthly-story/{customerId}
   */
  async getMonthlyStory(customerId: string): Promise<MonthlyStoryData> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<MonthlyStoryData>(`/monthly-story/${customerId}`);
        return response.data;
      } catch (err) {
        console.warn(`Backend call failed for /monthly-story/${customerId}, using mock data:`, err);
      }
    }
    const story = MOCK_MONTHLY_STORY[customerId] || MOCK_MONTHLY_STORY['CUST-003'];
    return Promise.resolve(story);
  },

  /**
   * FEATURE 11: Fetch Bank / Advisor Portal Data
   * Endpoint: GET /api/advisor-dashboard
   */
  async getAdvisorDashboard(): Promise<AdvisorDashboardData> {
    if (useRealBackend) {
      try {
        const response = await apiClient.get<AdvisorDashboardData>('/advisor-dashboard');
        return response.data;
      } catch (err) {
        console.warn('Backend call failed for /advisor-dashboard, using mock data:', err);
      }
    }
    return Promise.resolve(MOCK_ADVISOR_DATA);
  },

  /**
   * FEATURE 12: Fetch & Save Data Privacy Settings
   */
  async getPrivacyConsent(): Promise<DataPrivacyConsent> {
    return Promise.resolve(MOCK_PRIVACY_DATA);
  },

  async savePrivacyConsent(consent: DataPrivacyConsent): Promise<DataPrivacyConsent> {
    return Promise.resolve({ ...consent, lastUpdated: 'Just now' });
  },
};
