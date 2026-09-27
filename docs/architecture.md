# DealPulse AI — System Architecture Specification

DealPulse AI is designed around a decoupled, highly responsive architecture separating UI presentation, agentic logic, memory persistence, and foundational model generation.

```
                    ┌─────────────────────────────────────────┐
                    │               USER / REP                │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │      React 18 + Vite Web Frontend       │
                    │   (Glassmorphic UI, Visual Memory       │
                    │      Dashboard, Before/After Diff)      │
                    └────────────────────┬────────────────────┘
                                         │  REST / HTTP JSON
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │            FastAPI Backend              │
                    │  (/api/v1/accounts, /memory, /agent)    │
                    └──────────┬───────────────────┬──────────┘
                               │                   │
                               ▼                   ▼
                    ┌─────────────────┐     ┌──────────────┐
                    │ GROQ LLM AGENT  │     │ HINDSIGHT SDK│
                    │ (Llama 3.3 70B) │     │ (Vectorize)  │
                    └─────────────────┘     └──────┬───────┘
                                                   │
                                      ┌────────────┴────────────┐
                                      │                         │
                                      ▼                         ▼
                             ┌─────────────────┐       ┌─────────────────┐
                             │ HINDSIGHT CLOUD │       │ HINDSIGHT LOCAL │
                             │  (api.hindsight)│       │  FALLBACK STORE │
                             └─────────────────┘       └─────────────────┘
```

## Core Architectural Components

### 1. Web Presentation Layer (`frontend/`)
* **Framework**: React 18 with Vite bundling.
* **Styling**: Tailwind CSS design system with custom glassmorphic styling tokens, Outfit & Inter typography, and micro-animations.
* **Key Visualizers**:
  * **Hindsight Memory Inspector**: Real-time memory bank node visualizer with category filtering (`Fact`, `Objection`, `Preference`, `Constraint`).
  * **Interactive Recall Query Tool**: Allows testing semantic search and confidence scoring against Hindsight memory banks.
  * **Before vs After Diff Matrix**: Renders a side-by-side behavioral comparison showing output without memory vs output with Hindsight.
  * **60-Second Hackathon Judge Walkthrough**: Automated 4-step interactive guided demo.

### 2. Backend API Orchestrator (`backend/app/`)
* **Framework**: FastAPI (Asynchronous Python 3.10+).
* **Endpoints**:
  * `POST /api/v1/memory/retain`: Retains facts, objections, and preferences into target bank.
  * `POST /api/v1/memory/recall`: Performs hybrid semantic/BM25 recall across bank memories.
  * `POST /api/v1/memory/reflect`: Generates agentic synthesis and deal risk analysis over retained memories.
  * `POST /api/v1/agent/generate`: Generates tailored pitch/proposal using recalled Hindsight memory context.
  * `POST /api/v1/agent/compare`: Generates side-by-side pitch matrix (Without Memory vs With Hindsight Memory).

### 3. Hindsight Memory Subsystem (`app/core/hindsight_client.py`)
* **Primary**: Direct connection to Hindsight Cloud / REST endpoints using `hindsight-client` and `httpx`.
* **Bank Isolation**: Each customer account operates in an isolated memory bank (`bank_id`), preventing cross-tenant leakage.
* **Fallback Safety**: Includes embedded local memory bank fallback to guarantee 100% demo reliability under offline or unconfigured API key environments.

### 4. LLM Generation Engine (`app/services/llm_service.py`)
* **Provider**: Groq Cloud SDK (`AsyncGroq`).
* **Models**: `llama-3.3-70b-versatile` or `openai/gpt-oss-120b`.
* **Prompt Orchestration**: Injects recalled memory nodes and reflection summaries directly into the LLM system prompt context, mandating strict compliance with past customer constraints.
