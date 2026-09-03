from typing import Dict, Any, List
from schemas.risk import FinancialHealthResult, RiskDriver
from services.health_engine import FinancialHealthEngine
from ml.predict import Predictor

class RiskEngine:
    def __init__(self, model_dir: str = "models"):
        self.health_engine = FinancialHealthEngine()
        self.predictor = Predictor(model_dir=model_dir)
        
        # Explicit configurable weights
        self.WEIGHTS = {
            "cash_buffer_score": 0.25,
            "debt_burden_score": 0.20,
            "income_stability_score": 0.15,
            "expense_pressure_score": 0.15,
            "obligation_pressure_score": 0.10,
            "ml_risk_score": 0.15
        }
        
    def determine_risk_level(self, score: int) -> str:
        if score >= 80:
            return "LOW"
        elif score >= 60:
            return "WATCH"
        elif score >= 40:
            return "AT_RISK"
        elif score >= 20:
            return "HIGH"
        else:
            return "DISTRESS"
            
    def identify_drivers(self, scores: Dict[str, int]) -> List[RiskDriver]:
        drivers = []
        
        if scores["cash_buffer_score"] < 40:
            drivers.append(RiskDriver(
                driver="Low cash buffer",
                impact="high",
                contribution=int(100 - scores["cash_buffer_score"])
            ))
            
        if scores["debt_burden_score"] < 50:
            drivers.append(RiskDriver(
                driver="High EMI burden",
                impact="high",
                contribution=int(100 - scores["debt_burden_score"])
            ))
            
        if scores["expense_pressure_score"] < 50:
            drivers.append(RiskDriver(
                driver="High expense pressure",
                impact="medium",
                contribution=int(100 - scores["expense_pressure_score"])
            ))
            
        if scores["obligation_pressure_score"] < 40:
            drivers.append(RiskDriver(
                driver="High obligation pressure",
                impact="medium",
                contribution=int(100 - scores["obligation_pressure_score"])
            ))
            
        if scores["ml_risk_score"] < 50:
            drivers.append(RiskDriver(
                driver="High distress probability",
                impact="high",
                contribution=int(100 - scores["ml_risk_score"])
            ))
            
        # Sort by contribution descending
        drivers.sort(key=lambda x: x.contribution, reverse=True)
        return drivers

    def evaluate_customer(self, customer_data: Dict[str, Any]) -> FinancialHealthResult:
        # 1. Get deterministic health scores
        health_scores = self.health_engine.evaluate_health(customer_data)
        
        # 2. Get ML probability
        try:
            prediction = self.predictor.predict(customer_data)
            prob = prediction["risk_probability"]
        except Exception as e:
            # Fallback if prediction fails (e.g. missing features)
            prob = 0.5 
            
        # Convert prob to score (0 prob = 100 score, 1 prob = 0 score)
        ml_risk_score = int(max(0, min(100, (1.0 - prob) * 100)))
        health_scores["ml_risk_score"] = ml_risk_score
        
        # 3. Calculate final resilience score
        final_score = 0.0
        for comp, weight in self.WEIGHTS.items():
            final_score += health_scores[comp] * weight
            
        final_score = int(round(max(0, min(100, final_score))))
        
        # 4. Determine risk level
        risk_level = self.determine_risk_level(final_score)
        
        # 5. Identify drivers
        drivers = self.identify_drivers(health_scores)
        
        return FinancialHealthResult(
            cash_buffer_score=health_scores["cash_buffer_score"],
            debt_burden_score=health_scores["debt_burden_score"],
            income_stability_score=health_scores["income_stability_score"],
            expense_pressure_score=health_scores["expense_pressure_score"],
            obligation_pressure_score=health_scores["obligation_pressure_score"],
            ml_risk_score=ml_risk_score,
            financial_resilience_score=final_score,
            risk_level=risk_level,
            risk_drivers=drivers
        )
