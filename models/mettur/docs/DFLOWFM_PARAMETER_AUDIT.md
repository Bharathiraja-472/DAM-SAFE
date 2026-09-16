# ⚙️ D-Flow FM (v1.2.184) Numerical Parameter Audit

This document verifies the numerical and physical parameters configured in `d:/SIH2026/models/mettur/templates/mettur_base_template.mdu` against the installed Deltares D-Flow FM Version `1.2.184.Unknown`.

---

## 📊 Parameter Audit Matrix

| Parameter | Current Value | Version Compatibility (v1.2.184) | Scientific Meaning | Reason for Value | Status |
|---|---|---|---|---|---|
| `ModelType` | `2D` | Compatible | Depth-averaged 2D horizontal hydrodynamic equations | Standard for dam-break floodplain inundation modeling | `PROVISIONAL` |
| `CFLMax` | `0.70` | Compatible | Maximum Courant-Friedrichs-Lewy stability criterion ($\Delta t \le \text{CFL} \cdot \frac{\Delta x}{\sqrt{gh} + u}$) | Ensures numerical stability without excessive time-step reduction ($0.5 - 0.8$) | `PROVISIONAL` |
| `UnifFrictCoef` | `0.025` | Compatible | Uniform Manning's roughness coefficient ($n = 0.025\text{ s/m}^{1/3}$) | Baseline friction for natural alluvial channels; will be replaced by spatial LULC roughness | `PROVISIONAL / PENDING SPATIAL MAP` |
| `AdvectionType` | `33` | Compatible | Higher-order spatial advection discretization with flux limiter for unstructured grids | Minimizes numerical diffusion during rapid dam-break wave front propagation | `PROVISIONAL` |
| `Gravity` | `9.81` | Compatible | Acceleration due to gravity ($\text{m/s}^2$) | Standard gravitational constant | `VERIFIED` |
| `WaterDensity` | `1000.0` | Compatible | Fluid density ($\text{kg/m}^3$) | Standard freshwater density | `VERIFIED` |
| `BedLevType` | `3` | Compatible | Bed level interpolation at cell centers | Standard for cell-centered elevation sampling from GeoTIFF DEM | `VERIFIED` |
