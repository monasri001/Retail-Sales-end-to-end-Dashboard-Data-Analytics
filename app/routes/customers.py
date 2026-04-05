from fastapi import APIRouter
from app.services.segmentation import perform_customer_segmentation

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/segments")
def get_customer_segments():
    """
    Returns RFM segmentation and K-Means clustering output for customers.
    """
    return perform_customer_segmentation()
