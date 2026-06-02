# Flight Controllers

The flight controller (FC) is the central processing unit of your drone. It reads sensor data and adjusts motor speeds many times per second to keep the drone stable.

## How It Works

1. The **gyroscope** measures angular velocity on all three axes
2. The **accelerometer** measures linear acceleration
3. The **PID controller** calculates the correction needed
4. Motor outputs are updated at 8 kHz (or higher on F7 processors)

## Popular Firmware

| Firmware | Best For |
|---|---|
| **Betaflight** | Racing and freestyle; most popular |
| **INAV** | GPS navigation and autonomous flight |
| **ArduPilot** | Advanced autonomous missions |
| **Cleanflight** | Legacy; largely replaced by Betaflight |

## Processor Tiers

- **F4** (STM32F405) — solid performance, widely supported
- **F7** (STM32F745) — faster, supports higher loop rates
- **H7** (STM32H743) — top-tier, used in professional builds

## Choosing an FC

For beginners: look for an **F4 or F7** with built-in OSD, barometer, and Bluetooth for wireless configuration via the SpeedyBee app.
