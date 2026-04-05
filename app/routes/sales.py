from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.services.analytics import get_sales_summary, get_sales_trends

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.get("/summary")
def sales_summary():
    """
    Returns total revenue, total orders, and average order value.
    """
    return get_sales_summary()

@router.get("/trends")
def sales_trends(period: str = Query("daily", description="Period can be daily, weekly, or monthly")):
    """
    Returns sales trends grouped by daily, weekly, or monthly period.
    """
    return get_sales_trends(period)

from pydantic import BaseModel
import uuid
from datetime import datetime
from app.database import supabase
import random

class OrderPayload(BaseModel):
    customer_id: str
    product_id: str
    quantity: int

@router.post("/simulate_order")
def simulate_order(payload: OrderPayload):
    """
    Creates a new dynamic order in the database.
    This will instantly update your sold data and refresh frontend charts!
    """
    # 1. Fetch Product Price
    product_resp = supabase.table('products').select('price').eq('product_id', payload.product_id).execute()
    if not product_resp.data:
        return {"error": "Product not found"}
    price = product_resp.data[0]['price']
    
    total_amount = price * payload.quantity
    
    # 2. Insert Order
    order_id = str(uuid.uuid4())
    supabase.table('orders').insert({
        "order_id": order_id,
        "customer_id": payload.customer_id,
        "order_date": datetime.now().isoformat(),
        "total_amount": total_amount,
        "discount": 0
    }).execute()
    
    # 3. Insert Order Item
    supabase.table('order_items').insert({
        "id": str(uuid.uuid4()),
        "order_id": order_id,
        "product_id": payload.product_id,
        "quantity": payload.quantity
    }).execute()
    
    return {"message": "New order successfully simulated! Data updated."}
