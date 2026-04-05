import pandas as pd
from app.database import supabase

def get_sales_summary():
    # Fetch all orders (in production, should filter or aggregate in DB directly)
    response = supabase.table('orders').select('*').limit(100000).execute()
    data = response.data
    
    if not data:
        return {"total_revenue": 0.0, "total_orders": 0, "avg_order_value": 0.0}
        
    df = pd.DataFrame(data)
    total_revenue = df['total_amount'].sum()
    total_orders = len(df)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    return {
        "total_revenue": round(float(total_revenue), 2),
        "total_orders": int(total_orders),
        "avg_order_value": round(float(avg_order_value), 2)
    }

def get_sales_trends(period="daily"):
    # period can be daily, weekly, monthly
    response = supabase.table('orders').select('order_date, total_amount').limit(100000).execute()
    df = pd.DataFrame(response.data)
    
    if df.empty:
        return []
        
    df['order_date'] = pd.to_datetime(df['order_date'])
    
    if period == "daily":
        grouped = df.groupby(df['order_date'].dt.date)['total_amount'].sum()
    elif period == "weekly":
        grouped = df.groupby(pd.Grouper(key='order_date', freq='W-MON'))['total_amount'].sum()
    elif period == "monthly":
        grouped = df.groupby(pd.Grouper(key='order_date', freq='M'))['total_amount'].sum()
    else:
        grouped = df.groupby(df['order_date'].dt.date)['total_amount'].sum()
        
    trends = [{"date": str(k), "revenue": round(float(v), 2)} for k, v in grouped.items()]
    return trends
