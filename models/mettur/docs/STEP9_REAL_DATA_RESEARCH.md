# 🔎 Step 9 HADR Real Data Portal Research & Decision Audit Report

This report documents targeted searches across official Tamil Nadu State Disaster Management Authority (TNSDMA), Salem District Administration, Tamil Nadu Fire and Rescue Services, Tamil Nadu Police, Health & Family Welfare Department, School Education Department, Census of India 2011, NRSC/Bhuvan, and CWC portals for emergency response exposure layers.

---

## 📊 HADR Spatial Exposure Portal Search Matrix

| HADR Dataset | Required For | Portals Searched | Search Reference / URL | Real Data Found? | Download / Access Status | Final Classification | Prototype Action |
|---|---|---|---|---|---|---|---|
| **Settlement Population & Demographics** | Village population exposure | Census of India 2011, Salem District Handbook | `d:/SIH2026/data/Dataset_12_Population_Settlement_Mettur_Cauvery_Census2011.csv` | **`YES`** | Local verified CSV file | **`REAL (CENSUS 2011)`** | Ingest Census 2011 demographics; display explicit provenance note |
| **Emergency Relief Shelters** | Safe staging shelters & evacuation targets | TNSDMA, Salem District Admin Portal, TN Revenue Dept | `https://tnsdma.tn.gov.in/`<br>`https://salem.nic.in/` | **`NO`** (Public web downloads restricted) | Pending institutional GIS release | **`REAL DATA NOT FOUND`** | Create `DUMMY_FOR_PROTOTYPE` shelter points; display `"DUMMY SHELTER — PROTOTYPE ONLY"` |
| **Hospitals & Health Facilities** | Critical facility P1 priority ranking | TN Health Dept, National Health Mission GIS, Bhuvan | `https://tnhealth.tn.gov.in/`<br>`https://bhuvan-app1.nrsc.gov.in/` | **`PARTIAL`** (Facility specifications catalogued in Dataset 13) | Point coordinates catalogued | **`PARTIAL REAL DATA`** | Ingest Dataset 13 health facilities as `PARTIAL REAL DATA` |
| **Police & Fire Stations** | Disaster response staging centers | TN Police Portal, TN Fire & Rescue Services | `https://eservices.tnpolice.gov.in/`<br>`https://tnfrs.tn.gov.in/` | **`PARTIAL`** (Facility specifications catalogued in Dataset 13) | Point coordinates catalogued | **`PARTIAL REAL DATA`** | Ingest Dataset 13 police/fire stations as `PARTIAL REAL DATA` |
| **Transport Roads & Bridges** | Evacuation corridor usability analysis | Highways Department TN, OpenStreetMap Geofabrik | `d:/SIH2026/data/Dataset_11_Road_Transportation_Mettur_Cauvery.csv` | **`PARTIAL`** (SH-20 corridor specs catalogued in Dataset 11) | Line geometry specifications catalogued | **`PARTIAL REAL DATA`** | Ingest Dataset 11 SH-20 road corridor as `PARTIAL REAL DATA` |
| **Power Infrastructure** | Critical facility P1 priority ranking | TANGEDCO / TNEB Power Grid, Dataset 13 | `d:/SIH2026/data/Dataset_13_Critical_Infrastructure_Mettur_Cauvery.csv` | **`PARTIAL`** (110kV Substation specs catalogued in Dataset 13) | Facility coordinates catalogued | **`PARTIAL REAL DATA`** | Ingest Substation points as `PARTIAL REAL DATA` |

---

## ⚖️ Governance & Data Provenance Policy

1. **Census 2011 Attribution**: Population exposure figures use Census 2011 figures and are explicitly labeled `"Population exposure estimate based on Census 2011"`.
2. **Dummy Shelter Tagging**: Created shelter points carry `data_status = DUMMY_FOR_PROTOTYPE` and display `"DUMMY SHELTER — PROTOTYPE ONLY"` across all UI views.
3. **No Operational Claims**: All outputs display prominent disclaimers stating that the system is a **Decision-Support Prototype**, not an officially approved operational emergency warning system.
