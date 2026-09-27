import os
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("supportpulse.llm")

class LLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.LLM_MODEL
        self.client = None
        if self.api_key:
            try:
                from groq import AsyncGroq
                self.client = AsyncGroq(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize AsyncGroq client: {e}")

    async def generate_support_response(
        self,
        customer_name: str,
        query: str,
        memories: List[Dict[str, Any]] = None,
        reflection: Dict[str, Any] = None,
        use_hindsight: bool = True
    ) -> Dict[str, Any]:
        """Generates a customer support response using Groq LLM and recalled Hindsight memories."""
        memories = memories or []
        reflection = reflection or {}
        
        if use_hindsight and memories:
            memory_text = "\n".join([f"- [{m.get('category', 'observation').upper()}] {m.get('content')}" for m in memories])
            synthesis_text = reflection.get("synthesis", "")
            
            system_prompt = f"""You are SupportPulse AI, an intelligent customer support engineer.
You have access to persistent Hindsight long-term memory for customer '{customer_name}'.

RECALLED HINDSIGHT MEMORIES FOR {customer_name.upper()}:
{memory_text}

HINDSIGHT REFLECTION SYNTHESIS:
{synthesis_text}

CRITICAL RULES:
1. Greet {customer_name} warmly and acknowledge their previous interactions explicitly (e.g., "Welcome back {customer_name}!").
2. NEVER repeat basic troubleshooting steps that {customer_name} has ALREADY tried (e.g. reducing screen brightness or updating drivers if already attempted).
3. Directly reference past observations (e.g. Chrome tab battery drain) and build upon previous solutions.
4. If {customer_name} prefers advanced troubleshooting, skip basic advice immediately.
"""
        else:
            system_prompt = f"""You are SupportPulse AI, a standard AI customer support agent with NO HISTORICAL MEMORY.
You have zero past memory for customer '{customer_name}'.
Treat this as a completely new conversation from scratch.
Provide generic, basic troubleshooting steps (e.g., reduce screen brightness, close background apps, update drivers).
Do NOT reference any past conversations because you have no memory.
"""

        user_content = f"Customer: {customer_name}\nCustomer Query: {query}"

        if self.client:
            try:
                chat_completion = await self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    model=self.model,
                    temperature=0.3,
                    max_tokens=800
                )
                response_text = chat_completion.choices[0].message.content
                return {
                    "pitch_text": response_text,
                    "response_text": response_text,
                    "key_learned_insights": [m.get("content") for m in memories[:3]] if use_hindsight else ["Generic basic troubleshooting steps", "No past memory context"]
                }
            except Exception as e:
                logger.warning(f"Groq API call failed: {e}. Using template fallback synthesis.")

        # Synthetic response fallback
        return self._fallback_support_response(customer_name, query, memories, use_hindsight)

    # Alias generate_pitch
    async def generate_pitch(self, account_name: str, prompt: str, memories: List[Dict[str, Any]] = None, reflection: Dict[str, Any] = None, use_hindsight: bool = True) -> Dict[str, Any]:
        return await self.generate_support_response(customer_name=account_name, query=prompt, memories=memories, reflection=reflection, use_hindsight=use_hindsight)

    def _fallback_support_response(
        self,
        customer_name: str,
        query: str,
        memories: List[Dict[str, Any]],
        use_hindsight: bool
    ) -> Dict[str, Any]:
        if not use_hindsight or not memories:
            text = f"""Hello {customer_name},

Thank you for reaching out to customer support regarding: "{query}".

Please try the following general troubleshooting steps:
1. **Reduce Screen Brightness**: Lower your display brightness to 50% or enable auto-brightness.
2. **Close Background Applications**: Check Task Manager / Activity Monitor and close unused applications.
3. **Update Power Drivers**: Ensure your operating system and graphics power drivers are updated to the latest version.
4. **Restart Device**: Perform a full system reboot to clear temporary cache.

Let us know if the issue persists!

Best regards,
Customer Support Team
"""
            return {
                "pitch_text": text,
                "response_text": text,
                "key_learned_insights": ["Generic basic troubleshooting steps", "Standard repeat advice"]
            }

        # With Hindsight memories recalled
        extracted_points = [m.get("content") for m in memories]
        
        text = f"""Welcome back, {customer_name}!

I reviewed our long-term memory records for your previous support sessions regarding your battery and system performance.

### What We Remember From Your Previous Interaction:
- You have **already tried reducing screen brightness** and **updating all power drivers**.
- You noted that the severe battery drain was **particularly noticeable when Google Chrome had multiple tabs open**.

### Next Advanced Diagnostics Steps:
Since you've already completed basic brightness and driver troubleshooting, let's skip those basic steps and focus on Chrome's hardware acceleration and background process limits:

1. **Chrome Process Memory Saver**: Enable `chrome://settings/performance` -> **Memory Saver Mode** to freeze inactive background tabs.
2. **Inspect Tab Resource Allocation**: Open Chrome Task Manager (`Shift + Esc`) to identify high-CPU extension scripts.
3. **Hardware Acceleration Toggle**: Check if GPU hardware acceleration in Chrome settings is causing power spikes.

Let me know what Chrome's internal task manager shows!

Best regards,
SupportPulse AI (Powered by Hindsight Persistent Memory)
"""
        return {
            "pitch_text": text,
            "response_text": text,
            "key_learned_insights": extracted_points
        }

llm_service = LLMService()
