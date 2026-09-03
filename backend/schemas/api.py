from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from schemas.risk import FinancialHealthResult
from schemas.forecast import ForecastResult
from schemas.explanation import ExplanationResponse
from schemas.recommendation import RecommendationResponse

class CustomerSummary(BaseModel):
    user_id: str
    display_name: str

class CustomerListResponse(BaseModel):
    customers: List[CustomerSummary]

class CompleteAnalysisResponse(BaseModel):
    customer: Dict[str, Any]
    financial_health: FinancialHealthResult
    forecast: Optional[ForecastResult]
    explanation: ExplanationResponse
    recommendations: RecommendationResponse
