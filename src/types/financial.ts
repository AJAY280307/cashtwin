export type RiskLevel = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'HIGH_RISK';

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  avatarUrl?: string;
  riskLevel: RiskLevel;
  resilienceScore: number; // 0 - 100
  occupation: string;
  monthlyIncome: number;
}

export interface MetricCardData {
  title: string;
  value: number;
  formattedValue: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtext: string;
  iconName: string;
}

export interface ForecastPoint {
  day: number;
  label: string; // e.g. "Today", "7 days", "14 days", "21 days", "30 days"
  date: string;
  balance: number;
  safetyThreshold: number;
  zeroLine: number;
  simulatedBalance?: number;
  isStressed?: boolean;
}

export interface Obligation {
  id: string;
  title: string;
  category: 'EMI' | 'RENT' | 'UTILITIES' | 'SUBSCRIPTION' | 'CREDIT_CARD';
  amount: number;
  dueDate: string;
  daysRemaining: number;
  status: 'PENDING' | 'SCHEDULED' | 'PAID';
}

export interface ResilienceComponent {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: RiskLevel;
  description: string;
}

export interface FinancialRatios {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  monthlyEmi: number;
  debtToIncomeRatio: number; // e.g. 28.5%
  expenseToIncomeRatio: number; // e.g. 75%
  liquidRunwayDays: number;
}

export interface RiskDriver {
  id: string;
  title: string;
  contributionPercentage: number;
  observedPattern: string;
  impact: string;
  recommendedAction: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Recommendation {
  id: string;
  priority: number;
  title: string;
  problem: string;
  action: string;
  expectedImpact: string;
  riskReduction: {
    from: RiskLevel;
    to: RiskLevel;
  };
  cashGapImpact: {
    from: number;
    to: number;
  };
  reason: string;
  suggestedSimulation?: Partial<SimulationInput>;
}

export interface SimulationInput {
  discretionarySpending: number;
  monthlyEmi: number;
  plannedExpense: number;
  monthlySavings: number;
}

export interface SimulationResult {
  before: {
    riskScore: number;
    cashGap: number;
    minimumBalance: number;
    riskLevel: RiskLevel;
  };
  after: {
    riskScore: number;
    cashGap: number;
    minimumBalance: number;
    riskLevel: RiskLevel;
  };
  crisisPrevented: boolean;
  explanation: string;
  forecastPoints: ForecastPoint[];
}

export interface CustomerDashboardData {
  customer: Customer;
  resilienceScore: number;
  riskLevel: RiskLevel;
  resilienceMessage: string;
  metrics: {
    currentBalance: number;
    monthlyIncome: number;
    upcomingEmi: number;
    cashBufferDays: number;
  };
  forecast: ForecastPoint[];
  safetyThreshold: number;
  earlyWarning: {
    hasWarning: boolean;
    stressDetected: boolean;
    potentialCashGap: number;
    expectedDays: number;
    urgency: 'high' | 'medium' | 'low';
    headline: string;
  };
  quickRecommendation: {
    actionText: string;
    impactText: string;
    riskFrom: RiskLevel;
    riskTo: RiskLevel;
  };
}

export interface EarlyWarningData {
  customer: Customer;
  riskLevel: RiskLevel;
  potentialStressDays: number;
  potentialCashGap: number;
  drivers: RiskDriver[];
  journeyStage: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'POTENTIAL_DISTRESS' | 'CRISIS';
  journeyMessage: string;
}

export interface FinancialHealthData {
  customer: Customer;
  resilienceScore: number;
  riskLevel: RiskLevel;
  components: ResilienceComponent[];
  ratios: FinancialRatios;
  timelineStatus: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'DISTRESS';
  scoreExplanation: string;
}
