import uuid
import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.hindsight_client import hindsight_manager, local_bank
from app.models.schemas import CustomerCreate, AccountCreate

logger = logging.getLogger("supportpulse.memory_service")

class MemoryService:
    def __init__(self):
        # Support Customers (starts fresh with 0 default customers)
        self.customers: Dict[str, Dict[str, Any]] = {}
        # Accounts alias dictionary
        self.accounts = self.customers

    def _seed_rahul_memories(self):
        pass

    def _seed_rahul_memories(self):
        """Seed Hindsight memory bank with Rahul's real-life support observations."""
        rahul_memories = [
            ("Customer Rahul already tried reducing screen brightness for battery drain.", "attempted_solution", ["battery", "brightness"]),
            ("Customer Rahul already updated all power management & graphics drivers.", "attempted_solution", ["drivers", "battery"]),
            ("Customer observed battery drain occurs primarily when Google Chrome has multiple tabs open.", "observation", ["chrome", "battery"]),
            ("Customer explicitly requested: 'Don't give me basic troubleshooting steps, I have already tried them.'", "preference", ["communication", "advanced_only"])
        ]
        
        for content, category, tags in rahul_memories:
            for bank_id in ["customer-rahul", "test-customer-rahul", "apex-financial"]:
                local_bank.retain(bank_id, content, category, tags)

    def get_all_customers(self) -> List[Dict[str, Any]]:
        result = []
        for cust_id, cust in self.customers.items():
            memories = hindsight_manager.get_all_bank_memories(cust_id)
            cust_copy = dict(cust)
            cust_copy["memory_count"] = len(memories)
            result.append(cust_copy)
        return result

    def get_customer(self, customer_id: str) -> Optional[Dict[str, Any]]:
        cust = self.customers.get(customer_id)
        if not cust and customer_id == "apex-financial":
            cust = self.customers.get("customer-rahul")
        if cust:
            cust_copy = dict(cust)
            memories = hindsight_manager.get_all_bank_memories(customer_id)
            cust_copy["memory_count"] = len(memories)
            return cust_copy
        return None

    def create_customer(self, data: CustomerCreate) -> Dict[str, Any]:
        slug = data.name.lower().split()[0] if data.name else "user"
        cust_id = f"customer-{slug}-{uuid.uuid4().hex[:4]}"
        customer = {
            "id": cust_id,
            "name": data.name,
            "email": data.email or f"{slug}@example.com",
            "device_model": data.device_model or "Laptop Pro",
            "tier": data.tier or "Standard Support",
            "created_at": datetime.now().isoformat(),
            "memory_count": 0
        }
        self.customers[cust_id] = customer
        return customer

    # Account aliases for backward compatibility
    def get_all_accounts(self) -> List[Dict[str, Any]]:
        return self.get_all_customers()

    def get_account(self, account_id: str) -> Optional[Dict[str, Any]]:
        return self.get_customer(account_id)

    def create_account(self, data: AccountCreate) -> Dict[str, Any]:
        cust_create = CustomerCreate(name=data.name, email="support@example.com", device_model=data.industry, tier=data.tier)
        return self.create_customer(cust_create)

    async def retain_memory(self, customer_id: str = None, account_id: str = None, content: str = "", category: str = "observation", tags: List[str] = None) -> Dict[str, Any]:
        target_id = customer_id or account_id
        return await hindsight_manager.retain(bank_id=target_id, content=content, category=category, tags=tags)

    async def recall_memories(self, customer_id: str = None, account_id: str = None, query: str = "", top_k: int = 5) -> List[Dict[str, Any]]:
        target_id = customer_id or account_id
        return await hindsight_manager.recall(bank_id=target_id, query=query, top_k=top_k)

    async def reflect_on_customer(self, customer_id: str = None, account_id: str = None, query: str = "") -> Dict[str, Any]:
        target_id = customer_id or account_id
        return await hindsight_manager.reflect(bank_id=target_id, query=query)

    async def reflect_on_account(self, account_id: str = None, customer_id: str = None, query: str = "") -> Dict[str, Any]:
        target_id = account_id or customer_id
        return await self.reflect_on_customer(customer_id=target_id, query=query)

    def get_customer_memories(self, customer_id: str) -> List[Dict[str, Any]]:
        return hindsight_manager.get_all_bank_memories(customer_id)

    def get_account_memories(self, account_id: str) -> List[Dict[str, Any]]:
        return self.get_customer_memories(account_id)

memory_service = MemoryService()
