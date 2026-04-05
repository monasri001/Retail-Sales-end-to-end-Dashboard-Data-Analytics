import pandas as pd
from prophet import Prophet
from app.database import supabase
from datetime import datetime, timedelta

def forecast_sales_30_days():
    # Fetch historical sales data
    response = supabase.table('orders').select('order_date, total_amount').limit(100000).execute()
    data = response.data
    
    if not data:
        return {"error": "Not enough data for forecasting."}
        
    df = pd.DataFrame(data)
    df['order_date'] = pd.to_datetime(df['order_date']).dt.date
    daily_sales = df.groupby('order_date')['total_amount'].sum().reset_index()
    
    if len(daily_sales) < 30:
        return {"error": "Need at least 30 days of data for reliable forecasting."}
    
    # Prepare data for Prophet
    prophet_df = daily_sales.rename(columns={'order_date': 'ds', 'total_amount': 'y'})
    
    model = Prophet(daily_seasonality=True, yearly_seasonality=True)
    model.fit(prophet_df)
    
    # Predict next 30 days
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    
    # Filter for only future 30 days
    last_date = pd.to_datetime(prophet_df['ds'].max())
    future_forecast = forecast[forecast['ds'] > last_date][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    
    results = []
    for _, row in future_forecast.iterrows():
        results.append({
            "date": row['ds'].strftime("%Y-%m-%d"),
            "predicted_amount": round(row['yhat'], 2),
            "lower_bound": round(row['yhat_lower'], 2),
            "upper_bound": round(row['yhat_upper'], 2)
        })
        
    return {"forecast_next_30_days": results}
