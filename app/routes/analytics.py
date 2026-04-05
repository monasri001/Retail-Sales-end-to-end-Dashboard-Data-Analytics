import csv
from io import StringIO
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.forecasting import forecast_sales_30_days
from app.services.alerts import get_alerts
from app.services.ai_insights import generate_insights
from app.database import supabase

router = APIRouter(tags=["Analytics"])

@router.get("/forecast")
def get_forecast():
    """
    Returns 30 days sales prediction.
    """
    return forecast_sales_30_days()

@router.get("/alerts")
def fetch_alerts():
    """
    Returns alerts for low stock, revenue drop, inactive customers.
    """
    return get_alerts()

@router.get("/ai-insights")
def fetch_ai_insights():
    """
    Returns rule-based / generated insights.
    """
    return generate_insights()

@router.get("/export")
def export_data():
    """
    Export data as CSV. We'll export the latest 1000 orders as an example.
    """
    response = supabase.table('orders').select('*').order('order_date', desc=True).limit(1000).execute()
    data = response.data
    
    if not data:
        return {"error": "No data found to export"}
        
    csv_file = StringIO()
    writer = csv.DictWriter(csv_file, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    
    csv_file.seek(0)
    
    return StreamingResponse(
        iter([csv_file.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders_export.csv"}
    )
