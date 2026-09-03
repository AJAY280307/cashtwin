import pytest
from services.forecast_engine import ForecastEngine

@pytest.fixture
def forecast_engine():
    return ForecastEngine()

def test_healthy_customer(forecast_engine):
    data = {
        'savings_usd': 5000,
        'monthly_income_usd': 6000,
        'monthly_expenses_usd': 3000,
        'monthly_emi_usd': 1500
    }
    # Net daily: (6000 - 3000 - 1500) / 30 = 1500 / 30 = 50
    # Over 30 days: +1500
    res = forecast_engine.forecast_customer(data, horizon_days=30, scenario="BASELINE")
    
    assert res.ending_projected_cash == 6500.0
    assert res.cash_gap == 0.0
    assert res.stress_date is None
    assert "positive throughout" in res.insight

def test_financially_stressed_customer(forecast_engine):
    data = {
        'savings_usd': 1000,
        'monthly_income_usd': 3000,
        'monthly_expenses_usd': 4500,
        'monthly_emi_usd': 0
    }
    # Net daily: (3000 - 4500) / 30 = -1500 / 30 = -50
    # Day 20: 1000 - 50*20 = 0. Day 21: -50 (stress date)
    res = forecast_engine.forecast_customer(data, horizon_days=30, scenario="BASELINE")
    
    assert res.ending_projected_cash < res.starting_cash
    assert res.cash_gap == 500.0  # 1000 - 1500 = -500 -> gap 500
    assert res.stress_date == 21
    assert "shortfall detected" in res.insight

def test_zero_income(forecast_engine):
    data = {
        'savings_usd': 3000,
        'monthly_income_usd': 0,
        'monthly_expenses_usd': 1500,
        'monthly_emi_usd': 0
    }
    res = forecast_engine.forecast_customer(data, horizon_days=30, scenario="BASELINE")
    assert res.ending_projected_cash == 1500.0
    assert res.cash_gap == 0.0

def test_zero_expenses_emi(forecast_engine):
    data = {
        'savings_usd': 1000,
        'monthly_income_usd': 3000,
        'monthly_expenses_usd': 0,
        'monthly_emi_usd': 0
    }
    res = forecast_engine.forecast_customer(data, horizon_days=30, scenario="BASELINE")
    assert res.ending_projected_cash == 4000.0

def test_stress_scenario(forecast_engine):
    data = {
        'savings_usd': 2000,
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 4000,
        'monthly_emi_usd': 1000
    }
    # Baseline: Net = 5000 - 4000 - 1000 = 0. End cash = 2000.
    res_baseline = forecast_engine.forecast_customer(data, horizon_days=30, scenario="BASELINE")
    assert res_baseline.ending_projected_cash == 2000.0
    
    # Stress: Expenses * 1.15 = 4600. Net = 5000 - 4600 - 1000 = -600. End cash = 1400.
    res_stress = forecast_engine.forecast_customer(data, horizon_days=30, scenario="STRESS")
    assert res_stress.ending_projected_cash == 1400.0
    assert res_stress.ending_projected_cash < res_baseline.ending_projected_cash

def test_improved_scenario(forecast_engine):
    data = {
        'savings_usd': 2000,
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 4000,
        'monthly_emi_usd': 1000
    }
    # Improved: Expenses * 0.90 = 3600. Net = 5000 - 3600 - 1000 = 400. End cash = 2400.
    res_improved = forecast_engine.forecast_customer(data, horizon_days=30, scenario="IMPROVED")
    assert res_improved.ending_projected_cash == 2400.0
    assert res_improved.ending_projected_cash > 2000.0

def test_forecast_horizons(forecast_engine):
    data = {'savings_usd': 1000, 'monthly_income_usd': 3000, 'monthly_expenses_usd': 1500, 'monthly_emi_usd': 500}
    for days in [7, 14, 21, 30]:
        res = forecast_engine.forecast_customer(data, horizon_days=days, scenario="BASELINE")
        assert len(res.daily_projection) == days
        assert res.forecast_horizon_days == days
