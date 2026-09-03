import os
import sys

from services.data_processor import DataProcessor

def run():
    processor = DataProcessor(
        raw_data_path="data/raw/personal_finance.csv",
        processed_data_path="data/processed/financial_features.csv",
        metadata_path="data/processed/dataset_metadata.json"
    )
    df, meta = processor.run_pipeline()
    print("Pipeline completed successfully.")
    print(f"Processed rows: {meta['processed_row_count']}")
    
if __name__ == '__main__':
    run()
