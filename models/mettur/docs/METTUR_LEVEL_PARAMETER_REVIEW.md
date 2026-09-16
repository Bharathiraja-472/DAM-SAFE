# 📏 Mettur Dam Elevation & Storage Parameter Reconciliation

This document resolves the elevation parameters sourced from Dataset 2 (`d:/SIH2026/data/mettur_dam_dataset.csv`) to ensure consistent, un-confused elevation usage across all hydraulic models.

---

## 📊 Reconciled Mettur Elevation Matrix

| Parameter Name | Value (Imperial) | Value (Metric) | Source Field in Dataset 2 | Hydraulic / Model Meaning | Status |
|---|---|---|---|---|---|
| **Total Dam Structural Height** | `214 ft` | `65.23 m` | `Maximum Height` | Total physical wall height from foundation to road crest | `VERIFIED` |
| **Full Reservoir Level (FRL)** | `165 ft` | `50.29 m` | `Maximum Reservoir Height` | Maximum legal/structural reservoir water level height above riverbed sill | `VERIFIED` |
| **Usable Storage Depth** | `120 ft` | `36.58 m` | `Usable Water Height` | Operational water column height above dead storage sill level ($165\text{ ft} - 45\text{ ft}$) | `VERIFIED` |
| **Total Storage Capacity** | `95,660 Mcft` | `2,708.8 Mm³` | `Total Capacity` | Gross storage volume at FRL | `VERIFIED` |
| **Effective Storage Capacity** | `93,470 Mcft` | `2,646.7 Mm³` | `Effective Capacity` | Usable live storage volume above dead storage sill | `VERIFIED` |
| **Water Spread Area at FRL** | `59.25 sq miles` | `153.46 km²` | `Maximum Water Spread Area` | Surface area of Stanley Reservoir at FRL (165 ft) | `VERIFIED` |
| **Breach Bottom Elevation** | — | — | Not present in source | Bottom elevation of breach opening | `[PENDING REAL DATA / ENGINEERING DEFINITION]` |

---

## 🔍 Discrepancy Resolution Summary

> [!IMPORTANT]
> **Resolution of 120 ft vs 165 ft vs 214 ft:**
> - `214 ft` is the **physical masonry wall height** from deep foundation to top road crest.
> - `165 ft` is the **Full Reservoir Level (FRL)** maximum water height above deep sill.
> - `120 ft` is the **live/usable operational storage depth** above dead storage sill.
> - Breach elevation must **NEVER** be inferred blindly from dam height. It requires explicit engineering breach analysis.
