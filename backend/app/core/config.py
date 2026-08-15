"""
Central application configuration.

Loads values from environment variables (via .env, using python-dotenv).
Nothing here is secret by default — real secrets belong in a local
.env file that is NOT committed to version control (see .gitignore).
"""

import os
from dotenv import load_dotenv

# Load variables from a .env file if one exists in the working directory.
load_dotenv()


class Settings:
    # --- LLM / NLP configuration -------------------------------------------------
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "").strip()
    LLM_MODEL: str = os.getenv("LLM_MODEL", "claude-sonnet-4-6").strip()
    LLM_API_BASE_URL: str = os.getenv(
        "LLM_API_BASE_URL", "https://api.anthropic.com/v1/messages"
    ).strip()

    # --- CORS ----------------------------------------------------------------------
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").strip()

    # --- Database --------------------------------------------------------------------
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/formalease.db").strip()

    @property
    def llm_configured(self) -> bool:
        """True only if an LLM API key has actually been provided."""
        return bool(self.LLM_API_KEY)


settings = Settings()
