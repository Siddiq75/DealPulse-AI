from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import RetainRequest, RetainResponse, RecallRequest, RecallResponse, ReflectRequest, ReflectResponse, MemoryItem
from app.services.memory_service import memory_service

router = APIRouter(prefix="/memory", tags=["Hindsight Memory System"])

@router.post("/retain", response_model=RetainResponse)
async def retain_memory(req: RetainRequest):
    """
    [HINDSIGHT RETAIN] Retain new customer account meeting observations, objections, constraints, or preferences into Hindsight bank.
    """
    target_id = req.account_id or req.customer_id
    acc = memory_service.get_account(target_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    
    result = await memory_service.retain_memory(
        account_id=target_id,
        content=req.content,
        category=req.category or "observation",
        tags=req.tags or []
    )
    
    return RetainResponse(
        success=True,
        memory_id=result.get("id", "mem-001"),
        bank_id=target_id,
        content=req.content,
        category=req.category or "observation",
        timestamp=result.get("timestamp", ""),
        message=f"Successfully retained into Hindsight bank '{target_id}'"
    )

@router.post("/recall", response_model=RecallResponse)
async def recall_memory(req: RecallRequest):
    """
    [HINDSIGHT RECALL] Recall relevant historical memories from Hindsight bank via semantic & RRF keyword search.
    """
    target_id = req.account_id or req.customer_id
    acc = memory_service.get_account(target_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    
    results = await memory_service.recall_memories(
        account_id=target_id,
        query=req.query,
        top_k=req.top_k or 5
    )
    
    return RecallResponse(
        bank_id=target_id,
        query=req.query,
        memories=results,
        total_found=len(results)
    )

@router.post("/reflect", response_model=ReflectResponse)
async def reflect_memory(req: ReflectRequest):
    """
    [HINDSIGHT REFLECT] Perform high-level agentic synthesis over stored account memories.
    """
    target_id = req.account_id or req.customer_id
    acc = memory_service.get_account(target_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    
    reflection = await memory_service.reflect_on_account(
        account_id=target_id,
        query=req.query
    )
    
    return ReflectResponse(
        bank_id=target_id,
        query=req.query,
        synthesis=reflection.get("synthesis", ""),
        key_takeaways=reflection.get("key_takeaways", []),
        avoided_mistakes=reflection.get("deal_risk_factors", []),
        deal_risk_factors=reflection.get("deal_risk_factors", [])
    )

@router.get("/bank/{account_id}", response_model=List[MemoryItem])
def get_bank_memories(account_id: str):
    """Get full visual representation of all memory nodes stored in an account's Hindsight bank."""
    return memory_service.get_account_memories(account_id)
