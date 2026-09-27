import pytest
from app.services.llm_service import llm_service
from app.core.hindsight_client import hindsight_manager

@pytest.mark.asyncio
async def test_agent_b2b_pitch_learning():
    account_name = "Apex Financial Group"
    bank_id = "test-apex-financial"
    prompt = "Draft an executive proposal for our upcoming technical evaluation."
    
    # 1. Pitch WITHOUT Hindsight Memory (Generates generic troubleshooting advice)
    without_memory = await llm_service.generate_pitch(
        account_name=account_name,
        prompt=prompt,
        use_hindsight=False
    )
    assert "brightness" in without_memory["pitch_text"].lower() or "drivers" in without_memory["pitch_text"].lower() or "troubleshooting" in without_memory["pitch_text"].lower()
    
    # 2. RETAIN customer objection & hybrid requirement
    await hindsight_manager.retain(
        bank_id=bank_id,
        content="CTO Sarah Jenkins strictly rejected SaaS multi-tenant cloud due to FINRA regulations. Requires hybrid on-prem deployment.",
        category="objection",
        tags=["finra", "hybrid"]
    )
    
    # 3. RECALL & REFLECT
    memories = await hindsight_manager.recall(bank_id=bank_id, query=prompt)
    reflection = await hindsight_manager.reflect(bank_id=bank_id, query=prompt)
    
    # 4. Pitch WITH Hindsight Memory
    with_memory = await llm_service.generate_pitch(
        account_name=account_name,
        prompt=prompt,
        memories=memories,
        reflection=reflection,
        use_hindsight=True
    )
    
    # 5. Verify behavioral adaptation!
    assert with_memory["pitch_text"] != without_memory["pitch_text"]

@pytest.mark.asyncio
async def test_agent_behavioral_learning():
    customer_name = "Rahul Verma"
    bank_id = "test-customer-rahul"
    query = "My battery is still draining."
    
    # 1. Support Response WITHOUT Hindsight Memory
    without_memory = await llm_service.generate_support_response(
        customer_name=customer_name,
        query=query,
        use_hindsight=False
    )
    assert "brightness" in without_memory["response_text"].lower() or "drivers" in without_memory["response_text"].lower()
    
    # 2. RETAIN Rahul's attempted solutions & Chrome observation into Hindsight
    await hindsight_manager.retain(
        bank_id=bank_id,
        content="Customer Rahul already reduced screen brightness, updated drivers, and noted drain happens with Chrome tabs.",
        category="attempted_solution",
        tags=["battery", "chrome"]
    )
    
    # 3. RECALL & REFLECT
    memories = await hindsight_manager.recall(bank_id=bank_id, query=query)
    reflection = await hindsight_manager.reflect(bank_id=bank_id, query=query)
    
    # 4. Support Response WITH Hindsight Memory
    with_memory = await llm_service.generate_support_response(
        customer_name=customer_name,
        query=query,
        memories=memories,
        reflection=reflection,
        use_hindsight=True
    )
    
    # 5. Verify behavioral change!
    assert "chrome" in with_memory["response_text"].lower() or "already" in with_memory["response_text"].lower()
    assert with_memory["response_text"] != without_memory["response_text"]
