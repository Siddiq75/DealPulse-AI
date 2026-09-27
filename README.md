# DealPulse AI — Autonomous B2B Strategy Agent Powered by Hindsight

> **"Our AI doesn't just respond. It remembers what happened, learns from customer feedback, and becomes more effective over time."**

DealPulse AI is an enterprise sales & account intelligence platform built ground-up around **Hindsight by Vectorize**. It gives AI sales agents long-term, persistent memory across multi-session B2B deal lifecycles, enabling them to **Remember**, **Recall**, **Learn**, and **Improve** based on customer preferences, objections, compliance mandates, and deal outcomes.

---

## 🎯 The Problem

Enterprise B2B deal cycles span 3 to 12 months, involving multiple stakeholders, technical objections, compliance mandates (SOC2, HIPAA, FINRA), and specific pricing preferences. Traditional AI tools forget context between sessions or collapse when conversation windows reset. Sales reps waste hours re-explaining prospect constraints, leading to generic outreach, embarrassing tone-deaf pitches, and lost deals.

## 💡 The Solution

With **Hindsight by Vectorize**, DealPulse AI maintains dedicated **Memory Banks** for every customer account. Every interaction, stakeholder preference, objection, and feedback item is processed via `retain()`. In future sessions, when generating proposals, emails, or negotiation strategies, DealPulse executes `recall()` and `reflect()` to craft context-aware, highly personalized outcomes that avoid past mistakes.

---

## 🧠 Why Hindsight?

Standard vector databases (FAISS, Pinecone) or chat histories are stateless and lack memory structure. Hindsight provides a multi-tier memory system (Facts, Experiences, Preferences, Objections) with:
1. **Targeted Retain (`retain`)**: Indexes natural language facts and categorizes them with metadata and tags.
2. **Hybrid RRF Recall (`recall`)**: Combines semantic embeddings, BM25 keyword matching, and entity graph traversal.
3. **Agentic Reflect (`reflect`)**: Synthesizes high-level deal risks and strategic conclusions over historical account knowledge.

---

## 🔄 The Hindsight Memory Strategy

```
               ┌────────────────────────────────────────┐
               │           B2B Sales Account            │
               └───────────────────┬────────────────────┘
                                   │
                    User Prompt / Proposal Request
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │            HINDSIGHT RECALL            │
               │   (Semantic, BM25, Graph Traversal)    │
               └───────────────────┬────────────────────┘
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │            HINDSIGHT REFLECT           │
               │     (Synthesizes Account Traits &      │
               │        Past Lessons/Outcomes)          │
               └───────────────────┬────────────────────┘
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │             GROQ LLM AGENT             │
               │  Generates Tailored Sales Pitch /      │
               │  Proposal / Strategy / Follow-up       │
               └───────────────────┬────────────────────┘
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │          USER FEEDBACK / OUTCOME       │
               │  (e.g., "CTO rejected seat pricing,    │
               │   mandated hybrid deployment")          │
               └───────────────────┬────────────────────┘
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │            HINDSIGHT RETAIN            │
               │   Stores Facts, Preferences & Objections│
               └────────────────────────────────────────┘
```

### What We Retain
- **Objections**: Rejected pricing models, multi-tenant cloud security concerns, competitor feature gaps.
- **Preferences**: On-prem/hybrid deployment mandates, consumption billing, preferred communication channels.
- **Compliance Mandates**: FINRA, SOC2 Type II, HIPAA BAA requirements, data sovereignty rules.
- **Buying Triggers & Facts**: Fiscal year budget dates, decision maker roles, latency SLAs.

---

## ⚡ BEFORE vs AFTER Demonstration

| Feature | WITHOUT HINDSIGHT MEMORY | WITH HINDSIGHT MEMORY |
| :--- | :--- | :--- |
| **Historical Context** | ❌ Zero memory across sessions | ✅ Retains multi-session account trajectory |
| **Deployment Model** | ❌ Recommends default public cloud SaaS | ✅ Proactively proposes hybrid on-prem deployment |
| **Pricing Model** | ❌ Pushes rigid annual seat subscriptions | ✅ Offers flexible consumption-based pay-as-you-go |
| **Compliance** | ❌ Generic security disclaimers | ✅ Highlights FINRA / SOC2 Type II audit readiness |
| **Latency SLA** | ❌ Unspecified standard web speed | ✅ Specifies sub-15ms high-throughput SLA |

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Glassmorphism UI
* **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic
* **Memory Layer**: **Hindsight by Vectorize** (Hindsight Cloud / Open Source)
* **LLM Engine**: Groq Cloud SDK (`llama-3.3-70b-versatile` / `openai/gpt-oss-120b`)
* **Testing**: Pytest

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp backend/.env.example backend/.env
```

Add your API Keys:
```env
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_key_here
GROQ_API_KEY=your_groq_api_key_here
```
*(Note: Promo code `MEMHACK99` gives $50 free Cloud credits on https://ui.hindsight.vectorize.io)*

### 3. Run Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```
*Backend runs on `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).*

### 4. Run Frontend (React + Vite)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🧪 Running Automated Tests

Run the backend test suite to verify Hindsight retain, recall, reflect operations, and behavioral learning:
```bash
cd backend
pytest ../tests
```

---

## 📊 60-Second Hackathon Demo Guide

1. Open `http://localhost:3000` in your browser.
2. Click **"60s Hackathon Judge Demo"** in the top navigation bar.
3. Click through the 4 guided steps to see DealPulse AI automatically **REMAIN**, **RECALL**, **LEARN**, and **IMPROVE**!

---

## 📄 License
MIT License. Built for the Vectorize Hindsight Hackathon.
