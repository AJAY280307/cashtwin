from typing import Dict, Any

class FinancialHealthEngine:
    def __init__(self):
        pass

    def _safe_div(self, num: float, denom: float) -> float:
        if denom == 0 or denom is None:
            return 0.0
        return float(num) / float(denom)

    def calculate_cash_buffer_score(self, customer_data: Dict[str, Any]) -> int:
        savings = float(customer_data.get('savings_usd', 0) or 0)
        expenses = float(customer_data.get('monthly_expenses_usd', 0) or 0)
        buffer_months = self._safe_div(savings, expenses) if expenses > 0 else (6.0 if savings > 0 else 0.0)
        # 6 months = 100 score
        score = (buffer_months / 6.0) * 100
        return int(max(0, min(100, score)))

    def calculate_debt_burden_score(self, customer_data: Dict[str, Any]) -> int:
        emi = float(customer_data.get('monthly_emi_usd', 0) or 0)
        income = float(customer_data.get('monthly_income_usd', 0) or 0)
        if income <= 0:
            return 0 if emi > 0 else 100
            
        emi_ratio = self._safe_div(emi, income)
        # >50% EMI to income = 0 score
        score = 100 - (emi_ratio / 0.5) * 100
        return int(max(0, min(100, score)))

    def calculate_income_stability_score(self, customer_data: Dict[str, Any]) -> int:
        # Proxy since we lack longitudinal data
        status = str(customer_data.get('employment_status', 'Unknown')).lower()
        if 'employed' in status and 'self' not in status and 'un' not in status:
            return 85
        elif 'self' in status:
            return 70
        elif 'student' in status:
            return 50
        elif 'unemployed' in status:
            return 20
        return 60

    def calculate_expense_pressure_score(self, customer_data: Dict[str, Any]) -> int:
        expenses = float(customer_data.get('monthly_expenses_usd', 0) or 0)
        income = float(customer_data.get('monthly_income_usd', 0) or 0)
        if income <= 0:
            return 0 if expenses > 0 else 100
            
        exp_ratio = self._safe_div(expenses, income)
        # 90% expenses to income = 0 score
        score = 100 - (exp_ratio / 0.9) * 100
        return int(max(0, min(100, score)))

    def calculate_obligation_pressure_score(self, customer_data: Dict[str, Any]) -> int:
        loan_amount = float(customer_data.get('loan_amount_usd', 0) or 0)
        income = float(customer_data.get('monthly_income_usd', 0) or 0)
        annual_income = income * 12
        if annual_income <= 0:
            return 0 if loan_amount > 0 else 100
            
        lti = self._safe_div(loan_amount, annual_income)
        # Loan to annual income > 3.0 = 0 score
        score = 100 - (lti / 3.0) * 100
        return int(max(0, min(100, score)))

    def evaluate_health(self, customer_data: Dict[str, Any]) -> Dict[str, int]:
        return {
            "cash_buffer_score": self.calculate_cash_buffer_score(customer_data),
            "debt_burden_score": self.calculate_debt_burden_score(customer_data),
            "income_stability_score": self.calculate_income_stability_score(customer_data),
            "expense_pressure_score": self.calculate_expense_pressure_score(customer_data),
            "obligation_pressure_score": self.calculate_obligation_pressure_score(customer_data)
        }
