# Betaflight Setup Guide

Betaflight is the most popular firmware for FPV drones. This guide covers the essential configuration steps.

## Connecting to Betaflight Configurator

1. Download Betaflight Configurator from the Chrome Web Store or GitHub releases
2. Connect your FC via USB
3. Select the correct COM port and click **Connect**

## Essential Configuration

### Ports Tab
- Enable **Serial RX** on the UART connected to your receiver
- Enable **MSP** on USB (default)

### Configuration Tab
- Set **Motor Protocol** to DSHOT600 (recommended for most builds)
- Enable **Bidirectional DSHOT** for RPM filtering
- Set **Gyro Update** and **PID Loop** to 8kHz/8kHz (F7/H7) or 8kHz/4kHz (F4)

### Receiver Tab
- Select your receiver protocol (CRSF for ELRS/Crossfire, SBUS for FrSky)
- Verify channel mapping matches your radio

### Modes Tab
- Assign **ARM** to a switch (required)
- Assign **ANGLE** mode for beginners
- Assign **BEEPER** for finding crashed quads
- Optional: **TURTLE MODE** (flip after crash)

## PID Tuning Basics

The default PIDs work well for most 5" builds. Only tune if you notice:
- **Oscillations** → reduce P
- **Slow response** → increase P
- **Bounce-back after flips** → increase D
- **Drift during hover** → adjust I

## OSD Setup

Configure the OSD to show:
- Battery voltage (critical for LiPo health)
- Flight time
- RSSI (signal strength)
- Warnings (low battery, failsafe)
