import pandas as pd
import numpy as np
import requests
from io import StringIO

# Fetch the master CSV data
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/master_csv-S6cMjJhnL8nHwsu1SFE6bvsWrz7OgN.csv"
response = requests.get(url)
csv_content = response.text

# Read the CSV data
df = pd.read_csv(StringIO(csv_content))

print("=== Line Item Analysis Filter Options ===")
print(f"Dataset shape: {df.shape}")

# Analyze available banks
print("\nAvailable Banks:")
banks = df['bank'].unique()
bank_counts = df['bank'].value_counts()
for bank in banks:
    print(f"  {bank}: {bank_counts[bank]} items")

# Analyze categories
print("\nAvailable Categories:")
categories = df['category'].unique()
category_counts = df['category'].value_counts()
for category in categories:
    print(f"  {category}: {category_counts[category]} items")

# Analyze sub-categories
print("\nSub-categories (Level 1):")
sub_cats = df['sub_category1'].unique()
sub_cat_counts = df['sub_category1'].value_counts()
for sub_cat in sub_cats[:10]:  # Show top 10
    if pd.notna(sub_cat):
        print(f"  {sub_cat}: {sub_cat_counts[sub_cat]} items")

# Analyze time periods with data
time_columns = [col for col in df.columns if any(year in col for year in ['2023', '2024', '2025'])]
print(f"\nAvailable Time Periods: {len(time_columns)} columns")

# Check data availability by period
print("\nData availability by period:")
for col in time_columns:
    non_null_count = df[col].notna().sum()
    non_na_count = (df[col] != 'na').sum() if df[col].dtype == 'object' else non_null_count
    print(f"  {col}: {non_na_count} valid values ({non_na_count/len(df)*100:.1f}%)")

# Sample line items for each bank
print("\n=== Sample Line Items by Bank ===")
for bank in ['ADIB', 'FAB', 'ENBD', 'CBD']:
    if bank in banks:
        bank_data = df[df['bank'] == bank]
        print(f"\n{bank} Sample Items:")
        sample_items = bank_data[['Item', 'category', 'fy_2024', 'fy_2023']].head(5)
        for _, row in sample_items.iterrows():
            print(f"  - {row['Item']} ({row['category']})")

# Analyze levels for hierarchical display
print("\nHierarchical Levels:")
if 'level' in df.columns:
    level_counts = df['level'].value_counts().sort_index()
    for level in level_counts.index:
        print(f"  Level {level}: {level_counts[level]} items")

print("\n=== Filter Implementation Data ===")
print("Banks for filter buttons:", list(banks))
print("Categories for filter:", list(categories))
print("Most recent periods with data:", [col for col in time_columns if df[col].notna().sum() > 50][-4:])
