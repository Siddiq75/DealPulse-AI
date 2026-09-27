from fastapi import APIRouter, HTTPException
from app.models.schemas import PitchRequest, PitchResponse, CompareRequest, CompareResponse
from app.services.memory_service import memory_service
from app.services.llm_service import llm_service

router = APIRouter(prefix="/agent", tags=["AI Strategy Agent"])

@router.post("/generate", response_model=PitchResponse)
async def generate_pitch(req: PitchRequest):
    """Generate executive sales pitch strategy with option to leverage Hindsight persistent memory."""
    target_id = req.account_id or req.customer_id
    acc = memory_service.get_account(target_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    
    prompt = req.prompt or req.query or "Draft an executive sales strategy proposal."
    recalled_memories = []
    reflection = {}
    
    if req.use_hindsight:
        recalled_memories = await memory_service.recall_memories(
            account_id=target_id,
            query=prompt,
            top_k=5
        )
        reflection = await memory_service.reflect_on_account(
            account_id=target_id,
            query=prompt
        )
    
    llm_result = await llm_service.generate_pitch(
        account_name=acc["name"],
        prompt=prompt,
        memories=recalled_memories,
        reflection=reflection,
        use_hindsight=req.use_hindsight
    )
    
    p_text = llm_result.get("pitch_text") or llm_result.get("response_text", "")
    
    # Auto-learn & Retain: Store the customer's query & context into Hindsight memory bank for continuous learning
    try:
        interaction_memory = f"Customer '{acc['name']}' asked: '{prompt}'."
        await memory_service.retain_memory(
            customer_id=target_id,
            content=interaction_memory,
            category="observation",
            tags=["auto_learned", "user_query"]
        )
    except Exception as e:
        print(f"Auto-retain background warning: {e}")
    
    # Refresh recalled memories after retain to reflect latest node count
    updated_memories = await memory_service.recall_memories(
        account_id=target_id,
        query=prompt,
        top_k=10
    )
    
    return PitchResponse(
        account_id=target_id,
        account_name=acc["name"],
        customer_id=target_id,
        customer_name=acc["name"],
        prompt=prompt,
        query=prompt,
        pitch_text=p_text,
        response_text=p_text,
        use_hindsight=req.use_hindsight,
        recalled_memories=updated_memories if updated_memories else recalled_memories,
        reflection_synthesis=reflection.get("synthesis", ""),
        key_learned_insights=llm_result.get("key_learned_insights", [])
    )

@router.post("/compare", response_model=CompareResponse)
async def compare_before_after(req: CompareRequest):
    """
    [BEFORE vs AFTER DEMO MATRIX] Generate side-by-side strategy proposals:
    1. WITHOUT MEMORY (Generic SaaS assumptions: multi-tenant cloud, rigid annual seat licensing)
    2. WITH HINDSIGHT MEMORY (Tailored to customer's exact past objections, compliance rules & SLAs)
    """
    target_id = req.account_id or req.customer_id
    acc = memory_service.get_account(target_id)
    if not acc:
        raise HTTPException(status_code=404, detail="Account not found")
    
    prompt = req.prompt or req.query or "Draft an executive sales proposal."
    
    # 1. Pitch Without Hindsight Memory
    without_memory_res = await llm_service.generate_pitch(
        account_name=acc["name"],
        prompt=prompt,
        use_hindsight=False
    )
    
    # 2. Pitch With Hindsight Memory
    recalled_memories = await memory_service.recall_memories(
        account_id=target_id,
        query=prompt,
        top_k=5
    )
    reflection = await memory_service.reflect_on_account(
        account_id=target_id,
        query=prompt
    )
    
    with_memory_res = await llm_service.generate_pitch(
        account_name=acc["name"],
        prompt=prompt,
        memories=recalled_memories,
        reflection=reflection,
        use_hindsight=True
    )
    
    improvements = []
    if recalled_memories:
        for mem in recalled_memories:
            improvements.append(f"Adapted to {mem.get('category', 'observation').upper()}: '{mem.get('content')}'")
    else:
        improvements.append("No specific account memory nodes retained yet.")
        
    without_text = without_memory_res.get("pitch_text") or without_memory_res.get("response_text", "")
    with_text = with_memory_res.get("pitch_text") or with_memory_res.get("response_text", "")

    return CompareResponse(
        account_id=target_id,
        account_name=acc["name"],
        customer_id=target_id,
        customer_name=acc["name"],
        prompt=prompt,
        query=prompt,
        without_memory_pitch=without_text,
        with_memory_pitch=with_text,
        without_memory_response=without_text,
        with_memory_response=with_text,
        recalled_memories=recalled_memories,
        reflection_synthesis=reflection.get("synthesis", ""),
        key_improvements=improvements
    )
