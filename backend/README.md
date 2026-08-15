# FormalEase — Backend

## Project

FormalEase is a hackathon prototype backend for **PS-12: Informal Economy
Tax-Simplicity Advisor**. It accepts a natural-language description of a
small/informal business and returns a simplified analysis: classification,
registration/compliance guidance, tax explanation, an illustrative
obligation estimate, relevant government schemes, and a personalized
action plan.

This is **not** a production tax filing system.

## Problem

Owners of small/informal businesses (home bakers, tailors, street food
vendors, retailers, artisans, etc.) often don't know which registrations,
taxes, or government schemes apply to them. FormalEase turns a plain-English
description of their business into a structured, easy-to-understand
breakdown.

## Architecture

```
Frontend (not part of this repo)
   ↓
FastAPI REST API
   ↓
Business Description Processing (Pydantic validation)
   ↓
NLP / LLM Extraction (with keyword-based fallback if no LLM key is set)
   ↓
Structured Business Profile
   ↓
Rules Engine (deterministic — final authority on tax/compliance output)
   ↓
SQLite Database (curated prototype dataset + saved businesses/results)
   ↓
Personalized Analysis JSON
```

The LLM (when configured) is used **only** to extract structured fields
from free text. It never makes the final call on tax/compliance/benefit
logic — that's handled entirely by the deterministic rules engine, driven
by the seeded prototype dataset.

## Tech Stack

* FastAPI
* Python 3.11+
* SQLite
* SQLAlchemy
* Pydantic
* python-dotenv
* httpx (LLM API calls)

## Installation

```bash
python -m venv venv
```

**Activate the virtual environment**

Windows (PowerShell):

```bash
venv\Scripts\Activate.ps1
```

Windows (cmd.exe):

```bash
venv\Scripts\activate.bat
```

macOS / Linux:

```bash
source venv/bin/activate
```

**Install dependencies**

```bash
pip install -r requirements.txt
```

**Configure environment**

```bash
cp .env.example .env
```

Edit `.env` and set `LLM_API_KEY` / `LLM_MODEL` if you want LLM-based
extraction. If left blank, the app automatically uses the keyword-based
fallback classifier — the API works fully without any external AI key.

**Run**

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.
Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`

## API

### `GET /api/health`

Returns:

```json
{ "status": "ok" }
```

### `POST /api/analyze`

Request body:

```json
{
  "description": "I run a small home bakery in Jaipur. I sell cakes through Instagram and make around ₹30,000 per month.",
  "location": "Jaipur, Rajasthan",
  "monthly_revenue": 30000,
  "employees": 2
}
```

`location`, `monthly_revenue`, `annual_revenue`, and `employees` are all
optional — the description alone is enough to get an analysis.

Returns a full analysis: `business_profile`, `formalization_path`,
`registration`, `gst`, `income_tax`, `estimated_obligation`, `benefits`,
`action_plan`, and `analysis_source` (`"llm"` or `"fallback"`).

### `GET /api/schemes`

Optional helper endpoint to browse the seeded government-scheme dataset,
with an optional `?category=` filter (`food_business`, `tailoring`,
`retail`, `street_food`, `handicraft`).

## Disclaimer

**FormalEase is a hackathon prototype.** All tax, registration,
compliance, and government-scheme information is illustrative and drawn
from a small, curated prototype dataset seeded in
`app/seed/seed_data.py`. It is **not** legal or tax advice, is **not**
guaranteed to be current or complete, and **must be validated against
current official sources** (GST portal, Income Tax Department, MSME/Udyam
portal, relevant state government portals, FSSAI, etc.) before any
real-world use.
