"""
NLP / LLM extraction service.

Responsible ONLY for turning a free-text business description into a
structured profile (business_type, category, location, revenue, etc).
It is NOT responsible for any tax/compliance decision-making — that
is handled entirely by the rules engine.

If no LLM_API_KEY is configured, or the LLM call fails for any reason,
this service falls back to a simple keyword-based classifier so the
prototype keeps working end-to-end without an external AI API.
"""

import json
import logging
import re
from typing import Optional

import httpx

from app.core.config import settings
from app.schemas.business import ExtractedProfile

logger = logging.getLogger("formalease.nlp_service")

EXTRACTION_SYSTEM_PROMPT = """You are a data-extraction assistant for a small-business tax-simplicity tool.
Given a free-text description of a small/informal business, extract structured
information and respond with ONLY a single JSON object — no prose, no markdown
fences, no explanation. Use this exact schema:

{
  "business_type": string or null,
  "category": one of ["food_business", "tailoring", "retail", "street_food", "handicraft", "other"] or null,
  "location": string or null,
  "monthly_revenue": number or null,
  "annual_revenue": number or null,
  "employees": integer or null,
  "online": boolean or null
}

Rules:
- If a value is not mentioned or cannot be confidently inferred, use null.
- monthly_revenue and annual_revenue should be plain numbers (no currency symbols).
- If only one of monthly/annual revenue is stated, still leave the other as null;
  the caller will derive it.
- Respond with ONLY the JSON object.
"""

# --- Keyword fallback classifier -------------------------------------------------

_KEYWORD_MAP = {
    "food_business": ["bakery", "cake", "cakes", "cookie", "cookies", "bakes", "baking", "sweets", "confectionery"],
    "tailoring": ["tailoring", "tailor", "stitching", "stitch", "clothes", "boutique", "blouse", "alteration"],
    "retail": ["shop", "store", "retail", "kirana", "grocery", "supermarket"],
    "street_food": ["stall", "street food", "chaat", "cart", "vendor", "thela"],
    "handicraft": ["handmade", "craft", "crafts", "handicraft", "jewellery", "jewelry", "pottery", "weaving", "embroidery"],
}

_REVENUE_PATTERN = re.compile(
    r"(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|l)?\s*(?:per\s*month|/month|monthly|a month)?",
    re.IGNORECASE,
)

_EMPLOYEE_PATTERN = re.compile(
    r"(\d+)\s*(?:employees|staff|workers|people|helpers)",
    re.IGNORECASE,
)


def _keyword_classify(description: str) -> Optional[str]:
    text = description.lower()
    for category, keywords in _KEYWORD_MAP.items():
        for kw in keywords:
            if kw in text:
                return category
    return None


def _extract_revenue(description: str) -> Optional[float]:
    match = _REVENUE_PATTERN.search(description)
    if not match:
        return None
    number_str, unit = match.group(1), (match.group(2) or "").lower()
    try:
        number = float(number_str.replace(",", ""))
    except ValueError:
        return None
    if unit in ("k", "thousand"):
        number *= 1_000
    elif unit in ("l", "lakh", "lakhs"):
        number *= 100_000
    return number


def _extract_employees(description: str) -> Optional[int]:
    match = _EMPLOYEE_PATTERN.search(description)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None
    return None


def fallback_extract(description: str) -> ExtractedProfile:
    """Simple, dependency-free keyword classifier used when no LLM is available."""
    category = _keyword_classify(description)
    monthly_revenue = _extract_revenue(description)
    employees = _extract_employees(description)
    online = None
    lowered = description.lower()
    if any(word in lowered for word in ["instagram", "whatsapp", "online", "facebook", "website", "e-commerce", "ecommerce"]):
        online = True

    return ExtractedProfile(
        business_type=category.replace("_", " ").title() if category else None,
        category=category or "other",
        location=None,
        monthly_revenue=monthly_revenue,
        annual_revenue=(monthly_revenue * 12) if monthly_revenue else None,
        employees=employees,
        online=online,
    )


# --- LLM extraction -----------------------------------------------------------------

def _call_llm(description: str) -> Optional[dict]:
    """
    Calls the configured LLM API (Anthropic Messages API by default) and
    asks it to return structured JSON. Returns a parsed dict, or None on
    any failure (network error, bad JSON, timeout, etc.) so the caller
    can fall back gracefully.
    """
    if not settings.llm_configured:
        return None

    headers = {
        "Content-Type": "application/json",
        "x-api-key": settings.LLM_API_KEY,
        "anthropic-version": "2023-06-01",
    }
    payload = {
        "model": settings.LLM_MODEL,
        "max_tokens": 500,
        "system": EXTRACTION_SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": description}],
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(settings.LLM_API_BASE_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

        text_parts = [
            block.get("text", "")
            for block in data.get("content", [])
            if block.get("type") == "text"
        ]
        raw_text = "".join(text_parts).strip()

        # Strip markdown code fences if the model added them despite instructions.
        raw_text = re.sub(r"^```(?:json)?", "", raw_text.strip())
        raw_text = re.sub(r"```$", "", raw_text.strip()).strip()

        return json.loads(raw_text)

    except (httpx.HTTPError, json.JSONDecodeError, KeyError, ValueError) as exc:
        logger.warning("LLM extraction failed, falling back to keyword classifier: %s", exc)
        return None


def extract_business_profile(description: str) -> tuple[ExtractedProfile, str]:
    """
    Main entry point. Returns (extracted_profile, source) where source
    is "llm" or "fallback".
    """
    llm_result = _call_llm(description)

    if llm_result is not None:
        try:
            profile = ExtractedProfile(**llm_result)
            return profile, "llm"
        except Exception as exc:  # malformed LLM response -> fallback
            logger.warning("LLM returned malformed structure, falling back: %s", exc)

    return fallback_extract(description), "fallback"
