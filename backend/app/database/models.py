"""
SQLAlchemy ORM models.

NOTE: tax_rules, compliance_rules, and government_schemes are seeded
from app/seed/seed_data.py with a small, CURATED PROTOTYPE DATASET.
This data is illustrative only and must be validated against current
official sources before any real-world use.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, DateTime, Text

from app.database.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    business_type = Column(String, nullable=True)
    category = Column(String, nullable=True, index=True)
    location = Column(String, nullable=True)
    monthly_revenue = Column(Float, nullable=True)
    annual_revenue = Column(Float, nullable=True)
    employees = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class TaxRule(Base):
    """
    Prototype rules dataset.
    NOT universally accurate legal/tax advice — illustrative only.
    """

    __tablename__ = "tax_rules"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    min_turnover = Column(Float, nullable=True)
    max_turnover = Column(Float, nullable=True)
    registration_requirement = Column(Text, nullable=True)
    gst_guidance = Column(Text, nullable=True)
    income_tax_guidance = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)


class ComplianceRule(Base):
    __tablename__ = "compliance_rules"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    requirement = Column(String, nullable=False)
    status = Column(String, nullable=True)  # e.g. "recommended", "check_required"
    explanation = Column(Text, nullable=True)
    priority = Column(Integer, default=3)  # 1 = high, 3 = low


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)
    target_business = Column(String, nullable=True)
    benefit = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    official_url = Column(String, nullable=True)  # may be empty for prototype data


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, nullable=True, index=True)
    estimated_obligation = Column(Float, nullable=True)
    created_at = Column(DateTime, default=utcnow)
