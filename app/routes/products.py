from fastapi import APIRouter
from app.database import supabase
import pandas as pd

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/top")
def get_top_products():
    """
    Returns the top 10 products by sales volume.
    """
    items_resp = supabase.table('order_items').select('product_id, quantity').execute()
    if not items_resp.data:
        return []
        
    df = pd.DataFrame(items_resp.data)
    top_products = df.groupby('product_id')['quantity'].sum().nlargest(10).reset_index()
    
    products_info = []
    for _, row in top_products.iterrows():
        pid = row['product_id']
        prod_resp = supabase.table('products').select('name, category, price').eq('product_id', pid).execute()
        if prod_resp.data:
            p_data = prod_resp.data[0]
            products_info.append({
                "product_id": pid,
                "name": p_data['name'],
                "category": p_data['category'],
                "total_quantity_sold": int(row['quantity'])
            })
            
    return products_info

@router.get("/dead-stock")
def get_dead_stock():
    """
    Returns products with low sales (or zero sales).
    """
    # Fetch all products
    products_resp = supabase.table('products').select('product_id, name, stock').execute()
    if not products_resp.data:
        return []
        
    all_products = pd.DataFrame(products_resp.data)
    
    # Fetch all order items to see what was sold
    items_resp = supabase.table('order_items').select('product_id, quantity').execute()
    
    if not items_resp.data:
        # If no sales at all, everything is dead stock
        return all_products.to_dict(orient="records")
        
    sold_items = pd.DataFrame(items_resp.data)
    sold_grouped = sold_items.groupby('product_id')['quantity'].sum().reset_index()
    
    # Merge
    merged = pd.merge(all_products, sold_grouped, on='product_id', how='left')
    merged['quantity'] = merged['quantity'].fillna(0)
    
    # Define dead stock as bottom 10% of sales or 0 sales
    # Simplest: Just items with 0 sales or very low sales relative to stock
    dead_stock_df = merged[merged['quantity'] == 0]
    
    # If not enough zero-sale items, we can include low sales ones
    if len(dead_stock_df) == 0:
        dead_stock_df = merged[merged['quantity'] < merged['quantity'].quantile(0.1)]
        
    return dead_stock_df[['product_id', 'name', 'stock', 'quantity']].to_dict(orient='records')
