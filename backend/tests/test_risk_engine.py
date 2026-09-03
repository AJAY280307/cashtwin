import pytest
from services.risk_engine import RiskEngine

@pytest.fixture
def risk_engine():
    # Pass a non-existent dir to Predictor so it fails to load and uses the fallback (prob=0.5)
    # Actually, we can just mock the Predictor or let it load the real model since it exists.
    # The real model exists in models/distress_model.joblib from Phase 3B.
    return RiskEngine(model_dir="models")

def test_risk_level_boundaries(risk_engine):
    assert risk_engine.determine_risk_level(80) == "LOW"
    assert risk_engine.determine_risk_level(79) == "WATCH"
    assert risk_engine.determine_risk_level(60) == "WATCH"
    assert risk_engine.determine_risk_level(59) == "AT_RISK"
    assert risk_engine.determine_risk_level(40) == "AT_RISK"
    assert risk_engine.determine_risk_level(39) == "HIGH"
    assert risk_engine.determine_risk_level(20) == "HIGH"
    assert risk_engine.determine_risk_level(19) == "DISTRESS"
    assert risk_engine.determine_risk_level(0) == "DISTRESS"

def test_healthy_customer(risk_engine):
    data = {
        'age': 30,
        'monthly_income_usd': 10000,
        'monthly_expenses_usd': 2000,
        'savings_usd': 60000,
        'loan_amount_usd': 0,
        'loan_term_months': 0,
        'monthly_emi_usd': 0,
        'loan_interest_rate_pct': 0,
        'debt_to_income_ratio': 0,
        'credit_score': 800,
        'savings_to_income_ratio': 6.0,
        'cash_buffer_months': 30.0,
        'employment_status': 'Employed'
    }
    res = risk_engine.evaluate_customer(data)
    assert res.financial_resilience_score >= 80
    assert res.risk_level in ["LOW", "WATCH"]

def test_high_debt_customer(risk_engine):
    data = {
        'age': 30,
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 2000,
        'savings_usd': 1000,
        'loan_amount_usd': 200000,
        'loan_term_months': 360,
        'monthly_emi_usd': 3500,
        'loan_interest_rate_pct': 5,
        'debt_to_income_ratio': 0.7,
        'credit_score': 600,
        'savings_to_income_ratio': 0.2,
        'cash_buffer_months': 0.5,
        'employment_status': 'Employed'
    }
    res = risk_engine.evaluate_customer(data)
    assert res.debt_burden_score == 0
    assert res.financial_resilience_score < 60
    assert res.risk_level in ["AT_RISK", "HIGH", "DISTRESS"]

def test_distressed_customer(risk_engine):
    data = {
        'age': 30,
        'monthly_income_usd': 3000,
        'monthly_expenses_usd': 3000,
        'savings_usd': 0,
        'loan_amount_usd': 100000,
        'loan_term_months': 120,
        'monthly_emi_usd': 1000,
        'loan_interest_rate_pct': 10,
        'debt_to_income_ratio': 1.0,
        'credit_score': 500,
        'savings_to_income_ratio': 0.0,
        'cash_buffer_months': 0.0,
        'employment_status': 'Unemployed'
    }
    res = risk_engine.evaluate_customer(data)
    assert res.financial_resilience_score < 40
    assert res.risk_level in ["HIGH", "DISTRESS"]

def test_zero_income_safety(risk_engine):
    data = {
        'age': 30,
        'monthly_income_usd': 0,
        'monthly_expenses_usd': 2000,
        'savings_usd': 0,
        'loan_amount_usd': 50000,
        'loan_term_months': 60,
        'monthly_emi_usd': 1000,
        'loan_interest_rate_pct': 10,
        'debt_to_income_ratio': 0,
        'credit_score': 400,
        'savings_to_income_ratio': 0,
        'cash_buffer_months': 0,
        'employment_status': 'Unemployed'
    }
    res = risk_engine.evaluate_customer(data)
    # Should not crash
    assert 0 <= res.financial_resilience_score <= 100
