from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import customers, accounts, memory, agent, demo

app = FastAPI(
    title="SupportPulse AI — Hindsight Customer Support Agent",
    description="Customer Support AI Agent Powered by Vectorize Hindsight Persistent Memory (Remember → Recall → Learn → Improve)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware allowing frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(customers.router, prefix=settings.API_V1_STR)
app.include_router(accounts.router, prefix=settings.API_V1_STR)
app.include_router(memory.router, prefix=settings.API_V1_STR)
app.include_router(agent.router, prefix=settings.API_V1_STR)
app.include_router(demo.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "SupportPulse AI",
        "hindsight_system": "active",
        "hindsight_url": settings.HINDSIGHT_API_URL,
        "llm_model": settings.LLM_MODEL,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "memory_engine": "Vectorize Hindsight",
        "llm_engine": "Groq LLM"
    }
