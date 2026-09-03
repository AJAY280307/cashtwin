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
  incomeReductionPercent?: number; // e.g. 0, 20 (What if I lose 20% income)
  largePurchaseAmount?: number;    // e.g. 0, 10000, 25000 (What happens if I make a large purchase)
}

export interface SimulationResult {
  before: {
    riskScore: number;
    cashGap: number;
    minimumBalance: number;
    riskLevel: RiskLevel;
    runwayDays: number;
    pressureScore: number; // 0-100
  };
  after: {
    riskScore: number;
    cashGap: number;
    minimumBalance: number;
    riskLevel: RiskLevel;
    runwayDays: number;
    pressureScore: number; // 0-100
  };
  savingsImpact: number;
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

// FEATURE 1: FINANCIAL DISTRESS TIMELINE
export interface FinancialJourneyPoint {
  month: string;         // 'January', 'February', 'March', 'April', 'May'
  shortMonth: string;    // 'Jan', 'Feb', 'Mar', 'Apr', 'May'
  status: string;        // 'Healthy', 'Stable', 'Early Warning', 'Moderate Risk', 'Intervention Recommended'
  healthScore: number;   // 88, 82, 68, 55, 48
  riskLevel: RiskLevel;
  monthlyIncome: number;
  monthlyExpenses: number;
  netSavings: number;
  bufferDays: number;
  aiInsight: string;
  contributingFactors: string[];
}

// FEATURE 3: FINANCIAL STRESS HEATMAP
export type StressPressureLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface StressCategoryItem {
  id: string;
  category: string;
  pressureLevel: StressPressureLevel;
  pressureScore: number; // 0 to 100
  metricLabel: string;
  metricValue: string;
  benchmark: string;
  statusDescription: string;
  whyItMatters: string;
  suggestedAction: string;
  routeLink: string;
}

// FEATURE 4: EARLY WARNING ALERT CENTER
export interface EarlyWarningAlert {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  problemDetected: string;
  whyItMatters: string;
  suggestedAction: string;
  category: string;
  timestamp: string;
  actionRoute?: string;
  actionLabel?: string;
  dismissed?: boolean;
}

// FEATURE 5: PERSONALIZED RECOVERY PLAN
export interface RecoveryTask {
  id: string;
  week: number;
  weekTitle: string;
  title: string;
  description: string;
  estimatedSavings: number;
  impact: string;
  completed: boolean;
  category: 'Spending' | 'Discretionary' | 'Savings' | 'Debt';
}

export interface RecoveryPlan {
  id: string;
  customerId: string;
  title: string;
  totalEstimatedImprovement: number;
  resilienceBoost: number;
  initialRiskLevel: RiskLevel;
  targetRiskLevel: RiskLevel;
  tasks: RecoveryTask[];
}

// FEATURE 6: FINANCIAL GOALS
export type GoalCategory =
  | 'Emergency Fund'
  | 'Buy a Laptop'
  | 'Education'
  | 'Travel'
  | 'Debt Reduction'
  | 'Home Down Payment'
  | 'Other';

export interface FinancialGoal {
  id: string;
  title: string;
  category: GoalCategory;
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  estimatedCompletionDate: string;
  riskImpact: 'SAFE' | 'MODERATE_PRESSURE' | 'EXCESSIVE_PRESSURE';
  warningMessage?: string;
  isRecommended?: boolean;
}

// FEATURE 7: SMART SUBSCRIPTION MANAGER
export interface SubscriptionItem {
  id: string;
  name: string;
  category: 'Entertainment' | 'Fitness' | 'Productivity' | 'Shopping' | 'Utilities';
  monthlyCost: number;
  billingCycle: 'Monthly' | 'Annual';
  lastUsedDaysAgo: number;
  isUnused: boolean;
  recommendation: string;
  potentialMonthlySavings: number;
  active: boolean;
}

export interface SubscriptionAnalytics {
  totalMonthlySpend: number;
  unusedMonthlySpend: number;
  potentialMonthlySavings: number;
  annualProjectedWaste: number;
  subscriptionHealthScore: number; // 0-100
  subscriptions: SubscriptionItem[];
}

// FEATURE 8: BACHAT MITRA CO-PILOT
export interface ChatMessage {
  id: string;
  sender: 'user' | 'mitra';
  text: string;
  timestamp: string;
  actionSuggestion?: {
    label: string;
    route?: string;
    preset?: Partial<SimulationInput>;
  };
  structuredDetails?: {
    category?: string;
    amount?: number;
    impactVerdict?: 'AFFORDABLE' | 'CAUTION' | 'STRESS_WARNING';
    bufferChange?: string;
    bufferBefore?: string;
    bufferAfter?: string;
    recommendationSummary?: string;
  };
}

// FEATURE 9: ACCESSIBILITY MODE
export interface AccessibilitySettings {
  largerText: boolean;
  highContrast: boolean;
  simplifiedDashboard: boolean;
  voiceFriendly: boolean;
  reducedComplexity: boolean;
}

// FEATURE 10: MONTHLY FINANCIAL STORY
export interface MonthlyStoryData {
  month: string;
  headline: string;
  spendingChangePercent: number;
  savingsChangePercent: number;
  healthStatus: string;
  whatImproved: string[];
  whatNeedsAttention: string[];
  recommendedNextSteps: {
    title: string;
    description: string;
    actionText: string;
    route: string;
  }[];
}

// FEATURE 11: BANK / ADVISOR VIEW
export interface AdvisorCustomerRecord {
  id: string;
  anonymousId: string;
  alias: string;
  originalId?: string;
  riskLevel: RiskLevel;
  resilienceScore: number;
  bufferDaysRemaining: number;
  primaryStressDriver: string;
  outreachStatus: 'NEEDS_OUTREACH' | 'IN_CONVERSATION' | 'ASSISTANCE_OFFERED' | 'STABILIZED';
  recommendedIntervention: string;
  projectedShortfall: number;
}

export interface AdvisorDashboardData {
  customersNeedingSupport: number;
  totalMonitoredAccounts: number;
  preventedDelinquenciesCount: number;
  interventionEffectivenessRate: number; // e.g. 84%
  riskDistribution: {
    category: string;
    percentage: number;
    count: number;
    color: string;
  }[];
  cohortRiskTrends: {
    month: string;
    atRiskCount: number;
    assistedCount: number;
    stabilizedCount: number;
  }[];
  customerRecords: AdvisorCustomerRecord[];
}

// FEATURE 12: DATA PRIVACY & TRANSPARENCY
export interface DataPrivacyConsent {
  cashflowAnalytics: boolean;
  predictiveEarlyAlerts: boolean;
  anonymizedBenchmarking: boolean;
  thirdPartySharing: boolean; // Always false by default in CashTwin
  lastUpdated: string;
}

