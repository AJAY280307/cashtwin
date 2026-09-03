from pydantic import BaseModel
from typing import List, Optional

class ForecastPoint(BaseModel):
    day: int
    projected_cash: float
    income: float
    expenses: float
    obligations: float
    net_cash_flow: float

class ForecastResult(BaseModel):
    customer_id: str
    forecast_horizon_days: int
    scenario: str
    starting_cash: float
    total_expected_income: float
    total_expected_expenses: float
    total_expected_obligations: float
    ending_projected_cash: float
    minimum_projected_cash: float
    cash_gap: float
    stress_date: Optional[int]
    daily_projection: List[ForecastPoint]
    insight: str
