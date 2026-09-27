from fastapi import APIRouter
from typing import List
from app.models.schemas import DemoScenario
from app.services.memory_service import memory_service

router = APIRouter(prefix="/demo", tags=["Guided Hackathon Demo"])

@router.get("/scenarios", response_model=List[DemoScenario])
def get_demo_scenarios():
    """Get pre-configured 60-second hackathon judge demo scenarios."""
    return [
        DemoScenario(
            id="rahul-battery-drain-story",
            title="Rahul Verma: Laptop Battery Drain & Learning Loop",
            description="Demonstrates how Hindsight stops the AI from repeating basic troubleshooting steps (brightness, drivers) after Rahul reports the Chrome tab observation and requests advanced steps.",
            account_id="customer-rahul",
            customer_id="customer-rahul",
            day1_initial_query="My laptop battery is draining very quickly.",
            day1_customer_feedback="I already reduced screen brightness and updated drivers. The battery drain mainly happens when Google Chrome has many tabs open. Don't give me basic steps!",
            day2_return_query="My battery is still draining. What should I do next?",
            day3_new_issue_query="My laptop is overheating."
        )
    ]

@router.post("/reset")
def reset_demo_state():
    """Reset customer memory banks to clean initial state for fresh demo testing."""
    memory_service._seed_rahul_memories()
    return {"status": "success", "message": "Demo customer memory state successfully reset!"}
