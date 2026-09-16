# 🌊 Boundary Condition Specifications & Framework

This directory houses the external boundary forcing definition files (`*.ext`, `*.bc`) for the Mettur Dam / Cauvery hydrodynamics model.

---

## 1. Upstream Boundary (Mettur Release / Breach)

* **Location**: Mettur Dam spillway (11.8016° N, 77.8016° E)
* **Parameter**: Upstream discharge $Q(t)$ in $\text{m}^3/\text{s}$ or stage $H(t)$ in meters.
* **Current Status**: `PENDING REAL HYDROGRAPH`.
* **Policy**: Zero fabricated hydrograph curves. Real inflow/outflow telemetry from Dataset 3 and Dataset 6 will supply boundary values.

---

## 2. Downstream Boundary (Cauvery Main Stem Outflow)

* **Location**: Downstream reach (Tiruchirappalli / Grand Anicut)
* **Parameter**: Rating curve $Q(H)$ or water surface stage $H(t)$.
* **Current Status**: `PENDING REAL HYDROGRAPH`.
