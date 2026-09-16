# DAM-SAFE FastAPI Backend Service

Python-based API application supplying data services, dam parameter queries, reservoir history ingestion, scenario management, and simulation wrappers for the DAM-SAFE platform.

---

## 🛠️ Installation & Execution

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Uvicorn dev server
uvicorn app.main:app --reload --port 8000
```

---

## 📡 API Catalog

| Method | Endpoint | Description | Status Mode |
|---|---|---|---|
| `GET` | `/api/health` | Service health & project status | Production Ready |
| `GET` | `/api/dam` | Mettur Dam geometry & spillway parameters | Verified (from `mettur_dam_dataset.csv`) |
| `GET` | `/api/reservoir` | Reservoir level, storage, inflow/outflow records | Verified / Reference Data |
| `GET` | `/api/datasets` | Inventory catalog of all 16 project datasets | Ingestion Inventory |
| `POST` | `/api/scenarios/run` | Submit breach simulation scenario parameters | Prototype Mode |
| `GET` | `/api/simulation/status` | Check status of Delft3D-FM simulation engine | Integration Pending |
