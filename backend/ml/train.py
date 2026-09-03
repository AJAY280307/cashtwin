import os
import json
import pandas as pd
from datetime import datetime
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
)

def train_models():
    data_path = "data/processed/financial_features.csv"
    model_dir = "models"
    model_path = os.path.join(model_dir, "distress_model.joblib")
    meta_path = os.path.join(model_dir, "feature_metadata.json")
    
    os.makedirs(model_dir, exist_ok=True)
    
    df = pd.read_csv(data_path)
    
    # 1. Create distress target
    # DISTRESSED = financial_obligation_ratio > 1.0
    df['distress_target'] = (df['financial_obligation_ratio'] > 1.0).astype(int)
    
    total_samples = len(df)
    distressed_count = int(df['distress_target'].sum())
    not_distressed_count = total_samples - distressed_count
    
    class_distribution = {
        "total_samples": total_samples,
        "DISTRESSED_count": distressed_count,
        "NOT_DISTRESSED_count": not_distressed_count,
        "DISTRESSED_percentage": round(distressed_count / total_samples * 100, 2),
        "NOT_DISTRESSED_percentage": round(not_distressed_count / total_samples * 100, 2)
    }
    
    # 2. Leakage Exclusion and Feature Selection
    # Target is constructed directly from: (monthly_expenses_usd + monthly_emi_usd) / monthly_income_usd
    # Therefore, financial_obligation_ratio MUST be excluded.
    # To prevent the model from perfectly learning the arithmetic formula of the target,
    # we must exclude the exact raw components that form the target perfectly.
    
    # Note from user:
    # "Do NOT automatically remove all financial variables simply because they contributed to the target."
    # Wait, the user specifically says:
    # "prevent any feature that is mathematically equivalent to: (expenses + EMI) / income from being used as a direct target proxy."
    # But they also say:
    # "Variables such as: monthly_income_usd, monthly_expenses_usd, monthly_emi_usd... may be useful predictors."
    # So we keep the raw variables but exclude ratios that are directly equivalent or highly overlapping.
    
    # Let's keep raw variables, but exclude:
    # financial_obligation_ratio (exact match)
    # expense_to_income_ratio (partial match)
    # emi_to_income_ratio (partial match)
    
    # User's explicit minimum: financial_obligation_ratio
    
    excluded_columns = [
        "id", "user_id", "record_date", 
        "financial_obligation_ratio", "distress_target",
        "expense_to_income_ratio", "emi_to_income_ratio" # High leakage risk proxies
    ]
    
    # Categoricals might need encoding. The prompt says: "For the MVP, prefer a clean numerical model unless categorical preprocessing materially improves the model."
    # Let's use only numerical features for MVP.
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
    
    feature_columns = [c for c in numeric_cols if c not in excluded_columns]
    
    # 3. Train Test Split
    X = df[feature_columns]
    y = df['distress_target']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # 4. Train Models
    # Model A: Logistic Regression
    lr_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('lr', LogisticRegression(class_weight='balanced', random_state=42))
    ])
    lr_pipeline.fit(X_train, y_train)
    lr_preds = lr_pipeline.predict(X_test)
    lr_probs = lr_pipeline.predict_proba(X_test)[:, 1]
    
    # Model B: Random Forest
    rf_model = RandomForestClassifier(class_weight='balanced', random_state=42, n_estimators=100)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_probs = rf_model.predict_proba(X_test)[:, 1]
    
    def evaluate(y_true, y_pred, y_prob):
        cm = confusion_matrix(y_true, y_pred)
        # cm: [[TN, FP], [FN, TP]]
        fn = int(cm[1, 0])
        tp = int(cm[1, 1])
        recall = recall_score(y_true, y_pred)
        
        return {
            "Accuracy": accuracy_score(y_true, y_pred),
            "Precision": precision_score(y_true, y_pred, zero_division=0),
            "Recall": recall,
            "F1-score": f1_score(y_true, y_pred, zero_division=0),
            "ROC-AUC": roc_auc_score(y_true, y_prob),
            "False_Negatives": fn,
            "False_Negative_Rate": fn / (fn + tp) if (fn + tp) > 0 else 0
        }
        
    lr_metrics = evaluate(y_test, lr_preds, lr_probs)
    rf_metrics = evaluate(y_test, rf_preds, rf_probs)
    
    # Select Final Model
    # We want strong DISTRESSED recall and good F1.
    if rf_metrics['Recall'] >= lr_metrics['Recall'] * 0.95 and rf_metrics['F1-score'] > lr_metrics['F1-score']:
        selected_model = "Random Forest"
        final_model = rf_model
        final_metrics = rf_metrics
        # Save feature importance
        importances = final_model.feature_importances_
        feature_importance = {f: float(imp) for f, imp in zip(feature_columns, importances)}
        # Sort descending
        feature_importance = dict(sorted(feature_importance.items(), key=lambda item: item[1], reverse=True))
    else:
        selected_model = "Logistic Regression"
        final_model = lr_pipeline
        final_metrics = lr_metrics
        # Save coefficients
        coeffs = final_model.named_steps['lr'].coef_[0]
        feature_importance = {f: float(c) for f, c in zip(feature_columns, coeffs)}
        # Sort by absolute value descending
        feature_importance = dict(sorted(feature_importance.items(), key=lambda item: abs(item[1]), reverse=True))
        
    # Save the model
    joblib.dump(final_model, model_path)
    
    # Save metadata
    metadata = {
        "model_name": selected_model,
        "model_version": "1.0",
        "training_date": datetime.now().isoformat(),
        "target_definition": "financial_obligation_ratio > 1.0",
        "target_column": "distress_target",
        "feature_columns": feature_columns,
        "excluded_columns": excluded_columns,
        "train_size": len(X_train),
        "test_size": len(X_test),
        "random_state": 42,
        "metrics": final_metrics,
        "class_distribution": class_distribution,
        "feature_importance": feature_importance
    }
    
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=4)
        
    return {
        "class_distribution": class_distribution,
        "lr_metrics": lr_metrics,
        "rf_metrics": rf_metrics,
        "selected_model": selected_model
    }

if __name__ == "__main__":
    res = train_models()
    print("Training Complete.")
    print("Selected Model:", res['selected_model'])
