"""
SQLAlchemy engine / session setup for the SQLite database.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# Make sure the /data directory exists before SQLite tries to create the file.
os.makedirs("data", exist_ok=True)

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Called once on application startup."""
    # Import models here so they are registered on Base.metadata
    # before create_all() is called.
    from app.database import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
