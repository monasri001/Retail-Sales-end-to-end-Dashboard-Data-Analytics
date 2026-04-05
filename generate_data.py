import uuid
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Please set SUPABASE_URL and SUPABASE_KEY in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORIES = ['Electronics', 'Clothing', 'Grocery', 'Home', 'Beauty']
NUM_CUSTOMERS = random.randint(234, 350)
NUM_PRODUCTS = random.randint(55, 95)
NUM_ORDERS = random.randint(812, 940)

def generate_customers():
    print("Generating customers...")
    customers = []
    locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Toronto', 'Sydney', 'Tokyo', 'Berlin']
    for _ in range(NUM_CUSTOMERS):
        customer_id = str(uuid.uuid4())
        signup_date = datetime.now() - timedelta(days=random.randint(1, 1000))
        customers.append({
            'customer_id': customer_id,
            'name': f"Customer {uuid.uuid4().hex[:6]}",
            'location': random.choice(locations),
            'signup_date': signup_date.strftime('%Y-%m-%d')
        })
    return customers

def generate_products():
    print("Generating products...")
    products = []
    for _ in range(NUM_PRODUCTS):
        product_id = str(uuid.uuid4())
        category = random.choice(CATEGORIES)
        
        # Dead stock probability
        is_dead_stock = random.random() < 0.1
        stock = random.randint(50, 1000) if not is_dead_stock else random.randint(500, 2000)
        
        products.append({
            'product_id': product_id,
            'name': f"{category} Product {uuid.uuid4().hex[:4]}",
            'category': category,
            'price': round(random.uniform(5.0, 500.0), 2),
            'stock': stock
        })
    return products

def generate_orders_and_items(customers, products):
    print("Generating orders and items...")
    orders = []
    order_items = []
    
    # Probabilities for seasonal spikes / holidays
    def get_order_date():
        base_date = datetime.now() - timedelta(days=random.randint(1, 365))
        # Add random weekend/holiday bias
        if random.random() < 0.3: # 30% chance to be on a weekend
            days_to_weekend = 5 - base_date.weekday() if base_date.weekday() < 5 else 0
            base_date += timedelta(days=days_to_weekend)
        return base_date

    # Customer frequencies: some are frequent buyers
    customer_weights = np.random.exponential(scale=1.0, size=len(customers))
    customer_weights /= customer_weights.sum()
    selected_customers = np.random.choice(customers, size=NUM_ORDERS, p=customer_weights)

    # Product popularity
    product_weights = np.random.exponential(scale=1.0, size=len(products))
    
    # Force 20% of products to be completely UNSOLD (guaranteed dead stock)
    num_dead_stock = int(len(products) * 0.20)
    dead_indices = np.random.choice(len(products), num_dead_stock, replace=False)
    product_weights[dead_indices] = 0.0
    
    product_weights /= product_weights.sum()

    for i in range(NUM_ORDERS):
        order_id = str(uuid.uuid4())
        c = selected_customers[i]
        
        num_items = random.randint(1, 5)
        selected_prods = np.random.choice(products, size=num_items, p=product_weights, replace=False)
        
        total_amount = 0
        for p in selected_prods:
            qty = random.randint(1, 3)
            total_amount += p['price'] * qty
            
            order_items.append({
                'id': str(uuid.uuid4()),
                'order_id': order_id,
                'product_id': p['product_id'],
                'quantity': qty
            })
            
        discount = round(random.uniform(0, 0.3), 2) if random.random() < 0.4 else 0.0
        final_amount = total_amount * (1 - discount)
        
        orders.append({
            'order_id': order_id,
            'customer_id': c['customer_id'],
            'order_date': get_order_date().isoformat(),
            'total_amount': round(final_amount, 2),
            'discount': discount
        })

    return orders, order_items

def batch_insert(table_name, data, batch_size=1000):
    print(f"Inserting into {table_name}...")
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        response = supabase.table(table_name).insert(batch).execute()
        print(f"Inserted {len(batch)} rows into {table_name}")

if __name__ == "__main__":
    customers = generate_customers()
    products = generate_products()
    orders, order_items = generate_orders_and_items(customers, products)
    
    # Perform database insertions
    batch_insert('customers', customers)
    batch_insert('products', products)
    batch_insert('orders', orders)
    batch_insert('order_items', order_items)
    print("Data generation complete.")
