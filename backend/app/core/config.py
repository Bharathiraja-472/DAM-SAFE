import os
from pathlib import Path
from dotenv import load_dotenv


# ============================================================
# BASE DIRECTORIES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR.parent / "data"


# ============================================================
# LOAD .ENV CONFIGURATION
# ============================================================

dotenv_path = BASE_DIR / ".env"

if dotenv_path.exists():
    load_dotenv(dotenv_path)


# ============================================================
# PROJECT CONFIGURATION
# ============================================================

PROJECT_NAME = "DAM-SAFE"

STUDY_AREA = "Mettur Dam - Cauvery River Floodplain, Tamil Nadu"

PROTOTYPE_MODE = os.getenv(
    "PROTOTYPE_MODE",
    "True"
).lower() in ("true", "1", "yes")


# ============================================================
# DATABASE PARAMETERS
# ============================================================

DB_HOST = os.getenv(
    "DB_HOST",
    "localhost"
)

DB_PORT = os.getenv(
    "DB_PORT",
    "5432"
)

DB_NAME = os.getenv(
    "DB_NAME",
    "dam_safe"
)

DB_USER = os.getenv(
    "DB_USER",
    "postgres"
)

DB_PASSWORD = os.getenv(
    "DB_PASSWORD",
    "postgres"
)


# ============================================================
# DATABASE URL
# ============================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


# ============================================================
# METTUR DAM COORDINATES
# ============================================================

METTUR_DAM_COORDS = {
    "latitude": 11.8016,
    "longitude": 77.8016,
    "name": "Mettur Dam (Stanley Reservoir)",
    "district": "Salem",
    "state": "Tamil Nadu",
    "country": "India"
}