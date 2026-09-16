import os
import glob
import math
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy import text
from app.core.config import DATA_DIR, METTUR_DAM_COORDS
from app.core.database import engine

class IngestionService:
    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir

    def scan_data_directory(self) -> List[Dict[str, Any]]:
        """Scans raw data directory without modifying any file."""
        inventory = []
        if not self.data_dir.exists():
            return inventory

        files = sorted(os.listdir(self.data_dir))
        for f in files:
            fpath = self.data_dir / f
            if not fpath.is_file():
                continue

            stat = fpath.stat()
            ext = fpath.suffix.lower()
            size_bytes = stat.st_size
            
            row_count = None
            col_count = None
            cols_list = []
            date_start = None
            date_end = None
            missing_pct = 0.0

            if ext == '.csv':
                try:
                    df = pd.read_csv(fpath, comment='#', low_memory=False)
                    row_count = len(df)
                    col_count = len(df.columns)
                    cols_list = list(df.columns)
                    
                    # Calculate missing value percentage
                    total_cells = row_count * col_count
                    if total_cells > 0:
                        missing_cells = df.isna().sum().sum()
                        missing_pct = round((missing_cells / total_cells) * 100, 2)

                    # Extract date ranges if date columns exist
                    date_cols = [c for c in cols_list if 'date' in c.lower() or 'year' in c.lower()]
                    if date_cols and row_count > 0:
                        try:
                            d_vals = df[date_cols[0]].dropna().astype(str)
                            if len(d_vals) > 0:
                                date_start = str(d_vals.min())
                                date_end = str(d_vals.max())
                        except Exception:
                            pass
                except Exception:
                    pass

            inventory.append({
                "filename": f,
                "file_type": ext,
                "file_size_bytes": size_bytes,
                "row_count": row_count,
                "column_count": col_count,
                "columns_list": cols_list,
                "missing_percentage": missing_pct,
                "date_start": date_start,
                "date_end": date_end
            })

        return inventory

    def get_16_categories_catalog(self) -> List[Dict[str, Any]]:
        return []

    def run_full_etl(self) -> Dict[str, Any]:
        """Runs the ETL pipeline into PostgreSQL without modifying source files."""
        if engine is None:
            return {"status": "error", "message": "Database engine disconnected"}

        results = {
            "categories_processed": 0,
            "dams_ingested": 0,
            "hydro_records_ingested": 0,
            "rainfall_records_ingested": 0,
            "catalogue_entries": 0
        }

        # 1. Apply Migration 002 Schema
        migration_file = Path(__file__).resolve().parent.parent.parent.parent / "database" / "migrations" / "002_dataset_catalogue.sql"
        if migration_file.exists():
            with engine.connect() as conn:
                with open(migration_file, 'r', encoding='utf-8') as f:
                    conn.execute(text(f.read()))
                conn.commit()

        # 2. Map 16 Project Categories
        categories_def = [
            {
                "category_number": 1,
                "category_name": "DEM / Terrain",
                "dataset_name": "SRTM 30m Elevation Grid",
                "filename": "output_SRTMGL1.tif",
                "file_type": ".tif",
                "has_spatial_data": True,
                "geometry_type": "Raster",
                "crs": "EPSG:4326 (WGS 84)",
                "data_status": "VERIFIED",
                "data_source": "OFFICIAL",
                "db_table_mapped": "gis/raw/output_SRTMGL1.tif",
                "notes": "SRTM GL1 30m digital elevation model. Bounds: 11.4°N-12.2°N, 77.5°E-78.2°E."
            },
            {
                "category_number": 2,
                "category_name": "Mettur Dam Structural Parameters",
                "dataset_name": "Mettur Dam Structural Specifications",
                "filename": "mettur_dam_dataset.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Point",
                "crs": "EPSG:4326",
                "data_status": "VERIFIED",
                "data_source": "OFFICIAL",
                "db_table_mapped": "dams",
                "notes": "Structural dimensions, height (214ft), capacity (95,660 Mcft), spillway gates."
            },
            {
                "category_number": 3,
                "category_name": "Reservoir Level & Storage History",
                "dataset_name": "Mettur Reservoir Historical Telemetry",
                "filename": "mettur_reservoir_dataset_3.csv",
                "file_type": ".csv",
                "has_spatial_data": False,
                "geometry_type": "Tabular",
                "crs": "None",
                "data_status": "VERIFIED",
                "data_source": "OFFICIAL",
                "db_table_mapped": "hydro_observations",
                "notes": "Verified reservoir water levels, storage (Mcft), inflow/outflow cusecs."
            },
            {
                "category_number": 4,
                "category_name": "Cauvery River & Drainage Network",
                "dataset_name": "Cauvery Centerline & Bathymetry Network",
                "filename": "Dataset_4_Cauvery_River_Drainage.csv",
                "file_type": "None",
                "has_spatial_data": True,
                "geometry_type": "MultiLineString",
                "crs": "EPSG:4326",
                "data_status": "NOT_AVAILABLE",
                "data_source": "OFFICIAL",
                "db_table_mapped": "river_centerlines",
                "notes": "Raw GIS vector centerline pending extraction in Step 3."
            },
            {
                "category_number": 5,
                "category_name": "Rainfall Telemetry",
                "dataset_name": "Cauvery Basin Rain Gauge Telemetry",
                "filename": "mettur_cauvery_rainfall_dataset_5_complete.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Point",
                "crs": "EPSG:4326",
                "data_status": "VERIFIED",
                "data_source": "OFFICIAL",
                "db_table_mapped": "rainfall_observations",
                "notes": "175,735 records across 145 stations in Cauvery catchment."
            },
            {
                "category_number": 6,
                "category_name": "River Discharge & Water Level",
                "dataset_name": "CWC & TN SW-GW Gauge Telemetry Inventory",
                "filename": "Dataset_6_Mettur_Cauvery_Hydrology_Source_and_Verified_Observations.csv",
                "file_type": ".csv",
                "has_spatial_data": False,
                "geometry_type": "Tabular",
                "crs": "None",
                "data_status": "PARTIAL",
                "data_source": "OFFICIAL",
                "db_table_mapped": "hydro_observations",
                "notes": "Official source verified; hourly raw CWC telemetry endpoint extraction pending."
            },
            {
                "category_number": 7,
                "category_name": "Sentinel-1 SAR Imagery",
                "dataset_name": "Sentinel-1 Flood SAR Acquisition Inventory",
                "filename": "Dataset_7_Sentinel1_SAR_Mettur_Cauvery_Acquisition_Processing_Inventory.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Raster",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "dataset_catalogue",
                "notes": "SAR change-detection inventory for flood extent extraction."
            },
            {
                "category_number": 8,
                "category_name": "Sentinel-2 MSI Imagery",
                "dataset_name": "Sentinel-2 Optical Multispectral Inventory",
                "filename": "Dataset_8_Sentinel2_MSI_Mettur_Cauvery_Acquisition_Processing_Inventory.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Raster",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "dataset_catalogue",
                "notes": "Optical multispectral baseline for vegetation & water index mapping."
            },
            {
                "category_number": 9,
                "category_name": "Land Use / Land Cover (LULC)",
                "dataset_name": "NRSC Bhuvan LULC Inventory",
                "filename": "Dataset_9_LULC_Mettur_Cauvery_NRSC_Bhuvan.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Polygon",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "dataset_catalogue",
                "notes": "Bhuvan 1:50,000 LULC classification scheme."
            },
            {
                "category_number": 10,
                "category_name": "Building Footprints",
                "dataset_name": "Downstream Structure Footprints",
                "filename": "Dataset_10_Buildings.gpkg",
                "file_type": "None",
                "has_spatial_data": True,
                "geometry_type": "MultiPolygon",
                "crs": "EPSG:4326",
                "data_status": "NOT_AVAILABLE",
                "data_source": "OFFICIAL",
                "db_table_mapped": "buildings",
                "notes": "Pending OpenStreetMap / spatial footprint vector extraction."
            },
            {
                "category_number": 11,
                "category_name": "Roads & Transportation",
                "dataset_name": "Transport Network Inventory",
                "filename": "Dataset_11_Road_Transportation_Mettur_Cauvery.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "MultiLineString",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "roads",
                "notes": "National & State Highway network inventory for evacuation analysis."
            },
            {
                "category_number": 12,
                "category_name": "Population & Settlements",
                "dataset_name": "Census 2011 Village Settlement Demographics",
                "filename": "Dataset_12_Population_Settlement_Mettur_Cauvery_Census2011.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "MultiPolygon",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "villages",
                "notes": "Census 2011 settlement population metrics for Salem, Erode, Namakkal."
            },
            {
                "category_number": 13,
                "category_name": "Critical Infrastructure",
                "dataset_name": "Essential Facilities Inventory",
                "filename": "Dataset_13_Critical_Infrastructure_Mettur_Cauvery.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Point",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "infrastructure",
                "notes": "Hospitals, shelters, schools, police, power stations, bridges."
            },
            {
                "category_number": 14,
                "category_name": "Administrative Boundaries",
                "dataset_name": "District, Taluk, & Village Admin Inventory",
                "filename": "Dataset_14_Administrative_Boundaries_Mettur_Cauvery.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "MultiPolygon",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "admin_boundaries",
                "notes": "Tamil Nadu revenue administrative boundaries hierarchy."
            },
            {
                "category_number": 15,
                "category_name": "Historical Flood Validation",
                "dataset_name": "CWC & Sentinel Historical Flood Inventory",
                "filename": "Dataset_15_Historical_Flood_Disaster_Validation_Mettur_Cauvery.csv",
                "file_type": ".csv",
                "has_spatial_data": True,
                "geometry_type": "Polygon",
                "crs": "EPSG:4326",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "dataset_catalogue",
                "notes": "Historical flood inundation records for model calibration."
            },
            {
                "category_number": 16,
                "category_name": "Supporting Hydrometeorology",
                "dataset_name": "ERA5-Land Meteorological Data Specs",
                "filename": "Dataset_16_Supporting_Hydrometeorological_Mettur_Cauvery.csv",
                "file_type": ".csv",
                "has_spatial_data": False,
                "geometry_type": "Tabular",
                "crs": "None",
                "data_status": "PARTIAL",
                "data_source": "INVENTORY",
                "db_table_mapped": "dataset_catalogue",
                "notes": "Supporting ERA5 meteorology parameters."
            }
        ]

        with engine.connect() as conn:
            # 3. Populate Dataset Catalogue Table
            for cat in categories_def:
                fpath = self.data_dir / cat["filename"] if cat["filename"] != "None" else None
                row_count = 0
                col_count = 0
                size_bytes = 0
                cols_list = []

                if fpath and fpath.exists():
                    size_bytes = fpath.stat().st_size
                    if fpath.suffix.lower() == '.csv':
                        try:
                            df = pd.read_csv(fpath, comment='#', nrows=5)
                            row_count = sum(1 for _ in open(fpath, 'r', encoding='utf-8', errors='ignore')) - 1
                            col_count = len(df.columns)
                            cols_list = list(df.columns)
                        except Exception:
                            pass

                conn.execute(text("""
                    INSERT INTO dataset_catalogue (
                        category_number, category_name, dataset_name, filename, file_type,
                        file_size_bytes, row_count, column_count, columns_list,
                        has_spatial_data, geometry_type, crs, data_status, data_source,
                        is_realtime, db_table_mapped, notes
                    ) VALUES (
                        :cat_num, :cat_name, :ds_name, :fname, :ftype,
                        :fsize, :r_count, :c_count, :cols,
                        :has_spatial, :geom_type, :crs, :d_status, :d_source,
                        :is_rt, :tbl_mapped, :notes
                    ) ON CONFLICT (category_number) DO UPDATE SET
                        filename = EXCLUDED.filename,
                        file_size_bytes = EXCLUDED.file_size_bytes,
                        row_count = EXCLUDED.row_count,
                        column_count = EXCLUDED.column_count,
                        data_status = EXCLUDED.data_status,
                        last_scanned = CURRENT_TIMESTAMP;
                """), {
                    "cat_num": cat["category_number"],
                    "cat_name": cat["category_name"],
                    "ds_name": cat["dataset_name"],
                    "fname": cat["filename"],
                    "ftype": cat["file_type"],
                    "fsize": size_bytes,
                    "r_count": row_count,
                    "c_count": col_count,
                    "cols": cols_list,
                    "has_spatial": cat["has_spatial_data"],
                    "geom_type": cat["geometry_type"],
                    "crs": cat["crs"],
                    "d_status": cat["data_status"],
                    "d_source": cat["data_source"],
                    "is_rt": False,
                    "tbl_mapped": cat["db_table_mapped"],
                    "notes": cat["notes"]
                })
                results["catalogue_entries"] += 1

            # 4. Ingest Mettur Dam Structural Parameters into 'dams' table
            dam_csv = self.data_dir / "mettur_dam_dataset.csv"
            if dam_csv.exists():
                conn.execute(text("TRUNCATE TABLE dams CASCADE;"))
                conn.execute(text("""
                    INSERT INTO dams (
                        name, river, latitude, longitude, dam_length_ft, max_height_ft, max_width_ft, top_width_ft,
                        total_capacity_mcft, effective_capacity_mcft, spillway_gates_desc, geom
                    ) VALUES (
                        'Mettur Dam', 'Cauvery (Kaveri)', 11.8016, 77.8016, 5300, 214, 171, 20.4,
                        95660, 93470, '16 × 60 ft × 20 ft main spillway gates',
                        ST_SetSRID(ST_MakePoint(77.8016, 11.8016), 4326)
                    );
                """))
                results["dams_ingested"] = 1

            # 5. Ingest Reservoir Records into 'hydro_observations'
            res_csv3 = self.data_dir / "mettur_reservoir_dataset_3.csv"
            if res_csv3.exists():
                conn.execute(text("TRUNCATE TABLE hydro_observations CASCADE;"))
                df_res = pd.read_csv(res_csv3)
                for _, row in df_res.iterrows():
                    conn.execute(text("""
                        INSERT INTO hydro_observations (
                            station_name, observation_date, reservoir_level_ft, storage_mcft, inflow_cusecs, outflow_cusecs, data_source, data_status
                        ) VALUES (
                            :stn, :obs_date, :lvl, :stg, :inf, :outf, 'official', 'verified'
                        );
                    """), {
                        "stn": str(row.get('reservoir', 'Mettur')),
                        "obs_date": str(row.get('date', '2026-07-01')),
                        "lvl": float(row.get('current_level_ft', 0)),
                        "stg": float(row.get('current_storage_Mcft', 0)),
                        "inf": float(row.get('current_inflow_cusecs', 0)),
                        "outf": float(row.get('current_outflow_cusecs', 0))
                    })
                    results["hydro_records_ingested"] += 1

            # 6. Ingest Sample Rainfall Records into 'rainfall_observations'
            rf_csv = self.data_dir / "mettur_cauvery_rainfall_dataset_5_complete.csv"
            if rf_csv.exists():
                conn.execute(text("TRUNCATE TABLE rainfall_observations CASCADE;"))
                # Ingest initial 1,000 records safely for demonstration query speed
                df_rf = pd.read_csv(rf_csv, nrows=1000)
                for _, row in df_rf.iterrows():
                    stn = str(row.get('Station', 'Unknown'))
                    state = str(row.get('State', 'Tamil Nadu'))
                    agency = str(row.get('Agency', 'CWC'))
                    lat = float(row.get('Latitude', 11.8)) if pd.notna(row.get('Latitude')) else 11.8
                    lon = float(row.get('Longitude', 77.8)) if pd.notna(row.get('Longitude')) else 77.8
                    date_val = str(row.get('Date', '2020-01-01'))
                    rain_val = float(row.get('Rainfall_mm', 0)) if pd.notna(row.get('Rainfall_mm')) else 0.0

                    conn.execute(text("""
                        INSERT INTO rainfall_observations (
                            station_name, state, agency, latitude, longitude, observation_date, rainfall_mm, data_status
                        ) VALUES (
                            :stn, :state, :agency, :lat, :lon, :obs_date, :rain, 'verified'
                        );
                    """), {
                        "stn": stn, "state": state, "agency": agency,
                        "lat": lat, "lon": lon, "obs_date": date_val, "rain": rain_val
                    })
                    results["rainfall_records_ingested"] += 1

            conn.commit()
            results["status"] = "success"

        return results

ingestion_service = IngestionService()
