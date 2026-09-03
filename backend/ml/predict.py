import os
import json
import joblib
import pandas as pd
from typing import Dict, Any

class Predictor:
    def __init__(self, model_dir: str = "models"):
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, "distress_model.joblib")
        self.meta_path = os.path.join(model_dir, "feature_metadata.json")
        self.model = None
        self.metadata = None
        self._load()
        
    def _load(self):
        if not os.path.exists(self.model_path) or not os.path.exists(self.meta_path):
            raise FileNotFoundError("Model or metadata not found. Train the model first.")
        self.model = joblib.load(self.model_path)
        with open(self.meta_path, 'r') as f:
            self.metadata = json.load(f)
            
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        if self.model is None or self.metadata is None:
            raise ValueError("Model not loaded.")
            
        feature_columns = self.metadata['feature_columns']
        
        # Build input dataframe with correct columns in order
        input_data = {}
        for col in feature_columns:
            if col not in features:
                raise ValueError(f"Missing required feature: {col}")
            input_data[col] = [features[col]]
            
        df_input = pd.DataFrame(input_data)
        
        prediction = self.model.predict(df_input)[0]
        probabilities = self.model.predict_proba(df_input)[0]
        
        return {
            "prediction": int(prediction),
            "risk_probability": float(probabilities[1])
        }

if __name__ == "__main__":
    pass
