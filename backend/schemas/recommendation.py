from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class Recommendation(BaseModel):
    id: str
    title: str
    priority: str
    category: str
    action: str
    reason: str
    evidence: Dict[str, Any]
    expected_benefit: str
    target: Optional[str]
    source_driver: str

class RecommendationResponse(BaseModel):
    overall_risk: str
    summary: str
    recommendations: List[Recommendation]
