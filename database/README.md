# 🐘 DAM-SAFE PostgreSQL + PostGIS Primary Database Guide

**DAM-SAFE** uses **PostgreSQL + PostGIS** as its primary persistent database engine.

---

## 🖥️ Windows Installation Instructions

### Step 1: Install PostgreSQL & PostGIS Extension
1. Download **PostgreSQL for Windows** (v15, v16, or v18) from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
2. Run the installer and set a master password for the `postgres` user (e.g. `postgres`).
3. At the end of the installation, check the box to launch **StackBuilder**.
4. In StackBuilder, select your PostgreSQL server, expand **Spatial Extensions**, check **PostGIS**, and complete the PostGIS installation.

---

## 🛠️ Step 2: Create Database & Enable PostGIS

Open **SQL Shell (psql)** or **pgAdmin 4** and execute:

```sql
-- 1. Create the dedicated DAM-SAFE database
CREATE DATABASE dam_safe;

-- 2. Connect to dam_safe database
\c dam_safe;

-- 3. Enable PostGIS spatial extension & UUID generator
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Verify PostGIS installation
SELECT PostGIS_Version();
```

---

## 📜 Step 3: Run Database Schema Migrations

Apply the initial schema migration script from PowerShell or Command Prompt:

```powershell
psql -U postgres -d dam_safe -f d:\SIH2026\database\migrations\001_initial_schema.sql
```

---

## ⚙️ Step 4: Configure Backend Environment Variables

In `d:\SIH2026\backend\.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dam_safe
DB_USER=postgres
DB_PASSWORD=your_actual_password

DATABASE_URL=postgresql://postgres:your_actual_password@localhost:5432/dam_safe
```

---

## 🗄️ Database Tables Reference (13 Spatial & Hydrologic Tables)

| Table Name | Geometry / Type | Purpose |
|---|---|---|
| `dams` | `GEOMETRY(Point, 4326)` | Mettur Dam structural geometry & capacity parameters |
| `reservoirs` | `GEOMETRY(MultiPolygon, 4326)` | Stanley Reservoir boundary envelopes at FRL |
| `hydro_observations` | Relational Time-Series | Reservoir storage, water levels, inflow/outflow telemetry |
| `rainfall_stations` | `GEOMETRY(Point, 4326)` | Rain gauge locations & precipitation records |
| `river_centerlines` | `GEOMETRY(MultiLineString, 4326)` | Cauvery River main stem & tributary drainage networks |
| `admin_boundaries` | `GEOMETRY(MultiPolygon, 4326)` | District, Taluk, and Village administrative polygons |
| `villages` | `GEOMETRY(MultiPolygon, 4326)` | Village envelopes with census population metrics |
| `buildings` | `GEOMETRY(MultiPolygon, 4326)` | Downstream building footprints & structure types |
| `roads` | `GEOMETRY(MultiLineString, 4326)` | Transport network lines & surface classifications |
| `infrastructure` | `GEOMETRY(Point, 4326)` | Hospitals, schools, police, shelters, power stations |
| `simulation_scenarios` | Relational | Registered breach scenario parameters |
| `simulation_runs` | Relational | Delft3D-FM execution logs & output directory pointers |
| `flood_results` | `GEOMETRY(MultiPolygon, 4326)` | Post-processed inundation depth/velocity polygon layers |

---

## 🩺 Testing Database Connectivity

Start the FastAPI backend and test `/api/health`:

```powershell
cd d:\SIH2026\backend
uvicorn app.main:app --reload --port 8000
```

Access `http://localhost:8000/api/health`. You will receive:

```json
{
  "status": "ok",
  "project": "DAM-SAFE",
  "study_area": "Mettur Dam - Cauvery River",
  "mode": "prototype",
  "database": {
    "type": "PostgreSQL + PostGIS",
    "database": "dam_safe",
    "host": "localhost:5432",
    "status": "connected",
    "postgis_version": "3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1"
  }
}
```

If disconnected, `/api/health` gracefully returns `"status": "disconnected"` without crashing the application shell.
