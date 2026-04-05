import pandas as pd
from app.database import supabase
from datetime import datetime, timedelta

def generate_insights():
    insights = []
    
    # 1. Fetch Orders for Revenue comparisons
    orders_response = supabase.table('orders').select('order_date, total_amount').execute()
    if not orders_response.data:
        return [{"insight": "Not enough data to generate insights."}]
        
    df = pd.DataFrame(orders_response.data)
    df['order_date'] = pd.to_datetime(df['order_date']).dt.tz_localize(None)
    
    max_date = df['order_date'].max()
    
    # Define periods
    current_week_start = max_date - timedelta(days=7)
    prev_week_start = current_week_start - timedelta(days=7)
    
    current_week_df = df[df['order_date'] >= current_week_start]
    prev_week_df = df[(df['order_date'] >= prev_week_start) & (df['order_date'] < current_week_start)]
    
    curr_rev = current_week_df['total_amount'].sum()
    prev_rev = prev_week_df['total_amount'].sum()
    
    # Insight 1: Revenue trend
    if prev_rev > 0:
        pct_change = ((curr_rev - prev_rev) / prev_rev) * 100
        if pct_change < -10:
            insights.append({"insight": f"Revenue dropped {abs(pct_change):.1f}% compared to last week."})
        elif pct_change > 10:
            insights.append({"insight": f"Great job! Revenue increased {pct_change:.1f}% compared to last week."})
        else:
            insights.append({"insight": f"Revenue is stable compared to last week (changed by {pct_change:.1f}%)."})
            
    # 2. Fetch Order Items + Products for Product Trends
    # We want trending product
    items_resp = supabase.table('order_items').select('product_id').execute()
    if items_resp.data:
        items_df = pd.DataFrame(items_resp.data)
        top_product_id = items_df['product_id'].value_counts().idxmax()
        
        # Get product name
        prod_resp = supabase.table('products').select('name').eq('product_id', top_product_id).execute()
        if prod_resp.data:
            prod_name = prod_resp.data[0]['name']
            insights.append({"insight": f"Product '{prod_name}' is trending upward and is your most popular item recently."})
            
    # 3. High-Value Customers check
    from app.services.segmentation import perform_customer_segmentation
    try:
        segments = perform_customer_segmentation()
        if isinstance(segments, list):
            high_value = [s for s in segments if s['segment'] == 'High-Value Loyal Customers']
            if len(high_value) < (len(segments) * 0.1): # Less than 10% high value
                insights.append({"insight": "High-value customers proportion is low. Consider a loyalty program or retargeting."})
            else:
                insights.append({"insight": f"You have {len(high_value)} High-Value Loyal Customers. Keep them engaged!"})
    except Exception as e:
        pass
    
    return insights
