import {
  Customer,
  CustomerDashboardData,
  FinancialHealthData,
  EarlyWarningData,
  Recommendation,
  Obligation,
  SimulationInput,
  SimulationResult,
  ForecastPoint,
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

export const CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Arun Patel',
    accountNumber: '•••• 4192',
    riskLevel: 'HEALTHY',
    resilienceScore: 88,
    occupation: 'Senior Software Consultant',
    monthlyIncome: 95000,
  },
  {
    id: 'CUST-002',
    name: 'Priya Sharma',
    accountNumber: '•••• 7831',
    riskLevel: 'WATCH',
    resilienceScore: 73,
    occupation: 'Marketing Operations Manager',
    monthlyIncome: 62000,
  },
  {
    id: 'CUST-003',
    name: 'Rahul Verma',
    accountNumber: '•••• 6204',
    riskLevel: 'AT_RISK',
    resilienceScore: 64,
    occupation: 'Logistics Supervisor',
    monthlyIncome: 42000,
  },
  {
    id: 'CUST-004',
    name: 'Vikram Singh',
    accountNumber: '•••• 1098',
    riskLevel: 'HIGH_RISK',
    resilienceScore: 38,
    occupation: 'Independent Fleet Contractor',
    monthlyIncome: 34000,
  },
];

export const MOCK_DASHBOARD_DATA: Record<string, CustomerDashboardData> = {
  'CUST-003': {
    customer: CUSTOMERS[2],
    resilienceScore: 64,
    riskLevel: 'AT_RISK',
    resilienceMessage: 'Your financial position requires attention, but there is still time to intervene.',
    metrics: {
      currentBalance: 18500,
      monthlyIncome: 42000,
      upcomingEmi: 12000,
      cashBufferDays: 14,
    },
    safetyThreshold: 5000,
    forecast: [
      { day: 0, label: 'Today', date: 'Oct 14', balance: 18500, safetyThreshold: 5000, zeroLine: 0, isStressed: false },
      { day: 7, label: '7 days', date: 'Oct 21', balance: 15200, safetyThreshold: 5000, zeroLine: 0, isStressed: false },
      { day: 14, label: '14 days', date: 'Oct 28', balance: 8700, safetyThreshold: 5000, zeroLine: 0, isStressed: false },
      { day: 21, label: '21 days', date: 'Nov 04', balance: 1200, safetyThreshold: 5000, zeroLine: 0, isStressed: true },
      { day: 30, label: '30 days', date: 'Nov 13', balance: -4600, safetyThreshold: 5000, zeroLine: 0, isStressed: true },
    ],
    earlyWarning: {
      hasWarning: true,
      stressDetected: true,
      potentialCashGap: 9400,
      expectedDays: 18,
      urgency: 'high',
      headline: 'Potential financial stress detected',
    },
    quickRecommendation: {
      actionText: 'Reduce discretionary spending by approximately ₹5,000 this month to improve your projected cash buffer.',
      impactText: 'Potential risk reduction: High → Low',
      riskFrom: 'HIGH_RISK',
      riskTo: 'HEALTHY',
    },
  },
  'CUST-001': {
    customer: CUSTOMERS[0],
    resilienceScore: 88,
    riskLevel: 'HEALTHY',
    resilienceMessage: 'Your financial resilience is robust. Buffer reserves comfortably exceed safety thresholds.',
    metrics: {
      currentBalance: 84000,
      monthlyIncome: 95000,
      upcomingEmi: 18500,
      cashBufferDays: 48,
    },
    safetyThreshold: 15000,
    forecast: [
      { day: 0, label: 'Today', date: 'Oct 14', balance: 84000, safetyThreshold: 15000, zeroLine: 0, isStressed: false },
      { day: 7, label: '7 days', date: 'Oct 21', balance: 79500, safetyThreshold: 15000, zeroLine: 0, isStressed: false },
      { day: 14, label: '14 days', date: 'Oct 28', balance: 71000, safetyThreshold: 15000, zeroLine: 0, isStressed: false },
      { day: 21, label: '21 days', date: 'Nov 04', balance: 68400, safetyThreshold: 15000, zeroLine: 0, isStressed: false },
      { day: 30, label: '30 days', date: 'Nov 13', balance: 64200, safetyThreshold: 15000, zeroLine: 0, isStressed: false },
    ],
    earlyWarning: {
      hasWarning: false,
      stressDetected: false,
      potentialCashGap: 0,
      expectedDays: 0,
      urgency: 'low',
      headline: 'No critical financial friction detected',
    },
    quickRecommendation: {
      actionText: 'Maintain automated sweep-in deposits to optimize returns on idle liquidity.',
      impactText: 'Resilience status: Optimally Buffered',
      riskFrom: 'HEALTHY',
      riskTo: 'HEALTHY',
    },
  },
  'CUST-002': {
    customer: CUSTOMERS[1],
    resilienceScore: 73,
    riskLevel: 'WATCH',
    resilienceMessage: 'Moderate resilience. Upcoming discretionary bills may tighten end-of-month cash reserves.',
    metrics: {
      currentBalance: 32000,
      monthlyIncome: 62000,
      upcomingEmi: 14000,
      cashBufferDays: 24,
    },
    safetyThreshold: 8000,
    forecast: [
      { day: 0, label: 'Today', date: 'Oct 14', balance: 32000, safetyThreshold: 8000, zeroLine: 0, isStressed: false },
      { day: 7, label: '7 days', date: 'Oct 21', balance: 26500, safetyThreshold: 8000, zeroLine: 0, isStressed: false },
      { day: 14, label: '14 days', date: 'Oct 28', balance: 19800, safetyThreshold: 8000, zeroLine: 0, isStressed: false },
      { day: 21, label: '21 days', date: 'Nov 04', balance: 11400, safetyThreshold: 8000, zeroLine: 0, isStressed: false },
      { day: 30, label: '30 days', date: 'Nov 13', balance: 5200, safetyThreshold: 8000, zeroLine: 0, isStressed: true },
    ],
    earlyWarning: {
      hasWarning: true,
      stressDetected: true,
      potentialCashGap: 2800,
      expectedDays: 26,
      urgency: 'medium',
      headline: 'Watch alert: Buffer dip approaching threshold',
    },
    quickRecommendation: {
      actionText: 'Shift non-essential utility and shopping plans by 10 days to preserve end-of-month cushion.',
      impactText: 'Potential risk reduction: Watch → Healthy',
      riskFrom: 'WATCH',
      riskTo: 'HEALTHY',
    },
  },
  'CUST-004': {
    customer: CUSTOMERS[3],
    resilienceScore: 38,
    riskLevel: 'HIGH_RISK',
    resilienceMessage: 'Severe cash strain detected. High likelihood of immediate shortfall without swift restructuring.',
    metrics: {
      currentBalance: 6200,
      monthlyIncome: 34000,
      upcomingEmi: 19500,
      cashBufferDays: 4,
    },
    safetyThreshold: 4000,
    forecast: [
      { day: 0, label: 'Today', date: 'Oct 14', balance: 6200, safetyThreshold: 4000, zeroLine: 0, isStressed: false },
      { day: 7, label: '7 days', date: 'Oct 21', balance: -2400, safetyThreshold: 4000, zeroLine: 0, isStressed: true },
      { day: 14, label: '14 days', date: 'Oct 28', balance: -9800, safetyThreshold: 4000, zeroLine: 0, isStressed: true },
      { day: 21, label: '21 days', date: 'Nov 04', balance: -16200, safetyThreshold: 4000, zeroLine: 0, isStressed: true },
      { day: 30, label: '30 days', date: 'Nov 13', balance: -22400, safetyThreshold: 4000, zeroLine: 0, isStressed: true },
    ],
    earlyWarning: {
      hasWarning: true,
      stressDetected: true,
      potentialCashGap: 22400,
      expectedDays: 6,
      urgency: 'high',
      headline: 'Critical Distress Warning: Cash deficit imminent',
    },
    quickRecommendation: {
      actionText: 'Initiate bank hardship restructuring to defer upcoming EMI installment immediately.',
      impactText: 'Potential risk reduction: Severe Distress → Manageable',
      riskFrom: 'HIGH_RISK',
      riskTo: 'WATCH',
    },
  },
};

export const MOCK_FINANCIAL_HEALTH: Record<string, FinancialHealthData> = {
  'CUST-003': {
    customer: CUSTOMERS[2],
    resilienceScore: 64,
    riskLevel: 'AT_RISK',
    components: [
      {
        id: 'comp-1',
        name: 'Cash Buffer',
        score: 72,
        weight: 25,
        status: 'WATCH',
        description: 'Covers 14 days of typical household commitments. Below optimal 30-day baseline.',
      },
      {
        id: 'comp-2',
        name: 'Income Stability',
        score: 58,
        weight: 20,
        status: 'WATCH',
        description: 'Slight fluctuation in contract overtime pay observed in the last 60 days.',
      },
      {
        id: 'comp-3',
        name: 'Expense Stability',
        score: 61,
        weight: 20,
        status: 'WATCH',
        description: 'Discretionary outlays increased by 18% month-on-month, squeezing liquidity.',
      },
      {
        id: 'comp-4',
        name: 'Debt Burden',
        score: 43,
        weight: 20,
        status: 'HIGH_RISK',
        description: 'Fixed obligations (EMI) consume 28.5% of net monthly cash inflow.',
      },
      {
        id: 'comp-5',
        name: 'Upcoming Obligations',
        score: 55,
        weight: 15,
        status: 'AT_RISK',
        description: 'High clustering of EMI and utility payments due within an 8-day window.',
      },
    ],
    ratios: {
      monthlyIncome: 42000,
      monthlyExpenses: 31500,
      savings: 18500,
      monthlyEmi: 12000,
      debtToIncomeRatio: 28.5,
      expenseToIncomeRatio: 75.0,
      liquidRunwayDays: 14,
    },
    timelineStatus: 'AT_RISK',
    scoreExplanation:
      'The resilience score combines cash buffer, income stability, expense pressure, debt burden and upcoming obligations. It is calculated transparently to provide early warning before missed payment events.',
  },
  'CUST-001': {
    customer: CUSTOMERS[0],
    resilienceScore: 88,
    riskLevel: 'HEALTHY',
    components: [
      { id: 'c1', name: 'Cash Buffer', score: 92, weight: 25, status: 'HEALTHY', description: 'Over 48 days of liquid cushion in high-yield account.' },
      { id: 'c2', name: 'Income Stability', score: 90, weight: 20, status: 'HEALTHY', description: 'Consistent corporate payroll with dependable bonus stream.' },
      { id: 'c3', name: 'Expense Stability', score: 85, weight: 20, status: 'HEALTHY', description: 'Predictable recurring costs within budget boundaries.' },
      { id: 'c4', name: 'Debt Burden', score: 82, weight: 20, status: 'HEALTHY', description: 'Low debt-to-income ratio (19.4%). Comfortably serviced.' },
      { id: 'c5', name: 'Upcoming Obligations', score: 90, weight: 15, status: 'HEALTHY', description: 'Staggered payment dates with auto-debit coverage.' },
    ],
    ratios: {
      monthlyIncome: 95000,
      monthlyExpenses: 44000,
      savings: 84000,
      monthlyEmi: 18500,
      debtToIncomeRatio: 19.4,
      expenseToIncomeRatio: 46.3,
      liquidRunwayDays: 48,
    },
    timelineStatus: 'HEALTHY',
    scoreExplanation: 'Score indicates strong financial buffer reserves and resilient cashflow.',
  },
  'CUST-002': {
    customer: CUSTOMERS[1],
    resilienceScore: 73,
    riskLevel: 'WATCH',
    components: [
      { id: 'c1', name: 'Cash Buffer', score: 76, weight: 25, status: 'WATCH', description: '24 days of operational reserves. Adequate for mild shocks.' },
      { id: 'c2', name: 'Income Stability', score: 80, weight: 20, status: 'HEALTHY', description: 'Stable salaried employment.' },
      { id: 'c3', name: 'Expense Stability', score: 68, weight: 20, status: 'WATCH', description: 'Seasonal lifestyle spikes elevated recent outflows.' },
      { id: 'c4', name: 'Debt Burden', score: 65, weight: 20, status: 'WATCH', description: 'EMI consumes 22.5% of income.' },
      { id: 'c5', name: 'Upcoming Obligations', score: 72, weight: 15, status: 'WATCH', description: 'Slight concentration in 3rd week of the month.' },
    ],
    ratios: {
      monthlyIncome: 62000,
      monthlyExpenses: 41000,
      savings: 32000,
      monthlyEmi: 14000,
      debtToIncomeRatio: 22.5,
      expenseToIncomeRatio: 66.1,
      liquidRunwayDays: 24,
    },
    timelineStatus: 'WATCH',
    scoreExplanation: 'Moderate resilience with minor expense volatility requiring oversight.',
  },
  'CUST-004': {
    customer: CUSTOMERS[3],
    resilienceScore: 38,
    riskLevel: 'HIGH_RISK',
    components: [
      { id: 'c1', name: 'Cash Buffer', score: 28, weight: 25, status: 'HIGH_RISK', description: 'Only 4 days of liquid reserves remaining.' },
      { id: 'c2', name: 'Income Stability', score: 45, weight: 20, status: 'HIGH_RISK', description: 'Freelance gig receipts delayed by 21 days.' },
      { id: 'c3', name: 'Expense Stability', score: 39, weight: 20, status: 'HIGH_RISK', description: 'Unplanned vehicle maintenance drained emergency balance.' },
      { id: 'c4', name: 'Debt Burden', score: 24, weight: 20, status: 'HIGH_RISK', description: 'EMI obligation exceeds 57% of regular monthly income.' },
      { id: 'c5', name: 'Upcoming Obligations', score: 32, weight: 15, status: 'HIGH_RISK', description: 'Severe pileup of loan repayment within 6 days.' },
    ],
    ratios: {
      monthlyIncome: 34000,
      monthlyExpenses: 31000,
      savings: 6200,
      monthlyEmi: 19500,
      debtToIncomeRatio: 57.3,
      expenseToIncomeRatio: 91.1,
      liquidRunwayDays: 4,
    },
    timelineStatus: 'DISTRESS',
    scoreExplanation: 'Severe structural imbalance between contractual debt and incoming liquidity.',
  },
};

export const MOCK_EARLY_WARNING: Record<string, EarlyWarningData> = {
  'CUST-003': {
    customer: CUSTOMERS[2],
    riskLevel: 'HIGH_RISK',
    potentialStressDays: 18,
    potentialCashGap: 9400,
    drivers: [
      {
        id: 'driver-1',
        title: 'High EMI burden',
        contributionPercentage: 42,
        observedPattern:
          'Monthly EMI represents 28.5% of monthly income, consuming available cash margin needed for unexpected shocks.',
        impact: 'Increases short-term payment pressure and severely limits free cashflow flexibility.',
        recommendedAction: 'Explore tenure adjustment or temporary principal forbearance with lending partner.',
        severity: 'high',
      },
      {
        id: 'driver-2',
        title: 'Rising expenses',
        contributionPercentage: 27,
        observedPattern:
          'Discretionary retail and food delivery outlays increased by ₹4,800 (+26%) compared to the 90-day moving average.',
        impact: 'Accelerates the speed at which the cash balance drops towards the zero-line.',
        recommendedAction: 'Temporarily pause discretionary card purchases to recover ₹5,000 safety cushion.',
        severity: 'high',
      },
      {
        id: 'driver-3',
        title: 'Income volatility',
        contributionPercentage: 18,
        observedPattern:
          'Variable shift allowance dropped by ₹3,200 this cycle due to project schedule shifts.',
        impact: 'Compacted cash buffer, reducing safety runway from 22 days to 14 days.',
        recommendedAction: 'Align major planned outlays only after baseline payroll clears account.',
        severity: 'medium',
      },
      {
        id: 'driver-4',
        title: 'Low cash buffer',
        contributionPercentage: 13,
        observedPattern:
          'Liquid savings have fallen below the 20-day comfort boundary for two consecutive fortnights.',
        impact: 'Leaves account vulnerable to standard overdraft or non-sufficient fund charges.',
        recommendedAction: 'Rebuild a designated ₹15,000 emergency liquid cushion over the next quarter.',
        severity: 'medium',
      },
    ],
    journeyStage: 'AT_RISK',
    journeyMessage: 'An intervention is still possible before the projected stress point.',
  },
  'CUST-001': {
    customer: CUSTOMERS[0],
    riskLevel: 'HEALTHY',
    potentialStressDays: 0,
    potentialCashGap: 0,
    drivers: [
      {
        id: 'd-1',
        title: 'Discretionary buffer surplus',
        contributionPercentage: 60,
        observedPattern: 'Consistently spends under 50% of available income.',
        impact: 'Surplus cash continues building healthy liquid buffer.',
        recommendedAction: 'Continue current disciplined cash allocation.',
        severity: 'low',
      },
    ],
    journeyStage: 'HEALTHY',
    journeyMessage: 'Resilience indicators remain strong with no stress signals detected.',
  },
  'CUST-002': {
    customer: CUSTOMERS[1],
    riskLevel: 'WATCH',
    potentialStressDays: 26,
    potentialCashGap: 2800,
    drivers: [
      {
        id: 'd-1',
        title: 'Accelerated holiday retail spend',
        contributionPercentage: 48,
        observedPattern: 'Weekend discretionary outlays up 22% over prior month.',
        impact: 'Drawdown on end-of-month cash buffer.',
        recommendedAction: 'Throttle optional shopping categories for next two weeks.',
        severity: 'medium',
      },
      {
        id: 'd-2',
        title: 'Utility price cycle',
        contributionPercentage: 32,
        observedPattern: 'Higher seasonal power and municipal bills.',
        impact: 'Minor reduction in free cash margin.',
        recommendedAction: 'Budget for scheduled bill cycles in advance.',
        severity: 'medium',
      },
      {
        id: 'd-3',
        title: 'Short-term buffer compression',
        contributionPercentage: 20,
        observedPattern: 'Savings balance plateaued at 24-day runway.',
        impact: 'Moderate exposure if secondary expense arises.',
        recommendedAction: 'Maintain savings transfer schedule.',
        severity: 'low',
      },
    ],
    journeyStage: 'WATCH',
    journeyMessage: 'Proactive pacing now prevents entering the At Risk category.',
  },
  'CUST-004': {
    customer: CUSTOMERS[3],
    riskLevel: 'HIGH_RISK',
    potentialStressDays: 6,
    potentialCashGap: 22400,
    drivers: [
      {
        id: 'd-1',
        title: 'Debt-to-Income Spike (57.3%)',
        contributionPercentage: 54,
        observedPattern: 'Multiple short-term personal loan payments coincide simultaneously.',
        impact: 'Incoming income is insufficient to cover mandatory debt deductions.',
        recommendedAction: 'Contact branch loan officer for formal distress restructuring plan.',
        severity: 'high',
      },
      {
        id: 'd-2',
        title: 'Exhausted Liquidity Reserve',
        contributionPercentage: 31,
        observedPattern: 'Savings depleted to ₹6,200 following unplanned repair costs.',
        impact: 'Immediate overdraft risk within 6 business days.',
        recommendedAction: 'Freeze all non-essential outflows immediately.',
        severity: 'high',
      },
      {
        id: 'd-3',
        title: 'Delayed Vendor Receipts',
        contributionPercentage: 15,
        observedPattern: 'Contract invoices overdue by 3 weeks.',
        impact: 'Severely interrupted operating cash cycle.',
        recommendedAction: 'Request expedited milestone disbursement from clients.',
        severity: 'medium',
      },
    ],
    journeyStage: 'POTENTIAL_DISTRESS',
    journeyMessage: 'Immediate intervention mandatory: Shortfall predicted in under 7 days.',
  },
};

export const MOCK_OBLIGATIONS: Record<string, Obligation[]> = {
  'CUST-003': [
    { id: 'ob-1', title: 'Car Loan EMI (HDFC Bank)', category: 'EMI', amount: 12000, dueDate: 'Nov 02', daysRemaining: 18, status: 'PENDING' },
    { id: 'ob-2', title: 'Residential Apartment Rent', category: 'RENT', amount: 8000, dueDate: 'Nov 05', daysRemaining: 21, status: 'PENDING' },
    { id: 'ob-3', title: 'Electricity & Gas Utilities', category: 'UTILITIES', amount: 3500, dueDate: 'Oct 26', daysRemaining: 12, status: 'PENDING' },
    { id: 'ob-4', title: 'Other Recurring Expenses', category: 'SUBSCRIPTION', amount: 2500, dueDate: 'Oct 23', daysRemaining: 9, status: 'PENDING' },
  ],
  'CUST-001': [
    { id: 'ob-1', title: 'Home Loan EMI', category: 'EMI', amount: 18500, dueDate: 'Nov 01', daysRemaining: 17, status: 'SCHEDULED' },
    { id: 'ob-2', title: 'Condo Maintenance & Rent', category: 'RENT', amount: 14000, dueDate: 'Nov 05', daysRemaining: 21, status: 'SCHEDULED' },
    { id: 'ob-3', title: 'Utilities & Broadband', category: 'UTILITIES', amount: 4500, dueDate: 'Oct 28', daysRemaining: 14, status: 'SCHEDULED' },
    { id: 'ob-4', title: 'Health Insurance Premium', category: 'SUBSCRIPTION', amount: 3200, dueDate: 'Nov 10', daysRemaining: 26, status: 'SCHEDULED' },
  ],
  'CUST-002': [
    { id: 'ob-1', title: 'Two-Wheeler Loan EMI', category: 'EMI', amount: 6500, dueDate: 'Oct 29', daysRemaining: 15, status: 'PENDING' },
    { id: 'ob-2', title: 'Personal Loan EMI', category: 'EMI', amount: 7500, dueDate: 'Nov 04', daysRemaining: 20, status: 'PENDING' },
    { id: 'ob-3', title: 'Shared Flat Rent', category: 'RENT', amount: 9500, dueDate: 'Nov 05', daysRemaining: 21, status: 'PENDING' },
    { id: 'ob-4', title: 'Utilities & Mobile', category: 'UTILITIES', amount: 2800, dueDate: 'Oct 24', daysRemaining: 10, status: 'PENDING' },
  ],
  'CUST-004': [
    { id: 'ob-1', title: 'Vehicle Finance EMI #1', category: 'EMI', amount: 11500, dueDate: 'Oct 20', daysRemaining: 6, status: 'PENDING' },
    { id: 'ob-2', title: 'Commercial Equipment EMI #2', category: 'EMI', amount: 8000, dueDate: 'Oct 23', daysRemaining: 9, status: 'PENDING' },
    { id: 'ob-3', title: 'Workshop Space Rent', category: 'RENT', amount: 6500, dueDate: 'Oct 25', daysRemaining: 11, status: 'PENDING' },
    { id: 'ob-4', title: 'Fleet Fuel & Utilities', category: 'UTILITIES', amount: 5000, dueDate: 'Oct 19', daysRemaining: 5, status: 'PENDING' },
  ],
};

export const MOCK_RECOMMENDATIONS: Record<string, Recommendation[]> = {
  'CUST-003': [
    {
      id: 'rec-1',
      priority: 1,
      title: 'Reduce discretionary spending',
      problem: 'Expense pressure is increasing due to dining, shopping, and entertainment subscriptions.',
      action: 'Reduce discretionary spending by approximately ₹5,000 for the next 30 days.',
      expectedImpact: 'Projected cash gap: ₹9,400 → ₹0. Eliminates projected negative balance.',
      riskReduction: {
        from: 'HIGH_RISK',
        to: 'HEALTHY',
      },
      cashGapImpact: {
        from: 9400,
        to: 0,
      },
      reason: 'Discretionary spending is the most immediate lever under your direct control without altering contractual obligations.',
      suggestedSimulation: {
        discretionarySpending: 3000, // Reduced from 8000 by 5000
      },
    },
    {
      id: 'rec-2',
      priority: 2,
      title: 'Review upcoming EMI burden',
      problem: 'Upcoming debt obligations are increasing short-term cash pressure during the middle of the month.',
      action: 'Review repayment options with your bank (such as shifting debit date or tenure extension).',
      expectedImpact: 'Alleviates payment clustering and synchronizes EMI with monthly payroll receipt.',
      riskReduction: {
        from: 'HIGH_RISK',
        to: 'WATCH',
      },
      cashGapImpact: {
        from: 9400,
        to: 3200,
      },
      reason: 'Responsible restructuring avoids default marks on your credit profile while safeguarding liquid cash.',
      suggestedSimulation: {
        monthlyEmi: 9500,
      },
    },
    {
      id: 'rec-3',
      priority: 3,
      title: 'Build emergency buffer',
      problem: 'Current cash buffer of 14 days leaves no room for minor unplanned healthcare or vehicle expenses.',
      action: 'Target ₹15,000 liquid safety balance by increasing monthly savings contribution where possible once cashflow stabilizes.',
      expectedImpact: 'Increases resilience score from 64 to 78+ over the next 90 days.',
      riskReduction: {
        from: 'AT_RISK',
        to: 'HEALTHY',
      },
      cashGapImpact: {
        from: 9400,
        to: 0,
      },
      reason: 'A 30-day liquid reserve is the standard recognized buffer to insulate households against high-interest borrowing.',
      suggestedSimulation: {
        monthlySavings: 5000,
      },
    },
  ],
  'CUST-001': [
    {
      id: 'rec-1',
      priority: 1,
      title: 'Optimize idle liquidity yield',
      problem: 'Substantial savings sitting in low-yield standard checking account.',
      action: 'Activate bank automated sweep-in deposit to earn additional interest while maintaining liquidity.',
      expectedImpact: 'Generates ~₹4,200 annual supplementary interest without lock-in penalties.',
      riskReduction: { from: 'HEALTHY', to: 'HEALTHY' },
      cashGapImpact: { from: 0, to: 0 },
      reason: 'Maintains optimal financial health while increasing passive buffer growth.',
    },
  ],
  'CUST-002': [
    {
      id: 'rec-1',
      priority: 1,
      title: 'Smooth mid-month discretionary peaks',
      problem: 'Clustering of online purchases 5 days before salary day causes minor buffer dip.',
      action: 'Reschedule discretionary electronics purchases by 12 days.',
      expectedImpact: 'Preserves minimum buffer of ₹8,000 across all 30 forecast days.',
      riskReduction: { from: 'WATCH', to: 'HEALTHY' },
      cashGapImpact: { from: 2800, to: 0 },
      reason: 'Prevents dipping into safety reserve threshold.',
    },
  ],
  'CUST-004': [
    {
      id: 'rec-1',
      priority: 1,
      title: 'Immediate hardship restructuring request',
      problem: 'Debt service obligations exceed 57% of regular monthly receipts.',
      action: 'Engage bank customer care to request a 60-day loan tenure extension or temporary grace period.',
      expectedImpact: 'Reduces monthly immediate payment outflow by up to ₹7,000.',
      riskReduction: { from: 'HIGH_RISK', to: 'WATCH' },
      cashGapImpact: { from: 22400, to: 8200 },
      reason: 'Proactive bank engagement prevents loan default and protects banking access.',
    },
  ],
};

export const DEFAULT_SIMULATION_INPUTS: Record<string, SimulationInput> = {
  'CUST-003': {
    discretionarySpending: 8000,
    monthlyEmi: 12000,
    plannedExpense: 10000,
    monthlySavings: 3000,
  },
  'CUST-001': {
    discretionarySpending: 15000,
    monthlyEmi: 18500,
    plannedExpense: 5000,
    monthlySavings: 20000,
  },
  'CUST-002': {
    discretionarySpending: 11000,
    monthlyEmi: 14000,
    plannedExpense: 8000,
    monthlySavings: 5000,
  },
  'CUST-004': {
    discretionarySpending: 6000,
    monthlyEmi: 19500,
    plannedExpense: 4000,
    monthlySavings: 1000,
  },
};

/**
 * Calculates a forward-looking simulation based on customer and tweaked parameters
 */
export function calculateSimulation(
  customerId: string,
  input: SimulationInput
): SimulationResult {
  const baseDashboard = MOCK_DASHBOARD_DATA[customerId] || MOCK_DASHBOARD_DATA['CUST-003'];
  const defaults = DEFAULT_SIMULATION_INPUTS[customerId] || DEFAULT_SIMULATION_INPUTS['CUST-003'];
  const customer = CUSTOMERS.find((c) => c.id === customerId) || CUSTOMERS[2];

  // Calculate delta savings / spending changes
  const discretionarySavings = Math.max(0, defaults.discretionarySpending - input.discretionarySpending);
  const emiAdjustmentSavings = Math.max(0, defaults.monthlyEmi - input.monthlyEmi);
  const plannedExpenseDeferred = Math.max(0, defaults.plannedExpense - input.plannedExpense);
  const extraSavingsCommitted = Math.max(0, (input.monthlySavings || 0) - (defaults.monthlySavings || 0));

  // Handle Income Reduction (e.g. 20% income shock)
  const incomeCutPercent = input.incomeReductionPercent || 0;
  const incomeLoss = Math.round(customer.monthlyIncome * (incomeCutPercent / 100));

  // Handle Large Purchase Outflow (e.g. ₹10,000 laptop / appliance)
  const largePurchase = input.largePurchaseAmount || 0;

  // Total net liquidity impact for the month
  // positive = buffer improved, negative = liquidity worsened
  const totalNetLiquidityBenefit =
    discretionarySavings + emiAdjustmentSavings + plannedExpenseDeferred + extraSavingsCommitted - incomeLoss - largePurchase;

  const initialGap = baseDashboard.earlyWarning.potentialCashGap;
  const newCashGap = Math.max(0, initialGap - totalNetLiquidityBenefit);

  // Baseline minimum balance
  const initialMinBalance =
    baseDashboard.forecast.reduce((min, p) => (p.balance < min ? p.balance : min), baseDashboard.forecast[0].balance);
  
  const newMinBalance = initialMinBalance + totalNetLiquidityBenefit;

  // Before risk score and pressure
  const beforeRiskScore =
    customerId === 'CUST-003' ? 72 : customerId === 'CUST-004' ? 89 : customerId === 'CUST-002' ? 52 : 18;
  const beforeRunwayDays = baseDashboard.metrics.cashBufferDays;
  const beforePressureScore = Math.min(100, Math.max(10, Math.round(beforeRiskScore * 1.05)));

  // Calculate After risk score
  // If net benefit is negative (e.g. income cut or big purchase), risk score rises!
  let afterRiskScore = Math.min(
    95,
    Math.max(12, Math.round(beforeRiskScore - (totalNetLiquidityBenefit / 220)))
  );

  if (newCashGap === 0 && newMinBalance >= baseDashboard.safetyThreshold) {
    afterRiskScore = Math.min(afterRiskScore, 28);
  }

  const beforeRiskLevel: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'HIGH_RISK' =
    beforeRiskScore > 70 ? 'HIGH_RISK' : beforeRiskScore > 50 ? 'AT_RISK' : beforeRiskScore > 35 ? 'WATCH' : 'HEALTHY';

  const afterRiskLevel: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'HIGH_RISK' =
    afterRiskScore > 65 ? 'HIGH_RISK' : afterRiskScore > 45 ? 'AT_RISK' : afterRiskScore > 25 ? 'WATCH' : 'HEALTHY';

  // Calculate simulated emergency runway days
  const dailyBurn = Math.max(500, Math.round((customer.monthlyIncome * 0.8) / 30));
  const newRunwayDays = Math.max(0, Math.round(newMinBalance / dailyBurn));
  const afterPressureScore = Math.min(100, Math.max(10, Math.round(afterRiskScore * 1.05)));

  const crisisPrevented = initialGap > 0 && newCashGap === 0 && newMinBalance > 2000;

  let explanation = '';
  if (incomeCutPercent > 0) {
    explanation = `A ${incomeCutPercent}% income drop (₹${incomeLoss.toLocaleString('en-IN')}) reduces your monthly cash runway by ${Math.abs(beforeRunwayDays - newRunwayDays)} days. ${
      newCashGap > 0 ? 'Protective expense reduction or EMI restructuring is recommended.' : 'Current liquid reserves absorb the shock without default.'
    }`;
  } else if (largePurchase > 0) {
    explanation = `A ₹${largePurchase.toLocaleString('en-IN')} upfront purchase reduces your liquid buffer to ₹${newMinBalance.toLocaleString('en-IN')}. ${
      newMinBalance < baseDashboard.safetyThreshold
        ? 'Delaying this purchase is advised to protect your upcoming EMI obligations.'
        : 'Your remaining buffer safely satisfies upcoming commitments.'
    }`;
  } else if (crisisPrevented) {
    if (discretionarySavings > 0 && emiAdjustmentSavings === 0) {
      explanation = `Reducing discretionary spending by ₹${discretionarySavings.toLocaleString('en-IN')} improves the projected cash buffer and removes the predicted shortfall.`;
    } else if (totalNetLiquidityBenefit > 0) {
      explanation = `Combined interventions preserve ₹${totalNetLiquidityBenefit.toLocaleString('en-IN')} in liquidity, successfully averting the stress window.`;
    } else {
      explanation = `Projected buffer comfortably satisfies all impending contractual debt.`;
    }
  } else if (newCashGap > 0) {
    explanation = `The adjustments recover ₹${Math.max(0, totalNetLiquidityBenefit).toLocaleString('en-IN')}, but a residual cash shortfall of ₹${newCashGap.toLocaleString('en-IN')} remains. Additional bank restructuring recommended.`;
  } else {
    explanation = `Cash runway remains healthy with a projected minimum cushion of ₹${newMinBalance.toLocaleString('en-IN')} (${newRunwayDays} days buffer).`;
  }

  // Generate simulated forecast line
  const forecastPoints: ForecastPoint[] = baseDashboard.forecast.map((pt, idx) => {
    const benefitFactor = (idx + 1) / baseDashboard.forecast.length;
    const simBal = Math.round(pt.balance + totalNetLiquidityBenefit * benefitFactor);
    return {
      ...pt,
      simulatedBalance: simBal,
    };
  });

  return {
    before: {
      riskScore: beforeRiskScore,
      cashGap: initialGap,
      minimumBalance: initialMinBalance,
      riskLevel: beforeRiskLevel,
      runwayDays: beforeRunwayDays,
      pressureScore: beforePressureScore,
    },
    after: {
      riskScore: afterRiskScore,
      cashGap: newCashGap,
      minimumBalance: newMinBalance,
      riskLevel: afterRiskLevel,
      runwayDays: newRunwayDays,
      pressureScore: afterPressureScore,
    },
    savingsImpact: totalNetLiquidityBenefit,
    crisisPrevented,
    explanation,
    forecastPoints,
  };
}

// ==========================================
// FEATURE 1: FINANCIAL JOURNEY TIMELINE DATA
// ==========================================
export const MOCK_TIMELINE_DATA: Record<string, FinancialJourneyPoint[]> = {
  'CUST-003': [
    {
      month: 'January',
      shortMonth: 'Jan',
      status: 'Healthy',
      healthScore: 88,
      riskLevel: 'HEALTHY',
      monthlyIncome: 42000,
      monthlyExpenses: 28000,
      netSavings: 14000,
      bufferDays: 45,
      aiInsight: 'Your cash reserves comfortably supported fixed debt with an exceptional 45-day runway.',
      contributingFactors: ['Low discretionary spend', 'Prompt utility settlements', 'No credit card carry-forward'],
    },
    {
      month: 'February',
      shortMonth: 'Feb',
      status: 'Stable',
      healthScore: 82,
      riskLevel: 'HEALTHY',
      monthlyIncome: 42000,
      monthlyExpenses: 31000,
      netSavings: 11000,
      bufferDays: 38,
      aiInsight: 'Slight uptick in dining and subscriptions, but liquid buffer remained safely above 30 days.',
      contributingFactors: ['Minor discretionary increase (+₹3,000)', 'Regular EMI clearance'],
    },
    {
      month: 'March',
      shortMonth: 'Mar',
      status: 'Early Warning',
      healthScore: 68,
      riskLevel: 'WATCH',
      monthlyIncome: 42000,
      monthlyExpenses: 39500,
      netSavings: 2500,
      bufferDays: 22,
      aiInsight: 'Your financial pressure started increasing in March due to higher expenses and declining savings.',
      contributingFactors: ['Festival seasonal spike (+₹8,500)', 'Savings rate dropped from 26% to 6%', 'Emergency buffer down to 22 days'],
    },
    {
      month: 'April',
      shortMonth: 'Apr',
      status: 'Moderate Risk',
      healthScore: 55,
      riskLevel: 'AT_RISK',
      monthlyIncome: 42000,
      monthlyExpenses: 44000,
      netSavings: -2000,
      bufferDays: 14,
      aiInsight: 'Monthly expenditures outpaced incoming cash flow, forcing a withdrawal from liquid emergency savings.',
      contributingFactors: ['Unplanned vehicular repair (₹6,500)', 'Carried balance on short-term debt', 'Cash runway contracted to 14 days'],
    },
    {
      month: 'May',
      shortMonth: 'May',
      status: 'Intervention Recommended',
      healthScore: 48,
      riskLevel: 'HIGH_RISK',
      monthlyIncome: 42000,
      monthlyExpenses: 46600,
      netSavings: -4600,
      bufferDays: 8,
      aiInsight: 'A critical ₹12,000 auto-debit EMI scheduled in 18 days threatens a ₹9,400 deficit without immediate proactive intervention.',
      contributingFactors: ['Projected ₹9,400 liquidity deficit', 'Buffer compressed below 10-day safety line', 'Discretionary outlays persistent'],
    },
  ],
  'CUST-001': [
    {
      month: 'January',
      shortMonth: 'Jan',
      status: 'Healthy',
      healthScore: 92,
      riskLevel: 'HEALTHY',
      monthlyIncome: 95000,
      monthlyExpenses: 52000,
      netSavings: 43000,
      bufferDays: 52,
      aiInsight: 'Exceptional liquidity surplus. Savings rate exceeding 45% of gross payroll.',
      contributingFactors: ['High savings rate', 'Low debt-to-income ratio (19%)'],
    },
    {
      month: 'February',
      shortMonth: 'Feb',
      status: 'Healthy',
      healthScore: 90,
      riskLevel: 'HEALTHY',
      monthlyIncome: 95000,
      monthlyExpenses: 54000,
      netSavings: 41000,
      bufferDays: 50,
      aiInsight: 'Consistent surplus generation. Buffer maintained at 50 days.',
      contributingFactors: ['Automated investment deposits', 'Zero late payment flags'],
    },
    {
      month: 'March',
      shortMonth: 'Mar',
      status: 'Healthy',
      healthScore: 89,
      riskLevel: 'HEALTHY',
      monthlyIncome: 95000,
      monthlyExpenses: 56000,
      netSavings: 39000,
      bufferDays: 49,
      aiInsight: 'Stable operating cushion despite minor seasonal travel expenditures.',
      contributingFactors: ['Controlled discretionary spending', 'Solid emergency buffer'],
    },
    {
      month: 'April',
      shortMonth: 'Apr',
      status: 'Healthy',
      healthScore: 88,
      riskLevel: 'HEALTHY',
      monthlyIncome: 95000,
      monthlyExpenses: 55000,
      netSavings: 40000,
      bufferDays: 48,
      aiInsight: 'Robust liquidity cushion safely covers all commitments through the quarter.',
      contributingFactors: ['Emergency fund covers 6x baseline expenses'],
    },
    {
      month: 'May',
      shortMonth: 'May',
      status: 'Healthy',
      healthScore: 88,
      riskLevel: 'HEALTHY',
      monthlyIncome: 95000,
      monthlyExpenses: 55000,
      netSavings: 40000,
      bufferDays: 48,
      aiInsight: 'Strong financial health. No intervention required.',
      contributingFactors: ['Healthy cash reserves', 'Manageable EMI commitments'],
    },
  ],
  'CUST-002': [
    {
      month: 'January',
      shortMonth: 'Jan',
      status: 'Healthy',
      healthScore: 84,
      riskLevel: 'HEALTHY',
      monthlyIncome: 62000,
      monthlyExpenses: 44000,
      netSavings: 18000,
      bufferDays: 36,
      aiInsight: 'Healthy operating balance with consistent monthly savings.',
      contributingFactors: ['Controlled spending', 'On-time bill settlements'],
    },
    {
      month: 'February',
      shortMonth: 'Feb',
      status: 'Healthy',
      healthScore: 81,
      riskLevel: 'HEALTHY',
      monthlyIncome: 62000,
      monthlyExpenses: 46000,
      netSavings: 16000,
      bufferDays: 32,
      aiInsight: 'Buffer remains above 30 days despite slight shopping outlays.',
      contributingFactors: ['Minor e-commerce surge'],
    },
    {
      month: 'March',
      shortMonth: 'Mar',
      status: 'Stable',
      healthScore: 78,
      riskLevel: 'HEALTHY',
      monthlyIncome: 62000,
      monthlyExpenses: 49000,
      netSavings: 13000,
      bufferDays: 28,
      aiInsight: 'Runway slipped slightly under 30 days due to quarter-end expenses.',
      contributingFactors: ['Insurance annual premium paid (₹6,000)'],
    },
    {
      month: 'April',
      shortMonth: 'Apr',
      status: 'Early Warning',
      healthScore: 74,
      riskLevel: 'WATCH',
      monthlyIncome: 62000,
      monthlyExpenses: 52000,
      netSavings: 10000,
      bufferDays: 24,
      aiInsight: 'Discretionary spending is steadily increasing, tightening the safety cushion.',
      contributingFactors: ['Multiple digital subscriptions active', 'Runway at 24 days'],
    },
    {
      month: 'May',
      shortMonth: 'May',
      status: 'Early Warning',
      healthScore: 73,
      riskLevel: 'WATCH',
      monthlyIncome: 62000,
      monthlyExpenses: 53000,
      netSavings: 9000,
      bufferDays: 23,
      aiInsight: 'Early corrective trimming of recurring subscriptions will easily prevent distress.',
      contributingFactors: ['Discretionary spending remains elevated'],
    },
  ],
  'CUST-004': [
    {
      month: 'January',
      shortMonth: 'Jan',
      status: 'Stable',
      healthScore: 65,
      riskLevel: 'WATCH',
      monthlyIncome: 34000,
      monthlyExpenses: 30000,
      netSavings: 4000,
      bufferDays: 20,
      aiInsight: 'Tight monthly margin with high contractual debt-to-income ratio (57%).',
      contributingFactors: ['Vehicle loan EMI is 57% of income', 'Tight cash buffer'],
    },
    {
      month: 'February',
      shortMonth: 'Feb',
      status: 'Early Warning',
      healthScore: 54,
      riskLevel: 'AT_RISK',
      monthlyIncome: 34000,
      monthlyExpenses: 33000,
      netSavings: 1000,
      bufferDays: 14,
      aiInsight: 'Irregular contract gigs reduced net liquidity, leaving almost zero monthly savings.',
      contributingFactors: ['Income volatility', 'High fixed debt burden'],
    },
    {
      month: 'March',
      shortMonth: 'Mar',
      status: 'Moderate Risk',
      healthScore: 46,
      riskLevel: 'AT_RISK',
      monthlyIncome: 34000,
      monthlyExpenses: 36000,
      netSavings: -2000,
      bufferDays: 9,
      aiInsight: 'Operating expenses exceeded monthly earnings, consuming remaining bank reserves.',
      contributingFactors: ['Fuel cost inflation', 'No liquid cushion remaining'],
    },
    {
      month: 'April',
      shortMonth: 'Apr',
      status: 'Intervention Recommended',
      healthScore: 40,
      riskLevel: 'HIGH_RISK',
      monthlyIncome: 34000,
      monthlyExpenses: 38000,
      netSavings: -4000,
      bufferDays: 5,
      aiInsight: 'Severe cashflow deficit. Contractual EMI obligations exceed available funds.',
      contributingFactors: ['Deficit of ₹22,400 projected in 6 days', 'Critical risk'],
    },
    {
      month: 'May',
      shortMonth: 'May',
      status: 'Intervention Recommended',
      healthScore: 38,
      riskLevel: 'HIGH_RISK',
      monthlyIncome: 34000,
      monthlyExpenses: 39500,
      netSavings: -5500,
      bufferDays: 4,
      aiInsight: 'Immediate loan tenure extension or hardship relief needed to avert non-payment.',
      contributingFactors: ['Severe debt burden', 'Urgent bank restructuring needed'],
    },
  ],
};

// ==========================================
// FEATURE 3: FINANCIAL STRESS HEATMAP DATA
// ==========================================
export const MOCK_STRESS_HEATMAP: Record<string, StressCategoryItem[]> = {
  'CUST-003': [
    {
      id: 'cat-income',
      category: 'Income Stability',
      pressureLevel: 'LOW',
      pressureScore: 22,
      metricLabel: 'Monthly Inflow',
      metricValue: '₹42,000 / mo',
      benchmark: 'Stable payroll deposit on 1st of month',
      statusDescription: 'Consistent logistics supervisor payroll with verified direct bank deposit.',
      whyItMatters: 'Predictable income provides the baseline for deterministic cashflow budgeting.',
      suggestedAction: 'Maintain current income source. No immediate volatility detected.',
      routeLink: '/cash-forecast',
    },
    {
      id: 'cat-spending',
      category: 'Spending',
      pressureLevel: 'HIGH',
      pressureScore: 84,
      metricLabel: 'Discretionary Outlay',
      metricValue: '₹14,500 / mo',
      benchmark: 'Target: < ₹8,000 / mo',
      statusDescription: 'Elevated shopping and food delivery expenses have increased 28% over the past 60 days.',
      whyItMatters: 'Uncapped discretionary purchases are directly siphoning funds needed for contract obligations.',
      suggestedAction: 'Apply the 1-click ₹5,000 discretionary trim in the What-If Simulator.',
      routeLink: '/simulator',
    },
    {
      id: 'cat-debt',
      category: 'Debt',
      pressureLevel: 'MODERATE',
      pressureScore: 58,
      metricLabel: 'Total Debt Balance',
      metricValue: '₹1,84,000',
      benchmark: 'Target: < 40% annual income',
      statusDescription: 'Consumer durable loan and two active personal loan balances.',
      whyItMatters: 'Higher aggregate debt increases monthly interest leakage.',
      suggestedAction: 'Consolidate two smaller loans into a single lower-rate structured loan.',
      routeLink: '/recommendations',
    },
    {
      id: 'cat-savings',
      category: 'Savings',
      pressureLevel: 'HIGH',
      pressureScore: 88,
      metricLabel: 'Monthly Net Savings',
      metricValue: '₹3,000 / mo',
      benchmark: 'Target: ₹8,400 (20% income)',
      statusDescription: 'Net monthly savings fell from 26% in Jan to under 7% in May.',
      whyItMatters: 'Without regular savings inflows, any single surprise bill depletes the bank account.',
      suggestedAction: 'Enable automated weekly micro-savings of ₹1,200 via Bachat Mitra.',
      routeLink: '/recovery-plan',
    },
    {
      id: 'cat-emis',
      category: 'EMIs',
      pressureLevel: 'HIGH',
      pressureScore: 78,
      metricLabel: 'Monthly EMI Outflow',
      metricValue: '₹12,000 / mo',
      benchmark: 'Debt-to-Income: 28.5%',
      statusDescription: 'Upcoming ₹12,000 auto-debit due Nov 02 is 65% of current available balance (₹18,500).',
      whyItMatters: 'A high EMI ratio against a shrinking buffer triggers late fees and credit impairment.',
      suggestedAction: 'Request a 6-month tenure extension to lower monthly EMI by ₹3,200.',
      routeLink: '/simulator',
    },
    {
      id: 'cat-subscriptions',
      category: 'Subscriptions',
      pressureLevel: 'MODERATE',
      pressureScore: 62,
      metricLabel: 'Recurring Subscriptions',
      metricValue: '₹3,499 / mo',
      benchmark: 'Target: < ₹1,200 / mo',
      statusDescription: '6 active digital streaming and gym memberships, 3 of which have had zero usage for 30+ days.',
      whyItMatters: 'Silent recurring leaks compound to over ₹40,000 annually.',
      suggestedAction: 'Pause Cult.fit and Disney+ Hotstar to instantly save ₹1,999/month.',
      routeLink: '/subscriptions',
    },
    {
      id: 'cat-emergency',
      category: 'Emergency Fund',
      pressureLevel: 'HIGH',
      pressureScore: 86,
      metricLabel: 'Liquid Buffer Days',
      metricValue: '14 Days',
      benchmark: 'Safety Baseline: 30+ Days',
      statusDescription: 'Current liquid runway is only 14 days, well below the 30-day resilience benchmark.',
      whyItMatters: 'Leaves the household vulnerable to unexpected healthcare or vehicular repair shocks.',
      suggestedAction: 'Follow the 4-week Financial Recovery Plan to rebuild a 30-day cushion.',
      routeLink: '/recovery-plan',
    },
    {
      id: 'cat-payment',
      category: 'Payment Behavior',
      pressureLevel: 'LOW',
      pressureScore: 18,
      metricLabel: 'Historical Defaults',
      metricValue: '0 Missed Payments',
      benchmark: 'Clean credit track record',
      statusDescription: 'Zero missed payments to date. Early intervention ensures this record is 100% protected.',
      whyItMatters: 'Maintaining zero missed payments preserves access to prime interest rates.',
      suggestedAction: 'Act now with proactive adjustments to prevent the projected first default.',
      routeLink: '/early-warning',
    },
  ],
  'CUST-001': [
    { id: 'cat-income', category: 'Income Stability', pressureLevel: 'LOW', pressureScore: 10, metricLabel: 'Monthly Inflow', metricValue: '₹95,000 / mo', benchmark: 'Top-tier stability', statusDescription: 'Executive IT consulting income.', whyItMatters: 'Provides exceptional buffer.', suggestedAction: 'Continue current path.', routeLink: '/cash-forecast' },
    { id: 'cat-spending', category: 'Spending', pressureLevel: 'LOW', pressureScore: 24, metricLabel: 'Discretionary Outlay', metricValue: '₹15,000 / mo', benchmark: '< 25% of payroll', statusDescription: 'Controlled spending within budget.', whyItMatters: 'Healthy disposable margins.', suggestedAction: 'Automate surplus investments.', routeLink: '/goals' },
    { id: 'cat-debt', category: 'Debt', pressureLevel: 'LOW', pressureScore: 19, metricLabel: 'Total Debt Balance', metricValue: '₹4,20,000', benchmark: 'Comfortable', statusDescription: 'Home loan balance at prime rate.', whyItMatters: 'Low debt burden.', suggestedAction: 'Prepay principal when bonuses arrive.', routeLink: '/goals' },
    { id: 'cat-savings', category: 'Savings', pressureLevel: 'LOW', pressureScore: 12, metricLabel: 'Monthly Net Savings', metricValue: '₹40,000 / mo', benchmark: '> 35% income', statusDescription: 'High regular wealth building.', whyItMatters: 'Financial independence cushion.', suggestedAction: 'Review portfolio allocation.', routeLink: '/goals' },
    { id: 'cat-emis', category: 'EMIs', pressureLevel: 'LOW', pressureScore: 21, metricLabel: 'Monthly EMI Outflow', metricValue: '₹18,500 / mo', benchmark: '19.4% DTI', statusDescription: 'Well within standard safe limits.', whyItMatters: 'Zero risk of payment failure.', suggestedAction: 'Maintain autopay.', routeLink: '/early-warning' },
    { id: 'cat-subscriptions', category: 'Subscriptions', pressureLevel: 'LOW', pressureScore: 15, metricLabel: 'Recurring Subscriptions', metricValue: '₹1,800 / mo', benchmark: '< 2% income', statusDescription: 'Regularly utilized services.', whyItMatters: 'Low recurring footprint.', suggestedAction: 'Audit once annually.', routeLink: '/subscriptions' },
    { id: 'cat-emergency', category: 'Emergency Fund', pressureLevel: 'LOW', pressureScore: 14, metricLabel: 'Liquid Buffer Days', metricValue: '48 Days', benchmark: '> 30 Days', statusDescription: 'Robust liquid emergency reserves.', whyItMatters: 'Complete insulation against shocks.', suggestedAction: 'Keep in liquid sweep account.', routeLink: '/recovery-plan' },
    { id: 'cat-payment', category: 'Payment Behavior', pressureLevel: 'LOW', pressureScore: 8, metricLabel: 'Historical Defaults', metricValue: '0 Missed Payments', benchmark: 'Pristine track record', statusDescription: 'Flawless payment record over 6 years.', whyItMatters: 'Prime borrowing privileges.', suggestedAction: 'Maintain current habits.', routeLink: '/financial-health' },
  ],
  'CUST-002': [
    { id: 'cat-income', category: 'Income Stability', pressureLevel: 'LOW', pressureScore: 18, metricLabel: 'Monthly Inflow', metricValue: '₹62,000 / mo', benchmark: 'Stable corporate salary', statusDescription: 'Regular marketing operations payroll.', whyItMatters: 'Reliable monthly schedule.', suggestedAction: 'Plan around pay dates.', routeLink: '/cash-forecast' },
    { id: 'cat-spending', category: 'Spending', pressureLevel: 'MODERATE', pressureScore: 54, metricLabel: 'Discretionary Outlay', metricValue: '₹11,000 / mo', benchmark: 'Watch trend', statusDescription: 'Discretionary spending creeping upwards.', whyItMatters: 'Reduces end-of-month cushion.', suggestedAction: 'Cap dining and cab spend.', routeLink: '/simulator' },
    { id: 'cat-debt', category: 'Debt', pressureLevel: 'LOW', pressureScore: 28, metricLabel: 'Total Debt Balance', metricValue: '₹2,10,000', benchmark: 'Manageable', statusDescription: 'Car loan and retail EMI card.', whyItMatters: 'Debt ratio is 22.5%.', suggestedAction: 'Clear retail EMI card first.', routeLink: '/recommendations' },
    { id: 'cat-savings', category: 'Savings', pressureLevel: 'MODERATE', pressureScore: 46, metricLabel: 'Monthly Net Savings', metricValue: '₹5,000 / mo', benchmark: 'Target ₹10,000', statusDescription: 'Below target 20% savings rate.', whyItMatters: 'Slows emergency fund growth.', suggestedAction: 'Boost monthly contribution by ₹3,000.', routeLink: '/goals' },
    { id: 'cat-emis', category: 'EMIs', pressureLevel: 'LOW', pressureScore: 32, metricLabel: 'Monthly EMI Outflow', metricValue: '₹14,000 / mo', benchmark: '22.5% DTI', statusDescription: 'Regularly met without delay.', whyItMatters: 'Predictable debt service.', suggestedAction: 'Maintain auto-debit.', routeLink: '/early-warning' },
    { id: 'cat-subscriptions', category: 'Subscriptions', pressureLevel: 'MODERATE', pressureScore: 48, metricLabel: 'Recurring Subscriptions', metricValue: '₹2,650 / mo', benchmark: 'Review recommended', statusDescription: 'Several streaming and fitness apps.', whyItMatters: '₹1,200/mo potential savings.', suggestedAction: 'Cancel 2 unused subscriptions.', routeLink: '/subscriptions' },
    { id: 'cat-emergency', category: 'Emergency Fund', pressureLevel: 'MODERATE', pressureScore: 42, metricLabel: 'Liquid Buffer Days', metricValue: '23 Days', benchmark: 'Target: 30 Days', statusDescription: 'Runway is slightly below 30 days.', whyItMatters: 'Leaves thin margin for surprises.', suggestedAction: 'Build buffer up to 30 days.', routeLink: '/recovery-plan' },
    { id: 'cat-payment', category: 'Payment Behavior', pressureLevel: 'LOW', pressureScore: 12, metricLabel: 'Historical Defaults', metricValue: '0 Missed Payments', benchmark: 'Clean record', statusDescription: 'All bills cleared promptly.', whyItMatters: 'Preserves credit profile.', suggestedAction: 'Keep up excellent behavior.', routeLink: '/financial-health' },
  ],
  'CUST-004': [
    { id: 'cat-income', category: 'Income Stability', pressureLevel: 'HIGH', pressureScore: 82, metricLabel: 'Monthly Inflow', metricValue: '₹34,000 / mo', benchmark: 'High gig volatility', statusDescription: 'Variable freelance fleet revenue.', whyItMatters: 'Unpredictable cash dates.', suggestedAction: 'Set up income smoothing buffer.', routeLink: '/cash-forecast' },
    { id: 'cat-spending', category: 'Spending', pressureLevel: 'MODERATE', pressureScore: 50, metricLabel: 'Discretionary Outlay', metricValue: '₹6,000 / mo', benchmark: 'Lean spending', statusDescription: 'Living expenses already stripped down.', whyItMatters: 'Limited room to cut further.', suggestedAction: 'Focus on debt restructuring.', routeLink: '/recommendations' },
    { id: 'cat-debt', category: 'Debt', pressureLevel: 'HIGH', pressureScore: 92, metricLabel: 'Total Debt Balance', metricValue: '₹4,90,000', benchmark: 'High leverage', statusDescription: 'Heavy commercial vehicle financing.', whyItMatters: 'Interest is consuming liquidity.', suggestedAction: 'Restructure vehicle loan tenure.', routeLink: '/recommendations' },
    { id: 'cat-savings', category: 'Savings', pressureLevel: 'HIGH', pressureScore: 95, metricLabel: 'Monthly Net Savings', metricValue: '₹1,000 / mo', benchmark: 'Depleted', statusDescription: 'No monthly savings accumulation.', whyItMatters: 'Zero buffer for emergencies.', suggestedAction: 'Emergency debt relief needed.', routeLink: '/recovery-plan' },
    { id: 'cat-emis', category: 'EMIs', pressureLevel: 'HIGH', pressureScore: 96, metricLabel: 'Monthly EMI Outflow', metricValue: '₹19,500 / mo', benchmark: '57% DTI ratio', statusDescription: 'Over 57% of earnings locked into debt.', whyItMatters: 'Immediate risk of missed payment.', suggestedAction: 'Apply for bank hardship tenure extension.', routeLink: '/simulator' },
    { id: 'cat-subscriptions', category: 'Subscriptions', pressureLevel: 'LOW', pressureScore: 20, metricLabel: 'Recurring Subscriptions', metricValue: '₹499 / mo', benchmark: 'Minimal', statusDescription: 'Only 1 basic mobile plan.', whyItMatters: 'Not the cause of stress.', suggestedAction: 'Maintain essential plan.', routeLink: '/subscriptions' },
    { id: 'cat-emergency', category: 'Emergency Fund', pressureLevel: 'HIGH', pressureScore: 98, metricLabel: 'Liquid Buffer Days', metricValue: '4 Days', benchmark: 'Critical buffer', statusDescription: 'Only 4 days of liquid buffer remain.', whyItMatters: 'Deficit expected in 6 days.', suggestedAction: 'Immediate bank restructuring.', routeLink: '/recovery-plan' },
    { id: 'cat-payment', category: 'Payment Behavior', pressureLevel: 'MODERATE', pressureScore: 52, metricLabel: 'Historical Defaults', metricValue: '0 Missed (At Risk)', benchmark: 'Imminent breach', statusDescription: 'Never defaulted yet, but threshold close.', whyItMatters: 'Act today to protect credit history.', suggestedAction: 'Contact bank support desk.', routeLink: '/early-warning' },
  ],
};

// ==========================================
// FEATURE 4: EARLY WARNING ALERT CENTER DATA
// ==========================================
export const MOCK_ALERT_CENTER_DATA: Record<string, EarlyWarningAlert[]> = {
  'CUST-003': [
    {
      id: 'alt-001',
      priority: 'HIGH',
      title: 'Emergency Savings Depleting Below Baseline',
      problemDetected: 'Your liquid emergency reserves fell to 14 days of expenses, breaching the 30-day safe baseline.',
      whyItMatters: 'Without a 30-day cushion, scheduled monthly obligations like your ₹12,000 EMI face liquidity deficits if unexpected expenses occur.',
      suggestedAction: 'Pause discretionary dining and defer non-essential purchases to restore ₹5,000 to your liquid buffer.',
      category: 'Liquidity Buffer',
      timestamp: 'Today, 09:30 AM',
      actionRoute: '/simulator',
      actionLabel: 'Simulate Buffer Fix',
      dismissed: false,
    },
    {
      id: 'alt-002',
      priority: 'MEDIUM',
      title: 'Monthly Spending Increased by 18%',
      problemDetected: 'Your expenditures across food delivery and online shopping increased by 18% compared to last month.',
      whyItMatters: 'Accelerating spending reduces your monthly savings rate from 26% down to 6%, narrowing your financial safety margin.',
      suggestedAction: 'Review your discretionary budget and set a weekly spending cap of ₹2,000 for non-essentials.',
      category: 'Expenditure Spike',
      timestamp: 'Yesterday, 04:15 PM',
      actionRoute: '/recovery-plan',
      actionLabel: 'View Recovery Steps',
      dismissed: false,
    },
    {
      id: 'alt-003',
      priority: 'LOW',
      title: 'Inactive Subscriptions Detected',
      problemDetected: 'Your Cult.fit Gym (₹1,500/mo) and Hotstar (₹499/mo) subscriptions have recorded no usage for over 35 days.',
      whyItMatters: 'Silent recurring renewals drain ₹1,999 each month that could directly fortify your emergency savings.',
      suggestedAction: 'Pause or cancel underutilized subscriptions with one click in the Subscription Intelligence hub.',
      category: 'Subscriptions',
      timestamp: '2 days ago',
      actionRoute: '/subscriptions',
      actionLabel: 'Manage Subscriptions',
      dismissed: false,
    },
    {
      id: 'alt-004',
      priority: 'MEDIUM',
      title: 'Upcoming High-Value EMI Approaching',
      problemDetected: 'Auto-debit of ₹12,000 scheduled for Nov 02 (18 days remaining). Available liquid balance is ₹18,500.',
      whyItMatters: 'The upcoming obligation will consume 65% of your available cash balance, leaving minimal cushion for remaining bills.',
      suggestedAction: 'Maintain at least ₹14,000 in your primary checking account to avoid overdraft charges.',
      category: 'Debt Obligation',
      timestamp: '3 days ago',
      actionRoute: '/cash-forecast',
      actionLabel: 'Check Cash Trajectory',
      dismissed: false,
    },
  ],
  'CUST-001': [
    {
      id: 'alt-101',
      priority: 'LOW',
      title: 'Recurring Subscription Price Revision',
      problemDetected: 'Cloud storage subscription will adjust from ₹130 to ₹150 next billing cycle.',
      whyItMatters: 'Minor cost increase with negligible effect on your overall liquidity cushion.',
      suggestedAction: 'No action required. Buffer comfortably absorbs change.',
      category: 'Subscriptions',
      timestamp: '4 days ago',
      actionRoute: '/subscriptions',
      actionLabel: 'View Subscriptions',
      dismissed: false,
    },
  ],
  'CUST-002': [
    {
      id: 'alt-201',
      priority: 'MEDIUM',
      title: 'Seasonal Outlay Spike Observed',
      problemDetected: 'Shopping expenditures rose by 14% this month, bringing buffer runway to 23 days.',
      whyItMatters: 'Leaves a thinner cushion ahead of mid-month credit card settlement.',
      suggestedAction: 'Trim discretionary shopping by ₹3,000 over the next two weeks.',
      category: 'Spending',
      timestamp: '1 day ago',
      actionRoute: '/simulator',
      actionLabel: 'Simulate Spending Cut',
      dismissed: false,
    },
    {
      id: 'alt-202',
      priority: 'LOW',
      title: 'Unused Streaming Subscription',
      problemDetected: 'Spotify Family plan inactive for 28 days.',
      whyItMatters: 'Ongoing ₹179/month charge without active listening.',
      suggestedAction: 'Consider pausing or switching to individual tier.',
      category: 'Subscriptions',
      timestamp: '3 days ago',
      actionRoute: '/subscriptions',
      actionLabel: 'Optimize Plan',
      dismissed: false,
    },
  ],
  'CUST-004': [
    {
      id: 'alt-401',
      priority: 'HIGH',
      title: 'Imminent Cash Deficit Projected in 6 Days',
      problemDetected: 'Projected cash balance reaches -₹22,400 following upcoming commercial EMI debit.',
      whyItMatters: 'Risk of non-payment bounce fees and credit file notation if balance is insufficient.',
      suggestedAction: 'Apply for bank hardship tenure extension or request a 30-day grace period today.',
      category: 'Critical Liquidity',
      timestamp: '1 hour ago',
      actionRoute: '/recommendations',
      actionLabel: 'Apply for Restructuring',
      dismissed: false,
    },
    {
      id: 'alt-402',
      priority: 'HIGH',
      title: 'Liquid Buffer Depleted to 4 Days',
      problemDetected: 'Available liquid reserves do not cover upcoming vehicle loan installment.',
      whyItMatters: 'Zero room for fuel or maintenance costs.',
      suggestedAction: 'Access bank hardship support desk immediately.',
      category: 'Buffer Depletion',
      timestamp: '3 hours ago',
      actionRoute: '/simulator',
      actionLabel: 'Test Rescue Options',
      dismissed: false,
    },
  ],
};

// ==========================================
// FEATURE 5: PERSONALIZED RECOVERY PLAN DATA
// ==========================================
export const MOCK_RECOVERY_PLANS: Record<string, RecoveryPlan> = {
  'CUST-003': {
    id: 'rec-plan-003',
    customerId: 'CUST-003',
    title: '4-Week Liquidity Stabilization & Stress Prevention Plan',
    totalEstimatedImprovement: 6500,
    resilienceBoost: 22,
    initialRiskLevel: 'AT_RISK',
    targetRiskLevel: 'HEALTHY',
    tasks: [
      {
        id: 'task-w1-1',
        week: 1,
        weekTitle: 'Week 1: Review Unnecessary Spending',
        title: 'Audit and cancel unused digital subscriptions',
        description: 'Pause Cult.fit gym (₹1,500) and Hotstar (₹499) that have had zero logins over 30 days.',
        estimatedSavings: 1999,
        impact: '+₹1,999/mo direct cashflow relief',
        completed: false,
        category: 'Spending',
      },
      {
        id: 'task-w1-2',
        week: 1,
        weekTitle: 'Week 1: Review Unnecessary Spending',
        title: 'Audit food delivery and takeout surcharges',
        description: 'Set a weekly home-cooking target to reduce delivery fees and surge pricing by ₹1,000.',
        estimatedSavings: 1000,
        impact: '+₹1,000/mo expense reduction',
        completed: false,
        category: 'Discretionary',
      },
      {
        id: 'task-w2-1',
        week: 2,
        weekTitle: 'Week 2: Reduce Discretionary Expenses',
        title: 'Institute a weekly ₹2,000 discretionary allowance',
        description: 'Place non-essential weekend shopping on a strict weekly prepaid card limit.',
        estimatedSavings: 2000,
        impact: '+₹2,000/mo cash preservation',
        completed: false,
        category: 'Discretionary',
      },
      {
        id: 'task-w2-2',
        week: 2,
        weekTitle: 'Week 2: Reduce Discretionary Expenses',
        title: 'Defer non-urgent gadget purchases',
        description: 'Postpone planned ₹10,000 audio system upgrade until emergency runway exceeds 30 days.',
        estimatedSavings: 10000,
        impact: 'Protects ₹10,000 cash balance immediately',
        completed: true,
        category: 'Discretionary',
      },
      {
        id: 'task-w3-1',
        week: 3,
        weekTitle: 'Week 3: Build Emergency Savings',
        title: 'Activate automated ₹1,500 weekly emergency pot transfer',
        description: 'Auto-route savings immediately upon pay receipt into high-yield liquid account.',
        estimatedSavings: 1500,
        impact: '+12 days buffer addition over 60 days',
        completed: false,
        category: 'Savings',
      },
      {
        id: 'task-w3-2',
        week: 3,
        weekTitle: 'Week 3: Build Emergency Savings',
        title: 'Lock safety threshold of ₹5,000 in checking account',
        description: 'Configure low-balance warning alerts before balance drops under safety baseline.',
        estimatedSavings: 500,
        impact: 'Prevents overdraft and bounce fees',
        completed: false,
        category: 'Savings',
      },
      {
        id: 'task-w4-1',
        week: 4,
        weekTitle: 'Week 4: Review EMI Commitments',
        title: 'Evaluate loan tenure rebalancing with your bank',
        description: 'Extend loan tenure from 24 to 36 months to reduce monthly EMI burden from ₹12,000 to ₹8,800 without penalties.',
        estimatedSavings: 3200,
        impact: '+₹3,200/mo ongoing monthly cashflow cushion',
        completed: false,
        category: 'Debt',
      },
      {
        id: 'task-w4-2',
        week: 4,
        weekTitle: 'Week 4: Review EMI Commitments',
        title: 'Consolidate short-term retail debts',
        description: 'Merge two separate store finance loans into single structured facility at 11.5% APR.',
        estimatedSavings: 800,
        impact: 'Saves ₹800/mo in recurring finance charges',
        completed: false,
        category: 'Debt',
      },
    ],
  },
  'CUST-002': {
    id: 'rec-plan-002',
    customerId: 'CUST-002',
    title: '4-Week Buffer Optimization Plan',
    totalEstimatedImprovement: 4200,
    resilienceBoost: 15,
    initialRiskLevel: 'WATCH',
    targetRiskLevel: 'HEALTHY',
    tasks: [
      { id: 'task-p1', week: 1, weekTitle: 'Week 1: Review Unnecessary Spending', title: 'Trim unused digital media plans', description: 'Consolidate overlapping streaming accounts.', estimatedSavings: 1200, impact: '+₹1,200/mo cashflow', completed: true, category: 'Spending' },
      { id: 'task-p2', week: 2, weekTitle: 'Week 2: Reduce Discretionary Expenses', title: 'Cap weekend dining and cab surge costs', description: 'Switch to transit during peak hours.', estimatedSavings: 1500, impact: '+₹1,500/mo savings', completed: false, category: 'Discretionary' },
      { id: 'task-p3', week: 3, weekTitle: 'Week 3: Build Emergency Savings', title: 'Route monthly bonus into 30-day liquid buffer', description: 'Reach 35 days emergency runway.', estimatedSavings: 1500, impact: '+8 days buffer runway', completed: false, category: 'Savings' },
      { id: 'task-p4', week: 4, weekTitle: 'Week 4: Review EMI Commitments', title: 'Set up automated credit card full-balance payoff', description: 'Eliminate all revolving interest charges.', estimatedSavings: 500, impact: 'Preserves 0% interest status', completed: false, category: 'Debt' },
    ],
  },
  'CUST-004': {
    id: 'rec-plan-004',
    customerId: 'CUST-004',
    title: 'Emergency 4-Week Debt Restructuring & Solvency Plan',
    totalEstimatedImprovement: 8500,
    resilienceBoost: 35,
    initialRiskLevel: 'HIGH_RISK',
    targetRiskLevel: 'WATCH',
    tasks: [
      { id: 'task-v1', week: 1, weekTitle: 'Week 1: Restructure Immediate EMI', title: 'Apply for 30-day loan repayment moratorium', description: 'Request immediate bank hardship relief before payment date.', estimatedSavings: 19500, impact: 'Averts immediate overdraft crisis', completed: false, category: 'Debt' },
      { id: 'task-v2', week: 2, weekTitle: 'Week 2: Vehicle Loan Tenure Extension', title: 'Refinance commercial vehicle tenure to 60 months', description: 'Lowers monthly installment from ₹19,500 to ₹12,800.', estimatedSavings: 6700, impact: '+₹6,700/mo monthly liquidity relief', completed: false, category: 'Debt' },
      { id: 'task-v3', week: 3, weekTitle: 'Week 3: Cut Operating Overheads', title: 'Negotiate bulk fleet fuel pricing program', description: 'Enroll in logistics fuel partnership card.', estimatedSavings: 1200, impact: 'Reduces operating cost', completed: false, category: 'Spending' },
      { id: 'task-v4', week: 4, weekTitle: 'Week 4: Establish Dedicated Reserve', title: 'Segregate daily gig earnings into 15-day reserve', description: 'Prevent blending operational expenses with living needs.', estimatedSavings: 1500, impact: 'Ensures on-time EMI servicing', completed: false, category: 'Savings' },
    ],
  },
  'CUST-001': {
    id: 'rec-plan-001',
    customerId: 'CUST-001',
    title: 'Wealth Preservation & Buffer Reinforcement',
    totalEstimatedImprovement: 3000,
    resilienceBoost: 8,
    initialRiskLevel: 'HEALTHY',
    targetRiskLevel: 'HEALTHY',
    tasks: [
      { id: 'task-a1', week: 1, weekTitle: 'Week 1: Portfolio Review', title: 'Rebalance short-term liquid reserves', description: 'Shift excess idle checking cash into sweep-in FD.', estimatedSavings: 1500, impact: 'Higher passive yield', completed: true, category: 'Savings' },
      { id: 'task-a2', week: 2, weekTitle: 'Week 2: Tax Optimization', title: 'Maximize 80C and NPS deductions', description: 'Plan end-of-year tax-advantaged contributions.', estimatedSavings: 1500, impact: 'Optimizes net annual cashflow', completed: false, category: 'Savings' },
    ],
  },
};

// ==========================================
// FEATURE 6: FINANCIAL GOALS DATA
// ==========================================
export const MOCK_GOALS_DATA: Record<string, FinancialGoal[]> = {
  'CUST-003': [
    {
      id: 'goal-1',
      title: '3-Month Emergency Fund',
      category: 'Emergency Fund',
      targetAmount: 85000,
      currentSavings: 18500,
      monthlyContribution: 4000,
      estimatedCompletionDate: 'Oct 2027',
      riskImpact: 'SAFE',
      warningMessage: undefined,
      isRecommended: true,
    },
    {
      id: 'goal-2',
      title: 'Buy Work Laptop',
      category: 'Buy a Laptop',
      targetAmount: 55000,
      currentSavings: 12000,
      monthlyContribution: 3500,
      estimatedCompletionDate: 'Dec 2026',
      riskImpact: 'MODERATE_PRESSURE',
      warningMessage: 'Contributing ₹3,500/mo is manageable but narrows your buffer ahead of scheduled EMIs.',
    },
    {
      id: 'goal-3',
      title: 'Child Higher Education Pot',
      category: 'Education',
      targetAmount: 250000,
      currentSavings: 35000,
      monthlyContribution: 5000,
      estimatedCompletionDate: 'Jun 2030',
      riskImpact: 'EXCESSIVE_PRESSURE',
      warningMessage: '⚠️ Excessive Financial Pressure: Allocating ₹5,000/mo when liquid buffer is under 14 days risks a payment shortfall. Consider pacing at ₹2,500/mo until emergency reserves reach 30 days.',
    },
    {
      id: 'goal-4',
      title: 'Annual Family Travel',
      category: 'Travel',
      targetAmount: 40000,
      currentSavings: 8000,
      monthlyContribution: 2000,
      estimatedCompletionDate: 'Apr 2027',
      riskImpact: 'SAFE',
    },
    {
      id: 'goal-5',
      title: 'High-Interest Debt Payoff',
      category: 'Debt Reduction',
      targetAmount: 60000,
      currentSavings: 20000,
      monthlyContribution: 4000,
      estimatedCompletionDate: 'Jan 2027',
      riskImpact: 'SAFE',
      isRecommended: true,
    },
    {
      id: 'goal-6',
      title: 'Apartment Down Payment',
      category: 'Home Down Payment',
      targetAmount: 500000,
      currentSavings: 45000,
      monthlyContribution: 9000,
      estimatedCompletionDate: '2031',
      riskImpact: 'EXCESSIVE_PRESSURE',
      warningMessage: '⚠️ Excessive Financial Pressure: A ₹9,000/mo commitment consumes 21% of gross income and triggers severe deficit risks given upcoming contractual debt.',
    },
  ],
  'CUST-001': [
    { id: 'goal-a1', title: '6-Month Emergency Safety Vault', category: 'Emergency Fund', targetAmount: 300000, currentSavings: 280000, monthlyContribution: 10000, estimatedCompletionDate: 'Dec 2026', riskImpact: 'SAFE', isRecommended: true },
    { id: 'goal-a2', title: 'Home Down Payment Upgrade', category: 'Home Down Payment', targetAmount: 1500000, currentSavings: 650000, monthlyContribution: 25000, estimatedCompletionDate: 'Mar 2029', riskImpact: 'SAFE' },
    { id: 'goal-a3', title: 'International Sabbatical Travel', category: 'Travel', targetAmount: 300000, currentSavings: 120000, monthlyContribution: 12000, estimatedCompletionDate: 'Jan 2028', riskImpact: 'SAFE' },
  ],
  'CUST-002': [
    { id: 'goal-p1', title: '3-Month Emergency Cushion', category: 'Emergency Fund', targetAmount: 120000, currentSavings: 52000, monthlyContribution: 5000, estimatedCompletionDate: 'Dec 2027', riskImpact: 'SAFE', isRecommended: true },
    { id: 'goal-p2', title: 'Executive Education Certification', category: 'Education', targetAmount: 85000, currentSavings: 24000, monthlyContribution: 4500, estimatedCompletionDate: 'Feb 2027', riskImpact: 'SAFE' },
    { id: 'goal-p3', title: 'New Electric Vehicle Down Payment', category: 'Travel', targetAmount: 200000, currentSavings: 40000, monthlyContribution: 8000, estimatedCompletionDate: 'May 2028', riskImpact: 'MODERATE_PRESSURE', warningMessage: 'Allocating ₹8,000/mo leaves limited room for discretionary fluctuations.' },
  ],
  'CUST-004': [
    { id: 'goal-v1', title: 'Vehicle Maintenance Buffer', category: 'Emergency Fund', targetAmount: 50000, currentSavings: 6000, monthlyContribution: 1500, estimatedCompletionDate: '2028', riskImpact: 'MODERATE_PRESSURE', warningMessage: 'Current liquidity is too tight for discretionary savings. Prioritize debt restructuring first.', isRecommended: true },
    { id: 'goal-v2', title: 'Commercial Debt Liquidation', category: 'Debt Reduction', targetAmount: 150000, currentSavings: 10000, monthlyContribution: 3000, estimatedCompletionDate: '2029', riskImpact: 'EXCESSIVE_PRESSURE', warningMessage: '⚠️ Excessive Financial Pressure: Redirecting ₹3,000/mo into prepayments creates cash deficits for living needs.' },
  ],
};

// ==========================================
// FEATURE 7: SMART SUBSCRIPTION MANAGER DATA
// ==========================================
export const MOCK_SUBSCRIPTION_DATA: Record<string, SubscriptionAnalytics> = {
  'CUST-003': {
    totalMonthlySpend: 3499,
    unusedMonthlySpend: 1999,
    potentialMonthlySavings: 1999,
    annualProjectedWaste: 23988,
    subscriptionHealthScore: 56, // Low health because 57% is unused waste
    subscriptions: [
      {
        id: 'sub-1',
        name: 'Cult.fit Gym & Fitness Pass',
        category: 'Fitness',
        monthlyCost: 1500,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 42,
        isUnused: true,
        recommendation: 'Pause or cancel. Zero facility check-ins recorded for 6 consecutive weeks.',
        potentialMonthlySavings: 1500,
        active: true,
      },
      {
        id: 'sub-2',
        name: 'Disney+ Hotstar Super',
        category: 'Entertainment',
        monthlyCost: 499,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 36,
        isUnused: true,
        recommendation: 'Pause subscription between cricket tournament seasons to save ₹499/mo.',
        potentialMonthlySavings: 499,
        active: true,
      },
      {
        id: 'sub-3',
        name: 'Netflix Premium 4K UHD',
        category: 'Entertainment',
        monthlyCost: 649,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 2,
        isUnused: false,
        recommendation: 'Actively used (14 hours logged this week). Downgrade to Standard 1080p to save ₹150/mo.',
        potentialMonthlySavings: 150,
        active: true,
      },
      {
        id: 'sub-4',
        name: 'Amazon Prime Shopping & Video',
        category: 'Shopping',
        monthlyCost: 299,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 4,
        isUnused: false,
        recommendation: 'Switch from monthly (₹299/mo) to annual plan (₹1,499/yr) to save 58%.',
        potentialMonthlySavings: 174,
        active: true,
      },
      {
        id: 'sub-5',
        name: 'Spotify Premium Individual',
        category: 'Entertainment',
        monthlyCost: 119,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 1,
        isUnused: false,
        recommendation: 'Frequently used daily. Excellent value-to-cost ratio.',
        potentialMonthlySavings: 0,
        active: true,
      },
      {
        id: 'sub-6',
        name: 'Google One 100GB Cloud Storage',
        category: 'Productivity',
        monthlyCost: 130,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 0,
        isUnused: false,
        recommendation: 'Essential backup storage. Keep active.',
        potentialMonthlySavings: 0,
        active: true,
      },
      {
        id: 'sub-7',
        name: 'Blinkit Delivery Plus Pass',
        category: 'Utilities',
        monthlyCost: 303,
        billingCycle: 'Monthly',
        lastUsedDaysAgo: 18,
        isUnused: false,
        recommendation: 'Only 2 orders placed this month. Surcharge savings were lower than pass price.',
        potentialMonthlySavings: 180,
        active: true,
      },
    ],
  },
  'CUST-001': {
    totalMonthlySpend: 1849,
    unusedMonthlySpend: 0,
    potentialMonthlySavings: 250,
    annualProjectedWaste: 0,
    subscriptionHealthScore: 94,
    subscriptions: [
      { id: 'sub-a1', name: 'Apple One Premier', category: 'Productivity', monthlyCost: 999, billingCycle: 'Monthly', lastUsedDaysAgo: 0, isUnused: false, recommendation: 'Utilized across 4 family members.', potentialMonthlySavings: 0, active: true },
      { id: 'sub-a2', name: 'The Economist Digital', category: 'Productivity', monthlyCost: 450, billingCycle: 'Monthly', lastUsedDaysAgo: 1, isUnused: false, recommendation: 'Regularly read.', potentialMonthlySavings: 0, active: true },
      { id: 'sub-a3', name: 'Amazon Prime Annual (Amortized)', category: 'Shopping', monthlyCost: 125, billingCycle: 'Annual', lastUsedDaysAgo: 3, isUnused: false, recommendation: 'Optimal annual pricing active.', potentialMonthlySavings: 0, active: true },
      { id: 'sub-a4', name: 'Claude / AI Pro Bundle', category: 'Productivity', monthlyCost: 275, billingCycle: 'Monthly', lastUsedDaysAgo: 0, isUnused: false, recommendation: 'High business utility.', potentialMonthlySavings: 0, active: true },
    ],
  },
  'CUST-002': {
    totalMonthlySpend: 2650,
    unusedMonthlySpend: 999,
    potentialMonthlySavings: 1200,
    annualProjectedWaste: 11988,
    subscriptionHealthScore: 72,
    subscriptions: [
      { id: 'sub-p1', name: 'Anytime Fitness Monthly', category: 'Fitness', monthlyCost: 999, billingCycle: 'Monthly', lastUsedDaysAgo: 29, isUnused: true, recommendation: 'Unused for 4 weeks. Cancel to save ₹999/mo.', potentialMonthlySavings: 999, active: true },
      { id: 'sub-p2', name: 'Netflix Standard', category: 'Entertainment', monthlyCost: 499, billingCycle: 'Monthly', lastUsedDaysAgo: 3, isUnused: false, recommendation: 'Regularly watched.', potentialMonthlySavings: 0, active: true },
      { id: 'sub-p3', name: 'Audible Audiobooks', category: 'Entertainment', monthlyCost: 199, billingCycle: 'Monthly', lastUsedDaysAgo: 24, isUnused: false, recommendation: 'Consider pausing while unread library backlog clears.', potentialMonthlySavings: 199, active: true },
      { id: 'sub-p4', name: 'Canva Pro for Marketing', category: 'Productivity', monthlyCost: 653, billingCycle: 'Monthly', lastUsedDaysAgo: 1, isUnused: false, recommendation: 'Work essential.', potentialMonthlySavings: 0, active: true },
    ],
  },
  'CUST-004': {
    totalMonthlySpend: 499,
    unusedMonthlySpend: 0,
    potentialMonthlySavings: 150,
    annualProjectedWaste: 0,
    subscriptionHealthScore: 88,
    subscriptions: [
      { id: 'sub-v1', name: 'Airtel Postpaid Essential', category: 'Utilities', monthlyCost: 499, billingCycle: 'Monthly', lastUsedDaysAgo: 0, isUnused: false, recommendation: 'Switch to prepaid quarterly plan to save ₹150/mo.', potentialMonthlySavings: 150, active: true },
    ],
  },
};

// ==========================================
// FEATURE 10: MONTHLY FINANCIAL STORY DATA
// ==========================================
export const MOCK_MONTHLY_STORY: Record<string, MonthlyStoryData> = {
  'CUST-003': {
    month: 'May 2026',
    headline: 'This month your spending increased by 12%, while your savings decreased by 8%. Your overall financial health remains moderate.',
    spendingChangePercent: 12,
    savingsChangePercent: -8,
    healthStatus: 'Moderate — Early Intervention Window Active',
    whatImproved: [
      'Cleared all municipal utility and electricity bills strictly on time with zero penalty charges.',
      'Reduced retail clothing expenditures by ₹1,400 compared to prior month.',
      'Maintained 100% clean credit bureau record with zero historical defaults.',
    ],
    whatNeedsAttention: [
      'Discretionary food delivery and entertainment rose by 18%, draining ₹5,200 in unbudgeted cash.',
      'Upcoming ₹12,000 auto-debit EMI scheduled on Nov 02 exceeds available safe reserves.',
      'Underutilized subscriptions (Cult.fit & Disney+ Hotstar) leaked ₹1,999 without active usage.',
    ],
    recommendedNextSteps: [
      {
        title: 'Apply 1-Click Discretionary Trim',
        description: 'Simulate reducing dining and leisure by ₹5,000 to avert the projected November cash shortfall.',
        actionText: 'Launch Simulator',
        route: '/simulator',
      },
      {
        title: 'Execute 4-Week Recovery Roadmap',
        description: 'Check off Week 1 actions to cancel inactive subscriptions and establish weekly spending caps.',
        actionText: 'View Recovery Plan',
        route: '/recovery-plan',
      },
      {
        title: 'Review Loan Restructuring Options',
        description: 'Evaluate bank hardship tenure extension to reduce monthly commitment from ₹12,000 to ₹8,800.',
        actionText: 'Explore Interventions',
        route: '/recommendations',
      },
    ],
  },
  'CUST-001': {
    month: 'May 2026',
    headline: 'This month your spending remained steady at -2%, while your savings rate rose by 4%. Your overall financial health is robust.',
    spendingChangePercent: -2,
    savingsChangePercent: 4,
    healthStatus: 'Excellent — Solvency Buffer Exceeds 48 Days',
    whatImproved: [
      'Savings rate sustained above 42% of gross monthly consulting payroll.',
      'Liquid reserve cushion comfortably covers 6 months of living expenses.',
      'Automated mutual fund sweep completed smoothly.',
    ],
    whatNeedsAttention: [
      'Checking account cash balances exceed ₹80,000, creating minor idle yield drag.',
    ],
    recommendedNextSteps: [
      {
        title: 'Deploy Idle Reserves into High-Yield Sweep',
        description: 'Direct surplus checking deposits into liquid fixed sweep facilities.',
        actionText: 'Review Goals',
        route: '/goals',
      },
    ],
  },
  'CUST-002': {
    month: 'May 2026',
    headline: 'This month your spending increased by 7%, while your savings decreased by 3%. Your overall financial health is in the Watch zone.',
    spendingChangePercent: 7,
    savingsChangePercent: -3,
    healthStatus: 'Watch — Buffer Tightening',
    whatImproved: [
      'Maintained consistent on-time auto-debit for primary car loan.',
      'Work-related marketing tool subscriptions delivered positive return.',
    ],
    whatNeedsAttention: [
      'Discretionary e-commerce purchases narrowed cash buffer to 23 days.',
      'Unused gym pass renewed automatically for ₹999.',
    ],
    recommendedNextSteps: [
      {
        title: 'Pause Underutilized Gym Membership',
        description: 'Save ₹999/mo with one-click subscription management.',
        actionText: 'Manage Subscriptions',
        route: '/subscriptions',
      },
      {
        title: 'Re-align Buffer to 30 Days',
        description: 'Trim ₹2,500 in non-essentials to restore full safe runway.',
        actionText: 'Simulate Spending Cut',
        route: '/simulator',
      },
    ],
  },
  'CUST-004': {
    month: 'May 2026',
    headline: 'This month your expenditures exceeded income by 16%, depleting emergency cash reserves. Urgent intervention recommended.',
    spendingChangePercent: 16,
    savingsChangePercent: -22,
    healthStatus: 'High Distress Risk — Immediate Assistance Available',
    whatImproved: [
      'Maintained essential vehicle maintenance to preserve gig earning capacity.',
      'Proactively checked CashTwin ahead of scheduled auto-debit.',
    ],
    whatNeedsAttention: [
      'Commercial EMI of ₹19,500 due in 6 days threatens a ₹22,400 overdraft deficit.',
      'Liquid runway has contracted to 4 days.',
    ],
    recommendedNextSteps: [
      {
        title: 'Request Bank Hardship Tenure Extension',
        description: 'Restructure vehicle loan to 60 months to lower monthly outflow by ₹6,700.',
        actionText: 'Access Assistance',
        route: '/recommendations',
      },
      {
        title: 'Simulate Debt Moratorium',
        description: 'Model a 30-day payment deferral to stabilize operational liquidity.',
        actionText: 'Simulate Rescue',
        route: '/simulator',
      },
    ],
  },
};

// ==========================================
// FEATURE 11: BANK / ADVISOR VIEW DATA
// ==========================================
export const MOCK_ADVISOR_DATA: AdvisorDashboardData = {
  customersNeedingSupport: 142,
  totalMonitoredAccounts: 2840,
  preventedDelinquenciesCount: 389,
  interventionEffectivenessRate: 84.6, // 84.6% of early-assisted customers avoided default
  riskDistribution: [
    { category: 'Healthy (Buffer > 30d)', percentage: 62, count: 1760, color: '#10B981' },
    { category: 'Watch (Buffer 20-30d)', percentage: 21, count: 596, color: '#F59E0B' },
    { category: 'At Risk (Buffer 10-20d)', percentage: 12, count: 341, color: '#F97316' },
    { category: 'Critical Distress (< 7d)', percentage: 5, count: 143, color: '#EF4444' },
  ],
  cohortRiskTrends: [
    { month: 'Jan', atRiskCount: 198, assistedCount: 164, stabilizedCount: 142 },
    { month: 'Feb', atRiskCount: 185, assistedCount: 172, stabilizedCount: 153 },
    { month: 'Mar', atRiskCount: 224, assistedCount: 196, stabilizedCount: 168 },
    { month: 'Apr', atRiskCount: 241, assistedCount: 218, stabilizedCount: 189 },
    { month: 'May', atRiskCount: 142, assistedCount: 128, stabilizedCount: 112 },
  ],
  customerRecords: [
    {
      id: 'ADV-001',
      anonymousId: 'ANON-6204',
      alias: 'Rahul V. (Logistics Sector)',
      originalId: 'CUST-003',
      riskLevel: 'AT_RISK',
      resilienceScore: 64,
      bufferDaysRemaining: 14,
      primaryStressDriver: 'Impending ₹12,000 EMI vs declining cash reserves',
      outreachStatus: 'NEEDS_OUTREACH',
      recommendedIntervention: 'Offer 6-month tenure extension or ₹5,000 budgeting guidance',
      projectedShortfall: 9400,
    },
    {
      id: 'ADV-002',
      anonymousId: 'ANON-1098',
      alias: 'Vikram S. (Transport Contractor)',
      originalId: 'CUST-004',
      riskLevel: 'HIGH_RISK',
      resilienceScore: 38,
      bufferDaysRemaining: 4,
      primaryStressDriver: '57% Debt-to-Income; Deficit expected in 6 days',
      outreachStatus: 'IN_CONVERSATION',
      recommendedIntervention: 'Immediate hardship loan restructuring & 30-day payment grace window',
      projectedShortfall: 22400,
    },
    {
      id: 'ADV-003',
      anonymousId: 'ANON-7831',
      alias: 'Priya S. (Corporate Operations)',
      originalId: 'CUST-002',
      riskLevel: 'WATCH',
      resilienceScore: 73,
      bufferDaysRemaining: 23,
      primaryStressDriver: 'Accelerating discretionary spending and subscription leakage',
      outreachStatus: 'ASSISTANCE_OFFERED',
      recommendedIntervention: 'Automated subscription trim and weekly budgeting guide',
      projectedShortfall: 0,
    },
    {
      id: 'ADV-004',
      anonymousId: 'ANON-8419',
      alias: 'Sneha M. (Healthcare Worker)',
      originalId: 'CUST-005',
      riskLevel: 'AT_RISK',
      resilienceScore: 59,
      bufferDaysRemaining: 12,
      primaryStressDriver: 'Medical family outlay forced cash buffer under 15 days',
      outreachStatus: 'NEEDS_OUTREACH',
      recommendedIntervention: 'Zero-cost emergency credit line forbearance',
      projectedShortfall: 6200,
    },
    {
      id: 'ADV-005',
      anonymousId: 'ANON-9921',
      alias: 'Karan D. (Retail Small Merchant)',
      originalId: 'CUST-006',
      riskLevel: 'HIGH_RISK',
      resilienceScore: 42,
      bufferDaysRemaining: 6,
      primaryStressDriver: 'Inventory working capital mismatch ahead of quarterly tax debit',
      outreachStatus: 'IN_CONVERSATION',
      recommendedIntervention: 'Structured merchant cashflow smoothing facility',
      projectedShortfall: 18000,
    },
    {
      id: 'ADV-006',
      anonymousId: 'ANON-4192',
      alias: 'Arun P. (IT Consulting)',
      originalId: 'CUST-001',
      riskLevel: 'HEALTHY',
      resilienceScore: 88,
      bufferDaysRemaining: 48,
      primaryStressDriver: 'None. Pristine buffer and low leverage.',
      outreachStatus: 'STABILIZED',
      recommendedIntervention: 'Long-term wealth building & sweep deposit products',
      projectedShortfall: 0,
    },
  ],
};

// ==========================================
// FEATURE 12: DATA PRIVACY & TRANSPARENCY
// ==========================================
export const MOCK_PRIVACY_DATA: DataPrivacyConsent = {
  cashflowAnalytics: true,
  predictiveEarlyAlerts: true,
  anonymizedBenchmarking: true,
  thirdPartySharing: false, // Strict: Never shared with 3rd-party advertisers or brokers
  lastUpdated: 'May 12, 2026',
};

