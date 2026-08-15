"""
FormalEase backend entrypoint.

FastAPI app wiring: CORS, DB init + seeding, and route registration.
Run with:

    uvicorn app.main:app --reload
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.database import init_db, SessionLocal
from app.seed.seed_data import seed_database
from app.api.routes import health, analysis, schemes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("formalease")

app = FastAPI(
    title="FormalEase API",
    description=(
        "Hackathon prototype backend for PS-12: Informal Economy Tax-Simplicity Advisor. "
        "All tax/compliance/scheme information returned by this API is illustrative and "
        "based on a curated prototype dataset — it must be validated against current "
        "official sources before any real-world use."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Database initialized and seeded (if empty).")
    finally:
        db.close()

    if settings.llm_configured:
        logger.info("LLM extraction enabled (model=%s).", settings.LLM_MODEL)
    else:
        logger.info("No LLM_API_KEY configured — using keyword-based fallback classifier.")


app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(schemes.router)
