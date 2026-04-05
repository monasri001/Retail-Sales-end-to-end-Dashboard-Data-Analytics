import pandas as pd
from app.database import supabase
from datetime import datetime, timedelta

def get_alerts():
    alerts = []
    
    # 1. Low stock (< 100)
    products_resp = supabase.table('products').select('name, stock').lt('stock', 100).execute()
    if products_resp.data:
        for p in products_resp.data:
            alerts.append({
                "type": "LOW_STOCK",
                "message": f"Low stock alert: {p['name']} only has {p['stock']} units left."
            })
            
    # 2. Sales Drop
    orders_response = supabase.table('orders').select('order_date, total_amount').execute()
    if orders_response.data:
        df = pd.DataFrame(orders_response.data)
        df['order_date'] = pd.to_datetime(df['order_date']).dt.tz_localize(None)
        max_date = df['order_date'].max()
        
        current_week_start = max_date - timedelta(days=7)
        prev_week_start = current_week_start - timedelta(days=7)
        
        curr_rev = df[df['order_date'] >= current_week_start]['total_amount'].sum()
        prev_rev = df[(df['order_date'] >= prev_week_start) & (df['order_date'] < current_week_start)]['total_amount'].sum()
        
        if prev_rev > 0:
            pct_change = ((curr_rev - prev_rev) / prev_rev) * 100
            if pct_change < -10:
                alerts.append({
                    "type": "SALES_DROP",
                    "message": f"Revenue Alert: Revenue dropped {abs(pct_change):.1f}% compared to the previous 7 days."
                })
                
    # 3. Inactive Customers
    from app.services.segmentation import perform_customer_segmentation
    try:
        segments = perform_customer_segmentation()
        if isinstance(segments, list):
            # Find customers with high recency (e.g. > 90 days)
            inactive = [s for s in segments if s['recency_days'] > 90]
            if inactive:
                alerts.append({
                    "type": "INACTIVE_CUSTOMERS",
                    "message": f"Customer Alert: There are {len(inactive)} customers who haven't ordered in over 90 days."
                })
    except Exception:
        pass
        
    return alerts
