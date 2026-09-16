# Delft3D-FM Simulation Workspace

This module houses the execution workspace, input parameters, flow mesh configurations, and output rasters for **Delft3D-FM** (`dflowfm-cli.exe`).

---

## 📁 Subdirectory Layout

* `scenarios/`: Stored JSON scenario definitions submitted via UI.
* `configs/`: MDU configuration files generated for `dflowfm-cli.exe`.
* `inputs/`: Computational grid/mesh, cross-sections, and boundary condition files.
* `outputs/`: NetCDF map files and converted spatial GeoTIFF rasters (Depth, Velocity, Wave Arrival).

---

## ⚙️ Delft3D-FM Execution Workflow

```bash
# Example manual execution command
dflowfm-cli.exe --mdu simulation/configs/mettur_breach_scenario_01.mdu
```
