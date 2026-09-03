export interface BackendCustomerSummary {
  user_id: string;
  display_name: string;
}

export interface BackendCustomerListResponse {
  customers: BackendCustomerSummary[];
}

export interface BackendRiskDriver {
  driver: string;
  impact: string;
  contribution: number;
}

export interface BackendFinancialHealth {
  cash_buffer_score: number;
  debt_burden_score: number;
  income_stability_score: number;
  expense_pressure_score: number;
  obligation_pressure_score: number;
  ml_risk_score: number;
  financial_resilience_score: number;
  risk_level: string;
  risk_drivers: BackendRiskDriver[];
}

export interface BackendForecastPoint {
  day: number;
  projected_cash: number;
  income: number;
  expenses: number;
  obligations: number;
  net_cash_flow: number;
}

export interface BackendForecast {
  customer_id: string;
  forecast_horizon_days: number;
  scenario: string;
  starting_cash: number;
  total_expected_income: number;
  total_expected_expenses: number;
  total_expected_obligations: number;
  ending_projected_cash: number;
  minimum_projected_cash: number;
  cash_gap: number;
  stress_date: number | null;
  daily_projection: BackendForecastPoint[];
  insight: string;
}

export interface BackendExplanationDriver {
  driver: string;
  severity: string;
  score: number;
  evidence: string;
  explanation: string;
}

export interface BackendExplanation {
  overall_risk: string;
  drivers: BackendExplanationDriver[];
  summary: string;
}

export interface BackendRecommendationAction {
  category: string;
  priority: number;
  title: string;
  recommendation: string;
  evidence: string;
}

export interface BackendRecommendation {
  overall_risk: string;
  summary: string;
  recommendations: BackendRecommendationAction[];
}

export interface BackendIntervention {
  reduce_expenses_by: number;
  reduce_emi_by: number;
  increase_savings_by: number;
  increase_income_by: number;
}

export interface BackendSimulationImpact {
  metric: string;
  before_value: number;
  after_value: number;
  improved: boolean;
}

export interface BackendSimulationResult {
  baseline_risk_level: string;
  simulated_risk_level: string;
  risk_improved: boolean;
  baseline_resilience_score: number;
  simulated_resilience_score: number;
  baseline_cash_gap: number;
  simulated_cash_gap: number;
  cash_gap_improved: boolean;
  impacts: BackendSimulationImpact[];
  summary: string;
}

export interface BackendCompleteAnalysisResponse {
  customer: any; // Raw dataset customer
  financial_health: BackendFinancialHealth;
  forecast: BackendForecast | null;
  explanation: BackendExplanation;
  recommendations: BackendRecommendation;
}
