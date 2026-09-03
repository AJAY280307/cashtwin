import os
import sys
import pandas as pd
import numpy as np
import pytest
import tempfile
import json

from services.data_processor import DataProcessor

@pytest.fixture
def sample_data_path():
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write("user_id,monthly_income_usd,monthly_expenses_usd,savings_usd,monthly_emi_usd\n")
        f.write("U1,5000,2000,10000,500\n")
        f.write("U2,0,1000,500,0\n")
        f.write("U3,-1000,500,0,100\n")
        f.write("U3,-1000,500,0,100\n")  # duplicate
        f.write("U4,,2000,1000,0\n")    # missing income
        path = f.name
    yield path
    os.remove(path)

@pytest.fixture
def processor(sample_data_path):
    temp_dir = tempfile.gettempdir()
    processed_path = os.path.join(temp_dir, 'processed.csv')
    metadata_path = os.path.join(temp_dir, 'meta.json')
    return DataProcessor(sample_data_path, processed_path, metadata_path)

def test_load_and_inspect(processor):
    processor.load_dataset()
    assert len(processor.df) == 5
    stats = processor.inspect_dataset()
    assert stats['rows'] == 5
    assert stats['duplicates'] == 1
    assert stats['missing']['monthly_income_usd'] == 1

def test_clean_dataset(processor):
    processor.load_dataset()
    processor.clean_dataset()
    # Should drop 1 duplicate and 1 missing critical data
    assert len(processor.df) == 3

def test_validate_dataset(processor):
    processor.load_dataset()
    processor.clean_dataset()
    processor.validate_dataset()
    warnings = processor.metadata['validation_findings']
    assert any("negative monthly income" in w for w in warnings)

def test_create_financial_features(processor):
    processor.load_dataset()
    processor.clean_dataset()
    processor.create_financial_features()
    
    df = processor.df
    
    # U1: 5000 income, 2000 exp, 10000 sav, 500 emi
    u1 = df[df['user_id'] == 'U1'].iloc[0]
    assert u1['expense_to_income_ratio'] == 2000/5000
    assert u1['emi_to_income_ratio'] == 500/5000
    assert u1['savings_to_income_ratio'] == 10000/5000
    assert u1['cash_buffer_months'] == 10000/2000
    assert u1['financial_obligation_ratio'] == 2500/5000
    
    # U2: 0 income, 1000 exp, 500 sav, 0 emi
    u2 = df[df['user_id'] == 'U2'].iloc[0]
    assert u2['expense_to_income_ratio'] == 0  # safe div
    assert u2['emi_to_income_ratio'] == 0
    assert u2['cash_buffer_months'] == 500/1000

def test_save_processed(processor):
    processor.run_pipeline()
    assert os.path.exists(processor.processed_data_path)
    assert os.path.exists(processor.metadata_path)
    
    with open(processor.metadata_path, 'r') as f:
        meta = json.load(f)
    assert 'source_filename' in meta
    assert meta['processed_row_count'] == 3
