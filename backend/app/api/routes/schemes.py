"""
Simple read-only endpoint to browse the seeded government schemes dataset.
Not part of the core analysis pipeline, but useful for the frontend to
show a full scheme directory / for debugging the prototype dataset.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import GovernmentScheme

logger = logging.getLogger("formalease.api.schemes")

router = APIRouter(tags=["schemes"])


@router.get("/api/schemes")
def list_schemes(category: Optional[str] = Query(default=None), db: Session = Depends(get_db)):
    try:
        query = db.query(GovernmentScheme)
        if category:
            query = query.filter(GovernmentScheme.category == category.lower().strip())
        schemes = query.all()

        return {
            "count": len(schemes),
            "schemes": [
                {
                    "name": s.name,
                    "category": s.category,
                    "target_business": s.target_business,
                    "benefit": s.benefit,
                    "eligibility": s.eligibility,
                    "description": s.description,
                    "official_url": s.official_url or None,
                }
                for s in schemes
            ],
        }

    except SQLAlchemyError as exc:
        logger.error("Database error while listing schemes: %s", exc)
        raise HTTPException(status_code=500, detail="A database error occurred.") from exc
