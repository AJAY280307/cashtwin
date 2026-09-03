import axios from 'axios';
import {
  BackendCompleteAnalysisResponse,
  BackendCustomerListResponse,
  BackendSimulationResult
} from '../types/backend';
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

let cachedAnalysis: { customerId: string; data: BackendCompleteAnalysisResponse } | null = null;

async function getAnalysis(customerId: string): Promise<BackendCompleteAnalysisResponse> {
  if (cachedAnalysis && cachedAnalysis.customerId === customerId) {
    return cachedAnalysis.data;
  }
  const response = await apiClient.get<BackendCompleteAnalysisResponse>(`/customers/${customerId}/analysis`);
  cachedAnalysis = { customerId, data: response.data };
  return response.data;
}

function mapRiskLevel(backendRisk: string): RiskLevel {
  const mapping: Record<string, RiskLevel> = {
    'DISTRESS': 'HIGH_RISK',
    'HIGH': 'HIGH_RISK',
    'AT_RISK': 'AT_RISK',
    'WATCH': 'WATCH',
    'LOW': 'HEALTHY',
    'HEALTHY': 'HEALTHY'
  };
  return mapping[backendRisk?.toUpperCase()] || 'HEALTHY';
}

function mapCustomer(backendCust: any, riskLevel: string, resilienceScore: number): Customer {
  return {
    id: String(backendCust.user_id),
    name: backendCust.name || `Customer ${String(backendCust.user_id).substring(0,6)}`,
    accountNumber: backendCust.account_number || `•••• ${String(backendCust.user_id).substring(0,4)}`,
    avatarUrl: undefined,
    riskLevel: mapRiskLevel(riskLevel),
    resilienceScore: resilienceScore,
    occupation: backendCust.job_title || backendCust.employment_status || 'Customer',
    monthlyIncome: backendCust.monthly_income_usd || 0,
  };
}

export const financialApi = {
  /**
   * Fetch list of demo customers
   */
  async getCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<BackendCustomerListResponse>('/customers');
    return response.data.customers.map(c => ({
      id: String(c.user_id),
      name: c.display_name,
      accountNumber: `ΓÇóΓÇóΓÇóΓÇó ${String(c.user_id).substring(0,4)}`,
      riskLevel: 'HEALTHY' as RiskLevel, // Default until selected
      resilienceScore: 0,
      occupation: 'Customer',
      monthlyIncome: 0
    }));
  },

  /**
   * Fetch customer dashboard overview
   * Endpoint: GET /api/dashboard/{customerId}
   */
  async getDashboard(customerId: string): Promise<CustomerDashboardData> {
    const data = await getAnalysis(customerId);
    
    const customer = mapCustomer(data.customer, data.financial_health.risk_level, data.financial_health.financial_resilience_score);
    
    // Map forecast points
    let forecast: ForecastPoint[] = [];
    if (data.forecast) {
      forecast = data.forecast.daily_projection.map((pt) => ({
        day: pt.day,
        label: `Day ${pt.day}`,
        date: `Day ${pt.day}`,
        balance: pt.projected_cash,
        safetyThreshold: data.customer.monthly_expenses_usd || 5000,
        zeroLine: 0,
        isStressed: pt.projected_cash < 0
      }));
    }

    // Default dummy for safety
    if (forecast.length === 0) {
      forecast = [{ day: 0, label: 'Today', date: 'Today', balance: 0, safetyThreshold: 0, zeroLine: 0 }];
    }

    let quickRec = data.recommendations?.recommendations?.[0] || { recommendation: "Maintain positive balances.", title: "No Action Needed", category: "none" };

    return {
      customer,
      resilienceScore: data.financial_health.financial_resilience_score,
      riskLevel: mapRiskLevel(data.financial_health.risk_level),
      resilienceMessage: data.explanation.summary || 'Financial position loaded.',
      metrics: {
        currentBalance: data.forecast?.starting_cash || data.customer.savings_usd || 0,
        monthlyIncome: data.customer.monthly_income_usd || 0,
        upcomingEmi: data.customer.monthly_emi_usd || 0,
        cashBufferDays: Math.round(data.financial_health.cash_buffer_score),
      },
      forecast,
      safetyThreshold: data.customer.monthly_expenses_usd || 5000,
      earlyWarning: {
        hasWarning: (data.forecast?.cash_gap || 0) > 0,
        stressDetected: (data.forecast?.cash_gap || 0) > 0,
        potentialCashGap: data.forecast?.cash_gap || 0,
        expectedDays: data.forecast?.stress_date || 0,
        urgency: data.forecast?.cash_gap && data.forecast.cash_gap > 0 ? 'high' : 'low',
        headline: `Risk Level: ${data.explanation.overall_risk}` || 'Cashflow steady',
      },
      quickRecommendation: {
        actionText: quickRec.recommendation,
        impactText: `Category: ${quickRec.category}`,
        riskFrom: mapRiskLevel(data.financial_health.risk_level),
        riskTo: mapRiskLevel(data.financial_health.risk_level),
      },
    };
  },

  /**
   * Fetch deep financial resilience breakdown
   * Endpoint: GET /api/financial-health/{customerId}
   */
  async getFinancialHealth(customerId: string): Promise<FinancialHealthData> {
    const data = await getAnalysis(customerId);
    const customer = mapCustomer(data.customer, data.financial_health.risk_level, data.financial_health.financial_resilience_score);

    const components: ResilienceComponent[] = [
      { id: 'c1', name: 'Cash Buffer', score: data.financial_health.cash_buffer_score, weight: 25, status: mapRiskLevel(data.financial_health.cash_buffer_score > 60 ? 'LOW' : 'HIGH'), description: 'Cash reserves compared to obligations' },
      { id: 'c2', name: 'Income Stability', score: data.financial_health.income_stability_score, weight: 20, status: mapRiskLevel(data.financial_health.income_stability_score > 60 ? 'LOW' : 'HIGH'), description: 'Stability of regular income' },
      { id: 'c3', name: 'Expense Pressure', score: data.financial_health.expense_pressure_score, weight: 20, status: mapRiskLevel(data.financial_health.expense_pressure_score > 60 ? 'LOW' : 'HIGH'), description: 'Proportion of income consumed by expenses' },
      { id: 'c4', name: 'Debt Burden', score: data.financial_health.debt_burden_score, weight: 20, status: mapRiskLevel(data.financial_health.debt_burden_score > 60 ? 'LOW' : 'HIGH'), description: 'Total debt obligation pressure' },
      { id: 'c5', name: 'ML Risk (Distress)', score: data.financial_health.ml_risk_score, weight: 15, status: mapRiskLevel(data.financial_health.ml_risk_score > 60 ? 'LOW' : 'HIGH'), description: 'Machine learning derived distress probability' },
    ];

    return {
      customer,
      resilienceScore: data.financial_health.financial_resilience_score,
      riskLevel: mapRiskLevel(data.financial_health.risk_level),
      components,
      ratios: {
        monthlyIncome: data.customer.monthly_income_usd || 0,
        monthlyExpenses: data.customer.monthly_expenses_usd || 0,
        savings: data.customer.savings_usd || 0,
        monthlyEmi: data.customer.monthly_emi_usd || 0,
        debtToIncomeRatio: (data.customer.debt_to_income_ratio || 0) * 100,
        expenseToIncomeRatio: (data.customer.expense_to_income_ratio || 0) * 100,
        liquidRunwayDays: Math.round(data.financial_health.cash_buffer_score),
      },
      timelineStatus: (mapRiskLevel(data.financial_health.risk_level) === 'HIGH_RISK' ? 'DISTRESS' : mapRiskLevel(data.financial_health.risk_level)) as any,
      scoreExplanation: data.explanation.summary || 'Score derived deterministically based on financial ratios.',
    };
  },

  /**
   * Fetch 30-day cash forecast & obligations
   * Endpoint: GET /api/forecast/{customerId}
   */
  async getForecast(customerId: string) {
    const data = await getAnalysis(customerId);
    
    let forecast: ForecastPoint[] = [];
    if (data.forecast) {
      forecast = data.forecast.daily_projection.map((pt) => ({
        day: pt.day,
        label: `Day ${pt.day}`,
        date: `Day ${pt.day}`,
        balance: pt.projected_cash,
        safetyThreshold: data.customer.monthly_expenses_usd || 5000,
        zeroLine: 0,
        isStressed: pt.projected_cash < 0
      }));
    } else {
      forecast = [{ day: 0, label: 'Today', date: 'Today', balance: 0, safetyThreshold: 0, zeroLine: 0 }];
    }

    // Since we don't have explicit obligations tracked beyond EMI in backend, mock a single EMI obligation
    const obligations: Obligation[] = [];
    if (data.customer.monthly_emi_usd && data.customer.monthly_emi_usd > 0) {
      obligations.push({
        id: 'ob-emi',
        title: 'Monthly EMI',
        category: 'EMI',
        amount: data.customer.monthly_emi_usd,
        dueDate: 'Upcoming',
        daysRemaining: 15,
        status: 'PENDING'
      });
    }

    return {
      forecast,
      safetyThreshold: data.customer.monthly_expenses_usd || 5000,
      currentBalance: data.forecast?.starting_cash || data.customer.savings_usd || 0,
      projectedMinimum: data.forecast?.minimum_projected_cash || 0,
      potentialShortfall: data.forecast?.cash_gap || 0,
      expectedStressPointDays: data.forecast?.stress_date || 0,
      obligations,
      insight: data.forecast?.insight || 'Forecast generated.',
    };
  },

  /**
   * Fetch early warning drivers and explainability
   * Endpoint: GET /api/early-warning/{customerId}
   */
  async getEarlyWarning(customerId: string): Promise<EarlyWarningData> {
    const data = await getAnalysis(customerId);
    const customer = mapCustomer(data.customer, data.financial_health.risk_level, data.financial_health.financial_resilience_score);

    return {
      customer,
      riskLevel: mapRiskLevel(data.financial_health.risk_level),
      potentialStressDays: data.forecast?.stress_date || 0,
      potentialCashGap: data.forecast?.cash_gap || 0,
      drivers: data.explanation.drivers.map((d, i) => ({
        id: `driver-${i}`,
        title: d.driver,
        contributionPercentage: d.score,
        observedPattern: d.evidence,
        impact: d.explanation,
        recommendedAction: 'See recommendations panel',
        severity: (d.severity.toLowerCase() as 'high' | 'medium' | 'low') || 'medium'
      })),
      journeyStage: (mapRiskLevel(data.financial_health.risk_level) === 'HIGH_RISK' ? 'CRISIS' : mapRiskLevel(data.financial_health.risk_level)) as any,
      journeyMessage: data.explanation.summary,
    };
  },

  /**
   * Test a What-If financial simulation
   * Endpoint: POST /api/simulate
   */
  async simulate(customerId: string, input: SimulationInput): Promise<SimulationResult> {
    const backendIntervention = {
      reduce_expenses_by: input.discretionarySpending || 0, 
      reduce_emi_by: input.monthlyEmi || 0,
      increase_savings_by: input.monthlySavings || 0,
      increase_income_by: 0
    };

    const response = await apiClient.post<BackendSimulationResult>(`/customers/${customerId}/simulate`, backendIntervention);
    const result = response.data;

    return {
      before: {
        riskScore: result.baseline_resilience_score,
        cashGap: result.baseline_cash_gap,
        minimumBalance: result.impacts.find(i => i.metric === 'Minimum Projected Cash')?.before_value || 0,
        riskLevel: mapRiskLevel(result.baseline_risk_level),
      },
      after: {
        riskScore: result.simulated_resilience_score,
        cashGap: result.simulated_cash_gap,
        minimumBalance: result.impacts.find(i => i.metric === 'Minimum Projected Cash')?.after_value || 0,
        riskLevel: mapRiskLevel(result.simulated_risk_level),
      },
      crisisPrevented: result.baseline_cash_gap > 0 && result.simulated_cash_gap === 0,
      explanation: result.summary,
      forecastPoints: [] // Deliberately omit fabricated forecast points as requested in Phase 10B rules
    };
  },

  /**
   * Fetch personalized action plan recommendations
   * Endpoint: GET /api/recommendations/{customerId}
   */
  async getRecommendations(customerId: string): Promise<Recommendation[]> {
    const data = await getAnalysis(customerId);

    return data.recommendations.recommendations.map((act, i) => ({
      id: `rec-${i}`,
      priority: act.priority,
      title: act.title,
      problem: act.evidence,
      action: act.recommendation,
      expectedImpact: `Category: ${act.category}`,
      riskReduction: {
        from: mapRiskLevel(data.financial_health.risk_level),
        to: mapRiskLevel(data.financial_health.risk_level),
      },
      cashGapImpact: {
        from: data.forecast?.cash_gap || 0,
        to: data.forecast?.cash_gap || 0,
      },
      reason: act.evidence,
      suggestedSimulation: undefined
    }));
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
