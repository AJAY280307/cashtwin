from typing import Dict, Any, List, Optional
from schemas.explanation import ExplanationResponse, RiskExplanation
from schemas.risk import FinancialHealthResult
from schemas.forecast import ForecastResult

class ExplanationEngine:
    def __init__(self):
        pass

    def determine_severity(self, contribution: float) -> str:
        if contribution >= 80:
            return "CRITICAL"
        elif contribution >= 50:
            return "HIGH"
        elif contribution >= 20:
            return "MEDIUM"
        else:
            return "LOW"

    def get_summary(self, overall_risk: str) -> str:
        if overall_risk == "LOW":
            return "Financial indicators currently show strong resilience with limited immediate risk drivers."
        elif overall_risk == "WATCH":
            return "Some financial pressure indicators are present and should be monitored."
        elif overall_risk == "AT_RISK":
            return "Multiple financial pressure indicators suggest elevated financial risk."
        elif overall_risk == "HIGH":
            return "Significant financial pressure is present and may threaten near-term financial stability."
        elif overall_risk == "DISTRESS":
            return "Current financial indicators indicate severe financial stress requiring immediate attention."
        return "Unknown risk state."

    def build_explanation(self, customer_data: Dict[str, Any], health_result: FinancialHealthResult, forecast_result: Optional[ForecastResult] = None) -> ExplanationResponse:
        drivers: List[RiskExplanation] = []
        
        # 1. Process drivers from RiskEngine
        for driver in health_result.risk_drivers:
            severity = self.determine_severity(driver.contribution)
            evidence = {}
            explanation = ""
            
            if driver.driver == "Low cash buffer":
                savings = float(customer_data.get('savings_usd', 0) or 0)
                expenses = float(customer_data.get('monthly_expenses_usd', 0) or 0)
                buffer = savings / expenses if expenses > 0 else (6.0 if savings > 0 else 0.0)
                evidence = {
                    "savings_usd": savings,
                    "monthly_expenses_usd": expenses,
                    "cash_buffer_months": round(buffer, 2)
                }
                explanation = f"Cash buffer provides only {round(buffer, 2)} months of expense coverage, indicating low savings resilience."
            
            elif driver.driver == "High EMI burden":
                emi = float(customer_data.get('monthly_emi_usd', 0) or 0)
                income = float(customer_data.get('monthly_income_usd', 0) or 0)
                ratio = emi / income if income > 0 else 0.0
                evidence = {
                    "monthly_emi_usd": emi,
                    "monthly_income_usd": income,
                    "emi_to_income_ratio": round(ratio, 3)
                }
                if income == 0 and emi > 0:
                    explanation = "EMI exists but there is no monthly income."
                else:
                    explanation = f"Monthly EMI consumes approximately {round(ratio * 100, 1)}% of monthly income."
                    
            elif driver.driver == "High expense pressure":
                expenses = float(customer_data.get('monthly_expenses_usd', 0) or 0)
                income = float(customer_data.get('monthly_income_usd', 0) or 0)
                ratio = expenses / income if income > 0 else 0.0
                evidence = {
                    "monthly_expenses_usd": expenses,
                    "monthly_income_usd": income,
                    "expense_to_income_ratio": round(ratio, 3)
                }
                if income == 0 and expenses > 0:
                    explanation = "Expenses exist but there is no monthly income."
                else:
                    explanation = f"Monthly expenses consume approximately {round(ratio * 100, 1)}% of monthly income."
                    
            elif driver.driver == "High obligation pressure":
                loan = float(customer_data.get('loan_amount_usd', 0) or 0)
                income = float(customer_data.get('monthly_income_usd', 0) or 0)
                lti = loan / (income * 12) if income > 0 else 0.0
                evidence = {
                    "loan_amount_usd": loan,
                    "annual_income_usd": income * 12,
                    "loan_to_income_ratio": round(lti, 3)
                }
                explanation = "Outstanding loan obligations create elevated debt pressure relative to annual income."
                
            elif driver.driver == "High distress probability":
                prob = 1.0 - (health_result.ml_risk_score / 100.0)
                evidence = {
                    "distress_probability": round(prob, 3)
                }
                explanation = "The ML model identifies an elevated probability of the defined financial-obligation distress condition."
                
            else:
                # Fallback for unexpected drivers
                evidence = {"contribution": driver.contribution}
                explanation = f"Financial risk component: {driver.driver}"
                
            drivers.append(RiskExplanation(
                driver=driver.driver,
                severity=severity,
                evidence=evidence,
                contribution=float(driver.contribution),
                explanation=explanation
            ))
            
        # 2. Add Forecast Integration
        if forecast_result and forecast_result.minimum_projected_cash < 0:
            contribution = 85.0 # Fixed high contribution for running out of cash
            severity = self.determine_severity(contribution)
            evidence = {
                "forecast_horizon": forecast_result.forecast_horizon_days,
                "minimum_projected_cash": forecast_result.minimum_projected_cash,
                "cash_gap": forecast_result.cash_gap,
                "stress_date": forecast_result.stress_date
            }
            explanation = "Under the selected projection scenario, projected cash falls below zero within the forecast horizon."
            drivers.append(RiskExplanation(
                driver="Negative cash forecast",
                severity=severity,
                evidence=evidence,
                contribution=contribution,
                explanation=explanation
            ))
            
        # Prioritize drivers: CRITICAL -> HIGH -> MEDIUM -> LOW, and by contribution descending
        severity_rank = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
        drivers.sort(key=lambda x: (severity_rank.get(x.severity, 0), x.contribution), reverse=True)
        
        summary = self.get_summary(health_result.risk_level)
        
        return ExplanationResponse(
            overall_risk=health_result.risk_level,
            summary=summary,
            drivers=drivers
        )
