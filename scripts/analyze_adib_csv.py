import pandas as pd
import requests
import numpy as np
from io import StringIO

def analyze_adib_csv():
    """Analyze the ADIB CSV data structure and content"""
    
    # CSV URL
    csv_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adib_csv-NnJWhpVRJafi03oUOvKnAwYIuMmOzx.csv"
    
    try:
        # Fetch the CSV data
        print("Fetching CSV data...")
        response = requests.get(csv_url)
        response.raise_for_status()
        
        # Parse CSV
        csv_data = StringIO(response.text)
        df = pd.read_csv(csv_data)
        
        print(f"CSV loaded successfully!")
        print(f"Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        print("\nFirst few rows:")
        print(df.head())
        
        print("\nData types:")
        print(df.dtypes)
        
        print("\nBasic statistics:")
        print(df.describe())
        
        # Check for missing values
        print("\nMissing values:")
        print(df.isnull().sum())
        
        # Check unique values in first column (ID)
        print(f"\nUnique IDs: {df.iloc[:, 0].nunique()}")
        print(f"ID range: {df.iloc[:, 0].min()} to {df.iloc[:, 0].max()}")
        
        # Analyze numerical columns
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        print(f"\nNumerical columns: {list(numerical_cols)}")
        
        # Check for 'na' values in string columns
        string_cols = df.select_dtypes(include=['object']).columns
        for col in string_cols:
            na_count = (df[col] == 'na').sum()
            if na_count > 0:
                print(f"Column '{col}' has {na_count} 'na' values")
        
        # Sample data analysis
        print("\nSample data analysis:")
        for i, row in df.head(10).iterrows():
            print(f"ID {row.iloc[0]}: {dict(row.iloc[1:])}")
            
        return df
        
    except Exception as e:
        print(f"Error analyzing CSV: {e}")
        return None

if __name__ == "__main__":
    df = analyze_adib_csv()
