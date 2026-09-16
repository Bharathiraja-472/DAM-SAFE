# 📜 DAM-SAFE Synthetic Data Governance Policy

This policy establishes strict scientific rules governing the creation, storage, database isolation, API exposure, and visualization of synthetic/dummy test datasets in the DAM-SAFE platform.

---

## ⚖️ Core Governance Principles

1. **Software Testing Isolation Only**:
   - Synthetic test data is permitted **ONLY** for testing software functionality (PostgreSQL/PostGIS database schemas, FastAPI endpoints, React map rendering, Leaflet time-slider playback, and D-Flow FM CLI process integration).
   - Synthetic data **MUST NEVER** be presented as real hydraulic observations, government data, measured bathymetry, or validated flood predictions.

2. **File Naming & Folder Isolation**:
   - All synthetic files must reside exclusively in: `d:/SIH2026/models/mettur/synthetic_test/`
   - Every synthetic file filename MUST follow the pattern: `*_SYNTHETIC_TEST_ONLY.*`

3. **Mandatory Metadata Tagging**:
   - Every synthetic file must include explicit metadata headers:
     ```yaml
     data_status: SYNTHETIC_TEST_ONLY
     scientific_use: FALSE
     source_type: GENERATED_FOR_SOFTWARE_TESTING
     discrepancy_warning: NOT REAL HYDRAULIC OBSERVATION
     ```

4. **Scientific Mesh Filename Protection**:
   - The scientific computational mesh filename `models/mettur/geometry/mettur_cauvery_net.nc` is strictly **RESERVED** for real data.
   - The synthetic software test mesh must be named: `models/mettur/geometry/mettur_software_test_net.nc`

5. **Mandatory UI Warning Banner**:
   - The React Leaflet map and time-slider interface must display a prominent permanent banner whenever displaying synthetic test layers:
     ```
     SOFTWARE PIPELINE TEST — SYNTHETIC DATA — NOT A SCIENTIFIC FLOOD SIMULATION
     ```

6. **Scientific Model Status**:
   - The existence of synthetic test data does **NOT** alter the scientific model status.
   - The scientific Mettur dam-break model status remains strictly **`[PENDING REAL DATA / BLOCKED BY REAL DATA]`** until genuine vector centerlines, riverbed bathymetry, and high-frequency boundary hydrographs are acquired.

7. **Database Isolation**:
   - Synthetic records must never overwrite or replace `REAL` or `DERIVED_FROM_REAL` database rows.
   - All spatial and tabular database rows must contain a mandatory column: `data_status`.
