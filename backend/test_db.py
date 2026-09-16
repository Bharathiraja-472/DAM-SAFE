import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.core.config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DATABASE_URL
from app.core.database import check_db_connection

def main():
    print("=" * 60)
    print("DAM-SAFE PostgreSQL + PostGIS Connection Verifier")
    print("=" * 60)
    print(f"Host: {DB_HOST}:{DB_PORT}")
    print(f"User: {DB_USER}")
    print(f"Target Database: {DB_NAME}")
    print(f"Database URL: postgresql://{DB_USER}:*****@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    print("-" * 60)

    # Step 1: Connect to PostgreSQL server
    try:
        print("Connecting to PostgreSQL server...")
        conn = psycopg2.connect(dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        print("[OK] SUCCESS: Connected to PostgreSQL server!")

        # Check if dam_safe database exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (DB_NAME,))
        exists = cur.fetchone()
        if not exists:
            print(f"Database '{DB_NAME}' does not exist. Creating database '{DB_NAME}'...")
            cur.execute(f"CREATE DATABASE {DB_NAME};")
            print(f"[OK] SUCCESS: Created database '{DB_NAME}'!")
        else:
            print(f"[OK] Database '{DB_NAME}' already exists.")

        cur.close()
        conn.close()

        # Step 2: Connect to dam_safe database and enable PostGIS
        print(f"\nConnecting to '{DB_NAME}' database...")
        db_conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        db_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        db_cur = db_conn.cursor()

        print("Enabling PostGIS and UUID extensions...")
        db_cur.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        db_cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        db_cur.execute("SELECT PostGIS_Version();")
        postgis_ver = db_cur.fetchone()[0]
        print(f"[OK] SUCCESS: PostGIS extension enabled! Version: {postgis_ver}")

        # Step 3: Run schema migrations
        migration_files = [
            os.path.join(os.path.dirname(__file__), "..", "database", "migrations", "001_initial_schema.sql"),
            os.path.join(os.path.dirname(__file__), "..", "database", "migrations", "003_simulation_test_results.sql"),
            os.path.join(os.path.dirname(__file__), "..", "database", "migrations", "004_simulation_prototype_results.sql"),
            os.path.join(os.path.dirname(__file__), "..", "database", "migrations", "005_hadr_decision_support.sql")
        ]
        for m_file in migration_files:
            m_path = os.path.abspath(m_file)
            if os.path.exists(m_path):
                print(f"\nApplying schema migration from {m_path}...")
                with open(m_path, "r", encoding="utf-8") as f:
                    sql_script = f.read()
                db_cur.execute(sql_script)
                print(f"[OK] SUCCESS: Migration {os.path.basename(m_path)} applied!")

        # List created tables
        db_cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")
        tables = [row[0] for row in db_cur.fetchall()]
        print(f"\nTables in '{DB_NAME}' database ({len(tables)} total):")
        for t in tables:
            print(f"  - {t}")

        db_cur.close()
        db_conn.close()

        # Step 4: Test FastAPI backend database connection service
        print("\nTesting FastAPI Backend database check service...")
        health_status = check_db_connection()
        print("Backend DB Health Result:", health_status)
        print("\n[SUCCESS] ALL DATABASE CHECKS PASSED! PostgreSQL + PostGIS is FULLY CONNECTED!")

    except Exception as e:
        print("\n[ERROR] DATABASE CONNECTION ERROR:", str(e))
        sys.exit(1)

if __name__ == "__main__":
    main()
