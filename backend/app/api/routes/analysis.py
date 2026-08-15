import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.business import AnalyzeRequest
from app.schemas.analysis import AnalyzeResponse
from app.services.analysis_service import run_analysis

logger = logging.getLogger("formalease.api.analysis")

router = APIRouter(tags=["analysis"])


@router.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest, db: Session = Depends(get_db)):
    try:
        return run_analysis(db, request)

    except ValidationError as exc:
        logger.warning("Validation error during analysis: %s", exc)
        raise HTTPException(status_code=422, detail="Invalid input data.") from exc

    except SQLAlchemyError as exc:
        logger.error("Database error during analysis: %s", exc)
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="A database error occurred while processing the analysis.",
        ) from exc

    except Exception as exc:  # noqa: BLE001 - final safety net, never leak internals
        logger.exception("Unexpected error during analysis")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the analysis.",
        ) from exc
