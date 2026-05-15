"""
predict.py — Multi-Model Prediction Script
Called by the Node.js backend via child_process.spawn.
Reads input JSON from stdin, loads model.pkl, returns predictions from ALL 5 models as JSON.
"""

import sys
import json
import pickle
import os
import numpy as np

# Model display metadata (label + color for frontend)
MODEL_META = {
    'RandomForest':    {'label': 'Random Forest',       'icon': '🌲', 'color': '#4ade80'},
    'LinearRegression':{'label': 'Linear Regression',   'icon': '📈', 'color': '#60a5fa'},
    'GradientBoosting':{'label': 'Gradient Boosting',   'icon': '🚀', 'color': '#f59e0b'},
    'DecisionTree':    {'label': 'Decision Tree',        'icon': '🌿', 'color': '#a78bfa'},
    'KNN':             {'label': 'K-Nearest Neighbors',  'icon': '🔍', 'color': '#f472b6'},
}

def predict(input_data):
    """
    Load all saved models and return predictions from every model.
    input_data: dict with keys: crop, state, month, year, season
    """
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

    # Load model package
    with open(MODEL_PATH, 'rb') as f:
        pkg = pickle.load(f)

    models      = pkg.get('models', {})
    rf_min      = pkg['rf_min']
    rf_max      = pkg['rf_max']
    encoders    = pkg['encoders']
    metrics_all = pkg.get('metrics', {})

    crop   = input_data['crop']
    state  = input_data['state']
    season = input_data['season']
    month  = int(input_data['month'])
    year   = int(input_data['year'])

    # ── Encode categorical inputs ─────────────────────────────────────────────
    crop_enc   = encoders['crop']['mapping'].get(crop, 0)
    state_enc  = encoders['state']['mapping'].get(state, 0)
    season_enc = encoders['season']['mapping'].get(season, 0)

    X = np.array([[crop_enc, state_enc, season_enc, month, year]])

    # ── Shared min/max range ──────────────────────────────────────────────────
    min_price_base = float(rf_min.predict(X)[0])
    max_price_base = float(rf_max.predict(X)[0])

    # ── Run Prediction for each model ─────────────────────────────────────────
    results = []

    # If old model.pkl (no 'models' key), fall back to single model
    if not models:
        single = pkg.get('model')
        single_name = pkg.get('model_name', 'RandomForest')
        models = {single_name: single}

    for model_key, model in models.items():
        try:
            predicted_price = float(model.predict(X)[0])
            # Per-model min/max: adjust from base range proportionally
            min_price = min(min_price_base, predicted_price * 0.9)
            max_price = max(max_price_base, predicted_price * 1.1)

            meta = MODEL_META.get(model_key, {
                'label': model_key, 'icon': '🤖', 'color': '#94a3b8'
            })
            model_metrics = metrics_all.get(model_key, {})

            results.append({
                'model_key':       model_key,
                'model_label':     meta['label'],
                'icon':            meta['icon'],
                'color':           meta['color'],
                'predicted_price': round(predicted_price, 2),
                'min_range':       round(min_price, 2),
                'max_range':       round(max_price, 2),
                'mae':             round(model_metrics.get('mae', 0), 2),
                'r2':              round(model_metrics.get('r2', 0), 4),
            })
        except Exception as e:
            results.append({
                'model_key':   model_key,
                'model_label': MODEL_META.get(model_key, {}).get('label', model_key),
                'error':       str(e),
            })

    # Sort: best (lowest MAE) first
    results.sort(key=lambda r: metrics_all.get(r['model_key'], {}).get('mae', 999))

    # Primary prediction = first (best) model
    primary = results[0] if results else {}

    return {
        'predicted_price': primary.get('predicted_price', 0),
        'min_range':       primary.get('min_range', 0),
        'max_range':       primary.get('max_range', 0),
        'model_used':      primary.get('model_label', 'Unknown'),
        'all_models':      results,
    }


if __name__ == '__main__':
    # Node.js passes JSON via stdin
    raw = sys.stdin.read()
    input_data = json.loads(raw)

    try:
        result = predict(input_data)
        print(json.dumps({'success': True, 'data': result}))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
        sys.exit(1)
