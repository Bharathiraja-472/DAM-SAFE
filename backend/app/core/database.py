from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import Dict, Any
from app.core.config import DATABASE_URL, DB_NAME, DB_HOST, DB_PORT

# Create SQLAlchemy engine with safe connection timeout
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    engine = None
    SessionLocal = None

def get_db():
    """Dependency for obtaining database sessions."""
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_connection() -> Dict[str, Any]:
    """
    Verifies connection to PostgreSQL + PostGIS database without crashing if disconnected.
    """
    if engine is None:
        return {
            "type": "PostgreSQL + PostGIS",
            "database": DB_NAME,
            "status": "disconnected",
            "message": "SQLAlchemy engine not initialized. Check .env configuration."
        }

    try:
        with engine.connect() as conn:
            # Query PostgreSQL version & PostGIS extension presence
            res = conn.execute(text("SELECT version();")).fetchone()
            pg_version = res[0] if res else "Unknown"

            postgis_status = "not_installed"
            try:
                gis_res = conn.execute(text("SELECT PostGIS_Version();")).fetchone()
                postgis_status = gis_res[0] if gis_res else "installed"
            except Exception:
                postgis_status = "extension_missing"

            return {
                "type": "PostgreSQL + PostGIS",
                "database": DB_NAME,
                "host": f"{DB_HOST}:{DB_PORT}",
                "status": "connected",
                "pg_version": pg_version,
                "postgis_version": postgis_status
            }
    except Exception as err:
        return {
            "type": "PostgreSQL + PostGIS",
            "database": DB_NAME,
            "host": f"{DB_HOST}:{DB_PORT}",
            "status": "disconnected",
            "message": f"Connection failed: {str(err)}. Ensure PostgreSQL service is running and 'dam_safe' DB exists."
        }
