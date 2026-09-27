from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Account, AccountCreate
from app.services.memory_service import memory_service

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.get("", response_model=List[Account])
@router.get("/", response_model=List[Account])
def list_accounts():
    """List all managed customer accounts and their active Hindsight memory count."""
    return memory_service.get_all_accounts()

@router.get("/{account_id}", response_model=Account)
def get_account(account_id: str):
    """Get single account details by ID."""
    acc = memory_service.get_account(account_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    return acc

@router.post("", response_model=Account)
@router.post("/", response_model=Account)
def create_account(account_data: AccountCreate):
    """Create a new customer account with a dedicated Hindsight memory bank."""
    return memory_service.create_account(account_data)
