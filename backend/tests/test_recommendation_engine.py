import pytest
from services.recommendation_engine import RecommendationEngine
from schemas.explanation import ExplanationResponse, RiskExplanation

@pytest.fixture
def recommendation_engine():
    return RecommendationEngine()

def test_healthy_customer_no_artificial_recommendations(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="LOW",
        summary="Safe",
        drivers=[]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 0
    assert "No significant intervention" in res.summary

def test_high_emi_debt_recommendation(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="HIGH",
        summary="High risk",
        drivers=[
            RiskExplanation(
                driver="High EMI burden", severity="CRITICAL",
                evidence={"emi": 3000}, contribution=100.0, explanation="High EMI"
            )
        ]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 1
    rec = res.recommendations[0]
    assert rec.category == "DEBT"
    assert rec.priority == "CRITICAL"
    assert rec.source_driver == "High EMI burden"
    assert rec.target == "Reduce monthly debt obligations below 2000 (40% of income)."
    assert rec.expected_benefit is not None

def test_duplicate_prevention(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="HIGH",
        summary="High risk",
        drivers=[
            RiskExplanation(
                driver="High EMI burden", severity="CRITICAL",
                evidence={}, contribution=100.0, explanation="High EMI"
            ),
            RiskExplanation(
                driver="High obligation pressure", severity="HIGH",
                evidence={}, contribution=80.0, explanation="High Obligation"
            )
        ]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 1
    rec = res.recommendations[0]
    assert rec.category == "DEBT"
    assert rec.priority == "CRITICAL" # Retains priority of the first/highest priority driver

def test_low_cash_buffer_recommendation(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="AT_RISK",
        summary="At risk",
        drivers=[
            RiskExplanation(
                driver="Low cash buffer", severity="HIGH",
                evidence={"cash_buffer_months": 0.5}, contribution=80.0, explanation="Low buffer"
            )
        ]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 1
    rec = res.recommendations[0]
    assert rec.category == "CASH_BUFFER"
    assert rec.target == "Build toward 1.0+ months of essential expenses."

def test_zero_income_safe(recommendation_engine):
    data = {'monthly_income_usd': 0}
    explanation = ExplanationResponse(
        overall_risk="DISTRESS",
        summary="Distress",
        drivers=[
            RiskExplanation(
                driver="High expense pressure", severity="CRITICAL",
                evidence={}, contribution=100.0, explanation="High expense"
            )
        ]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 1
    rec = res.recommendations[0]
    assert rec.category == "EXPENSES"
    assert rec.target is None # Target safely handled when income=0

def test_multiple_drivers_and_ordering(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="DISTRESS",
        summary="Distress",
        drivers=[
            RiskExplanation(driver="Negative cash forecast", severity="CRITICAL", evidence={}, contribution=100.0, explanation="Neg cash"),
            RiskExplanation(driver="High EMI burden", severity="HIGH", evidence={}, contribution=80.0, explanation="High EMI"),
            RiskExplanation(driver="High distress probability", severity="MEDIUM", evidence={}, contribution=50.0, explanation="ML Risk")
        ]
    )
    res = recommendation_engine.build_recommendations(data, explanation)
    assert len(res.recommendations) == 3
    # They should retain the order from the explanation which is pre-sorted
    assert res.recommendations[0].category == "CASH_FLOW"
    assert res.recommendations[1].category == "DEBT"
    assert res.recommendations[2].category == "RISK_MONITORING"
    
def test_deterministic_repeated_output(recommendation_engine):
    data = {'monthly_income_usd': 5000}
    explanation = ExplanationResponse(
        overall_risk="DISTRESS",
        summary="Distress",
        drivers=[
            RiskExplanation(driver="Negative cash forecast", severity="CRITICAL", evidence={}, contribution=100.0, explanation="Neg cash"),
        ]
    )
    res1 = recommendation_engine.build_recommendations(data, explanation)
    res2 = recommendation_engine.build_recommendations(data, explanation)
    assert res1.model_dump() == res2.model_dump()
