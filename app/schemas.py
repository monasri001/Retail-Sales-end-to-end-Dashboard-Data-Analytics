from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class Customer(BaseModel):
    customer_id: str
    name: str
    location: Optional[str] = None
    signup_date: date

class Product(BaseModel):
    product_id: str
    name: str
    category: str
    price: float
    stock: int

class Order(BaseModel):
    order_id: str
    customer_id: str
    order_date: datetime
    total_amount: float
    discount: float

class OrderItem(BaseModel):
    id: str
    order_id: str
    product_id: str
    quantity: int

class SalesSummary(BaseModel):
    total_revenue: float
    total_orders: int
    avg_order_value: float

class Insight(BaseModel):
    insight: str
