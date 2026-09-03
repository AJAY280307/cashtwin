from typing import Dict, Any, Optional
from schemas.forecast import ForecastResult, ForecastPoint

class ForecastEngine:
    def __init__(self):
        # Multipliers for STRESS and IMPROVED scenarios
        self.SCENARIOS = {
            "BASELINE": 1.0,
            "STRESS": 1.15,
            "IMPROVED": 0.90
        }

    def generate_forecast_insight(self, min_cash: float, end_cash: float, start_cash: float, scenario: str, baseline_min_cash: Optional[float] = None) -> str:
        if min_cash >= 0:
            return "Cash position remains positive throughout the forecast period."
        
        if scenario == "STRESS" and baseline_min_cash is not None and baseline_min_cash >= 0 and min_cash < 0:
            return "Current cash position is stable under baseline assumptions but vulnerable to increased expenses."
            
        if end_cash < start_cash and min_cash >= 0:
            return "Cash reserves are declining under the current expense and obligation pattern."
            
        return "Projected cash shortfall detected within the forecast horizon."

    def calculate_cash_gap(self, minimum_projected_cash: float) -> float:
        if minimum_projected_cash < 0:
            return abs(minimum_projected_cash)
        return 0.0

    def forecast_customer(self, customer_data: Dict[str, Any], horizon_days: int = 30, scenario: str = "BASELINE") -> ForecastResult:
        customer_id = str(customer_data.get("user_id", customer_data.get("id", "unknown")))
        
        starting_cash = float(customer_data.get("savings_usd", 0) or 0)
        
        monthly_income = float(customer_data.get("monthly_income_usd", 0) or 0)
        monthly_expenses = float(customer_data.get("monthly_expenses_usd", 0) or 0)
        monthly_emi = float(customer_data.get("monthly_emi_usd", 0) or 0)
        
        daily_income = monthly_income / 30.0 if monthly_income > 0 else 0.0
        
        # Apply scenario multiplier to expenses
        multiplier = self.SCENARIOS.get(scenario, 1.0)
        daily_expenses = (monthly_expenses * multiplier) / 30.0 if monthly_expenses > 0 else 0.0
        
        daily_emi = monthly_emi / 30.0 if monthly_emi > 0 else 0.0
        
        daily_net_cash_flow = daily_income - daily_expenses - daily_emi
        
        current_cash = starting_cash
        daily_projection = []
        minimum_projected_cash = starting_cash
        stress_date = None
        
        total_expected_income = 0.0
        total_expected_expenses = 0.0
        total_expected_obligations = 0.0
        
        for day in range(1, horizon_days + 1):
            current_cash += daily_net_cash_flow
            
            total_expected_income += daily_income
            total_expected_expenses += daily_expenses
            total_expected_obligations += daily_emi
            
            daily_projection.append(ForecastPoint(
                day=day,
                projected_cash=round(current_cash, 2),
                income=round(daily_income, 2),
                expenses=round(daily_expenses, 2),
                obligations=round(daily_emi, 2),
                net_cash_flow=round(daily_net_cash_flow, 2)
            ))
            
            if current_cash < minimum_projected_cash:
                minimum_projected_cash = current_cash
                
            if current_cash < 0 and stress_date is None:
                stress_date = day
                
        cash_gap = self.calculate_cash_gap(minimum_projected_cash)
        
        # Calculate baseline minimum cash to generate better insights for STRESS scenarios
        baseline_min_cash = None
        if scenario == "STRESS":
            baseline_result = self._forecast_baseline_min_cash(starting_cash, daily_income, monthly_expenses / 30.0 if monthly_expenses > 0 else 0.0, daily_emi, horizon_days)
            baseline_min_cash = baseline_result
            
        insight = self.generate_forecast_insight(
            min_cash=minimum_projected_cash,
            end_cash=current_cash,
            start_cash=starting_cash,
            scenario=scenario,
            baseline_min_cash=baseline_min_cash
        )
        
        return ForecastResult(
            customer_id=customer_id,
            forecast_horizon_days=horizon_days,
            scenario=scenario,
            starting_cash=round(starting_cash, 2),
            total_expected_income=round(total_expected_income, 2),
            total_expected_expenses=round(total_expected_expenses, 2),
            total_expected_obligations=round(total_expected_obligations, 2),
            ending_projected_cash=round(current_cash, 2),
            minimum_projected_cash=round(minimum_projected_cash, 2),
            cash_gap=round(cash_gap, 2),
            stress_date=stress_date,
            daily_projection=daily_projection,
            insight=insight
        )
        
    def _forecast_baseline_min_cash(self, start_cash: float, daily_inc: float, daily_exp: float, daily_emi: float, days: int) -> float:
        curr = start_cash
        min_c = start_cash
        for _ in range(days):
            curr += (daily_inc - daily_exp - daily_emi)
            if curr < min_c:
                min_c = curr
        return min_c
