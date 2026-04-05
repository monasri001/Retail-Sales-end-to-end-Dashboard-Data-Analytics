import os
from supabase import create_client
from dotenv import load_dotenv
import math
from datetime import datetime
import pandas as pd

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def inject_anomalies():
    print("Fetching orders to inject anomalies...")
    # Fetch all columns to satisfy constraints during upsert
    response = supabase.table('orders').select('*').limit(10000).execute()
    data = response.data
    
    if not data:
        print("No orders found!")
        return

    updates = []
    
    for row in data:
        dt = datetime.fromisoformat(row['order_date'].replace('Z', '+00:00') if 'Z' in row['order_date'] else row['order_date'])
        month = dt.month
        current_amount = row['total_amount']
        
        if month in [11, 12]:
            new_amount = current_amount * 3.5  
        elif month in [3, 4]:
            new_amount = current_amount * 0.3  
        elif month in [7, 8]:
            new_amount = current_amount * 1.8  
        else:
            new_amount = current_amount * 1.1
            
        if new_amount != current_amount:
            # We provide the entire row back, just updating the amount
            updated_row = row.copy()
            updated_row['total_amount'] = round(new_amount, 2)
            updates.append(updated_row)

    print(f"Applying heavy volatility to {len(updates)} orders...")
    
    # Supabase bulk update
    batch_size = 1000
    for i in range(0, len(updates), batch_size):
        batch = updates[i:i+batch_size]
        supabase.table('orders').upsert(batch).execute()
        
    print("Volatility injected successfully! Reload your frontend.")

if __name__ == "__main__":
    inject_anomalies()
