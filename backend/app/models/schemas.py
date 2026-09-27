from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, model_validator
from datetime import datetime

# Account Schemas for B2B Sales Strategy
class AccountBase(BaseModel):
    name: str
    industry: Optional[str] = "Laptops & Devices"
    stage: Optional[str] = "Technical Review"
    contact_name: Optional[str] = "Verified Contact"
    deal_size: Optional[str] = "$0"
    tier: Optional[str] = "Premium Support"
    email: Optional[str] = "support@example.com"
    device_model: Optional[str] = "ZenBook Ultra 15 Pro"

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    created_at: str
    memory_count: int = 0

# Legacy / Alias Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: str
    device_model: str = "Enterprise Suite"
    tier: str = "Premium Support"

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: str
    created_at: str
    memory_count: int = 0

class MemoryItem(BaseModel):
    id: str
    bank_id: str
    content: str
    category: str = "observation"  # objection, preference, constraint, fact, attempted_solution
    timestamp: str
    tags: List[str] = []
    metadata: Dict[str, Any] = {}

class RetainRequest(BaseModel):
    account_id: Optional[str] = None
    customer_id: Optional[str] = None
    content: str
    category: Optional[str] = "observation"
    tags: Optional[List[str]] = []

    @model_validator(mode='before')
    @classmethod
    def resolve_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            acc_id = data.get('account_id') or data.get('customer_id')
            if acc_id:
                data['account_id'] = acc_id
                data['customer_id'] = acc_id
        return data

class RetainResponse(BaseModel):
    success: bool
    memory_id: str
    bank_id: str
    content: str
    category: str
    timestamp: str
    message: str

class RecallRequest(BaseModel):
    account_id: Optional[str] = None
    customer_id: Optional[str] = None
    query: str
    top_k: Optional[int] = 5

    @model_validator(mode='before')
    @classmethod
    def resolve_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            acc_id = data.get('account_id') or data.get('customer_id')
            if acc_id:
                data['account_id'] = acc_id
                data['customer_id'] = acc_id
        return data

class RecallResult(BaseModel):
    memory_id: str
    content: str
    category: str
    relevance_score: float
    timestamp: str
    tags: List[str] = []

class RecallResponse(BaseModel):
    bank_id: str
    query: str
    memories: List[RecallResult]
    total_found: int

class ReflectRequest(BaseModel):
    account_id: Optional[str] = None
    customer_id: Optional[str] = None
    query: str

    @model_validator(mode='before')
    @classmethod
    def resolve_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            acc_id = data.get('account_id') or data.get('customer_id')
            if acc_id:
                data['account_id'] = acc_id
                data['customer_id'] = acc_id
        return data

class ReflectResponse(BaseModel):
    bank_id: str
    query: str
    synthesis: str
    key_takeaways: List[str] = []
    avoided_mistakes: List[str] = []
    deal_risk_factors: List[str] = []

class PitchRequest(BaseModel):
    account_id: Optional[str] = None
    customer_id: Optional[str] = None
    prompt: Optional[str] = None
    query: Optional[str] = None
    use_hindsight: bool = True

    @model_validator(mode='before')
    @classmethod
    def resolve_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            acc_id = data.get('account_id') or data.get('customer_id')
            pr = data.get('prompt') or data.get('query')
            if acc_id:
                data['account_id'] = acc_id
                data['customer_id'] = acc_id
            if pr:
                data['prompt'] = pr
                data['query'] = pr
        return data

# SupportResponseRequest alias
SupportResponseRequest = PitchRequest

class PitchResponse(BaseModel):
    account_id: str
    account_name: str
    customer_id: str
    customer_name: str
    prompt: str
    query: str
    pitch_text: str
    response_text: str
    use_hindsight: bool
    recalled_memories: List[RecallResult] = []
    reflection_synthesis: Optional[str] = ""
    key_learned_insights: List[str] = []

# SupportResponse alias
SupportResponse = PitchResponse

class CompareRequest(BaseModel):
    account_id: Optional[str] = None
    customer_id: Optional[str] = None
    prompt: Optional[str] = None
    query: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def resolve_ids(cls, data: Any) -> Any:
        if isinstance(data, dict):
            acc_id = data.get('account_id') or data.get('customer_id')
            pr = data.get('prompt') or data.get('query')
            if acc_id:
                data['account_id'] = acc_id
                data['customer_id'] = acc_id
            if pr:
                data['prompt'] = pr
                data['query'] = pr
        return data

class CompareResponse(BaseModel):
    account_id: str
    account_name: str
    customer_id: str
    customer_name: str
    prompt: str
    query: str
    without_memory_pitch: str
    with_memory_pitch: str
    without_memory_response: str
    with_memory_response: str
    recalled_memories: List[RecallResult]
    reflection_synthesis: str
    key_improvements: List[str]

class DemoScenario(BaseModel):
    id: str
    title: str
    description: str
    account_id: str
    customer_id: str
    day1_initial_query: str
    day1_customer_feedback: str
    day2_return_query: str
    day3_new_issue_query: str
