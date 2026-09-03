import os
import json
import pandas as pd
import numpy as np

def analyze_distress_target(processed_data_path: str, output_json_path: str):
    df = pd.read_csv(processed_data_path)
    
    # 1. Important indicators
    indicators = [
        'monthly_income_usd', 'monthly_expenses_usd', 'savings_usd',
        'monthly_emi_usd', 'loan_amount_usd', 'loan_interest_rate_pct',
        'debt_to_income_ratio', 'credit_score', 'savings_to_income_ratio',
        'expense_to_income_ratio', 'emi_to_income_ratio', 'cash_buffer_months',
        'financial_obligation_ratio'
    ]
    
    # Check what exists
    available_indicators = [c for c in indicators if c in df.columns]
    
    # Calculate stats
    stats = {}
    for col in available_indicators:
        s = df[col]
        stats[col] = {
            "min": float(s.min()),
            "max": float(s.max()),
            "mean": float(s.mean()),
            "median": float(s.median()),
            "std": float(s.std()),
            "p25": float(s.quantile(0.25)),
            "p75": float(s.quantile(0.75)),
            "p90": float(s.quantile(0.90))
        }
        
    # Correlation matrix
    corr_matrix = df[available_indicators].corr().to_dict()
    
    # Candidate Strategies
    # Strategy A: Rule-based composite (e.g. DTI > median AND Expense/Income > median AND Cash Buffer < median)
    med_dti = stats.get('debt_to_income_ratio', {}).get('median', 0)
    med_eti = stats.get('expense_to_income_ratio', {}).get('median', 0)
    med_cb = stats.get('cash_buffer_months', {}).get('median', 0)
    
    strat_a_distress = (
        (df.get('debt_to_income_ratio', 0) > med_dti) & 
        (df.get('expense_to_income_ratio', 0) > med_eti) & 
        (df.get('cash_buffer_months', 0) < med_cb)
    )
    
    # Strategy B: Quantile-based target (e.g., top 20% of financial_obligation_ratio)
    p80_for = stats.get('financial_obligation_ratio', {}).get('p75', 0) # Just using 75th percentile for simplicity in simulation
    if p80_for > 0:
        strat_b_distress = df.get('financial_obligation_ratio', 0) > p80_for
    else:
        strat_b_distress = pd.Series([False]*len(df))
        
    # Strategy C: Financial stress score risk tiers (e.g. normalized sum of normalized risk factors > threshold)
    # Just a mock threshold for the sake of simulation based on 'financial_obligation_ratio' > 1.0 meaning expenses+emi > income
    strat_c_distress = df.get('financial_obligation_ratio', 0) > 1.0

    def calc_dist(series):
        counts = series.value_counts(normalize=True) * 100
        return {
            "DISTRESSED": float(counts.get(True, 0)),
            "LOW": float(counts.get(False, 0))
        }
    
    candidates = {
        "Strategy_A_RuleBased": {
            "description": "Rule-based composite combining high debt, high expenses, and low cash buffer relative to medians.",
            "class_balance": calc_dist(strat_a_distress),
            "advantages": "Highly interpretable and captures multi-dimensional stress.",
            "disadvantages": "Thresholds are data-relative (medians) and might not align with real-world absolute distress.",
            "leakage_risk": "High if we train the model on the exact ratios used to construct the rule."
        },
        "Strategy_B_Quantile": {
            "description": "Top quartile (p75) of financial_obligation_ratio.",
            "class_balance": calc_dist(strat_b_distress),
            "advantages": "Guarantees a fixed percentage of positive cases (class balance).",
            "disadvantages": "Arbitrarily forces 25% into distress even if they are financially healthy.",
            "leakage_risk": "High if financial_obligation_ratio is a direct model input."
        },
        "Strategy_C_AbsoluteThreshold": {
            "description": "Absolute threshold: financial_obligation_ratio > 1.0 (Outgoings exceed income).",
            "class_balance": calc_dist(strat_c_distress),
            "advantages": "Domain-inspired and highly logical (spending more than earning).",
            "disadvantages": "May yield very few or very many positive cases depending on dataset distribution.",
            "leakage_risk": "High if income, emi, and expenses are included as raw inputs."
        }
    }
    
    leakage_analysis = (
        "Constructing a target from variables like monthly_income, monthly_expenses, or EMI, "
        "and then using those exact variables as features in an ML model creates severe data leakage. "
        "The model will simply learn the algebraic formula of the target. To avoid this, CashTwin should "
        "either obscure the raw inputs, use alternative behavioral features, or treat the system as a "
        "rule-based engine rather than ML if those features are the only ones available."
    )
    
    recommended = "Strategy_C_AbsoluteThreshold"
    recommended_reason = (
        "It relies on a domain-inspired, absolute financial reality (expenses + debt obligations > income) "
        "rather than arbitrary quantiles or sample medians. This makes the target defensible and interpretable. "
        "However, to avoid leakage, the model must be trained carefully (e.g., predicting future distress from past "
        "behavior, or using non-leakage features)."
    )

    output = {
        "dataset_size": len(df),
        "columns_analyzed": available_indicators,
        "feature_statistics": stats,
        "correlation_matrix": corr_matrix,
        "candidate_strategies": candidates,
        "leakage_analysis": leakage_analysis,
        "recommended_strategy": recommended,
        "recommended_reason": recommended_reason
    }
    
    os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
    with open(output_json_path, 'w') as f:
        json.dump(output, f, indent=4)
        
    return output

if __name__ == "__main__":
    analyze_distress_target(
        "data/processed/financial_features.csv",
        "data/processed/distress_target_analysis.json"
    )
