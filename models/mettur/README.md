# 🌊 Mettur Dam Delft3D-FM Base Model Workspace

This directory houses the structural model definition, MDU templates, computational domain documentation, bathymetry status, boundary frameworks, scenario configurations, and validation scripts for **D-Flow FM (Delft3D-FM Flexible Mesh)**.

---

## ⚙️ Installed Executable Telemetry

* **Executable Binary**: `D:\DAM-SAFE\delft3d\install_fm-suite\bin\dflowfm-cli.exe`
* **Batch Launcher**: `D:\DAM-SAFE\delft3d\install_fm-suite\bin\run_dflowfm.bat`
* **D-Flow FM Version**: `1.2.184.Unknown (Built Sep 07 2026)`
* **Compilation Support**: OpenMP (`yes`), MPI (`yes`), PETSc (`yes`), METIS (`yes`), PROJ (`yes`), Shapelib (`yes`), GDAL (`yes`).
* **Verification Status**: `VERIFIED` (Executable responds cleanly to `--help` & `-v`).

---

## 📁 Model Subdirectory Layout

```text
models/mettur/
├── base/                   # Baseline hydraulic flow model MDU configuration
├── geometry/               # D-Flow FM 2D unstructured flow mesh files (*_net.nc)
├── bathymetry/             # DEM processing copy & interpolated depth files
├── boundary/               # Upstream dam release & downstream boundary definitions
├── forcing/                # Hydrometeorological forcing & initial water levels
├── scenarios/              # Dam-break breach scenario configurations
│   ├── scenario_max_reservoir/  # Full Reservoir Level (FRL) breach template
│   ├── scenario_moderate/       # Normal operating level release template
│   └── scenario_custom/         # Custom user parameter breach template
├── templates/              # Validated MDU template syntax files
├── runs/                   # Execution workspace for model runs
├── output/                 # Raw Delft3D-FM NetCDF output files (DFM_map.nc)
├── logs/                   # Diagnostic execution logs (*.dia) & CLI stdout
├── validation/             # Synthetic syntax & physical validation scripts
├── docs/                   # Scientific documentation (DOMAIN.md, BATHYMETRY_STATUS.md, etc.)
└── README.md               # Master model documentation
```

---

## 🛡️ Scientific Integrity Policy

1. **Zero Data Mutation**: Original files in `d:/SIH2026/data/` remain **100% untouched**.
2. **Zero Fabricated Geometry**: Missing river vector bathymetry and high-frequency boundary hydrographs are explicitly badged as `PENDING REAL DATA` or `HYDROLOGIC RIVER GEOMETRY PENDING ACQUISITION`.
3. **No Unsubstantiated Claims**: The model structure is validated for syntactical correctness before triggering full hydrodynamic execution.
