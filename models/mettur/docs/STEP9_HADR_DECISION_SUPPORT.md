# DAM-SAFE Step 9 — HADR Impact Analysis & Evacuation Decision Support Specification

## Executive Overview
Step 9 builds the Humanitarian Assistance and Disaster Response (HADR) decision-support layer on top of the Step 8 Mettur Dam-Break Prototype outputs.

This system translates raw hydraulic parameters (flood inundation depth, velocity, wave arrival time) into prioritized, actionable decision support for emergency responders and Salem/Erode District Disaster Management Authorities.

---

## Technical Governance & Provenance Rules
1. **Model Scope & Safety Boundary**:
   - The scientific Mettur hydraulic model remains strictly **`[BLOCKED BY REAL DATA]`** pending acquisition of river geometry & bathymetry.
   - The reserved mesh file `models/mettur/geometry/mettur_cauvery_net.nc` remains **UN-CREATED**.
   - All Step 9 HADR decision support outputs are generated using the **Step 8 Mettur Dam-Break Prototype** outputs (mixed real terrain/dem, daily telemetry, and explicit prototype assumptions).
2. **Prominent Disclaimers**:
   - All HADR screens and report files display the mandatory disclaimer:
     `"HADR DECISION SUPPORT PROTOTYPE — NOT AN OPERATIONAL EMERGENCY WARNING SYSTEM"`
3. **Population Exposure Attribution**:
   - All population exposure figures are explicitly attributed as:
     `"Population exposure estimate based on Census 2011"`
4. **Staging Shelters Labelling**:
   - Staging shelter records carry the data status `DUMMY_FOR_PROTOTYPE` and are tagged with the UI badge:
     `"DUMMY DATA — PROTOTYPE ONLY"`

---

## HADR Priority Scoring Methodology (0–100)
The Priority Score measures overall disaster impact risk for settlements and infrastructure nodes:

$$\text{HADR Priority Score} = 100 \times \left( 0.25 R_d + 0.20 R_v + 0.25 R_a + 0.15 R_p + 0.15 R_i \right)$$

Where normalized risk factors are defined as:
* **Depth Risk ($R_d$)**: $R_d = \min\left(1.0, \frac{\text{depth (m)}}{3.0}\right)$
* **Velocity Risk ($R_v$)**: $R_v = \min\left(1.0, \frac{\text{velocity (m/s)}}{3.0}\right)$
* **Arrival Risk ($R_a$)**: $R_a = 1.0 - \min\left(1.0, \frac{\text{arrival time (hrs)}}{3.0}\right)$
* **Population Risk ($R_p$)**: $R_p = \min\left(1.0, \frac{\text{exposed population}}{5000}\right)$
* **Infrastructure Risk ($R_i$)**: $R_i = \text{infrastructure criticality factor } (0.0 - 1.0)$

### Priority Ranks & Action Guidance
* `75.0 – 100.0` → **P1 CRITICAL**: Immediate Mandatory Evacuation (High depth/velocity + early arrival < 1 hr).
* `50.0 – 74.9` → **P2 HIGH**: High Priority Evacuation (Substantial depth/velocity + arrival < 2 hrs).
* `25.0 – 49.9` → **P3 MODERATE**: Precautionary Advisory (Moderate inundation + arrival 2–3 hrs).
* `0.0 – 24.9` → **P4 LOW**: Monitoring & Alert (Low depth + arrival > 3 hrs).

---

## Spatial & Relational Database Schema (`dam_safe`)
Schema migration `005_hadr_decision_support.sql` defines 6 PostGIS tables with spatial indexes:
1. `hadr_impact_results`: Village spatial impact, depth, velocity, arrival, population, priority score, rank.
2. `hadr_evacuation_zones`: Polygons for Zone 1 (Immediate), Zone 2 (High), Zone 3 (Precautionary), Zone 4 (Monitor).
3. `hadr_route_analysis`: Transport road lines, status (OPEN, AT RISK, AFFECTED, SEVERELY AFFECTED), depth, detour options.
4. `hadr_priority_areas`: Aggregated high-risk spatial hotspots.
5. `hadr_shelters`: Staging shelter point locations, capacities, contacts (`DUMMY DATA — PROTOTYPE ONLY`).
6. `hadr_alert_zones`: Regional emergency alert advisories.

---

## FastAPI Endpoints (`/api/hadr/*`)
* `GET /api/hadr/report/{run_id}`: Full HADR decision support JSON report.
* `POST /api/hadr/compute/{run_id}`: Re-calculates HADR decision support for a run.
* `GET /api/hadr/priority-scoring/methodology`: Exposes transparent formula, weights, and rank thresholds.
* `GET /api/hadr/shelters`: Exposes staging shelter inventory with explicit dummy badge.

---

## User Interface (React + Vite + TypeScript)
- Component: `frontend/src/pages/HadrDashboardPage.tsx`
- Navigation: Integrated into `Sidebar.tsx` and `App.tsx` under HADR / Evacuation tab.
- Sub-tabs: Overview, Village Priority, Evacuation Zones, Route Usability, Staging Shelters, Methodology.
