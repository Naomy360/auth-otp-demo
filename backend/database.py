from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Flags for controlling DB type
TESTING = os.getenv("TESTING", "0") == "1"
USE_SQLITE = os.getenv("USE_SQLITE", "0") == "1"

if TESTING or USE_SQLITE:
    # SQLite for local dev or tests
    db_file = "test.db" if TESTING else "dev.db"
    DATABASE_URL = f"sqlite:///./{db_file}"
else:
    # Default to Postgres (works in Docker or deployment)
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@otp_postgres:5432/postgres"
    )

# For SQLite we need to disable same thread check
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Shared DB dependency for FastAPI and tests
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
