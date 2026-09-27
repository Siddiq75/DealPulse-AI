import pytest
import asyncio
from app.core.hindsight_client import hindsight_manager, local_bank

@pytest.mark.asyncio
async def test_hindsight_retain_and_recall():
    bank_id = "test-bank-fintech"
    content = "Client requires ISO-27001 certification and strictly forbids offshore data centers."
    category = "constraint"
    tags = ["security", "iso27001"]
    
    # 1. Retain
    retain_res = await hindsight_manager.retain(bank_id=bank_id, content=content, category=category, tags=tags)
    assert retain_res is not None
    assert retain_res["bank_id"] == bank_id
    assert retain_res["content"] == content
    
    # 2. Recall
    recalled = await hindsight_manager.recall(bank_id=bank_id, query="What security certification does client need?", top_k=3)
    assert len(recalled) > 0
    assert "ISO-27001" in recalled[0]["content"]

@pytest.mark.asyncio
async def test_hindsight_reflect():
    bank_id = "test-bank-fintech"
    reflection = await hindsight_manager.reflect(bank_id=bank_id, query="Summarize key deal constraints")
    assert reflection is not None
    assert "synthesis" in reflection
    assert "key_takeaways" in reflection
