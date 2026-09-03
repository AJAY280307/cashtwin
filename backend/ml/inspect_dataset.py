import pandas as pd
import json

def inspect_dataset(file_path: str):
    print(f"Inspecting dataset at {file_path}...")
    df = pd.read_csv(file_path)
    
    print("\n--- Basic Info ---")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")
    print(f"Column Names: {list(df.columns)}")
    
    print("\n--- Data Types ---")
    print(df.dtypes)
    
    print("\n--- Missing Values ---")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df)) * 100
    missing_df = pd.DataFrame({'Missing': missing, 'Percentage': missing_pct})
    print(missing_df[missing_df['Missing'] > 0] if missing.sum() > 0 else "No missing values")
    
    print("\n--- Duplicates ---")
    duplicates = df.duplicated().sum()
    print(f"Duplicate rows: {duplicates}")
    
    print("\n--- Numerical Statistics ---")
    print(df.describe())
    
    print("\n--- Categorical Distributions ---")
    cat_cols = df.select_dtypes(include=['object', 'category']).columns
    for col in cat_cols:
        print(f"\n{col} distribution:")
        print(df[col].value_counts(normalize=True).head(10) * 100)

if __name__ == "__main__":
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "../data/raw/personal_finance.csv"
    inspect_dataset(path)
