from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sales, products, customers, analytics

app = FastAPI(
    title="Smart Retail Analytics System API",
    description="Backend for tracking sales, customers, products, running ML models, and AI insights.",
    version="1.0.0"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(sales.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Retail Analytics System API"}
