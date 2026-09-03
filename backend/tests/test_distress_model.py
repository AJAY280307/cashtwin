import os
import json
import pytest
import pandas as pd
from ml.predict import Predictor

def test_model_files_exist():
    assert os.path.exists("models/distress_model.joblib")
    assert os.path.exists("models/feature_metadata.json")

def test_metadata():
    with open("models/feature_metadata.json", 'r') as f:
        meta = json.load(f)
    assert "target_definition" in meta
    assert "target_column" in meta
    assert "feature_columns" in meta
    assert "excluded_columns" in meta
    assert "metrics" in meta
    assert "class_distribution" in meta
    
    # Leakage test
    assert "financial_obligation_ratio" in meta["excluded_columns"]
    assert "distress_target" in meta["excluded_columns"]
    assert "id" in meta["excluded_columns"]
    assert "user_id" in meta["excluded_columns"]
    assert "record_date" in meta["excluded_columns"]
    
    for exc in meta["excluded_columns"]:
        assert exc not in meta["feature_columns"]

def test_prediction():
    predictor = Predictor(model_dir="models")
    meta = predictor.metadata
    
    # Create dummy features
    dummy_features = {}
    for col in meta["feature_columns"]:
        dummy_features[col] = 1.0 # arbitrary numerical value
        
    res = predictor.predict(dummy_features)
    assert "prediction" in res
    assert "risk_probability" in res
    assert res["prediction"] in [0, 1]
    assert 0.0 <= res["risk_probability"] <= 1.0

def test_target_creation():
    df = pd.read_csv("data/processed/financial_features.csv")
    df['distress_target'] = (df['financial_obligation_ratio'] > 1.0).astype(int)
    assert set(df['distress_target'].unique()).issubset({0, 1})
    assert (df[df['financial_obligation_ratio'] > 1.0]['distress_target'] == 1).all()
    assert (df[df['financial_obligation_ratio'] <= 1.0]['distress_target'] == 0).all()
