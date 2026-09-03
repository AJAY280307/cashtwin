import pytest
from services.simulator import SimulatorEngine
from schemas.simulation import Intervention

@pytest.fixture
def simulator():
    return SimulatorEngine(model_dir="models")

def test_apply_intervention_to_data(simulator):
    data = {
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 3000,
        'monthly_emi_usd': 1000,
        'savings_usd': 2000,
        'loan_amount_usd': 50000
    }
    
    intervention = Intervention(
        reduce_expenses_by=500,
        reduce_emi_by=0,
        increase_savings_by=1000,
        increase_income_by=0
    )
    
    sim_data = simulator.apply_intervention_to_data(data, intervention)
    assert sim_data['monthly_expenses_usd'] == 2500
    assert sim_data['monthly_emi_usd'] == 1000
    assert sim_data['savings_usd'] == 3000
    assert sim_data['monthly_income_usd'] == 5000
    
    # Ratios
    assert sim_data['expense_to_income_ratio'] == 2500 / 5000
    assert sim_data['emi_to_income_ratio'] == 1000 / 5000
    assert sim_data['savings_to_income_ratio'] == 3000 / 5000
    assert sim_data['cash_buffer_months'] == 3000 / 2500
    assert sim_data['financial_obligation_ratio'] == (2500 + 1000) / 5000

def test_simulate_improves_risk(simulator):
    data = {
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 4000, # Very high expenses
        'monthly_emi_usd': 1000,      # High EMI
        'savings_usd': 0,
        'loan_amount_usd': 50000,
        'age': 30,
        'loan_term_months': 60,
        'loan_interest_rate_pct': 10,
        'credit_score': 600,
        'expense_to_income_ratio': 4000/5000,
        'emi_to_income_ratio': 1000/5000,
        'savings_to_income_ratio': 0,
        'cash_buffer_months': 0,
        'financial_obligation_ratio': 5000/5000,
        'debt_to_income_ratio': 50000/(5000*12)
    }
    
    # Baseline is highly distressed
    # Intervention drastically cuts expenses and adds savings
    intervention = Intervention(
        reduce_expenses_by=2000,
        reduce_emi_by=500,
        increase_savings_by=10000,
        increase_income_by=0
    )
    
    result = simulator.simulate(data, intervention)
    
    assert result.simulated_resilience_score > result.baseline_resilience_score
    assert result.risk_improved is True
    
    # Verify impacts
    res_impact = next(i for i in result.impacts if i.metric == "Financial Resilience Score")
    assert res_impact.improved is True
    assert res_impact.after_value > res_impact.before_value

def test_simulate_improves_cash_gap(simulator):
    # Setup data where expenses exceed income so baseline gap > 0
    data = {
        'monthly_income_usd': 3000,
        'monthly_expenses_usd': 4000,
        'monthly_emi_usd': 0,
        'savings_usd': 0,
        'age': 30,
        'loan_term_months': 0,
        'loan_amount_usd': 0,
        'loan_interest_rate_pct': 0,
        'credit_score': 700,
        'expense_to_income_ratio': 4000/3000,
        'emi_to_income_ratio': 0,
        'savings_to_income_ratio': 0,
        'cash_buffer_months': 0,
        'financial_obligation_ratio': 4000/3000,
        'debt_to_income_ratio': 0
    }
    
    # Check that initially it has a cash gap
    baseline_sim = simulator.simulate(data, Intervention())
    assert baseline_sim.baseline_cash_gap > 0
    
    # Intervention fixes the cash gap
    intervention = Intervention(
        reduce_expenses_by=1500,
        reduce_emi_by=0,
        increase_savings_by=0,
        increase_income_by=0
    )
    
    result = simulator.simulate(data, intervention)
    assert result.simulated_cash_gap == 0
    assert result.cash_gap_improved is True
    assert "improved the projected cash flow" in result.summary or "resolved the cash shortfall" in result.summary

def test_simulate_no_improvement(simulator):
    data = {
        'monthly_income_usd': 5000,
        'monthly_expenses_usd': 2000,
        'monthly_emi_usd': 500,
        'savings_usd': 10000,
        'age': 30,
        'loan_term_months': 60,
        'loan_amount_usd': 20000,
        'loan_interest_rate_pct': 5,
        'credit_score': 800,
        'expense_to_income_ratio': 2000/5000,
        'emi_to_income_ratio': 500/5000,
        'savings_to_income_ratio': 10000/5000,
        'cash_buffer_months': 10000/2000,
        'financial_obligation_ratio': 2500/5000,
        'debt_to_income_ratio': 20000/(5000*12)
    }
    
    # Intervention does absolutely nothing
    intervention = Intervention()
    result = simulator.simulate(data, intervention)
    
    assert result.risk_improved is False
    assert result.cash_gap_improved is False
    assert result.simulated_resilience_score == result.baseline_resilience_score
