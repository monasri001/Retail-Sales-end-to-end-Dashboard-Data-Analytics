# Smart Retail Analytics System: Frontend Integration Guide

This document provides a complete technical breakdown of the Backend Architecture and Database Schema for the Smart Retail Analytics System. It is designed to act as your blueprint when creating the frontend.

## 🗄️ 1. Database Schema (Supabase PostgreSQL)
Your frontend will read data driven by this schema. Though the FastAPI acts as the middleman, understanding these relationships ensures you know what data points to visualize.

| Table Name     | Columns & Types                                                                                       | Description & Relationships                                                                 |
|----------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **customers**  | `customer_id` (UUID - PK)<br>`name` (Text)<br>`location` (Text)<br>`signup_date` (Date)               | Core user information. Linked to `orders`.                                                  |
| **products**   | `product_id` (UUID - PK)<br>`name` (Text)<br>`category` (Text)<br>`price` (Float)<br>`stock` (Int)    | Inventory tracking. Categories include: Electronics, Clothing, Grocery, Home, Beauty.       |
| **orders**     | `order_id` (UUID - PK)<br>`customer_id` (UUID - FK)<br>`order_date` (Timestamp)<br>`total_amount` (Float)<br>`discount` (Float) | Financial transaction header. Belongs to 1 `customer_id`.                               |
| **order_items**| `id` (UUID - PK)<br>`order_id` (UUID - FK)<br>`product_id` (UUID - FK)<br>`quantity` (Int)             | Line items for each order. Connects `orders` and `products`.                                |

---

## 🔌 2. API Endpoints Map (FastAPI)

The backend server is globally mounted at: **`http://127.0.0.1:8000`**. You will use this as your basic `FETCH` or `Axios` base URL. 

### A. Sales Domain (`/sales`)
Ideal for: **Dashboard Top-Level Metrics & Charts**

*   `GET /sales/summary`
    *   **Description**: Fetch the top-level KPIs.
    *   **Returns**: 
        ```json
        {
          "total_revenue": 145030.50,
          "total_orders": 10000,
          "avg_order_value": 14.50
        }
        ```
*   `GET /sales/trends?period={period}`
    *   **Parameters**: `period` (string) -> `"daily"`, `"weekly"`, or `"monthly"` (defaults to `"daily"`).
    *   **Description**: Perfect for plotting an Area or Line Chart indicating revenue growth over time.
    *   **Returns**: Array of objects: `[{"date": "2024-03-24", "revenue": 1500.00}, ...]`

### B. Products Domain (`/products`)
Ideal for: **Inventory Tables and Top-Selling Lists**

*   `GET /products/top`
    *   **Description**: Get the Top 10 products sorted by highest historic volume moved.
    *   **Returns**: Array of objects: `[{"product_id": "...", "name": "TV", "category": "Electronics", "total_quantity_sold": 340}, ...]`
*   `GET /products/dead-stock`
    *   **Description**: Identifies products that have 0 sales or sit in the bottom 10% of historic movement vs their given inventory stock limit.
    *   **Returns**: Array of objects: `[{"product_id": "...", "name": "Ugly Sweater", "stock": 500, "quantity": 0}, ...]`

### C. Customers Domain (`/customers`)
Ideal for: **Customer Profiles, Churn Management, targeted CRM features**

*   `GET /customers/segments`
    *   **Description**: Triggers a backend Machine Learning algorithm (RFM + K-Means Clustering) to dynamically segment users into 4 categories.
    *   **Clusters Generated**: "High-Value Loyal Customers", "Active Potential Customers", "At-Risk Customers", "Lost/Low-Value Customers".
    *   **Returns**: Array of objects: `[{"customer_id": "...", "recency_days": 14, "frequency": 5, "monetary": 350.50, "segment": "High-Value Loyal Customers"}, ...]`

### D. Analytics, ML & Alerts Domain (`/`)
Ideal for: **The "Smart Insights" section, Notifications Center, and External Exports**

*   `GET /forecast`
    *   **Description**: Runs Facebook Prophet on historical sales data to predict revenue for the next 30 days. Perfect for a dashed-line forward projection chart.
    *   **Returns**: 
        ```json
        {
          "forecast_next_30_days": [
            {"date": "2024-04-01", "predicted_amount": 1050.20, "lower_bound": 900.50, "upper_bound": 1200.00}
          ]
        }
        ```
*   `GET /alerts`
    *   **Description**: Scans tables for triggering thresholds. Use this to render a "Notification Bell" or Alert banner.
    *   **Returns**: 
        ```json
        [
          {"type": "LOW_STOCK", "message": "Low stock alert: Generic Phone only has 50 units left."},
          {"type": "SALES_DROP", "message": "Revenue Alert: Revenue dropped 12.5% compared to the previous 7 days."}
        ]
        ```
*   `GET /ai-insights`
    *   **Description**: Runs heuristic comparisons to generate human-readable text strings for users. E.g "Product X is trending upwards".
    *   **Returns**: `[{"insight": "Revenue dropped 12.0% compared to last week."}, ...]`
*   `GET /export`
    *   **Description**: Direct CSV stream of the latest 1000 orders.
    *   **Frontend Usage**: Call via a simple `<a href="http://127.0.0.1:8000/export" download>` anchor tag or window.open to force a file download instantly.

---

## 🛠️ Suggestions for the Frontend Stack (React/Next.js)

If you are using React / Next.js to build this UI out:
1. **API Client**: `axios` or standard `fetch()` is fine. Use `SWR` or `React Query` for `/alerts` and `/sales/summary` to keep them refreshed natively.
2. **Charts**: Use `Recharts` or `Chart.js`. 
   - Use `recharts` `<LineChart>` for `/forecast` (Mapping `predicted_amount`, `lower_bound`, `upper_bound`).
   - Use `recharts` `<BarChart>` for `/sales/trends?period=monthly`.
3. **Data Grid**: For the `/customers/segments` route, a data table with filtering/sorting capabilities (like `TanStack Table` or `MUI DataGrid`) works beautifully to sort churn statuses.
