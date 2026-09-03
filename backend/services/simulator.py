from typing import Dict, Any, List
from copy import deepcopy
from schemas.simulation import Intervention, SimulationResult, SimulationImpact
from services.risk_engine import RiskEngine
from services.forecast_engine import ForecastEngine

class SimulatorEngine:
    def __init__(self, model_dir: str = "models"):
        self.risk_engine = RiskEngine(model_dir=model_dir)
        self.forecast_engine = ForecastEngine()

    def apply_intervention_to_data(self, customer_data: Dict[str, Any], intervention: Intervention) -> Dict[str, Any]:
        sim_data = deepcopy(customer_data)
        
        # Apply intervention values (preventing them from dropping below 0 logically)
        sim_data['monthly_expenses_usd'] = max(0.0, float(sim_data.get('monthly_expenses_usd', 0)) - intervention.reduce_expenses_by)
        sim_data['monthly_emi_usd'] = max(0.0, float(sim_data.get('monthly_emi_usd', 0)) - intervention.reduce_emi_by)
        sim_data['savings_usd'] = max(0.0, float(sim_data.get('savings_usd', 0)) + intervention.increase_savings_by)
        sim_data['monthly_income_usd'] = max(0.0, float(sim_data.get('monthly_income_usd', 0)) + intervention.increase_income_by)

        # Recalculate derived ratios expected by the ML model
        def safe_div(a, b):
            return 0.0 if b == 0 else float(a) / float(b)

        inc = sim_data['monthly_income_usd']
        exp = sim_data['monthly_expenses_usd']
        emi = sim_data['monthly_emi_usd']
        sav = sim_data['savings_usd']
        loan = float(sim_data.get('loan_amount_usd', 0))

        sim_data['expense_to_income_ratio'] = safe_div(exp, inc)
        sim_data['emi_to_income_ratio'] = safe_div(emi, inc)
        sim_data['savings_to_income_ratio'] = safe_div(sav, inc)
        sim_data['cash_buffer_months'] = safe_div(sav, exp)
        sim_data['financial_obligation_ratio'] = safe_div(exp + emi, inc)
        
        # Recalculate debt_to_income_ratio if it was present
        if 'debt_to_income_ratio' in sim_data:
            sim_data['debt_to_income_ratio'] = safe_div(loan, inc * 12)
            
        return sim_data

    def simulate(self, customer_data: Dict[str, Any], intervention: Intervention) -> SimulationResult:
        # 1. Baseline Evaluation
        baseline_health = self.risk_engine.evaluate_customer(customer_data)
        baseline_forecast = self.forecast_engine.forecast_customer(
            customer_data, 
            horizon_days=30, 
            scenario="BASELINE"
        )

        # 2. Simulated Evaluation
        simulated_data = self.apply_intervention_to_data(customer_data, intervention)
        simulated_health = self.risk_engine.evaluate_customer(simulated_data)
        simulated_forecast = self.forecast_engine.forecast_customer(
            simulated_data, 
            horizon_days=30, 
            scenario="BASELINE"
        )

        # 3. Build Impacts List
        impacts: List[SimulationImpact] = []
        
        # Resilience Score Impact
        res_before = baseline_health.financial_resilience_score
        res_after = simulated_health.financial_resilience_score
        impacts.append(SimulationImpact(
            metric="Financial Resilience Score",
            before_value=res_before,
            after_value=res_after,
            improved=res_after > res_before
        ))

        # Cash Gap Impact
        gap_before = baseline_forecast.cash_gap
        gap_after = simulated_forecast.cash_gap
        impacts.append(SimulationImpact(
            metric="Projected Cash Gap",
            before_value=gap_before,
            after_value=gap_after,
            improved=gap_after < gap_before
        ))
        
        # Min Projected Cash
        min_cash_before = baseline_forecast.minimum_projected_cash
        min_cash_after = simulated_forecast.minimum_projected_cash
        impacts.append(SimulationImpact(
            metric="Minimum Projected Cash",
            before_value=min_cash_before,
            after_value=min_cash_after,
            improved=min_cash_after > min_cash_before
        ))

        # Overall Improvements
        risk_improved = False
        risk_levels = {"DISTRESS": 0, "HIGH": 1, "AT_RISK": 2, "WATCH": 3, "LOW": 4}
        if risk_levels.get(simulated_health.risk_level, 0) > risk_levels.get(baseline_health.risk_level, 0):
            risk_improved = True
            
        cash_gap_improved = gap_after < gap_before

        # Determine Summary
        if risk_improved and gap_after == 0 and gap_before > 0:
            summary = "The intervention successfully resolved the cash shortfall and improved the overall risk level."
        elif risk_improved:
            summary = "The intervention improved the overall risk level."
        elif cash_gap_improved:
            summary = "The intervention improved the projected cash flow."
        elif res_after > res_before:
            summary = "The intervention marginally improved financial resilience, but did not shift the overall risk tier."
        else:
            summary = "The intervention did not significantly improve the financial condition."

        return SimulationResult(
            baseline_risk_level=baseline_health.risk_level,
            simulated_risk_level=simulated_health.risk_level,
            risk_improved=risk_improved,
            baseline_resilience_score=baseline_health.financial_resilience_score,
            simulated_resilience_score=simulated_health.financial_resilience_score,
            baseline_cash_gap=baseline_forecast.cash_gap,
            simulated_cash_gap=simulated_forecast.cash_gap,
            cash_gap_improved=cash_gap_improved,
            impacts=impacts,
            summary=summary
        )
