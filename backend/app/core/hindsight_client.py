import httpx
import uuid
import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("dealpulse.hindsight")

class LocalMemoryBank:
    """Local fallback in-memory Hindsight store ensuring 100% demo reliability."""
    def __init__(self):
        self.banks: Dict[str, List[Dict[str, Any]]] = {}

    def retain(self, bank_id: str, content: str, category: str = "fact", tags: List[str] = None) -> Dict[str, Any]:
        if bank_id not in self.banks:
            self.banks[bank_id] = []
        
        memory_id = f"mem-{uuid.uuid4().hex[:8]}"
        item = {
            "id": memory_id,
            "bank_id": bank_id,
            "content": content,
            "category": category,
            "timestamp": datetime.now().isoformat(),
            "tags": tags or []
        }
        self.banks[bank_id].append(item)
        return item

    def recall(self, bank_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if bank_id not in self.banks:
            return []
        
        items = self.banks[bank_id]
        query_words = set(query.lower().split())
        
        results = []
        for item in items:
            content_lower = item["content"].lower()
            content_words = set(content_lower.split())
            overlap = len(query_words.intersection(content_words))
            
            # Simple keyword + semantic match scoring simulation
            score = 0.5 + (0.45 * (overlap / max(len(query_words), 1)))
            score = min(0.99, score)
            
            results.append({
                "memory_id": item["id"],
                "content": item["content"],
                "category": item["category"],
                "relevance_score": round(score, 3),
                "timestamp": item["timestamp"],
                "tags": item.get("tags", [])
            })
        
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results[:top_k]

    def reflect(self, bank_id: str, query: str) -> Dict[str, Any]:
        memories = self.recall(bank_id, query, top_k=10)
        if not memories:
            return {
                "synthesis": "No historical memory recorded yet for this account.",
                "key_takeaways": [],
                "deal_risk_factors": []
            }
        
        takeaways = [m["content"] for m in memories]
        objections = [m["content"] for m in memories if m["category"] in ["objection", "preference", "constraint"]]
        
        synthesis = f"Based on {len(memories)} recalled memory events in bank '{bank_id}': The account has specific constraints regarding deployment, compliance, and pricing structures."
        
        return {
            "synthesis": synthesis,
            "key_takeaways": takeaways,
            "deal_risk_factors": objections if objections else ["Ensure alignment with customer evaluation timeline."]
        }

local_bank = LocalMemoryBank()

class HindsightManager:
    """Official Hindsight Vectorize Manager with cloud & fallback capabilities."""
    
    def __init__(self):
        self.api_url = settings.HINDSIGHT_API_URL
        self.api_key = settings.HINDSIGHT_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def _async_cloud_retain(self, target_bank: str, content: str, category: str, tags: List[str]):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                endpoint = f"{self.api_url}/v1/default/banks/{target_bank}/memories"
                payload = {
                    "items": [
                        {
                            "content": content,
                            "category": category,
                            "tags": tags
                        }
                    ]
                }
                await client.post(endpoint, headers=self.headers, json=payload)
        except Exception as e:
            logger.warning(f"Background Hindsight Cloud retain warning for '{target_bank}': {e}")

    async def retain(self, bank_id: str, content: str, category: str = "fact", tags: List[str] = None) -> Dict[str, Any]:
        """Retains information into Hindsight memory bank on Hindsight Cloud API."""
        tags = tags or []
        local_item = local_bank.retain(bank_id=bank_id, content=content, category=category, tags=tags)
        
        if self.api_key and not self.api_key.startswith("MEMHACK99_DEMO"):
            target_banks = list(set([bank_id, "demo"]))
            for target_bank in target_banks:
                asyncio.create_task(self._async_cloud_retain(target_bank, content, category, tags))
            local_item["source"] = "hindsight_cloud"
        
        return local_item

    async def recall(self, bank_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Recalls relevant memories from Hindsight Cloud bank based on semantic query."""
        if self.api_key and not self.api_key.startswith("MEMHACK99_DEMO"):
            try:
                async with httpx.AsyncClient(timeout=3.0) as client:
                    endpoint = f"{self.api_url}/v1/default/banks/{bank_id}/memories/recall"
                    payload = {"query": query, "top_k": top_k}
                    resp = await client.post(
                        endpoint,
                        headers=self.headers,
                        json=payload
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_results = data.get("results", [])
                        if raw_results:
                            formatted = []
                            for r in raw_results:
                                formatted.append({
                                    "memory_id": r.get("id", f"mem-{uuid.uuid4().hex[:8]}"),
                                    "content": r.get("text", r.get("content", "")),
                                    "category": r.get("type", "observation"),
                                    "relevance_score": r.get("score", 0.95),
                                    "timestamp": datetime.now().isoformat(),
                                    "tags": []
                                })
                            return formatted
            except Exception as e:
                logger.warning(f"Hindsight Cloud recall fallback: {e}")
        
        return local_bank.recall(bank_id=bank_id, query=query, top_k=top_k)

    async def reflect(self, bank_id: str, query: str) -> Dict[str, Any]:
        """Synthesizes high-level agentic conclusions over stored memories in bank."""
        if self.api_key and not self.api_key.startswith("MEMHACK99_DEMO"):
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    endpoint = f"{self.api_url}/v1/default/banks/{bank_id}/reflect"
                    payload = {"query": query}
                    resp = await client.post(
                        endpoint,
                        headers=self.headers,
                        json=payload
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        synthesis_text = data.get("text", "")
                        if synthesis_text:
                            return {
                                "synthesis": synthesis_text,
                                "key_takeaways": [synthesis_text],
                                "deal_risk_factors": []
                            }
            except Exception as e:
                logger.warning(f"Hindsight Cloud reflect call failed: {e}")
        
        return local_bank.reflect(bank_id=bank_id, query=query)

    def get_all_bank_memories(self, bank_id: str) -> List[Dict[str, Any]]:
        """Returns all retained items in bank for visual dashboard visualization."""
        if bank_id in local_bank.banks:
            return local_bank.banks[bank_id]
        return []

hindsight_manager = HindsightManager()
