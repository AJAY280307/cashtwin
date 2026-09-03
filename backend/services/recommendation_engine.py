from typing import Dict, Any, List
from schemas.explanation import ExplanationResponse
from schemas.recommendation import Recommendation, RecommendationResponse

class RecommendationEngine:
    def __init__(self):
        pass

    def build_recommendations(self, customer_data: Dict[str, Any], explanation: ExplanationResponse) -> RecommendationResponse:
        recommendations: List[Recommendation] = []
        added_categories = set()
        
        income = float(customer_data.get('monthly_income_usd', 0) or 0)
        
        # Drivers in explanation are already sorted by priority/severity from Phase 6
        for driver in explanation.drivers:
            rec = None
            
            if driver.driver in ("High EMI burden", "High obligation pressure"):
                if "DEBT" not in added_categories:
                    added_categories.add("DEBT")
                    target = f"Reduce monthly debt obligations below {int(income * 0.4)} (40% of income)." if income > 0 else None
                    rec = Recommendation(
                        id="rec-debt",
                        title="Review Debt Obligations",
                        priority=driver.severity,
                        category="DEBT",
                        action="Review outstanding debt obligations and prioritize reducing high-cost or high-pressure debt where financially appropriate. Consider restructuring or consolidating eligible debt with an appropriate financial institution, where suitable.",
                        reason=driver.explanation,
                        evidence=driver.evidence,
                        expected_benefit="May reduce monthly obligation pressure and improve cash-flow resilience.",
                        target=target,
                        source_driver=driver.driver
                    )
                    
            elif driver.driver == "Low cash buffer":
                if "CASH_BUFFER" not in added_categories:
                    added_categories.add("CASH_BUFFER")
                    buffer_months = driver.evidence.get("cash_buffer_months", 0)
                    target = "Build toward 1.0+ months of essential expenses." if buffer_months < 1.0 else "Build toward 3.0+ months of essential expenses."
                    rec = Recommendation(
                        id="rec-cash-buffer",
                        title="Build Emergency Reserve",
                        priority=driver.severity,
                        category="CASH_BUFFER",
                        action="Build an emergency cash reserve by allocating a manageable portion of monthly surplus toward savings.",
                        reason=driver.explanation,
                        evidence=driver.evidence,
                        expected_benefit="May increase available emergency liquidity and protect against sudden expense shocks.",
                        target=target,
                        source_driver=driver.driver
                    )
                    
            elif driver.driver == "High expense pressure":
                if "EXPENSES" not in added_categories:
                    added_categories.add("EXPENSES")
                    target = f"Reduce recurring expenses toward {int(income * 0.5)} (50% of income)." if income > 0 else None
                    rec = Recommendation(
                        id="rec-expenses",
                        title="Reduce Discretionary Spending",
                        priority=driver.severity,
                        category="EXPENSES",
                        action="Review discretionary spending and identify recurring expenses that can be reduced.",
                        reason=driver.explanation,
                        evidence=driver.evidence,
                        expected_benefit="May improve monthly surplus and increase available cash for savings or debt reduction.",
                        target=target,
                        source_driver=driver.driver
                    )
                    
            elif driver.driver == "Negative cash forecast":
                if "CASH_FLOW" not in added_categories:
                    added_categories.add("CASH_FLOW")
                    rec = Recommendation(
                        id="rec-cash-flow",
                        title="Prevent Projected Shortfall",
                        priority=driver.severity,
                        category="CASH_FLOW",
                        action="Reduce projected cash pressure by increasing available cash reserves, reducing avoidable expenses, or reviewing upcoming obligations before the projected cash gap.",
                        reason=driver.explanation,
                        evidence=driver.evidence,
                        expected_benefit="May reduce the projected cash gap and maintain a positive cash balance.",
                        target=None,
                        source_driver=driver.driver
                    )
                    
            elif driver.driver == "High distress probability":
                if "RISK_MONITORING" not in added_categories:
                    added_categories.add("RISK_MONITORING")
                    rec = Recommendation(
                        id="rec-risk-monitoring",
                        title="Early Intervention Review",
                        priority=driver.severity,
                        category="RISK_MONITORING",
                        action="Review the major financial risk drivers identified by CashTwin and consider early intervention before financial pressure increases.",
                        reason=driver.explanation,
                        evidence=driver.evidence,
                        expected_benefit="May address systemic financial stress factors and improve overall financial stability.",
                        target=None,
                        source_driver=driver.driver
                    )
                    
            if rec:
                recommendations.append(rec)
                
        if len(recommendations) == 0:
            summary = "No significant intervention is currently indicated based on the available financial indicators."
        else:
            summary = "Personalized financial recommendations have been generated based on current risk drivers."
            
        return RecommendationResponse(
            overall_risk=explanation.overall_risk,
            summary=summary,
            recommendations=recommendations
        )
