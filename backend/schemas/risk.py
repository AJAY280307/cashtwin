from pydantic import BaseModel
from typing import List

class RiskDriver(BaseModel):
    driver: str
    impact: str
    contribution: float

class FinancialHealthResult(BaseModel):
    cash_buffer_score: int
    debt_burden_score: int
    income_stability_score: int
    expense_pressure_score: int
    obligation_pressure_score: int
    ml_risk_score: int
    financial_resilience_score: int
    risk_level: str
    risk_drivers: List[RiskDriver]
