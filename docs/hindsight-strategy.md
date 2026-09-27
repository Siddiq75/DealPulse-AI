# DealPulse AI — Hindsight Memory Strategy Specification

## Overview

Hindsight by Vectorize is the mandatory persistent memory system powering DealPulse AI. Rather than treating AI interactions as stateless chats, Hindsight allows our AI sales strategy agent to **Remember**, **Recall**, **Learn**, and **Improve** across multi-session enterprise deal cycles.

---

## The Hindsight 4-Step Loop

```
REMEMBER (Retain)  ──►  RECALL (Hybrid Search)  ──►  LEARN (Reflect Synthesis)  ──►  IMPROVE (Context-Aware Action)
```

### 1. RETAIN — What & When We Remember
We selectively store information that possesses high future value for account strategy.

* **Retained Memory Types**:
  * **Objections**: Rejected pricing models, multi-tenant cloud security concerns, competitor feature gaps.
  * **Preferences**: On-prem/hybrid deployment mandates, consumption billing, preferred communication channels.
  * **Compliance Mandates**: FINRA, SOC2 Type II, HIPAA BAA requirements, data sovereignty rules.
  * **Buying Triggers & Facts**: Budget cycles, decision maker roles, evaluation deadlines.
* **Retention Events**:
  * Immediately upon rep logging meeting feedback or transcript notes.
  * When a prospect rejects a specific proposal option.

### 2. RECALL — When & How We Retrieve
Before the AI sales agent performs any generation or strategy task:

* **Execution**: Calls `hindsight.recall(bank_id=account_id, query=task_prompt, top_k=5)`.
* **Hybrid Search Engine**: Uses Reciprocal Rank Fusion (RRF) combining semantic embeddings, BM25 keyword matching, and entity graph traversal.
* **Precision Filtering**: Retrieves only high-relevance memories relevant to the specific user query.

### 3. REFLECT — High-Level Agentic Synthesis
Unlike raw text matching, Hindsight `reflect()` performs agentic reasoning over all retained account memories:

* **Execution**: Calls `hindsight.reflect(bank_id=account_id, query="Summarize deal risks and key constraints")`.
* **Output**: Returns a synthesized summary of account trajectory, key takeaways, and explicit risk factors.

### 4. IMPROVE — Behavioral Adaptation
Recalled memories and reflection summaries are formatted and injected into the LLM system context.
The agent is explicitly instructed to:
1. Satisfy all recalled compliance & deployment constraints.
2. Avoid any pricing or architectural options previously rejected by the prospect.
3. Highlight specific features addressing past customer pain points.
