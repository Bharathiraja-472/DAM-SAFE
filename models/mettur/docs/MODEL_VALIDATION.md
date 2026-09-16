# 🩺 Mettur Delft3D-FM Model Validation Protocol

This document outlines the syntax, spatial, and physical validation checks required for the Mettur Dam / Cauvery D-Flow FM hydrodynamic model.

---

## 1. Syntactical MDU Validation

Before executing D-Flow FM (`dflowfm-cli.exe`), the MDU configuration file is validated against the following syntax criteria:

* **Executable Binary**: `D:\DAM-SAFE\delft3d\install_fm-suite\bin\dflowfm-cli.exe`
* **Version**: `1.2.184.Unknown`
* **Syntax Checks**:
  - `[General]` section contains valid `Program = D-Flow FM` & `MDUFormatVersion = 1.00`.
  - `[geometry]` section references existing Bathymetry files.
  - `[time]` section contains valid positive time steps (`TStart`, `TEnd`, `DtMax`).
  - `[physics]` section contains valid gravity ($9.81\text{ m/s}^2$) and friction parameters.

---

## 2. File Path & File Existence Checks

```text
┌──────────────────────────────────────────────┬────────────────────────┐
│ CHECK ITEM                                   │ STATUS                 │
├──────────────────────────────────────────────┼────────────────────────┤
│ Executable dflowfm-cli.exe                   │ VERIFIED               │
│ Batch launcher run_dflowfm.bat               │ VERIFIED               │
│ Bathymetry File (SRTM_Mettur_30m)            │ VERIFIED               │
│ MDU Template (mettur_base_template.mdu)      │ VERIFIED               │
│ MDU Base File (mettur_base.mdu)              │ VERIFIED               │
│ Boundary File (mettur_boundary.ext)          │ VERIFIED               │
│ Computational Mesh (mettur_cauvery_net.nc)   │ PENDING GRID GENERATION│
└──────────────────────────────────────────────┴────────────────────────┘
```

---

## 3. Log Capture Protocol

Execution diagnostics and CLI logs are saved under `d:/SIH2026/models/mettur/logs/`:
* `dflowfm_cli_test.log`: Standard output from executable verification runs.
* `mettur_base.dia`: D-Flow FM diagnostics output file upon model initialization.
