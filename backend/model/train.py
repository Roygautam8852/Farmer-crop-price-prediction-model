# -*- coding: utf-8 -*-
"""
train.py — ML Model Training Script
Trains 5 different models on crop price data and saves all models in model.pkl.
Models: Random Forest, Linear Regression, Gradient Boosting, Decision Tree, KNN
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import json
import os

# ── 1. Load Dataset ──────────────────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'crop_prices_dataset.csv')
df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded: {len(df)} rows, {df.columns.tolist()} columns")
print(f"Crops  : {sorted(df['crop'].unique().tolist())}")
print(f"States : {sorted(df['state'].unique().tolist())}")

# ── 2. Encode Categorical Features ───────────────────────────────────────────
encoders = {}
categorical_cols = ['crop', 'state', 'season']

for col in categorical_cols:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col])
    encoders[col] = {
        'classes': le.classes_.tolist(),
        'mapping': {cls: int(idx) for idx, cls in enumerate(le.classes_)}
    }

# ── 3. Define Feature Matrix (X) and Target (y) ──────────────────────────────
feature_cols = ['crop_encoded', 'state_encoded', 'season_encoded', 'month', 'year']
X = df[feature_cols]
y = df['modal_price']   # Target: modal (average) market price in ₹/quintal

# Also save min/max price for confidence range calculation
y_min = df['min_price']
y_max = df['max_price']

# ── 4. Train-Test Split ───────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
_, _, y_min_train, y_min_test = train_test_split(y_min, y_min, test_size=0.2, random_state=42)
_, _, y_max_train, y_max_test = train_test_split(y_max, y_max, test_size=0.2, random_state=42)

# ── 5. Define All 5 Models ────────────────────────────────────────────────────
model_configs = [
    {
        'key':   'RandomForest',
        'label': 'Random Forest',
        'model': RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1),
    },
    {
        'key':   'LinearRegression',
        'label': 'Linear Regression',
        'model': LinearRegression(),
    },
    {
        'key':   'GradientBoosting',
        'label': 'Gradient Boosting',
        'model': GradientBoostingRegressor(n_estimators=150, random_state=42),
    },
    {
        'key':   'DecisionTree',
        'label': 'Decision Tree',
        'model': DecisionTreeRegressor(max_depth=15, random_state=42),
    },
    {
        'key':   'KNN',
        'label': 'K-Nearest Neighbors',
        'model': KNeighborsRegressor(n_neighbors=7, n_jobs=-1),
    },
]

# ── 6. Train All Models ───────────────────────────────────────────────────────
trained_models = {}
metrics_all = {}

print("\n" + "="*30 + " Training 5 Models " + "="*30)
for cfg in model_configs:
    key   = cfg['key']
    label = cfg['label']
    mdl   = cfg['model']

    mdl.fit(X_train, y_train)
    preds = mdl.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    mse = mean_squared_error(y_test, preds)
    r2  = r2_score(y_test, preds)

    trained_models[key] = mdl
    metrics_all[key] = {
        'label': label,
        'mae': float(mae),
        'mse': float(mse),
        'r2':  float(r2),
    }
    print(f"  [{label:<22}]  MAE={mae:.2f}  MSE={mse:.2f}  R²={r2:.4f}")

# ── 7. Train RF for min/max price ranges (shared range estimator) ─────────────
rf_min = RandomForestRegressor(n_estimators=100, random_state=42)
rf_min.fit(X_train, y_min.iloc[X_train.index])
rf_max = RandomForestRegressor(n_estimators=100, random_state=42)
rf_max.fit(X_train, y_max.iloc[X_train.index])

# ── 8. Pick Best Model by MAE ─────────────────────────────────────────────────
best_key = min(metrics_all, key=lambda k: metrics_all[k]['mae'])
print(f"\n[BEST] '{metrics_all[best_key]['label']}' has lowest MAE = {metrics_all[best_key]['mae']:.2f}")

# ── 9. Save All Models + Encoders + Metadata ──────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

model_package = {
    # All 5 trained models keyed by their identifier
    'models':       trained_models,
    # Best single model (kept for backward compat)
    'model':        trained_models[best_key],
    'model_name':   best_key,
    # Range estimators
    'rf_min':       rf_min,
    'rf_max':       rf_max,
    # Encoders & feature config
    'encoders':     encoders,
    'feature_cols': feature_cols,
    # Per-model metrics
    'metrics':      metrics_all,
}

with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model_package, f)

print(f"\n[DONE] Model saved to {MODEL_PATH}")

# Save crop/state/season options as JSON for the API
OPTIONS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'options.json')
options = {
    'crops':   sorted(df['crop'].unique().tolist()),
    'states':  sorted(df['state'].unique().tolist()),
    'seasons': sorted(df['season'].unique().tolist()),
}
with open(OPTIONS_PATH, 'w') as f:
    json.dump(options, f, indent=2)

print(f"[DONE] Options saved to {OPTIONS_PATH}")
print("\nTraining complete! 5 models saved.")
