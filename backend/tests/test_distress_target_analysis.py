import os
import tempfile
import pytest
import pandas as pd
import json

from ml.distress_target_analysis import analyze_distress_target

@pytest.fixture
def mock_processed_data():
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        # Provide minimal columns needed for the analysis script
        f.write("monthly_income_usd,monthly_expenses_usd,savings_usd,monthly_emi_usd,debt_to_income_ratio,expense_to_income_ratio,cash_buffer_months,financial_obligation_ratio\n")
        f.write("5000,2000,10000,500,0.1,0.4,5,0.5\n")
        f.write("4000,3000,1000,1500,0.375,0.75,0.33,1.125\n")
        f.write("1000,1500,0,0,0,1.5,0,1.5\n")
        path = f.name
    yield path
    os.remove(path)

@pytest.fixture
def temp_output_json():
    fd, path = tempfile.mkstemp(suffix='.json')
    os.close(fd)
    yield path
    os.remove(path)

def test_analyze_distress_target(mock_processed_data, temp_output_json):
    output = analyze_distress_target(mock_processed_data, temp_output_json)
    
    assert output is not None
    assert output['dataset_size'] == 3
    assert 'monthly_income_usd' in output['columns_analyzed']
    
    # Check stats calculation
    stats = output['feature_statistics']
    assert stats['monthly_income_usd']['min'] == 1000
    assert stats['monthly_income_usd']['max'] == 5000
    
    # Check correlation matrix
    assert 'monthly_income_usd' in output['correlation_matrix']
    
    # Check candidate strategies
    strats = output['candidate_strategies']
    assert 'Strategy_A_RuleBased' in strats
    assert 'Strategy_B_Quantile' in strats
    assert 'Strategy_C_AbsoluteThreshold' in strats
    
    # Check absolute threshold dist calculation
    strat_c = strats['Strategy_C_AbsoluteThreshold']
    assert strat_c['class_balance']['DISTRESSED'] > 0
    assert strat_c['class_balance']['LOW'] > 0
    
    # Check JSON output exists
    assert os.path.exists(temp_output_json)
    with open(temp_output_json, 'r') as f:
        data = json.load(f)
    assert data['recommended_strategy'] == "Strategy_C_AbsoluteThreshold"
