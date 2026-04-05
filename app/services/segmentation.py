import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from app.database import supabase
from datetime import datetime

def perform_customer_segmentation():
    # Fetch orders data
    orders_response = supabase.table('orders').select('customer_id, order_date, total_amount').execute()
    data = orders_response.data
    
    if not data:
        return {"error": "Not enough data for segmentation."}
        
    df = pd.DataFrame(data)
    df['order_date'] = pd.to_datetime(df['order_date']).dt.tz_localize(None)
    
    # Snapshot date for Recency calculation
    snapshot_date = df['order_date'].max() + pd.Timedelta(days=1)
    
    # Calculate RFM metrics
    rfm = df.groupby('customer_id').agg({
        'order_date': lambda x: (snapshot_date - x.max()).days,
        'customer_id': 'count',
        'total_amount': 'sum'
    })
    rfm.rename(columns={'order_date': 'Recency', 'customer_id': 'Frequency', 'total_amount': 'Monetary'}, inplace=True)
    
    # Scale the data
    scaler = StandardScaler()
    scaled_rfm = scaler.fit_transform(rfm)
    
    # KMeans Clustering
    # Choosing K=4 clusters typically represents (Best, Loyal, At Risk, Lost)
    n_clusters = 4
    if len(rfm) < n_clusters:
        n_clusters = len(rfm)
        
    if n_clusters == 0:
        return []
        
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    rfm['Cluster'] = kmeans.fit_predict(scaled_rfm)
    
    # Map clusters to descriptive names based on their characteristics
    # We can calculate the mean for each cluster to interpret them
    cluster_means = rfm.groupby('Cluster').mean()
    # Sort clusters by Monetary and Frequency value to assign logical names
    cluster_ranks = cluster_means['Monetary'].sort_values(ascending=False).index.tolist()
    
    cluster_names = {}
    if len(cluster_ranks) >= 4:
        cluster_names[cluster_ranks[0]] = "High-Value Loyal Customers"
        cluster_names[cluster_ranks[1]] = "Active Potential Customers"
        cluster_names[cluster_ranks[2]] = "At-Risk Customers"
        cluster_names[cluster_ranks[3]] = "Lost/Low-Value Customers"
    else:
        for i, c in enumerate(cluster_ranks):
            cluster_names[c] = f"Segment {i+1}"
            
    rfm['Segment_Name'] = rfm['Cluster'].map(cluster_names)
    rfm = rfm.reset_index()
    
    results = []
    for _, row in rfm.iterrows():
        results.append({
            "customer_id": row['customer_id'],
            "recency_days": int(row['Recency']),
            "frequency": int(row['Frequency']),
            "monetary": round(float(row['Monetary']), 2),
            "segment": row['Segment_Name']
        })
        
    return results
