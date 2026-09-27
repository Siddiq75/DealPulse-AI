from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Customer, CustomerCreate
from app.services.memory_service import memory_service

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=List[Customer])
def list_customers():
    """List all managed support customers and active Hindsight memory node count."""
    return memory_service.get_all_customers()

@router.get("/{customer_id}", response_model=Customer)
def get_customer(customer_id: str):
    """Get single customer details by ID."""
    cust = memory_service.get_customer(customer_id)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    return cust

@router.post("", response_model=Customer)
def create_customer(customer_data: CustomerCreate):
    """Create a new customer profile with dedicated Hindsight memory bank."""
    return memory_service.create_customer(customer_data)
