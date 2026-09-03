import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
import os

class CustomerLoader:
    _df: Optional[pd.DataFrame] = None
    
    @classmethod
    def _load_data(cls) -> pd.DataFrame:
        if cls._df is None:
            path = os.path.join("data", "processed", "financial_features.csv")
            if not os.path.exists(path):
                raise FileNotFoundError(f"Processed dataset not found at {path}")
            df = pd.read_csv(path)
            # Replace NaNs with None for JSON serialization
            df = df.replace({np.nan: None})
            cls._df = df
        return cls._df
        
    @classmethod
    def get_customers(cls, limit: int = 50) -> List[Dict[str, Any]]:
        df = cls._load_data()
        # Return deterministic subset of customers
        subset = df.head(limit)
        customers = []
        for _, row in subset.iterrows():
            customers.append({
                "user_id": str(row["user_id"]),
                "display_name": f"Customer {str(row['user_id'])[:6]}"
            })
        return customers
        
    @classmethod
    def get_customer(cls, user_id: str) -> Optional[Dict[str, Any]]:
        df = cls._load_data()
        # In the dataset user_id might be a string or integer
        match = df[df['user_id'].astype(str) == str(user_id)]
        if match.empty:
            return None
            
        record = match.iloc[0].to_dict()
        return record
