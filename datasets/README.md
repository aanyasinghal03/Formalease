# FormalEase — Complete Training/Rules Pack

This pack is designed for the architecture:
User natural language -> LLM extraction -> clarifying questions -> deterministic rules -> scheme matching -> personalized action plan.

IMPORTANT DISTINCTION:
This is NOT a model-training corpus of official government answers.
- `synthetic_training_examples.csv` contains synthetic user scenarios and expected outputs for development/testing.
- `compliance_rule_engine.csv`, `scheme_rules.csv`, and `action_plan_rules.csv` are the authoritative prototype logic layer.
- Official source URLs are included so the team can verify rules.
- Never let the LLM invent eligibility or tax liability.
- Never label a scheme as guaranteed eligibility.

Recommended model training later:
1. Train/fine-tune an extraction model only on examples of natural-language business descriptions -> structured profile.
2. Do NOT fine-tune the model to memorize changing tax/scheme rules.
3. Keep legal/compliance/scheme rules in Firestore and update them independently.
4. Use the LLM for conversation, normalization, and explanation.
5. Use deterministic rules for final matching.

Core Firestore collections:
business_profiles
compliance_rules
scheme_rules
action_plan_rules
clarifying_questions
source_registry
analysis_results

Optional:
scheme_matches
business_categories
state_rules
local_rules

The engine should:
- ask only for missing fields needed by rules;
- run all relevant compliance checks;
- rank scheme matches;
- explain why each scheme matched;
- list missing information/conditions;
- produce 3-5 prioritized next actions;
- attach sourceName/sourceUrl/lastVerified to each important claim.
