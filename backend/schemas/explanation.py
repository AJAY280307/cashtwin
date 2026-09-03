from pydantic import BaseModel
from typing import Dict, Any, List

class RiskExplanation(BaseModel):
    driver: str
    severity: str
    evidence: Dict[str, Any]
    contribution: float
    explanation: str

class ExplanationResponse(BaseModel):
    overall_risk: str
    summary: str
    drivers: List[RiskExplanation]
