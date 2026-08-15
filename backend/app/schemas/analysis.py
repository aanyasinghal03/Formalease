"""
Pydantic schemas describing the shape of the /api/analyze response.
"""

from typing import Optional, List
from pydantic import BaseModel


class BusinessProfileOut(BaseModel):
    name: str
    category: str
    location: Optional[str] = None
    monthly_revenue: Optional[float] = None
    annual_revenue: Optional[float] = None
    employees: Optional[int] = None


class FormalizationStep(BaseModel):
    step: int
    title: str
    status: str  # "complete" | "recommended" | "check_required" | "available"


class GuidanceBlock(BaseModel):
    status: str
    explanation: str


class EstimatedObligation(BaseModel):
    amount: float
    label: str = "Illustrative estimate"
    disclaimer: str = "Prototype estimate only. Not a substitute for professional tax advice."


class SchemeOut(BaseModel):
    name: str
    benefit: str
    eligibility: Optional[str] = None
    description: Optional[str] = None
    official_url: Optional[str] = None
    note: str = (
        "This scheme may be relevant based on the information provided. "
        "Check official eligibility before applying."
    )


class ActionStep(BaseModel):
    order: int
    action: str
    reason: Optional[str] = None


class AnalyzeResponse(BaseModel):
    business_profile: BusinessProfileOut
    formalization_path: List[FormalizationStep]
    registration: GuidanceBlock
    gst: GuidanceBlock
    income_tax: GuidanceBlock
    estimated_obligation: EstimatedObligation
    benefits: List[SchemeOut]
    action_plan: List[ActionStep]
    analysis_source: str
    disclaimer: str = (
        "FormalEase is a hackathon prototype. All tax, compliance, and scheme "
        "information is illustrative and based on a curated prototype dataset. "
        "Verify against current official sources before making real decisions."
    )
