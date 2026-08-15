"""
Orchestrates the full analysis pipeline for POST /api/analyze:

  1. Validate input (handled by Pydantic schema at the API layer)
  2. Extract structured fields via NLP/LLM service (with fallback)
  3. Merge explicit user-provided fields (priority) with extracted fields
  4. Persist the business + run rules engine
  5. Persist the analysis result
  6. Return a fully-typed AnalyzeResponse
"""

import logging

from sqlalchemy.orm import Session

from app.database.models import Business, AnalysisResult
from app.schemas.business import AnalyzeRequest, BusinessProfile
from app.schemas.analysis import AnalyzeResponse
from app.services import nlp_service, rules_engine

logger = logging.getLogger("formalease.analysis_service")


def _merge_profile(request: AnalyzeRequest, extracted, source: str) -> BusinessProfile:
    """Explicit user-provided fields always take priority over extracted ones."""
    monthly_revenue = request.monthly_revenue if request.monthly_revenue is not None else extracted.monthly_revenue
    annual_revenue = request.annual_revenue if request.annual_revenue is not None else extracted.annual_revenue

    # If the user gave monthly but not annual (or vice versa), derive the other.
    if annual_revenue is None and monthly_revenue is not None:
        annual_revenue = monthly_revenue * 12
    if monthly_revenue is None and annual_revenue is not None:
        monthly_revenue = round(annual_revenue / 12, 2)

    return BusinessProfile(
        description=request.description,
        business_type=extracted.business_type,
        category=extracted.category,
        location=request.location or extracted.location,
        monthly_revenue=monthly_revenue,
        annual_revenue=annual_revenue,
        employees=request.employees if request.employees is not None else extracted.employees,
        online=extracted.online,
        analysis_source=source,
    )


def run_analysis(db: Session, request: AnalyzeRequest) -> AnalyzeResponse:
    # Step 2: NLP/LLM extraction (falls back internally on any failure)
    try:
        extracted, source = nlp_service.extract_business_profile(request.description)
    except Exception as exc:  # belt-and-braces: never let extraction crash the request
        logger.error("Unexpected extraction failure, using empty fallback profile: %s", exc)
        extracted = nlp_service.fallback_extract(request.description)
        source = "fallback"

    # Step 3: merge
    profile = _merge_profile(request, extracted, source)

    # Persist the business record
    business = Business(
        description=profile.description,
        business_type=profile.business_type,
        category=profile.category,
        location=profile.location,
        monthly_revenue=profile.monthly_revenue,
        annual_revenue=profile.annual_revenue,
        employees=profile.employees,
    )
    db.add(business)
    db.commit()
    db.refresh(business)

    # Steps 4-6: rules engine
    result = rules_engine.analyze_business(db, profile)

    # Persist the analysis result
    analysis_record = AnalysisResult(
        business_id=business.id,
        estimated_obligation=result["estimated_obligation"]["amount"],
    )
    db.add(analysis_record)
    db.commit()

    return AnalyzeResponse(
        business_profile=result["business_profile"],
        formalization_path=result["formalization_path"],
        registration=result["registration"],
        gst=result["gst"],
        income_tax=result["income_tax"],
        estimated_obligation=result["estimated_obligation"],
        benefits=result["benefits"],
        action_plan=result["action_plan"],
        analysis_source=source,
    )
