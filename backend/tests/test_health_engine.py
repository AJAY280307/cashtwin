from services.health_engine import FinancialHealthEngine

def test_safe_div():
    engine = FinancialHealthEngine()
    assert engine._safe_div(10, 0) == 0.0
    assert engine._safe_div(10, 2) == 5.0

def test_cash_buffer_score():
    engine = FinancialHealthEngine()
    # 6 months = 100
    assert engine.calculate_cash_buffer_score({'savings_usd': 6000, 'monthly_expenses_usd': 1000}) == 100
    # 3 months = 50
    assert engine.calculate_cash_buffer_score({'savings_usd': 3000, 'monthly_expenses_usd': 1000}) == 50
    # 0 savings = 0
    assert engine.calculate_cash_buffer_score({'savings_usd': 0, 'monthly_expenses_usd': 1000}) == 0
    # 0 expenses but has savings = 100
    assert engine.calculate_cash_buffer_score({'savings_usd': 1000, 'monthly_expenses_usd': 0}) == 100

def test_debt_burden_score():
    engine = FinancialHealthEngine()
    # 0 EMI = 100
    assert engine.calculate_debt_burden_score({'monthly_emi_usd': 0, 'monthly_income_usd': 5000}) == 100
    # 25% EMI = 50
    assert engine.calculate_debt_burden_score({'monthly_emi_usd': 1250, 'monthly_income_usd': 5000}) == 50
    # >50% EMI = 0
    assert engine.calculate_debt_burden_score({'monthly_emi_usd': 3000, 'monthly_income_usd': 5000}) == 0
    # 0 income, 0 EMI = 100
    assert engine.calculate_debt_burden_score({'monthly_emi_usd': 0, 'monthly_income_usd': 0}) == 100
    # 0 income, >0 EMI = 0
    assert engine.calculate_debt_burden_score({'monthly_emi_usd': 500, 'monthly_income_usd': 0}) == 0

def test_expense_pressure_score():
    engine = FinancialHealthEngine()
    # 45% expense = 50 score (100 - (0.45/0.9)*100 = 50)
    assert engine.calculate_expense_pressure_score({'monthly_expenses_usd': 2250, 'monthly_income_usd': 5000}) == 50
    # 0 expenses = 100
    assert engine.calculate_expense_pressure_score({'monthly_expenses_usd': 0, 'monthly_income_usd': 5000}) == 100
    # >90% expense = 0
    assert engine.calculate_expense_pressure_score({'monthly_expenses_usd': 4600, 'monthly_income_usd': 5000}) == 0

def test_obligation_pressure_score():
    engine = FinancialHealthEngine()
    # LTI = 1.5 -> Score = 100 - (1.5/3)*100 = 50
    assert engine.calculate_obligation_pressure_score({'loan_amount_usd': 90000, 'monthly_income_usd': 5000}) == 50

def test_evaluate_health():
    engine = FinancialHealthEngine()
    res = engine.evaluate_health({
        'savings_usd': 6000,
        'monthly_expenses_usd': 1000,
        'monthly_emi_usd': 1250,
        'monthly_income_usd': 5000,
        'loan_amount_usd': 90000,
        'employment_status': 'Employed'
    })
    assert res['cash_buffer_score'] == 100
    assert res['debt_burden_score'] == 50
    assert res['expense_pressure_score'] == 77 # 100 - (1000/5000)/0.9*100 = 100 - 22.22 = 77
    assert res['obligation_pressure_score'] == 50
    assert res['income_stability_score'] == 85
