# 📐 HADR Priority Scoring & Risk Classification Methodology

This document details the mathematical formula, normalization factors, weighting scheme, severity thresholds, and data status declarations for the HADR Priority Scoring System in the DAM-SAFE platform.

---

## ⚖️ Scientific & Governance Disclaimer

> [!IMPORTANT]
> **Prototype Methodology Notice:**
> - The HADR Priority Score is a **PROTOTYPE DECISION-SUPPORT METHODOLOGY**.
> - It is **NOT** an officially approved emergency-management formula.
> - All parameters retain explicit itemized data provenance.

---

## 🧮 Mathematical Priority Scoring Formula

The HADR Priority Score evaluates flood risk and human exposure using a 0 to 100 normalized scale.

$$\text{HADR Priority Score} = 100 \times \left( w_d \cdot R_d + w_v \cdot R_v + w_a \cdot R_a + w_p \cdot R_p + w_i \cdot R_i \right)$$

Where:
- $R_d$: **Depth Risk Factor** ($0.0 \le R_d \le 1.0$)
- $R_v$: **Velocity Risk Factor** ($0.0 \le R_v \le 1.0$)
- $R_a$: **Arrival Risk Factor** ($R_a = 1 - \text{normalized\_arrival\_time}$) — *Earlier arrival yields higher priority risk*
- $R_p$: **Population Exposure Risk Factor** ($0.0 \le R_p \le 1.0$)
- $R_i$: **Infrastructure Exposure Risk Factor** ($0.0 \le R_i \le 1.0$)

---

## 📊 Weighting Scheme & Normalization Parameters

| Factor | Variable | Weight ($w_k$) | Normalization Formula | Rationale | Data Source & Status |
|---|---|---|---|---|---|
| **Flood Depth** | $R_d$ | `0.25` | $R_d = \min\left(1.0, \frac{\text{Depth (m)}}{5.0}\right)$ | Depths $> 5.0\text{m}$ cause structural failure & loss of life | Prototype Hydrodynamic Model (`PROTOTYPE_ASSUMPTION`) |
| **Water Velocity** | $R_v$ | `0.20` | $R_v = \min\left(1.0, \frac{\text{Velocity (m/s)}}{3.0}\right)$ | Velocities $> 3.0\text{m/s}$ sweep vehicles and persons away | Prototype Hydrodynamic Model (`PROTOTYPE_ASSUMPTION`) |
| **Arrival Risk** | $R_a$ | `0.25` | $R_a = 1.0 - \min\left(1.0, \frac{\text{Arrival Time (hrs)}}{3.0}\right)$ | **Earlier arrival time requires faster evacuation** | Prototype Hydrodynamic Model (`PROTOTYPE_ASSUMPTION`) |
| **Population Risk** | $R_p$ | `0.15` | $R_p = \min\left(1.0, \frac{\text{Population Exposed}}{5000}\right)$ | Higher settlement density increases human casualty risk | Census 2011 Demographics (`REAL — CENSUS 2011`) |
| **Infrastructure Risk** | $R_i$ | `0.15` | $R_i = \frac{\text{Facility Importance (P1=1.0, P2=0.7, P3=0.4, P4=0.2)}}{1.0}$ | Essential facilities (Hospitals, Power Grid) take precedence | Dataset 13 Infrastructure (`PARTIAL REAL DATA`) |

*Sum of Weights*: $w_d + w_v + w_a + w_p + w_i = 0.25 + 0.20 + 0.25 + 0.15 + 0.15 = 1.00$.

---

## 🏷️ Priority Score Classification Categories

| Score Range | Priority Rank | Action Category | Recommended HADR Response |
|---|---|---|---|
| **75.0 – 100.0** | **P1 CRITICAL** | Immediate Evacuation | Immediate emergency evacuation, life-safety alert, priority helicopter/boat rescue |
| **50.0 – 74.9** | **P2 HIGH** | High Priority Evacuation | High-priority staging, road closure enforcement, shelter preparation |
| **25.0 – 49.9** | **P3 MODERATE** | Precautionary Warning | Precautionary advisory, vulnerable population movement, monitoring |
| **0.0 – 24.9** | **P4 LOW** | Monitoring / Alert | Active monitoring, community radio updates, routine surveillance |
