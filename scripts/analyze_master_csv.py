import pandas as pd
import numpy as np
import requests
from io import StringIO

# Fetch the master CSV data
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/master_csv-Lb4r5QgZnCZ5gAMuJAKoch0dwkprlO.csv"
response = requests.get(url)
csv_content = response.text

# Read the CSV data
df = pd.read_csv(StringIO(csv_content))

print("=== Master CSV Data Analysis ===")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print("\nFirst 10 rows:")
print(df.head(10))

print("\nUnique banks:")
print(df['bank'].unique())

print("\nUnique categories:")
print(df['category'].unique())

print("\nUnique sub_category1:")
print(df['sub_category1'].unique())

print("\nSample items:")
print(df['Item'].unique()[:20])

# Analyze time period columns
time_columns = [col for col in df.columns if any(year in col for year in ['2023', '2024', '2025'])]
print(f"\nTime period columns: {time_columns}")

# Check data availability by period
print("\nData availability by period:")
for col in time_columns:
    non_null_count = df[col].notna().sum()
    print(f"{col}: {non_null_count} non-null values ({non_null_count/len(df)*100:.1f}%)")

# Analyze ADIB data specifically
adib_data = df[df['bank'] == 'ADIB']
print(f"\nADIB data: {len(adib_data)} rows")
print("ADIB categories:")
print(adib_data['category'].value_counts())

# Sample ADIB financial items
print("\nSample ADIB financial items:")
adib_financial = adib_data[adib_data['category'].isin(['P&L', 'KPI', 'Balance Sheet'])]
print(adib_financial[['Item', 'category', 'fy_2024', 'fy_2023']].head(15))

# Generate filter options
print("\n=== Filter Options ===")
print("Available periods for filtering:")
available_periods = [col for col in time_columns if df[col].notna().sum() > 50]
print(available_periods)

print("\nAvailable categories for filtering:")
print(df['category'].value_counts())

print("\nAvailable sub-categories:")
print(df['sub_category1'].value_counts())
