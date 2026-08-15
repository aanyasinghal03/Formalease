"""
Rules engine.

This module is the FINAL AUTHORITY on compliance/tax/benefit output —
the LLM is only used upstream (in nlp_service) to extract structured
fields from free text. Everything here is deterministic, driven by the
curated prototype dataset in the database (tax_rules, compliance_rules,
government_schemes).

All monetary "estimates" are explicitly labelled as illustrative and
must never be presented as authoritative tax liability.
"""

from typing import Optional
from sqlalchemy.orm import Session

from app.database.models import TaxRule, ComplianceRule, GovernmentScheme
from app.schemas.business import BusinessProfile

DEFAULT_CATEGORY = "other"
CATEGORY_DISPLAY_NAMES = {
    "food_business": "Food & Beverage",
    "tailoring": "Tailoring & Apparel",
    "retail": "Retail",
    "street_food": "Street Food",
    "handicraft": "Handicrafts / Online Seller",
    "other": "General Small Business",
}

# Very rough illustrative effective-rate table used ONLY to produce a
# ballpark "estimated_obligation" figure for the prototype UI.
# This is NOT a real tax calculation.
_ILLUSTRATIVE_RATE_BY_CATEGORY = {
    "food_business": 0.03,
    "tailoring": 0.025,
    "retail": 0.035,
    "street_food": 0.02,
    "handicraft": 0.03,
    "other": 0.03,
}


def _resolve_annual_revenue(profile: BusinessProfile) -> Optional[float]:
    if profile.annual_revenue:
        return profile.annual_revenue
    if profile.monthly_revenue:
        return profile.monthly_revenue * 12
    return None


def _get_tax_rule(db: Session, category: str) -> Optional[TaxRule]:
    return db.query(TaxRule).filter(TaxRule.category == category).first()


def _get_compliance_rules(db: Session, category: str) -> list[ComplianceRule]:
    return (
        db.query(ComplianceRule)
        .filter(ComplianceRule.category == category)
        .order_by(ComplianceRule.priority.asc())
        .all()
    )


def _get_schemes(db: Session, category: str, limit: int = 5) -> list[GovernmentScheme]:
    schemes = (
        db.query(GovernmentScheme)
        .filter(GovernmentScheme.category == category)
        .limit(limit)
        .all()
    )
    if not schemes:
        # Fall back to a small generic set (e.g. retail/MSME-oriented) so the
        # response is never completely empty for an unrecognized category.
        schemes = db.query(GovernmentScheme).limit(3).all()
    return schemes[:limit]


def _estimate_obligation(category: str, annual_revenue: Optional[float]) -> dict:
    if not annual_revenue:
        return {
            "amount": 0,
            "label": "Illustrative estimate",
            "disclaimer": (
                "No revenue information provided — estimate could not be calculated. "
                "Prototype estimate only, not tax advice."
            ),
        }

    rate = _ILLUSTRATIVE_RATE_BY_CATEGORY.get(category, 0.03)
    amount = round(annual_revenue * rate, 2)
    return {
        "amount": amount,
        "label": "Illustrative estimate",
        "disclaimer": (
            "Based on provided information using a simplified illustrative rate. "
            "This is a prototype estimate only and is not tax advice — actual "
            "obligations depend on many factors and must be confirmed with a "
            "tax professional or official source."
        ),
    }


def _registration_block(tax_rule: Optional[TaxRule]) -> dict:
    if tax_rule and tax_rule.registration_requirement:
        return {
            "status": "Potentially Applicable",
            "explanation": tax_rule.registration_requirement,
        }
    return {
        "status": "Check Applicability",
        "explanation": (
            "No specific registration guidance found for this category in the "
            "prototype dataset. Check applicability with your local authority."
        ),
    }


def _gst_block(tax_rule: Optional[TaxRule], annual_revenue: Optional[float]) -> dict:
    if tax_rule and tax_rule.gst_guidance:
        status = "Check Applicability"
        if annual_revenue and tax_rule.max_turnover and annual_revenue > tax_rule.max_turnover:
            status = "Likely Applicable"
        return {"status": status, "explanation": tax_rule.gst_guidance}
    return {
        "status": "Check Applicability",
        "explanation": "GST guidance not available for this category in the prototype dataset.",
    }


def _income_tax_block(tax_rule: Optional[TaxRule]) -> dict:
    if tax_rule and tax_rule.income_tax_guidance:
        return {
            "status": "Applicable Based on Income",
            "explanation": tax_rule.income_tax_guidance,
        }
    return {
        "status": "Check Applicability",
        "explanation": "Income tax guidance not available for this category in the prototype dataset.",
    }


def _formalization_path(compliance_rules: list[ComplianceRule], schemes: list[GovernmentScheme]) -> list[dict]:
    return [
        {"step": 1, "title": "Business identified", "status": "complete"},
        {
            "step": 2,
            "title": "Registration",
            "status": "recommended" if compliance_rules else "check_required",
        },
        {"step": 3, "title": "Tax compliance", "status": "check_required"},
        {"step": 4, "title": "Benefits", "status": "available" if schemes else "check_required"},
    ]


def _action_plan(compliance_rules: list[ComplianceRule], schemes: list[GovernmentScheme]) -> list[dict]:
    plan = []
    order = 1
    for rule in compliance_rules[:3]:
        plan.append({
            "order": order,
            "action": f"Check applicability of: {rule.requirement}",
            "reason": rule.explanation,
        })
        order += 1

    if schemes:
        plan.append({
            "order": order,
            "action": f"Review potential eligibility for '{schemes[0].name}'",
            "reason": "This scheme may be relevant based on your business category.",
        })
        order += 1

    plan.append({
        "order": order,
        "action": "Consult a local tax professional or official government portal to confirm exact requirements.",
        "reason": "This tool provides illustrative, prototype guidance only.",
    })
    return plan


def analyze_business(db: Session, profile: BusinessProfile) -> dict:
    """
    Main rules-engine entry point.

    Takes the merged structured BusinessProfile and returns the full
    analysis dict matching the documented response shape. This function
    never performs authoritative tax calculations — all numeric output
    is explicitly labelled as illustrative.
    """
    category = (profile.category or DEFAULT_CATEGORY).lower().strip()
    if category not in CATEGORY_DISPLAY_NAMES:
        category = DEFAULT_CATEGORY

    annual_revenue = _resolve_annual_revenue(profile)

    tax_rule = _get_tax_rule(db, category)
    compliance_rules = _get_compliance_rules(db, category)
    schemes = _get_schemes(db, category)

    business_profile_out = {
        "name": profile.business_type or CATEGORY_DISPLAY_NAMES[category],
        "category": CATEGORY_DISPLAY_NAMES[category],
        "location": profile.location,
        "monthly_revenue": profile.monthly_revenue,
        "annual_revenue": annual_revenue,
        "employees": profile.employees,
    }

    benefits_out = [
        {
            "name": s.name,
            "benefit": s.benefit or "",
            "eligibility": s.eligibility,
            "description": s.description,
            "official_url": s.official_url or None,
            "note": (
                "This scheme may be relevant based on the information provided. "
                "Check official eligibility before applying."
            ),
        }
        for s in schemes
    ]

    return {
        "business_profile": business_profile_out,
        "formalization_path": _formalization_path(compliance_rules, schemes),
        "registration": _registration_block(tax_rule),
        "gst": _gst_block(tax_rule, annual_revenue),
        "income_tax": _income_tax_block(tax_rule),
        "estimated_obligation": _estimate_obligation(category, annual_revenue),
        "benefits": benefits_out,
        "action_plan": _action_plan(compliance_rules, schemes),
    }
