from pydantic import BaseModel
from typing import List, Optional

class Intervention(BaseModel):
    reduce_expenses_by: float = 0.0
    reduce_emi_by: float = 0.0
    increase_savings_by: float = 0.0
    increase_income_by: float = 0.0

class SimulationImpact(BaseModel):
    metric: str
    before_value: float
    after_value: float
    improved: bool

class SimulationResult(BaseModel):
    baseline_risk_level: str
    simulated_risk_level: str
    risk_improved: bool
    baseline_resilience_score: int
    simulated_resilience_score: int
    baseline_cash_gap: float
    simulated_cash_gap: float
    cash_gap_improved: bool
    impacts: List[SimulationImpact]
    summary: str
