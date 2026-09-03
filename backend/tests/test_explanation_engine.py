import pytest
from services.explanation_engine import ExplanationEngine
from schemas.risk import FinancialHealthResult, RiskDriver
from schemas.forecast import ForecastResult, ForecastPoint

@pytest.fixture
def explanation_engine():
    return ExplanationEngine()

def test_healthy_customer(explanation_engine):
    data = {'savings_usd': 50000, 'monthly_income_usd': 10000, 'monthly_expenses_usd': 2000, 'monthly_emi_usd': 0}
    health = FinancialHealthResult(
        cash_buffer_score=100, debt_burden_score=100, income_stability_score=100,
        expense_pressure_score=100, obligation_pressure_score=100, ml_risk_score=100,
        financial_resilience_score=100, risk_level="LOW", risk_drivers=[]
    )
    res = explanation_engine.build_explanation(data, health)
    assert res.overall_risk == "LOW"
    assert len(res.drivers) == 0
    assert "strong resilience" in res.summary

def test_multiple_drivers_and_ordering(explanation_engine):
    data = {'savings_usd': 0, 'monthly_income_usd': 5000, 'monthly_expenses_usd': 4000, 'monthly_emi_usd': 2000, 'loan_amount_usd': 100000}
    health = FinancialHealthResult(
        cash_buffer_score=0, debt_burden_score=0, income_stability_score=60,
        expense_pressure_score=0, obligation_pressure_score=0, ml_risk_score=0,
        financial_resilience_score=0, risk_level="DISTRESS",
        risk_drivers=[
            RiskDriver(driver="Low cash buffer", impact="high", contribution=100),
            RiskDriver(driver="High EMI burden", impact="high", contribution=100),
            RiskDriver(driver="High expense pressure", impact="medium", contribution=100),
            RiskDriver(driver="High obligation pressure", impact="medium", contribution=100),
            RiskDriver(driver="High distress probability", impact="high", contribution=100)
        ]
    )
    res = explanation_engine.build_explanation(data, health)
    assert res.overall_risk == "DISTRESS"
    assert len(res.drivers) == 5
    
    driver_names = [d.driver for d in res.drivers]
    assert "Low cash buffer" in driver_names
    assert "High EMI burden" in driver_names
    assert "High expense pressure" in driver_names
    assert "High obligation pressure" in driver_names
    assert "High distress probability" in driver_names
    
    # All contributions are 100, so severity should be CRITICAL
    for d in res.drivers:
        assert d.severity == "CRITICAL"
        assert d.contribution == 100.0

def test_evidence_correctness_and_zero_income(explanation_engine):
    data = {'savings_usd': 100, 'monthly_income_usd': 0, 'monthly_expenses_usd': 1000, 'monthly_emi_usd': 500, 'loan_amount_usd': 50000}
    health = FinancialHealthResult(
        cash_buffer_score=0, debt_burden_score=0, income_stability_score=20,
        expense_pressure_score=0, obligation_pressure_score=0, ml_risk_score=0,
        financial_resilience_score=0, risk_level="DISTRESS",
        risk_drivers=[
            RiskDriver(driver="High EMI burden", impact="high", contribution=100),
            RiskDriver(driver="High expense pressure", impact="medium", contribution=100)
        ]
    )
    # Does not crash with zero income
    res = explanation_engine.build_explanation(data, health)
    assert len(res.drivers) == 2
    
    emi_driver = next(d for d in res.drivers if d.driver == "High EMI burden")
    assert emi_driver.evidence["monthly_income_usd"] == 0
    assert "no monthly income" in emi_driver.explanation
    
    exp_driver = next(d for d in res.drivers if d.driver == "High expense pressure")
    assert exp_driver.evidence["monthly_income_usd"] == 0
    assert "no monthly income" in exp_driver.explanation

def test_negative_cash_forecast(explanation_engine):
    data = {'savings_usd': 1000, 'monthly_income_usd': 3000, 'monthly_expenses_usd': 3000, 'monthly_emi_usd': 1000}
    health = FinancialHealthResult(
        cash_buffer_score=100, debt_burden_score=100, income_stability_score=100,
        expense_pressure_score=100, obligation_pressure_score=100, ml_risk_score=100,
        financial_resilience_score=100, risk_level="WATCH", risk_drivers=[]
    )
    
    forecast = ForecastResult(
        customer_id="123", forecast_horizon_days=30, scenario="BASELINE",
        starting_cash=1000, total_expected_income=3000, total_expected_expenses=3000,
        total_expected_obligations=1000, ending_projected_cash=-1000, minimum_projected_cash=-1000,
        cash_gap=1000, stress_date=15, daily_projection=[], insight="Projected cash shortfall detected."
    )
    
    res = explanation_engine.build_explanation(data, health, forecast)
    assert len(res.drivers) == 1
    assert res.drivers[0].driver == "Negative cash forecast"
    assert res.drivers[0].evidence["minimum_projected_cash"] == -1000
    assert res.drivers[0].severity == "CRITICAL"

def test_missing_forecast_does_not_crash(explanation_engine):
    data = {'savings_usd': 5000, 'monthly_income_usd': 5000}
    health = FinancialHealthResult(
        cash_buffer_score=100, debt_burden_score=100, income_stability_score=100,
        expense_pressure_score=100, obligation_pressure_score=100, ml_risk_score=100,
        financial_resilience_score=100, risk_level="LOW", risk_drivers=[]
    )
    res = explanation_engine.build_explanation(data, health, forecast_result=None)
    assert res.overall_risk == "LOW"

def test_deterministic_repeated_output(explanation_engine):
    data = {'savings_usd': 1000, 'monthly_income_usd': 3000, 'monthly_expenses_usd': 2000, 'monthly_emi_usd': 1000}
    health = FinancialHealthResult(
        cash_buffer_score=40, debt_burden_score=40, income_stability_score=100,
        expense_pressure_score=40, obligation_pressure_score=40, ml_risk_score=40,
        financial_resilience_score=40, risk_level="AT_RISK",
        risk_drivers=[
            RiskDriver(driver="Low cash buffer", impact="high", contribution=60)
        ]
    )
    res1 = explanation_engine.build_explanation(data, health)
    res2 = explanation_engine.build_explanation(data, health)
    
    assert res1.model_dump() == res2.model_dump()

def test_zero_emi_does_not_crash(explanation_engine):
    data = {'savings_usd': 5000, 'monthly_income_usd': 5000, 'monthly_emi_usd': 0}
    health = FinancialHealthResult(
        cash_buffer_score=100, debt_burden_score=100, income_stability_score=100,
        expense_pressure_score=100, obligation_pressure_score=100, ml_risk_score=100,
        financial_resilience_score=100, risk_level="LOW", risk_drivers=[]
    )
    res = explanation_engine.build_explanation(data, health)
    assert len(res.drivers) == 0
