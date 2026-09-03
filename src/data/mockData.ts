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

  // Calculate delta savings / spending changes
  const discretionarySavings = Math.max(0, defaults.discretionarySpending - input.discretionarySpending);
  const emiAdjustmentSavings = Math.max(0, defaults.monthlyEmi - input.monthlyEmi);
  const plannedExpenseDeferred = Math.max(0, defaults.plannedExpense - input.plannedExpense);

  const totalInterventionBenefit = discretionarySavings + emiAdjustmentSavings + plannedExpenseDeferred;

  const initialGap = baseDashboard.earlyWarning.potentialCashGap;
  const newCashGap = Math.max(0, initialGap - totalInterventionBenefit);

  // Baseline minimum balance
  const initialMinBalance =
    baseDashboard.forecast.reduce((min, p) => (p.balance < min ? p.balance : min), baseDashboard.forecast[0].balance);
  
  const newMinBalance = initialMinBalance + totalInterventionBenefit;

  // Before risk score
  const beforeRiskScore =
    customerId === 'CUST-003' ? 72 : customerId === 'CUST-004' ? 89 : customerId === 'CUST-002' ? 52 : 18;

  // Calculate After risk score
  let afterRiskScore = Math.max(15, Math.round(beforeRiskScore - (totalInterventionBenefit / 250)));
  if (newCashGap === 0 && newMinBalance >= baseDashboard.safetyThreshold) {
    afterRiskScore = Math.min(afterRiskScore, 31);
  }

  const beforeRiskLevel: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'HIGH_RISK' =
    beforeRiskScore > 70 ? 'HIGH_RISK' : beforeRiskScore > 50 ? 'AT_RISK' : beforeRiskScore > 35 ? 'WATCH' : 'HEALTHY';

  const afterRiskLevel: 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'HIGH_RISK' =
    afterRiskScore > 65 ? 'HIGH_RISK' : afterRiskScore > 45 ? 'AT_RISK' : afterRiskScore > 25 ? 'WATCH' : 'HEALTHY';

  const crisisPrevented = initialGap > 0 && newCashGap === 0 && newMinBalance > 2000;

  let explanation = '';
  if (crisisPrevented) {
    if (discretionarySavings > 0 && emiAdjustmentSavings === 0) {
      explanation = `Reducing discretionary spending by ₹${discretionarySavings.toLocaleString('en-IN')} improves the projected cash buffer and removes the predicted shortfall.`;
    } else if (totalInterventionBenefit > 0) {
      explanation = `Combined interventions preserve ₹${totalInterventionBenefit.toLocaleString('en-IN')} in liquidity, successfully averting the stress window.`;
    } else {
      explanation = `Projected buffer comfortably satisfies all impending contractual debt.`;
    }
  } else if (newCashGap > 0) {
    explanation = `The intervention recovers ₹${totalInterventionBenefit.toLocaleString('en-IN')}, but a residual cash shortfall of ₹${newCashGap.toLocaleString('en-IN')} remains. Additional bank restructuring recommended.`;
  } else {
    explanation = `Cash runway remains healthy with a projected minimum cushion of ₹${newMinBalance.toLocaleString('en-IN')}.`;
  }

  // Generate simulated forecast line
  const forecastPoints: ForecastPoint[] = baseDashboard.forecast.map((pt, idx) => {
    // Phase in the benefit progressively over the month
    const benefitFactor = (idx + 1) / baseDashboard.forecast.length;
    const simBal = Math.round(pt.balance + totalInterventionBenefit * benefitFactor);
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
    },
    after: {
      riskScore: afterRiskScore,
      cashGap: newCashGap,
      minimumBalance: newMinBalance,
      riskLevel: afterRiskLevel,
    },
    crisisPrevented,
    explanation,
    forecastPoints,
  };
}
