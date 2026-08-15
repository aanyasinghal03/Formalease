"""
Pydantic schemas related to the raw request and the structured
business profile that gets extracted from it.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class AnalyzeRequest(BaseModel):
    """Incoming payload for POST /api/analyze."""

    description: str = Field(..., min_length=1, description="Natural-language business description")
    location: Optional[str] = None
    monthly_revenue: Optional[float] = Field(default=None, ge=0)
    annual_revenue: Optional[float] = Field(default=None, ge=0)
    employees: Optional[int] = Field(default=None, ge=0)

    @field_validator("description")
    @classmethod
    def description_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("description must not be empty")
        return v.strip()


class ExtractedProfile(BaseModel):
    """
    What the NLP/LLM service (or the keyword fallback) returns.
    All fields are optional since extraction can partially fail.
    """

    business_type: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    monthly_revenue: Optional[float] = None
    annual_revenue: Optional[float] = None
    employees: Optional[int] = None
    online: Optional[bool] = None


class BusinessProfile(BaseModel):
    """
    The merged structured profile (user-provided fields take priority
    over LLM/fallback-extracted fields) that is passed to the rules engine.
    """

    description: str
    business_type: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    monthly_revenue: Optional[float] = None
    annual_revenue: Optional[float] = None
    employees: Optional[int] = None
    online: Optional[bool] = None
    analysis_source: str = "fallback"  # "llm" or "fallback"
