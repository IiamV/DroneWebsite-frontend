# Telemetry & Blackbox

The IDE records full flight telemetry that you can analyze after each session.

## Live Telemetry Panel

During a simulation, the **Telemetry Panel** (View → Telemetry) shows:

- Battery voltage and current draw
- Motor temperatures and RPM
- GPS coordinates and altitude
- Attitude (roll, pitch, yaw)
- Signal strength (RSSI)

## Blackbox Recording

Every flight is automatically saved as a Blackbox log (`.bbl` file) in your project folder.

### Analyzing Logs

Open the **Blackbox Analyzer** (Tools → Blackbox Analyzer) to:

1. Plot gyro, PID, and motor traces
2. Identify oscillations and tune PID values
3. Export data to CSV for external analysis

## PID Tuning Workflow

1. Fly a test session in Acro mode
2. Open the Blackbox Analyzer
3. Look for **P-term oscillations** on the gyro trace
4. Reduce P gain by 10% and re-test
5. Repeat until the trace is clean
