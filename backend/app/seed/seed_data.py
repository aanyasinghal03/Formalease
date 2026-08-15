"""
Seed data for FormalEase.

*** IMPORTANT ***
This is a small, CURATED PROTOTYPE DATASET built for a hackathon demo.
Turnover thresholds, guidance text, and scheme details are illustrative
approximations of general small-business/informal-economy patterns in
India. They are NOT guaranteed to be current, complete, or legally
accurate, and MUST be validated against official government sources
(e.g. GST portal, Income Tax Department, MSME / Udyam portal, state
government scheme portals) before any real-world use.

Categories covered: food_business, tailoring, retail, street_food, handicraft
"""

from sqlalchemy.orm import Session

from app.database.models import TaxRule, ComplianceRule, GovernmentScheme

CATEGORIES = ["food_business", "tailoring", "retail", "street_food", "handicraft"]

CATEGORY_LABELS = {
    "food_business": "Food & Beverage (Home Bakery / Food Business)",
    "tailoring": "Tailoring & Apparel",
    "retail": "Retail",
    "street_food": "Street Food",
    "handicraft": "Handicrafts / Online Seller",
}

TAX_RULES = [
    dict(
        category="food_business",
        min_turnover=0,
        max_turnover=4_000_00 * 1,  # ~4 lakh illustrative micro threshold
        registration_requirement=(
            "Consider FSSAI basic registration for small food businesses, and a local "
            "municipal trade license if operating from a fixed premises. Udyam/MSME "
            "registration is optional but often beneficial."
        ),
        gst_guidance=(
            "GST registration is typically not mandatory below the small-business "
            "turnover threshold, but check applicability if selling through e-commerce "
            "platforms, as some platforms require GST registration regardless of turnover."
        ),
        income_tax_guidance=(
            "Income from the business is generally taxable under normal income tax slabs. "
            "Presumptive taxation schemes may simplify bookkeeping for small businesses."
        ),
        notes="Illustrative only — verify FSSAI and GST e-commerce rules before applying.",
    ),
    dict(
        category="tailoring",
        min_turnover=0,
        max_turnover=20_00_000,
        registration_requirement=(
            "Udyam/MSME registration is recommended for access to micro-enterprise "
            "benefits. A local shop & establishment registration may apply if operating "
            "from a fixed shop."
        ),
        gst_guidance=(
            "GST registration is generally required only after crossing the applicable "
            "turnover threshold for goods/services; check the current threshold for your state."
        ),
        income_tax_guidance=(
            "Presumptive taxation (turnover-based) may simplify tax filing for small "
            "tailoring businesses with modest annual turnover."
        ),
        notes="Illustrative only — thresholds vary by state and by goods vs. services classification.",
    ),
    dict(
        category="retail",
        min_turnover=0,
        max_turnover=40_00_000,
        registration_requirement=(
            "Shop & establishment registration is commonly required for a fixed retail "
            "premises. Udyam/MSME registration is recommended."
        ),
        gst_guidance=(
            "GST registration is typically required once turnover crosses the applicable "
            "threshold for goods (higher than for services in most states)."
        ),
        income_tax_guidance=(
            "Presumptive taxation schemes for small businesses may reduce compliance "
            "burden; standard slab-based taxation applies otherwise."
        ),
        notes="Illustrative only — verify current goods-vs-services GST thresholds.",
    ),
    dict(
        category="street_food",
        min_turnover=0,
        max_turnover=4_00_000,
        registration_requirement=(
            "FSSAI basic registration is generally required for street food vendors. "
            "Local municipal vending license/permit is typically also required."
        ),
        gst_guidance=(
            "Most street food vendors operate well below the GST registration threshold, "
            "but check if applicable when selling through delivery/aggregator platforms."
        ),
        income_tax_guidance=(
            "Income is generally taxable under normal slabs; presumptive taxation may "
            "apply if eligible and turnover records are maintained."
        ),
        notes="Illustrative only — municipal vending rules vary significantly by city.",
    ),
    dict(
        category="handicraft",
        min_turnover=0,
        max_turnover=40_00_000,
        registration_requirement=(
            "Udyam/MSME registration is recommended, along with artisan/craft-specific "
            "registrations (e.g. with development commissioners for handicrafts) where "
            "available in your state."
        ),
        gst_guidance=(
            "GST registration is often required for online marketplace sellers "
            "regardless of turnover — check the specific marketplace's requirements."
        ),
        income_tax_guidance=(
            "Presumptive taxation schemes may apply for eligible small businesses; "
            "maintain records of online marketplace payouts for accurate filing."
        ),
        notes="Illustrative only — online marketplace GST rules can override general thresholds.",
    ),
]

COMPLIANCE_RULES = [
    dict(category="food_business", requirement="FSSAI Basic Registration", status="recommended",
         explanation="Required for most small-scale food businesses and home bakeries selling food to the public.",
         priority=1),
    dict(category="food_business", requirement="Local Municipal Trade License", status="check_required",
         explanation="May be required depending on your city/municipality if operating from a fixed premises.",
         priority=2),
    dict(category="food_business", requirement="Udyam / MSME Registration", status="recommended",
         explanation="Optional but unlocks access to MSME schemes, easier credit, and priority-sector benefits.",
         priority=2),

    dict(category="tailoring", requirement="Udyam / MSME Registration", status="recommended",
         explanation="Recommended to access micro-enterprise schemes and credit facilities.",
         priority=1),
    dict(category="tailoring", requirement="Shop & Establishment Registration", status="check_required",
         explanation="May be required if you operate from a fixed shop premises with employees.",
         priority=2),

    dict(category="retail", requirement="Shop & Establishment Registration", status="recommended",
         explanation="Commonly required for retail premises; rules vary by state.",
         priority=1),
    dict(category="retail", requirement="Udyam / MSME Registration", status="recommended",
         explanation="Recommended for access to MSME schemes and priority-sector lending.",
         priority=2),

    dict(category="street_food", requirement="FSSAI Basic Registration", status="recommended",
         explanation="Generally required for street food vendors preparing/selling food.",
         priority=1),
    dict(category="street_food", requirement="Municipal Vending License/Permit", status="check_required",
         explanation="Required by most municipalities for street vending; process varies by city.",
         priority=1),

    dict(category="handicraft", requirement="Udyam / MSME Registration", status="recommended",
         explanation="Recommended for access to artisan and MSME-specific schemes.",
         priority=1),
    dict(category="handicraft", requirement="Marketplace GST Registration", status="check_required",
         explanation="Many online marketplaces require GST registration to sell on their platform, regardless of turnover.",
         priority=1),
]

GOVERNMENT_SCHEMES = [
    dict(name="PM SVANidhi (Street Vendor Micro-credit)", category="street_food",
         target_business="Street vendors and small food stall owners",
         benefit="Collateral-free working capital loan for street vendors.",
         eligibility="Street vendors with a valid vending certificate/ID issued by the local urban body.",
         description="Micro-credit scheme aimed at helping street vendors resume and grow their businesses.",
         official_url=""),
    dict(name="PMFME (PM Formalisation of Micro Food Processing Enterprises)", category="food_business",
         target_business="Micro food processing / home-based food businesses",
         benefit="Credit-linked subsidy and support for formalizing small food businesses.",
         eligibility="Existing micro food processing enterprises, including home-based ones.",
         description="Scheme supporting formalization, branding, and quality upgrades for small food enterprises.",
         official_url=""),
    dict(name="Udyam / MSME Registration Benefits", category="retail",
         target_business="Micro, small, and medium retail businesses",
         benefit="Access to priority-sector lending, subsidies, and government tender preferences.",
         eligibility="Businesses meeting MSME investment/turnover criteria that register on the Udyam portal.",
         description="Formal MSME status unlocks a range of central and state-level benefits.",
         official_url=""),
    dict(name="Prime Minister's Employment Generation Programme (PMEGP)", category="tailoring",
         target_business="Micro-enterprises including tailoring units",
         benefit="Subsidy on project cost for setting up or expanding a micro-enterprise.",
         eligibility="Individuals above 18 years setting up a new micro-enterprise; educational criteria may apply for larger projects.",
         description="Credit-linked subsidy programme to support self-employment ventures.",
         official_url=""),
    dict(name="Artisan / Handicraft Development Schemes (Development Commissioner - Handicrafts)", category="handicraft",
         target_business="Artisans and handicraft-based online sellers",
         benefit="Skill development, marketing support, and access to artisan credit cards.",
         eligibility="Registered artisans/craftspersons, often requiring an Artisan Card.",
         description="Bundle of schemes supporting artisans with training, marketing, and credit access.",
         official_url=""),
    dict(name="Stand-Up India", category="retail",
         target_business="First-time entrepreneurs (SC/ST and women)",
         benefit="Bank loans between a defined range for greenfield enterprises.",
         eligibility="SC/ST and/or women entrepreneurs setting up a new enterprise.",
         description="Facilitates bank loans to first-time entrepreneurs from underrepresented groups.",
         official_url=""),
]


def seed_database(db: Session):
    """Populate the database with the curated prototype dataset if empty."""
    if db.query(TaxRule).count() == 0:
        db.bulk_insert_mappings(TaxRule, TAX_RULES)

    if db.query(ComplianceRule).count() == 0:
        db.bulk_insert_mappings(ComplianceRule, COMPLIANCE_RULES)

    if db.query(GovernmentScheme).count() == 0:
        db.bulk_insert_mappings(GovernmentScheme, GOVERNMENT_SCHEMES)

    db.commit()
