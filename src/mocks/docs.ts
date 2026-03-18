import type { DocPage } from '@/types'

export const mockDocs: DocPage[] = [
  // ── Getting Started ──────────────────────────────────────────────────────────
  {
    id: 'doc-gs',
    slug: ['getting-started'],
    title: 'Getting Started',
    content: `# Getting Started

Welcome to the **Drone Simulation Platform** — your all-in-one environment for learning drone technology, simulating builds, and downloading the Drone Application by Insai IDE.

## What You Can Do

- Browse the **Course Catalog** to learn drone fundamentals, assembly, and advanced tuning
- Explore the **Product Catalog** and use the compatibility filter to plan your build
- Download the **Drone Application by Insai** IDE to simulate and configure drones locally
- Manage your **Subscription** to unlock premium courses and the IDE download

## Quick Start

1. [Create an account](/auth/register) or [sign in](/auth/login)
2. Choose a [subscription plan](/subscription) that fits your needs
3. Head to [Courses](/courses) to start learning
4. Download the [IDE](/downloads) once you have a Basic or Pro subscription`,
    order: 1,
    parentSlug: null,
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'doc-gs-install',
    slug: ['getting-started', 'installation'],
    title: 'Installing the IDE',
    content: `# Installing the Drone Application by Insai

The IDE is available for Windows, macOS, and Linux. Head to the [Downloads](/downloads) page to get the installer for your platform.

## Windows

1. Download the \`.exe\` installer
2. Run the installer and follow the setup wizard
3. Launch **Drone Application by Insai** from the Start Menu

## macOS

1. Download the \`.dmg\` file
2. Open the disk image and drag the app to your **Applications** folder
3. On first launch, right-click → Open to bypass Gatekeeper if prompted

## Linux

1. Download the \`.AppImage\` file
2. Make it executable: \`chmod +x drone-app-insai-1.0.0-linux.AppImage\`
3. Run it: \`./drone-app-insai-1.0.0-linux.AppImage\`

## System Requirements

| | Minimum | Recommended |
|---|---|---|
| OS | Windows 10 / macOS 12 / Ubuntu 20.04 | Windows 11 / macOS 14 / Ubuntu 22.04 |
| CPU | 4-core 2.5 GHz | 8-core 3.5 GHz |
| RAM | 8 GB | 16 GB |
| GPU | OpenGL 4.1 | Dedicated GPU with 4 GB VRAM |
| Storage | 2 GB free | 5 GB free |`,
    order: 1,
    parentSlug: 'getting-started',
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'doc-gs-first-flight',
    slug: ['getting-started', 'first-flight'],
    title: 'Your First Simulated Flight',
    content: `# Your First Simulated Flight

Once the IDE is installed, follow these steps to run your first simulation.

## 1. Create a New Project

Open the IDE and click **New Project**. Select a preset drone (we recommend the *5-inch Freestyle* preset for beginners).

## 2. Configure Your Drone

The visual configurator lets you swap components from the catalog. Each change updates the physics model in real time.

## 3. Launch the Simulator

Click **Simulate** in the toolbar. The 3D environment loads with your configured drone ready to fly.

## Default Controls

| Action | Keyboard | Gamepad |
|---|---|---|
| Throttle up | W | Left stick up |
| Throttle down | S | Left stick down |
| Yaw left | A | Left stick left |
| Yaw right | D | Left stick right |
| Pitch forward | Up arrow | Right stick up |
| Pitch back | Down arrow | Right stick down |
| Roll left | Left arrow | Right stick left |
| Roll right | Right arrow | Right stick right |

## Tips for Beginners

- Start in **Stabilized** mode — the FC auto-levels the drone
- Use the **Slow Motion** toggle (Space) to practice precise maneuvers
- Check the **Telemetry Panel** to see battery voltage, motor temps, and GPS data`,
    order: 2,
    parentSlug: 'getting-started',
    updatedAt: new Date('2024-03-05'),
  },

  // ── Drone Components ─────────────────────────────────────────────────────────
  {
    id: 'doc-comp',
    slug: ['drone-components'],
    title: 'Drone Components',
    content: `# Drone Components

Understanding the anatomy of a drone is essential before you start building or simulating.

## The Core Stack

A typical FPV drone consists of:

- **Frame** — the structural backbone; determines size class (3", 5", 7")
- **Motors** — brushless motors convert electrical energy to thrust
- **ESCs** — Electronic Speed Controllers regulate motor RPM
- **Flight Controller** — the brain; reads sensors and adjusts motor output
- **Battery** — LiPo cells provide high-discharge power
- **Propellers** — convert motor rotation to lift and thrust

## Optional Components

- **FPV Camera** — live video feed to your goggles
- **Video Transmitter (VTX)** — broadcasts the camera signal
- **GPS Module** — enables position hold and return-to-home
- **Receiver (RX)** — receives control signals from your radio

## Size Classes

| Class | Prop Size | Typical Use |
|---|---|---|
| Micro | 2–3 inch | Indoor, proximity flying |
| Mini | 3–4 inch | Park flying, light freestyle |
| Standard | 5 inch | Freestyle, racing |
| Long-range | 7–10 inch | Cruising, cinematography |`,
    order: 2,
    parentSlug: null,
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'doc-comp-fc',
    slug: ['drone-components', 'flight-controllers'],
    title: 'Flight Controllers',
    content: `# Flight Controllers

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

For beginners: look for an **F4 or F7** with built-in OSD, barometer, and Bluetooth for wireless configuration via the SpeedyBee app.`,
    order: 1,
    parentSlug: 'drone-components',
    updatedAt: new Date('2024-02-22'),
  },
  {
    id: 'doc-comp-motors',
    slug: ['drone-components', 'motors'],
    title: 'Motors & KV Ratings',
    content: `# Motors & KV Ratings

Brushless motors are rated by their **KV value** — the number of RPM per volt with no load.

## KV and Battery Voltage

| Build Type | Battery | Recommended KV |
|---|---|---|
| 5" Freestyle | 4S (14.8V) | 2300–2600 KV |
| 5" Freestyle | 6S (22.2V) | 1700–1900 KV |
| 5" Racing | 4S | 2600–2800 KV |
| 7" Long-range | 6S | 1300–1500 KV |

## Stator Size

The stator size (e.g., **2207**) tells you the diameter (22mm) and height (7mm). Taller stators produce more torque; wider stators spin faster.

## Motor Mounting

Most 5" motors use an **M3 16×16mm** bolt pattern. Always check compatibility with your frame before ordering.`,
    order: 2,
    parentSlug: 'drone-components',
    updatedAt: new Date('2024-02-25'),
  },

  // ── Simulator Guide ───────────────────────────────────────────────────────────
  {
    id: 'doc-sim',
    slug: ['simulator-guide'],
    title: 'Simulator Guide',
    content: `# Simulator Guide

The **Drone Application by Insai** IDE includes a full physics simulator. This section covers everything you need to get the most out of it.

## Simulation Modes

| Mode | Description |
|---|---|
| **Stabilized** | FC auto-levels; great for beginners |
| **Acro** | Full manual control; used by experienced pilots |
| **GPS Hold** | Drone holds position; useful for photography |
| **Autonomous** | Follow a pre-programmed waypoint mission |

## Environments

The simulator ships with several environments:

- **Open Field** — flat terrain, ideal for learning basics
- **Urban Canyon** — buildings and obstacles for proximity flying
- **Indoor Warehouse** — tight spaces for micro drone practice
- **Mountain Ridge** — wind simulation and elevation changes

## Physics Settings

Adjust realism in **Settings → Physics**:

- Wind speed and direction
- Air density (altitude simulation)
- Battery discharge curve
- Motor response latency`,
    order: 3,
    parentSlug: null,
    updatedAt: new Date('2024-03-08'),
  },
  {
    id: 'doc-sim-telemetry',
    slug: ['simulator-guide', 'telemetry'],
    title: 'Telemetry & Blackbox',
    content: `# Telemetry & Blackbox

The IDE records full flight telemetry that you can analyze after each session.

## Live Telemetry Panel

During a simulation, the **Telemetry Panel** (View → Telemetry) shows:

- Battery voltage and current draw
- Motor temperatures and RPM
- GPS coordinates and altitude
- Attitude (roll, pitch, yaw)
- Signal strength (RSSI)

## Blackbox Recording

Every flight is automatically saved as a Blackbox log (\`.bbl\` file) in your project folder.

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
5. Repeat until the trace is clean`,
    order: 1,
    parentSlug: 'simulator-guide',
    updatedAt: new Date('2024-03-10'),
  },

  // ── API Reference ─────────────────────────────────────────────────────────────
  {
    id: 'doc-api',
    slug: ['api-reference'],
    title: 'API Reference',
    content: `# API Reference

The platform exposes a REST API for integrating with external tools and scripts.

## Authentication

All protected endpoints require a Bearer token obtained from Supabase Auth:

\`\`\`http
Authorization: Bearer <your-access-token>
\`\`\`

## Base URL

\`\`\`
https://your-deployment.vercel.app/api
\`\`\`

## Endpoints Overview

| Method | Path | Description |
|---|---|---|
| GET | /subscription/tiers | List all subscription tiers |
| GET | /subscription/status | Current user subscription |
| POST | /payment/create | Generate VNPay payment URL |
| GET | /courses | List accessible courses |
| GET | /courses/:slug | Course detail and modules |
| POST | /courses/:slug/progress | Save module progress |
| GET | /products | List products (paginated) |
| GET | /products/:slug | Product detail |
| GET | /downloads | List available downloads |
| GET | /downloads/:id/url | Get signed download URL |
| GET | /docs | Documentation tree |
| GET | /docs/:slug | Documentation page |
| GET | /user/profile | Get user profile |
| PATCH | /user/profile | Update profile |`,
    order: 4,
    parentSlug: null,
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: 'doc-api-auth',
    slug: ['api-reference', 'authentication'],
    title: 'Authentication API',
    content: `# Authentication API

## POST /api/auth/register

Create a new user account.

**Request body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Your Name"
}
\`\`\`

**Responses:**

| Status | Description |
|---|---|
| 201 | User created successfully |
| 400 | Validation error |
| 409 | Email already in use |
| 429 | Rate limit exceeded (10 req/min per IP) |

## POST /api/auth/callback

Handles the Supabase OAuth callback after social login. Exchanges the authorization code for a session.

**Query params:** \`code\` (string, required)

**Response:** Redirects to the originally requested page or \`/\`.`,
    order: 1,
    parentSlug: 'api-reference',
    updatedAt: new Date('2024-03-12'),
  },
]
