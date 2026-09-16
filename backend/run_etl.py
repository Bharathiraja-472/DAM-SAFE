from app.services.ingestion_service import ingestion_service

if __name__ == "__main__":
    print("Executing DAM-SAFE Ingestion ETL into PostgreSQL 'dam_safe'...")
    res = ingestion_service.run_full_etl()
    print("ETL Result:", res)
