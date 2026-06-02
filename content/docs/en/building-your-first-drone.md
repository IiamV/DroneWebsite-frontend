# Building Your First Drone

A step-by-step overview of what it takes to build a 5-inch FPV drone from scratch.

## What You Need

### Tools
- Soldering iron (TS100 or Pinecil recommended)
- Solder (63/37 leaded or lead-free)
- Flush cutters
- Hex drivers (2mm, 2.5mm)
- Heat shrink tubing
- Loctite Blue (thread locker)
- Multimeter

### Components
- Frame (5-inch, e.g., iFlight Nazgul5 V3)
- Motors × 4 (e.g., iFlight XING2 2207 1800KV)
- 4-in-1 ESC (e.g., SpeedyBee F405 V4 stack)
- Flight Controller (included in stack)
- Propellers × 4+4 spares (e.g., HQProp 5x4x3)
- Battery (e.g., Tattu R-Line 6S 1300mAh)
- FPV Camera (e.g., RunCam Phoenix 2 SP)
- Receiver (e.g., ELRS EP2)
- Antenna, XT60 pigtail, zip ties

## Build Order

1. **Assemble the frame** — arms to bottom plate
2. **Mount motors** — one per arm, apply Loctite
3. **Install ESC** — solder battery lead and motor wires
4. **Stack the FC** — connect ESC-to-FC cable
5. **Install receiver** — solder to a UART on the FC
6. **Mount camera** — connect video and power
7. **Flash firmware** — Betaflight via USB
8. **Install props** — verify motor directions first
9. **Maiden flight** — open area, Angle mode first

## Common Mistakes

- Forgetting Loctite on motor screws (they vibrate loose)
- Wrong motor direction (verify in Betaflight motor tab, props OFF)
- Not adding a capacitor across battery pads (causes noise)
- Overtightening standoffs (cracks carbon fiber)
- Flying without configuring failsafe (dangerous)

## Cost Breakdown

| Component | Budget | Mid-range | Premium |
|---|---|---|---|
| Frame | $30 | $50 | $80 |
| Motors (×4) | $60 | $100 | $160 |
| FC + ESC Stack | $50 | $80 | $120 |
| Props (×8) | $10 | $15 | $20 |
| Battery | $30 | $45 | $60 |
| Camera | $20 | $35 | $50 |
| Receiver | $15 | $20 | $25 |
| **Total** | **$215** | **$345** | **$515** |
