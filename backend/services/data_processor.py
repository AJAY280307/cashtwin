import pandas as pd
import numpy as np
import json
import os
from datetime import datetime
from typing import Dict, Any, Tuple

class DataProcessor:
    def __init__(self, raw_data_path: str, processed_data_path: str, metadata_path: str):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        self.metadata_path = metadata_path
        self.df = None
        self.metadata: Dict[str, Any] = {}

    def load_dataset(self) -> None:
        """Loads the raw dataset."""
        if not os.path.exists(self.raw_data_path):
            raise FileNotFoundError(f"Dataset not found at {self.raw_data_path}")
        self.df = pd.read_csv(self.raw_data_path)
        self.metadata['source_filename'] = os.path.basename(self.raw_data_path)
        self.metadata['processing_date'] = datetime.now().isoformat()
        self.metadata['original_row_count'] = len(self.df)
        self.metadata['original_column_count'] = len(self.df.columns)
        self.metadata['original_columns'] = list(self.df.columns)

    def inspect_dataset(self) -> Dict[str, Any]:
        """Inspects the dataset and returns stats."""
        if self.df is None:
            raise ValueError("Dataset not loaded")
        
        missing = self.df.isnull().sum().to_dict()
        duplicates = int(self.df.duplicated().sum())
        dtypes = {k: str(v) for k, v in self.df.dtypes.items()}
        
        self.metadata['missing_values_findings'] = missing
        self.metadata['duplicate_count'] = duplicates
        self.metadata['data_types'] = dtypes
        
        return {
            "rows": len(self.df),
            "columns": len(self.df.columns),
            "missing": missing,
            "duplicates": duplicates,
            "dtypes": dtypes
        }

    def clean_dataset(self) -> None:
        """Cleans the dataset by handling duplicates and obvious missing values."""
        if self.df is None:
            raise ValueError("Dataset not loaded")
        
        actions = []
        # Remove duplicates
        initial_len = len(self.df)
        self.df = self.df.drop_duplicates()
        if len(self.df) < initial_len:
            actions.append(f"Dropped {initial_len - len(self.df)} duplicate rows")
            
        # We don't blindly replace missing values with zero per instructions.
        # But we will drop rows with missing critical financial identifiers if there are any.
        critical_cols = ['monthly_income_usd', 'monthly_expenses_usd', 'savings_usd']
        before_drop = len(self.df)
        self.df = self.df.dropna(subset=critical_cols)
        if len(self.df) < before_drop:
            actions.append(f"Dropped {before_drop - len(self.df)} rows due to missing critical financial data")
            
        self.metadata['cleaning_actions'] = actions

    def validate_dataset(self) -> None:
        """Validates dataset quality and records warnings."""
        if self.df is None:
            raise ValueError("Dataset not loaded")
            
        warnings = []
        
        # Check negative values
        if (self.df['monthly_income_usd'] < 0).any():
            warnings.append("Found negative monthly income")
        if (self.df['monthly_expenses_usd'] < 0).any():
            warnings.append("Found negative monthly expenses")
        if (self.df['savings_usd'] < 0).any():
            warnings.append("Found negative savings")
        if 'monthly_emi_usd' in self.df.columns and (self.df['monthly_emi_usd'] < 0).any():
            warnings.append("Found negative EMI")
        if 'loan_amount_usd' in self.df.columns and (self.df['loan_amount_usd'] < 0).any():
            warnings.append("Found negative loan amount")
            
        self.metadata['validation_findings'] = warnings

    def create_financial_features(self) -> None:
        """Creates basic financial features."""
        if self.df is None:
            raise ValueError("Dataset not loaded")
            
        # Safe division function
        def safe_div(a, b):
            return np.where(b == 0, 0, a / b)
            
        # 1. expense_to_income_ratio = monthly_expenses_usd / monthly_income_usd
        self.df['expense_to_income_ratio'] = safe_div(self.df['monthly_expenses_usd'], self.df['monthly_income_usd'])
        
        # 2. emi_to_income_ratio = monthly_emi_usd / monthly_income_usd
        self.df['emi_to_income_ratio'] = safe_div(self.df.get('monthly_emi_usd', 0), self.df['monthly_income_usd'])
        
        # 3. savings_to_income_ratio = savings_usd / monthly_income_usd
        self.df['savings_to_income_ratio'] = safe_div(self.df['savings_usd'], self.df['monthly_income_usd'])
        
        # 4. cash_buffer_months = savings_usd / monthly_expenses_usd
        self.df['cash_buffer_months'] = safe_div(self.df['savings_usd'], self.df['monthly_expenses_usd'])
        
        # 5. financial_obligation_ratio = (monthly_expenses_usd + monthly_emi_usd) / monthly_income_usd
        total_obligations = self.df['monthly_expenses_usd'] + self.df.get('monthly_emi_usd', 0)
        self.df['financial_obligation_ratio'] = safe_div(total_obligations, self.df['monthly_income_usd'])
        
        self.metadata['features_created'] = [
            "expense_to_income_ratio",
            "emi_to_income_ratio",
            "savings_to_income_ratio",
            "cash_buffer_months",
            "financial_obligation_ratio"
        ]
        
        self.metadata['feature_definitions'] = {
            "expense_to_income_ratio": "monthly_expenses_usd / monthly_income_usd",
            "emi_to_income_ratio": "monthly_emi_usd / monthly_income_usd",
            "savings_to_income_ratio": "savings_usd / monthly_income_usd",
            "cash_buffer_months": "savings_usd / monthly_expenses_usd",
            "financial_obligation_ratio": "(monthly_expenses_usd + monthly_emi_usd) / monthly_income_usd"
        }

    def save_processed_dataset(self) -> None:
        """Saves the processed dataset and metadata."""
        if self.df is None:
            raise ValueError("Dataset not loaded")
            
        # Ensure directories exist
        os.makedirs(os.path.dirname(self.processed_data_path), exist_ok=True)
        os.makedirs(os.path.dirname(self.metadata_path), exist_ok=True)
        
        # Add final stats
        self.metadata['processed_row_count'] = len(self.df)
        self.metadata['processed_column_count'] = len(self.df.columns)
        self.metadata['processed_columns'] = list(self.df.columns)
        
        # Save CSV
        self.df.to_csv(self.processed_data_path, index=False)
        
        # Save metadata
        with open(self.metadata_path, 'w') as f:
            json.dump(self.metadata, f, indent=4)

    def run_pipeline(self) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Runs the complete data pipeline."""
        self.load_dataset()
        self.inspect_dataset()
        self.validate_dataset()
        self.clean_dataset()
        self.create_financial_features()
        self.save_processed_dataset()
        return self.df, self.metadata
