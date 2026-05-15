"""
prepare_kaggle_data.py
======================
Downloads the Kaggle dataset "arjunyadav99/indian-agricultural-mandi-prices-20232025"
and transforms it into the exact format expected by train.py:

    crop, state, year, month, season, modal_price, min_price, max_price

Usage:
    pip install kagglehub pandas
    python prepare_kaggle_data.py

Requirements:
    - A Kaggle account + API token (~/.kaggle/kaggle.json)
      OR set KAGGLE_USERNAME and KAGGLE_KEY environment variables.
"""

import os
import glob
import pandas as pd
import kagglehub  # type: ignore[import-untyped]  # pyrefly: ignore[missing-import]

# ── 1. Download the dataset ───────────────────────────────────────────────────
print("📥 Downloading dataset from Kaggle...")
path = kagglehub.dataset_download("arjunyadav99/indian-agricultural-mandi-prices-20232025")
print(f"✅ Downloaded to: {path}")

# ── 2. Find the CSV file(s) in the downloaded path ───────────────────────────
csv_files = glob.glob(os.path.join(path, "**", "*.csv"), recursive=True)
if not csv_files:
    raise FileNotFoundError(f"No CSV files found in {path}")

print(f"\n📂 Found {len(csv_files)} CSV file(s):")
for f in csv_files:
    print(f"   → {f}")

# Load all CSVs and concatenate
dfs = []
for f in csv_files:
    try:
        df_temp = pd.read_csv(f, encoding='utf-8', low_memory=False)
        dfs.append(df_temp)
        print(f"   Loaded {len(df_temp)} rows from {os.path.basename(f)}")
    except Exception as e:
        print(f"   ⚠️  Could not load {f}: {e}")

raw_df = pd.concat(dfs, ignore_index=True)
print(f"\n📊 Total raw rows: {len(raw_df)}")
print(f"📋 Raw columns: {raw_df.columns.tolist()}")

# ── 3. Normalize column names (lowercase, strip spaces) ──────────────────────
raw_df.columns = raw_df.columns.str.strip().str.lower().str.replace(' ', '_')
print(f"📋 Normalized columns: {raw_df.columns.tolist()}")

# ── 4. Identify and rename relevant columns ──────────────────────────────────
# Try common Agmarknet column name variants
COLUMN_MAP = {
    # Kaggle column name    →   Our standard column name
    'commodity':               'crop',
    'state':                   'state',
    'state_name':              'state',
    'modal_price':             'modal_price',
    'modal price':             'modal_price',
    'modalPrice':              'modal_price',
    'min_price':               'min_price',
    'min price':               'min_price',
    'max_price':               'max_price',
    'max price':               'max_price',
    'arrival_date':            'arrival_date',
    'date':                    'arrival_date',
    'price_date':              'arrival_date',
}

raw_df.rename(columns={k: v for k, v in COLUMN_MAP.items() if k in raw_df.columns}, inplace=True)
print(f"📋 Columns after rename: {raw_df.columns.tolist()}")

# ── 5. Parse date → year and month ───────────────────────────────────────────
if 'arrival_date' in raw_df.columns:
    raw_df['arrival_date'] = pd.to_datetime(raw_df['arrival_date'], dayfirst=True, errors='coerce')
    raw_df['year']  = raw_df['arrival_date'].dt.year
    raw_df['month'] = raw_df['arrival_date'].dt.month
    print("✅ Extracted year and month from arrival_date")
else:
    print("⚠️  No date column found! Please check the dataset manually.")
    raise KeyError("Missing date column in dataset")

# ── 6. Derive season from month ──────────────────────────────────────────────
# Indian agricultural seasons:
#   Kharif  : June – November (months 6–11) — monsoon crops (Rice, Maize, Cotton)
#   Rabi    : November – April (months 11–4) — winter crops (Wheat, Mustard, Gram)
#   Zaid    : April – June (months 4–6) — summer crops (Watermelon, Cucumber)
def derive_season(month):
    if month in [6, 7, 8, 9, 10]:
        return 'Kharif'
    elif month in [11, 12, 1, 2, 3]:
        return 'Rabi'
    else:   # 4, 5
        return 'Zaid'

raw_df['season'] = raw_df['month'].apply(derive_season)
print("✅ Derived season column from month")

# ── 7. Select and validate required columns ───────────────────────────────────
required_cols = ['crop', 'state', 'year', 'month', 'season', 'modal_price', 'min_price', 'max_price']
missing = [c for c in required_cols if c not in raw_df.columns]
if missing:
    print(f"\n❌ Missing required columns: {missing}")
    print(f"   Available columns: {raw_df.columns.tolist()}")
    raise KeyError(f"Cannot proceed — missing: {missing}")

df = raw_df[required_cols].copy()

# ── 8. Clean data ────────────────────────────────────────────────────────────
initial_len = len(df)

# Drop rows with nulls in critical columns
df.dropna(subset=['crop', 'state', 'year', 'month', 'modal_price', 'min_price', 'max_price'], inplace=True)

# Convert price columns to numeric, coerce errors
for col in ['modal_price', 'min_price', 'max_price']:
    df[col] = pd.to_numeric(df[col], errors='coerce')
df.dropna(subset=['modal_price', 'min_price', 'max_price'], inplace=True)

# Remove zero or negative prices
df = df[(df['modal_price'] > 0) & (df['min_price'] > 0) & (df['max_price'] > 0)]

# Normalize text columns
df['crop']   = df['crop'].str.strip().str.title()
df['state']  = df['state'].str.strip().str.title()
df['season'] = df['season'].str.strip()

# Convert year/month to int
df['year']  = df['year'].astype(int)
df['month'] = df['month'].astype(int)

# Remove duplicates
df.drop_duplicates(inplace=True)

print(f"\n🧹 Cleaned data: {initial_len} → {len(df)} rows (removed {initial_len - len(df)} invalid rows)")

# ── 9. Summary stats ─────────────────────────────────────────────────────────
print(f"\n📈 Final dataset summary:")
print(f"   Rows    : {len(df)}")
print(f"   Crops   : {sorted(df['crop'].unique().tolist())}")
print(f"   States  : {sorted(df['state'].unique().tolist())}")
print(f"   Seasons : {df['season'].unique().tolist()}")
print(f"   Years   : {sorted(df['year'].unique().tolist())}")

# ── 10. Save to crop_prices.csv ───────────────────────────────────────────────
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'crop_prices.csv')

# Ask before overwriting
print(f"\n💾 Output path: {OUTPUT_PATH}")
answer = input("⚠️  This will OVERWRITE your existing crop_prices.csv. Continue? (yes/no): ").strip().lower()

if answer in ['yes', 'y']:
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"✅ Saved {len(df)} rows to crop_prices.csv")
    print("\n🚀 Next step: Retrain your model by running:")
    print("   cd ../model && python train.py")
else:
    # Save as separate file instead
    PREVIEW_PATH = os.path.join(os.path.dirname(__file__), 'crop_prices_kaggle.csv')
    df.to_csv(PREVIEW_PATH, index=False)
    print(f"✅ Saved as crop_prices_kaggle.csv instead (original unchanged).")
    print("   Review it, then rename it to crop_prices.csv when ready.")
