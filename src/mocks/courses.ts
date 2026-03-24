import type { Course } from '@/types'

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    slug: 'intro-to-drones',
    title: 'Introduction to Drones',
    description: 'Learn the fundamentals of drone technology, components, and safe flying practices.',
    thumbnailUrl: '/images/courses/intro-drones.jpg',
    category: 'fundamentals',
    difficulty: 'beginner',
    durationMinutes: 90,
    requiredTier: 'free',
    modules: [
      {
        id: 'module-1-1',
        courseId: 'course-1',
        title: 'What is a Drone?',
        videoUrl: '/videos/courses/intro-drones/what-is-a-drone.mp4',
        content: `# What is a Drone?

A **drone**, formally known as an Unmanned Aerial Vehicle (UAV), is an aircraft that operates without a human pilot on board. Drones can be controlled remotely by a human operator or fly autonomously through pre-programmed flight plans managed by onboard computers.

## A Brief History

The concept of unmanned flight dates back to the early 20th century. Military applications drove early development — from target practice drones in the 1930s to reconnaissance UAVs in the Vietnam War era. The real revolution came in the 2000s when miniaturized electronics, brushless motors, and lithium polymer batteries made small, affordable drones possible for consumers.

By 2015, the consumer drone market had exploded. DJI's Phantom series brought aerial photography to hobbyists worldwide. Today, drones are used in agriculture, construction, search and rescue, filmmaking, racing, and scientific research.

## Types of Drones

| Type | Description | Common Use |
|---|---|---|
| **Multirotor** | 3+ rotors, VTOL capable | Photography, FPV racing, inspection |
| **Fixed-wing** | Airplane-style, longer range | Mapping, agriculture, surveillance |
| **Single rotor** | Helicopter-style | Heavy lift, agriculture |
| **Hybrid VTOL** | Takes off vertically, transitions to fixed-wing | Long-range delivery |

Most hobbyist and FPV drones are **multirotors** — specifically quadcopters (4 rotors), though hexacopters (6) and octocopters (8) exist for heavier payloads.

## How Multirotors Achieve Stable Flight

A quadcopter achieves stability through differential motor speed. Two motors spin clockwise (CW) and two spin counter-clockwise (CCW). This cancels out the torque that would otherwise spin the entire frame.

- **Throttle** — all motors increase/decrease speed equally
- **Roll** — left motors speed up, right motors slow down (or vice versa)
- **Pitch** — front motors speed up, rear motors slow down (or vice versa)
- **Yaw** — CW motors speed up while CCW motors slow down (or vice versa)

The flight controller runs this calculation hundreds of times per second using gyroscope and accelerometer data to keep the drone stable.

## Key Takeaways

- Drones are aircraft without onboard pilots, controlled remotely or autonomously
- Multirotors are the most common type for hobbyists and FPV pilots
- Stability is achieved through differential motor speed, managed by the flight controller
- The industry has grown from military origins to a massive consumer and commercial market`,
        order: 1,
      },
      {
        id: 'module-1-2',
        courseId: 'course-1',
        title: 'Drone Components Overview',
        videoUrl: '/videos/courses/intro-drones/components-overview.mp4',
        content: `# Drone Components Overview

Understanding what goes into a drone is the foundation of everything else — assembly, tuning, troubleshooting, and upgrading. Every FPV quadcopter shares the same core set of components, even if the specific parts vary widely.

## The Core Components

### 1. Frame
The frame is the structural skeleton of the drone. It holds everything together and determines the size class (measured by the diagonal motor-to-motor distance in millimeters, or by propeller size in inches).

- **Material**: Most FPV frames use 3K carbon fiber for its strength-to-weight ratio
- **Size classes**: 3-inch (micro), 5-inch (standard FPV), 7-inch (long range), 10-inch+ (heavy lift)
- **Geometry**: True-X, stretched-X, and H-frame are the most common layouts

### 2. Motors
Brushless DC motors convert electrical energy into rotational force. Each motor is rated by its **stator size** (e.g., 2207 = 22mm diameter, 7mm height) and **KV rating** (RPM per volt).

- Higher KV = faster spinning, better for smaller props and 4S batteries
- Lower KV = more torque, better for larger props and 6S batteries
- A typical 5-inch freestyle build uses 2207 motors at 1800–2400KV

### 3. Electronic Speed Controllers (ESC)
ESCs receive throttle signals from the flight controller and regulate the power delivered to each motor. Modern FPV builds use a **4-in-1 ESC** that controls all four motors from a single board.

- **Current rating**: 30A, 45A, 60A — must exceed your motor's peak draw
- **Firmware**: BLHeli_32 and AM32 are the most common, enabling features like bidirectional DSHOT
- **Protocol**: DSHOT300, DSHOT600 — digital protocols with no calibration needed

### 4. Flight Controller (FC)
The brain of the drone. The FC reads sensor data (gyroscope, accelerometer, barometer) and sends corrective signals to the ESCs thousands of times per second.

- **Firmware**: Betaflight is the most popular for FPV; ArduPilot/INAV for autonomous flight
- **Processor**: F4 (STM32F405) and F7/H7 (STM32H743) are current standards
- **Sensors**: ICM-42688-P gyro is the current gold standard for low noise

### 5. Battery
LiPo (Lithium Polymer) batteries power everything. Key specs:

- **Cell count (S)**: 4S = 14.8V nominal, 6S = 22.2V nominal
- **Capacity (mAh)**: Higher = longer flight time but more weight
- **C rating**: Discharge rate multiplier — a 100C 1500mAh battery can deliver 150A continuously
- **Connector**: XT60 is standard for 5-inch builds

### 6. Receiver (RX)
The receiver picks up signals from your radio transmitter. Modern systems use:

- **ExpressLRS (ELRS)**: Open-source, ultra-low latency, long range
- **TBS Crossfire**: Reliable long-range system
- **FrSky**: Popular legacy system

### 7. FPV Camera + Video Transmitter (VTX)
The FPV camera captures the live video feed, which the VTX broadcasts to your goggles.

- **Analog**: Lower latency, works with most goggles, lower image quality
- **Digital**: DJI O3, Walksnail Avatar — HD quality with acceptable latency

## Component Interaction Diagram

\`\`\`
Battery → ESC → Motors
           ↕
    Flight Controller ← Receiver ← Radio Transmitter
           ↕
      FPV Camera → VTX → Goggles
\`\`\`

## Summary

Every component has a specific role, and they must all be compatible with each other. In the next module, we'll cover safety and regulations before you start flying.`,
        order: 2,
      },
      {
        id: 'module-1-3',
        courseId: 'course-1',
        title: 'Safety and Regulations',
        videoUrl: '/videos/courses/intro-drones/safety-regulations.mp4',
        content: `# Safety and Regulations

Flying drones is a serious responsibility. Drones can cause injury, property damage, and interfere with manned aircraft if operated carelessly. Understanding the rules before you fly is not optional — it's essential.

## Regulatory Frameworks

Regulations vary by country, but most follow similar principles:

### United States (FAA)
- Drones under 250g: Minimal restrictions, but rules still apply in controlled airspace
- Drones 250g–25kg: Must be registered with the FAA ($5 fee, 3-year registration)
- **Part 107**: Commercial drone pilots must pass a knowledge test and obtain a Remote Pilot Certificate
- **LAANC**: Low Altitude Authorization and Notification Capability — get instant airspace authorization via apps like AirMap or Aloft

### European Union (EASA)
- **Open Category**: Sub-250g or low-risk operations, no authorization needed
- **Specific Category**: Higher risk, requires operational authorization
- **Certified Category**: Equivalent to manned aviation

### General Rules (Most Countries)
- Do not fly over people or moving vehicles
- Do not fly near airports or heliports without authorization
- Maximum altitude: typically 400ft (120m) AGL
- Always maintain visual line of sight (VLOS)
- Do not fly at night without proper lighting and authorization
- Never fly under the influence of alcohol or drugs

## Pre-Flight Safety Checklist

Before every flight, run through this checklist:

1. **Props**: Inspect for cracks, chips, or imbalance. Replace any damaged props
2. **Motors**: Spin each motor by hand — should spin freely with no grinding
3. **Battery**: Check voltage, inspect for swelling or damage
4. **Frame**: Check for cracks, loose screws, and secure motor mounts
5. **Connections**: Verify all connectors are secure
6. **Flight controller**: Confirm firmware is up to date, sensors are calibrated
7. **Failsafe**: Test that your failsafe (RTH or disarm) is configured correctly
8. **Airspace**: Check for NOTAMs and TFRs in your area

## Flying Safely

- **Start in a simulator**: Spend at least 10–20 hours in a simulator before flying a real drone
- **Choose open areas**: Parks, fields, and designated flying sites away from people
- **Arm/disarm carefully**: Never arm the drone while people are nearby
- **Battery management**: Land before the battery reaches critical voltage (3.5V/cell)
- **Fly with a spotter**: A second person watching for hazards is invaluable

## LiPo Battery Safety

LiPo batteries are energy-dense and can catch fire if mishandled:

- Never charge unattended
- Use a LiPo-safe bag or metal container for charging and storage
- Never charge a swollen or damaged battery — dispose of it safely
- Store at storage voltage (3.8V/cell) if not flying for more than a few days
- Never over-discharge below 3.5V/cell under load

## Key Takeaways

- Register your drone and understand your local regulations before flying
- Run a pre-flight checklist every single time
- Treat LiPo batteries with respect — they are a fire hazard if mishandled
- Start in a simulator to build muscle memory before risking real hardware`,
        order: 3,
      },
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'course-2',
    slug: 'drone-assembly-guide',
    title: 'Building Your First FPV Drone',
    description: 'Step-by-step guide to assembling a 5-inch FPV racing drone from scratch.',
    thumbnailUrl: '/images/courses/fpv-assembly.jpg',
    category: 'assembly',
    difficulty: 'intermediate',
    durationMinutes: 180,
    requiredTier: 'basic',
    modules: [
      {
        id: 'module-2-1',
        courseId: 'course-2',
        title: 'Choosing Your Frame',
        videoUrl: '/videos/courses/drone-assembly-guide/choosing-your-frame.mp4',
        content: `# Choosing Your Frame

The frame is the first decision you make when building a drone, and it shapes every other component choice. A good frame is stiff, repairable, and sized appropriately for your flying style.

## Frame Size Classes

| Size | Prop Size | Use Case | Typical Weight |
|---|---|---|---|
| **Micro (2–3 inch)** | 2–3" | Indoor, proximity flying | 50–150g |
| **Mini (4 inch)** | 4" | Park flying, light freestyle | 150–250g |
| **Standard (5 inch)** | 5" | Freestyle, racing, general FPV | 250–400g |
| **Long range (7 inch)** | 7" | Efficiency, long range | 400–600g |
| **Heavy lift (10 inch+)** | 10"+ | Cinematography, payload | 800g+ |

For your first build, **5-inch is the sweet spot**. Parts are widely available, the community is huge, and the performance ceiling is very high.

## Frame Geometry

### True-X
Motors are equidistant from the center. Balanced handling, good for both freestyle and racing. Most popular geometry.

### Stretched-X
Rear motors are pushed back, creating a longer front-to-rear distance. More stable at high speed, preferred by racers.

### H-Frame
Motors at the corners of a rectangle. Older design, less common now. More space for electronics.

## What to Look For

**Arm thickness**: 4mm arms are standard for 5-inch. Thicker = heavier but more durable. 5mm arms are used in more durable "toothpick" style frames.

**Stack mounting**: Most 5-inch frames support 30x30mm stacks. Some also support 20x20mm for smaller components.

**Camera mount**: Check the camera mount angle range and whether it fits your camera size (micro vs. full-size).

**Repairability**: Can you buy replacement arms? Carbon fiber breaks — you want a frame where you can replace individual arms rather than the whole frame.

## Recommended Starter Frames

- **iFlight Nazgul5 V3**: Excellent build quality, widely available, great community support
- **TBS Source One V5**: Open-source design, very affordable, replaceable arms
- **DJI F450**: If you're building a beginner quad for learning (not FPV racing), the F450's integrated PDB simplifies wiring enormously

## Tools You'll Need

Before assembly, gather:
- M2 and M3 hex drivers (1.5mm, 2mm, 2.5mm)
- Threadlocker (Loctite Blue 243) for motor screws
- Soldering iron (65W minimum, temperature-controlled)
- Solder (63/37 rosin core, 0.8mm)
- Flux pen
- Multimeter
- Zip ties and double-sided tape`,
        order: 1,
      },
      {
        id: 'module-2-2',
        courseId: 'course-2',
        title: 'Motor and ESC Installation',
        videoUrl: '/videos/courses/drone-assembly-guide/motor-esc-installation.mp4',
        content: `# Motor and ESC Installation

Installing motors and ESCs correctly is one of the most critical steps in the build. Poor solder joints here cause crashes, fires, and frustration.

## Motor Orientation

On a quadcopter, motors spin in specific directions to cancel torque:

\`\`\`
  CCW (M2) ←  → CW (M1)
      ↑              ↑
      |    FRONT     |
      ↓              ↓
  CW (M3)  ←  → CCW (M4)
\`\`\`

Most modern flight controllers and Betaflight handle motor direction remapping in software, but it's good practice to mount motors in the correct physical orientation.

## Mounting Motors

1. Thread the motor wires through the arm before mounting
2. Apply a small drop of Loctite Blue to each motor screw
3. Tighten in a cross pattern to ensure even seating
4. Do not overtighten — M3 screws in carbon fiber strip easily

**Torque spec**: ~0.5–0.7 Nm for M3 screws in carbon fiber

## Soldering the ESC

### Preparing the ESC Pads

1. Apply flux to each motor pad on the ESC
2. Pre-tin the pads with a small amount of solder
3. Pre-tin the motor wire ends (strip 3–4mm, twist, tin)

### Making the Connection

1. Hold the wire against the pad
2. Touch the iron to the wire (not the pad) — heat transfers through
3. The solder should flow and create a shiny, volcano-shaped joint
4. Hold still for 2–3 seconds while it cools — do not blow on it

### Motor Wire Order

The order of the three motor wires to the ESC determines spin direction. If the motor spins the wrong way, swap any two of the three wires. In Betaflight, you can also reverse direction in the Motors tab without resoldering.

## Soldering the Battery Lead

The battery lead (XT60 connector) connects to the ESC's main power pads. This is the highest-current joint in the build.

- Use 12–14 AWG silicone wire
- Use plenty of solder — these pads need a solid, low-resistance connection
- Add a capacitor (1000–2200µF, 35V+) across the battery pads to filter voltage spikes

## Continuity Check

Before powering up:
1. Set your multimeter to continuity mode
2. Check that positive and negative battery pads are NOT shorted
3. Check each motor phase for continuity to its ESC pad

**Never connect a battery without doing a continuity check first.**

## Stack Assembly

Most 5-inch builds use a stack: ESC on the bottom, FC on top, separated by M3 standoffs.

1. Mount the ESC to the bottom plate with M3 nylon standoffs (30x30mm pattern)
2. Connect the FC to the ESC using the provided ribbon cable or solder pads
3. Mount the FC on top of the standoffs
4. Route motor wires cleanly — use zip ties to prevent them from hitting props`,
        order: 2,
      },
      {
        id: 'module-2-3',
        courseId: 'course-2',
        title: 'Flight Controller Configuration',
        videoUrl: '/videos/courses/drone-assembly-guide/fc-configuration.mp4',
        content: `# Flight Controller Configuration

With the hardware assembled, it's time to configure Betaflight. This is where your drone gets its personality — how it responds to your inputs and how it stabilizes itself.

## Connecting to Betaflight Configurator

1. Download Betaflight Configurator from the official GitHub releases
2. Connect your FC to your computer via USB
3. Select the correct COM port and click Connect
4. If the FC isn't recognized, install the CP210x or CH340 USB driver

## Initial Setup Tabs

### Ports Tab
Configure which UART each peripheral uses:
- **UART1**: Usually USB (don't change)
- **UART2**: Receiver (set to Serial RX)
- **UART3**: VTX (SmartAudio or Tramp)
- **UART4**: GPS (if applicable)

### Configuration Tab
Key settings:
- **ESC/Motor protocol**: Set to DSHOT600 for BLHeli_32 ESCs
- **Receiver mode**: Serial (UART) for ELRS/Crossfire
- **Accelerometer**: Enable for angle/horizon mode
- **Barometer**: Enable if present (useful for altitude hold)
- **Arming angle**: Set to 180° to allow arming at any angle (advanced users only)

### Receiver Tab
- Set receiver type to **CRSF** (for ELRS/Crossfire) or **SBUS**
- Verify all channels move correctly when you move your sticks
- Set channel map to **TAER1234** (Throttle, Aileron, Elevator, Rudder)
- Configure deadband: 5–10 on center, 0 on yaw

### Motors Tab
**With props OFF:**
1. Enable the motor test slider
2. Spin each motor individually and verify correct direction
3. If a motor spins the wrong way, use BLHeli Configurator to reverse it (or swap two wires)

### PID Tuning Tab
For your first flight, use the default PIDs or a community preset for your frame. Don't tune PIDs until you've verified the drone flies safely.

## Failsafe Configuration

This is critical for safety:
1. Go to the Failsafe tab
2. Set Stage 1 to **Drop** (motors cut immediately on signal loss)
3. Or set to **Land** if you have GPS
4. Test by turning off your transmitter while connected — verify the failsafe triggers

## Modes Tab

Set up your flight modes on switches:
- **Arm**: A dedicated arm switch (not a stick combination)
- **Angle/Horizon**: Self-leveling modes for beginners
- **Acro (no mode set)**: Full manual, no self-leveling — the standard for FPV
- **Beeper**: Useful for finding a crashed drone
- **Turtle mode**: Flip over after a crash without walking to the drone

## Pre-Flight Verification

Before your first flight:
1. Verify props are on correctly (CW props on CW motors, CCW on CCW)
2. Arm the drone in a safe area and verify all motors spin
3. Gently throttle up — the drone should lift evenly without drifting
4. If it drifts, check motor direction and prop orientation`,
        order: 3,
      },
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'course-3',
    slug: 'advanced-pid-tuning',
    title: 'Advanced PID Tuning and Flight Optimization',
    description: 'Master PID tuning techniques to achieve smooth, responsive flight performance.',
    thumbnailUrl: '/images/courses/pid-tuning.jpg',
    category: 'tuning',
    difficulty: 'advanced',
    durationMinutes: 240,
    requiredTier: 'pro',
    modules: [
      {
        id: 'module-3-1',
        courseId: 'course-3',
        title: 'Understanding PID Theory',
        videoUrl: '/videos/courses/advanced-pid-tuning/pid-theory.mp4',
        content: `# Understanding PID Theory

PID control is the mathematical heart of every modern flight controller. Understanding it deeply is what separates pilots who can tune from pilots who just copy presets.

## What is a PID Controller?

PID stands for **Proportional, Integral, Derivative**. It's a feedback control loop that continuously calculates an error value (the difference between desired and actual state) and applies a correction.

In a drone, the desired state is the angle or rotation rate you command with your sticks. The actual state is what the gyroscope measures. The PID controller's job is to make those match as quickly and smoothly as possible.

## The Three Terms

### P — Proportional
The P term responds to the **current error**. If the drone is tilted 10° when you want 0°, P applies a correction proportional to that 10°.

- **Too low P**: Drone feels mushy, slow to respond, may oscillate slowly
- **Too high P**: Drone feels twitchy, may oscillate rapidly (high-frequency "propwash")
- **Symptoms of correct P**: Crisp, immediate response to stick inputs

### I — Integral
The I term responds to **accumulated error over time**. It corrects for persistent offsets that P alone can't fix — like wind pushing the drone off course, or a slightly unbalanced build.

- **Too low I**: Drone drifts, doesn't hold position/angle, "wags" in wind
- **Too high I**: Slow, mushy oscillations, "I-term windup" on hard maneuvers
- **Symptoms of correct I**: Drone holds its attitude without drifting

### D — Derivative
The D term responds to the **rate of change of error**. It acts as a damper, slowing down the correction before it overshoots.

- **Too low D**: Overshoots on corrections, bouncy feel, propwash oscillations
- **Too high D**: Motors get hot, high-frequency noise, sluggish feel
- **Symptoms of correct D**: Smooth, damped response with no bounce

## The Tuning Process

### Step 1: Start with P
Increase P until you see high-frequency oscillations (the drone "buzzes"), then back off 20–30%.

### Step 2: Set D
Increase D until the oscillations from high P are damped. D should be roughly 1/3 to 1/2 of P.

### Step 3: Adjust I
I is usually fine at defaults. Increase if the drone drifts; decrease if you see slow oscillations.

### Step 4: Use Blackbox
Record a flight with Blackbox logging enabled. Analyze the gyro traces in Betaflight Blackbox Explorer. Look for:
- **Gyro noise**: High-frequency noise means too much D or mechanical vibration
- **Step response**: How quickly does the drone reach the commanded rate?
- **Propwash**: Oscillations during throttle changes after maneuvers

## RPM Filtering

Modern Betaflight uses **RPM filtering** (requires bidirectional DSHOT) to dynamically filter out motor noise at the exact frequencies generated by each motor. This allows you to run lower D values while maintaining stability.

Enable bidirectional DSHOT in the Configuration tab, then enable RPM filtering in the Filtering tab. This is the single biggest improvement you can make to a modern build.

## Feed Forward

Feed Forward (FF) is a fourth term in Betaflight that responds to **stick movement** rather than error. It makes the drone feel more "connected" to your inputs by anticipating the needed correction.

- Increase FF for a more direct, responsive feel
- Decrease FF if the drone overshoots on stick inputs`,
        order: 1,
      },
      {
        id: 'module-3-2',
        courseId: 'course-3',
        title: 'Blackbox Analysis',
        videoUrl: '/videos/courses/advanced-pid-tuning/blackbox-analysis.mp4',
        content: `# Blackbox Analysis

Blackbox logging is the most powerful tool available for PID tuning. It records gyroscope data, motor outputs, RC inputs, and more at up to 4kHz, giving you a complete picture of what your drone is doing in flight.

## Setting Up Blackbox

In Betaflight Configurator → Blackbox tab:
- **Device**: SD card (preferred) or onboard flash
- **Logging rate**: 1kHz for general tuning, 2–4kHz for detailed analysis
- **Debug mode**: Set to GYRO_SCALED for basic analysis, or specific modes for targeted debugging

## Betaflight Blackbox Explorer

Download from the official Betaflight GitHub. Open a .bbl or .bfl log file.

### Key Traces to Analyze

**gyroADC[0,1,2]** — Raw gyroscope data (roll, pitch, yaw). Should be smooth with minimal noise.

**gyroUnfilt[0,1,2]** — Unfiltered gyro. Compare to filtered to see how much noise your filters are removing.

**axisP[0,1,2]** — P term output. Should track the error signal cleanly.

**axisD[0,1,2]** — D term output. High-frequency spikes here indicate noise or too-high D.

**motor[0,1,2,3]** — Motor outputs. Should be smooth. Spikes indicate oscillations reaching the motors.

## Reading the Step Response

The step response shows how quickly your drone reaches a commanded rotation rate. In Blackbox Explorer:

1. Find a section where you made a sharp stick input
2. Look at the gyro trace — how quickly does it reach the commanded rate?
3. Does it overshoot? Does it oscillate before settling?

**Ideal step response**: Reaches commanded rate in ~20–30ms, slight overshoot (5–10%), settles cleanly.

## Identifying Propwash

Propwash is oscillation that occurs when the drone flies through its own turbulent wake — typically after a dive or flip when you add throttle.

In Blackbox, propwash appears as:
- Oscillations in the gyro trace during throttle-up after a maneuver
- Correlated spikes in all three axes
- Motor outputs spiking unevenly

**Fixes for propwash**:
- Increase D term (most effective)
- Increase D-term low-pass filter cutoff
- Enable RPM filtering
- Reduce I-term (prevents I-term windup contributing to propwash)
- Adjust throttle boost settings

## Noise Analysis

In the Blackbox Explorer, use the **Spectrum Analyzer** (Ctrl+A) to view the frequency content of your gyro signal.

- Peaks at motor frequencies = mechanical vibration (check motor screws, prop balance)
- Broad high-frequency noise = electrical noise (add capacitor, check solder joints)
- Peaks that move with throttle = motor noise (use RPM filtering)

## Practical Workflow

1. Fly a 2-minute pack with varied maneuvers
2. Download the log and open in Blackbox Explorer
3. Check gyro noise floor — should be below ±5 deg/s at hover
4. Check step response on a sharp roll input
5. Check for propwash on a dive-and-pull maneuver
6. Adjust PIDs based on findings
7. Repeat until satisfied`,
        order: 2,
      },
    ],
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'course-4',
    slug: 'fpv-flying-basics',
    title: 'FPV Flying Basics',
    description: 'Get started with FPV flying using a simulator before taking to the skies.',
    thumbnailUrl: '/images/courses/fpv-basics.jpg',
    category: 'flying',
    difficulty: 'beginner',
    durationMinutes: 120,
    requiredTier: 'free',
    modules: [
      {
        id: 'module-4-1',
        courseId: 'course-4',
        title: 'Setting Up Your Simulator',
        videoUrl: '/videos/courses/fpv-flying-basics/simulator-setup.mp4',
        content: `# Setting Up Your Simulator

Before you risk real hardware, spend time in a simulator. The muscle memory you build there transfers directly to real flying — and crashes in a simulator cost nothing.

## Recommended Simulators

### Liftoff: Micro Drone Racing
Best for learning the basics. Forgiving physics, good for absolute beginners. Available on Steam.

### Velocidrone
The most realistic physics engine. Used by professional racers for training. Slightly steeper learning curve but worth it.

### DRL Simulator (Drone Racing League)
Official simulator of the DRL. Great for learning race lines and gate flying.

### Uncrashed: FPV Drone Simulator
Excellent for freestyle. Beautiful environments, realistic physics.

## Controller Setup

You need a real radio transmitter connected to your PC — do not use a keyboard or gamepad. The muscle memory from a proper radio is what you're building.

**Recommended entry-level radios**:
- RadioMaster Boxer (ELRS built-in)
- RadioMaster TX16S (flagship, hall gimbals)
- BetaFPV LiteRadio 3 Pro (budget option)

Connect via USB or use a USB dongle. In the simulator, go to Settings → Controller and map your axes.

**Stick mode**: Most FPV pilots use **Mode 2** (throttle on left stick, roll/pitch on right stick).

## Simulator Settings

For realistic training, configure:
- **Physics**: Set to realistic/hard (not arcade)
- **Rates**: Match your real Betaflight rates (start with 200 deg/s on all axes)
- **Quad**: Choose a 5-inch freestyle quad

## Training Progression

### Week 1–2: Basic Control
- Hover in place for 30 seconds without drifting
- Fly slow figure-8 patterns
- Practice landing on a target

### Week 3–4: Orientation
- Fly toward yourself (nose-in) — this reverses left/right
- Practice flying in all four orientations
- Fly slow circuits around obstacles

### Week 5–8: Speed and Precision
- Increase speed gradually
- Fly through gates and gaps
- Practice smooth throttle management

### Month 2+: Freestyle Basics
- Learn to roll and flip
- Practice split-S turns
- Start learning power loops

**Target**: 20+ hours in the simulator before your first real flight.`,
        order: 1,
      },
      {
        id: 'module-4-2',
        courseId: 'course-4',
        title: 'Basic Maneuvers',
        videoUrl: '/videos/courses/fpv-flying-basics/basic-maneuvers.mp4',
        content: `# Basic Maneuvers

Once you have basic control in the simulator, it's time to learn the fundamental maneuvers that form the building blocks of all FPV flying.

## Throttle Management

Throttle is the most important skill in FPV. Unlike a car, a drone needs constant throttle input to maintain altitude.

**Key concepts**:
- **Hover throttle**: The throttle position where the drone neither climbs nor descends. Typically 30–40% on a well-tuned 5-inch.
- **Throttle anticipation**: Add throttle before a turn, not during. The drone loses altitude in turns.
- **Smooth inputs**: Jerky throttle causes oscillations and propwash. Think of it as a dial, not a switch.

## The Four Basic Maneuvers

### 1. Hover
Hold the drone stationary at a fixed altitude and position. Sounds simple — it's not. Practice until you can hover for 60 seconds without significant drift.

**Common mistakes**:
- Overcorrecting (leads to oscillation)
- Not anticipating drift (wind, slight imbalance)
- Staring at the drone instead of the FPV feed

### 2. Forward Flight
Pitch forward to fly in a straight line. Maintain altitude with throttle.

**Practice drill**: Fly a straight line 50m, stop, return. Repeat until the line is truly straight.

### 3. Banked Turn
Roll into a turn while maintaining altitude. This requires adding throttle as you roll — the drone loses lift when banked.

**Practice drill**: Fly a circle of consistent radius. The circle should be flat, not a spiral.

### 4. Yaw Turn
Rotate the drone on its vertical axis without moving laterally. Used for pointing the camera.

**Practice drill**: Hover and yaw 360° in place. Then yaw while flying forward (carving turn).

## The Figure-8

The figure-8 combines all four basic inputs and is the classic beginner drill:

1. Fly forward
2. Bank left into a circle
3. At the bottom of the circle, bank right into a circle in the opposite direction
4. Repeat

A clean figure-8 means your throttle management, roll, and pitch coordination are solid.

## Nose-In Flying

When the drone is flying toward you, left and right are reversed from your perspective. This is one of the hardest things for beginners to master.

**Training method**: In the simulator, fly toward a wall and practice hovering nose-in. Then practice slow nose-in circles. Do this until it feels natural.

## Reading the FPV Feed

Flying FPV is different from flying line-of-sight. Tips:
- **Horizon line**: Use the horizon in your goggles to judge bank angle
- **Ground texture**: Use ground features to judge speed and altitude
- **Peripheral vision**: Your goggles show a wide FOV — use all of it
- **OSD**: Your on-screen display shows battery voltage, flight time, and other data — glance at it regularly`,
        order: 2,
      },
      {
        id: 'module-4-3',
        courseId: 'course-4',
        title: 'Your First Real Flight',
        videoUrl: '/videos/courses/fpv-flying-basics/first-real-flight.mp4',
        content: `# Your First Real Flight

After 20+ hours in the simulator, you're ready to fly real hardware. The transition is exciting but humbling — real drones behave differently from simulators in subtle ways.

## Choosing Your First Flying Location

- **Open field**: Minimum 50m x 50m of clear space
- **No people**: Fly alone or with a spotter, away from bystanders
- **No obstacles**: For your first flights, avoid trees, buildings, and power lines
- **Legal**: Check airspace, register your drone, follow local rules

## Pre-Flight Checklist

1. Props tight and correct orientation (CW/CCW)
2. Battery fully charged and secured
3. All connections verified
4. Betaflight connected — verify sensor data looks correct
5. Failsafe configured and tested
6. Radio bound and all channels responding correctly
7. Video feed clear in goggles

## The First Hover

1. Place the drone 5m in front of you, nose pointing away
2. Put on your goggles
3. Arm the drone
4. Slowly increase throttle to hover height (about 1m)
5. Hold the hover for 30 seconds
6. Land gently

**What to expect**: The drone will feel more responsive than the simulator. It may drift slightly. Don't overcorrect — small, smooth inputs.

## Common First-Flight Issues

**Drone flips on takeoff**: Motor direction wrong, or props on wrong motors. Disarm immediately.

**Drone drifts in one direction**: Normal — slight imbalance or wind. Use trim if needed, or adjust in Betaflight.

**Video feed is noisy**: VTX power may be too low, or you're too far from your goggles receiver.

**Drone feels twitchy**: Rates may be too high for a beginner. Reduce rates in Betaflight (start at 200 deg/s max).

## Building Confidence

**Session 1**: Hover only. 5 hovers, 30 seconds each.
**Session 2**: Slow forward flight. Fly 20m, turn around, return.
**Session 3**: Slow circuits. Fly a rectangle around a landmark.
**Session 4**: Figure-8s at low speed.
**Session 5+**: Gradually increase speed and complexity.

## After Each Flight

- Check props for damage — replace any chipped or cracked props
- Check motor screws — vibration loosens them
- Check frame for cracks
- Check solder joints — look for any that have cracked
- Log your flight time — motors and bearings have finite lifespans

## When You Crash

You will crash. Everyone does. After a crash:
1. Disarm immediately (if not already disarmed by failsafe)
2. Wait for props to stop spinning before approaching
3. Check for damage before flying again
4. Never fly a damaged drone — a cracked arm or loose motor can cause a catastrophic failure mid-flight`,
        order: 3,
      },
    ],
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'course-5',
    slug: 'betaflight-configuration',
    title: 'Betaflight Configuration Deep Dive',
    description: 'A comprehensive guide to configuring Betaflight for optimal performance.',
    thumbnailUrl: '/images/courses/betaflight.jpg',
    category: 'tuning',
    difficulty: 'intermediate',
    durationMinutes: 150,
    requiredTier: 'basic',
    modules: [
      { id: 'module-5-1', courseId: 'course-5', title: 'Betaflight Configurator Overview', videoUrl: '/videos/courses/betaflight-configuration/configurator-overview.mp4', content: '# Betaflight Configurator\n\nNavigating the Betaflight configurator interface. Connect via USB, explore each tab, and understand what each section controls.', order: 1 },
      { id: 'module-5-2', courseId: 'course-5', title: 'Motor and ESC Setup', videoUrl: '/videos/courses/betaflight-configuration/motor-esc-setup.mp4', content: '# Motor Setup\n\nConfiguring motor direction, ESC protocol (DSHOT600), and bidirectional DSHOT for RPM filtering.', order: 2 },
      { id: 'module-5-3', courseId: 'course-5', title: 'Rates and Expo', videoUrl: '/videos/courses/betaflight-configuration/rates-and-expo.mp4', content: '# Rates and Expo\n\nSetting up rates and expo for your flying style. Understand RC Rate, Super Rate, and Expo. Start conservative and increase as your skills improve.', order: 3 },
    ],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'course-6',
    slug: 'soldering-for-fpv',
    title: 'Soldering for FPV Builders',
    description: 'Learn proper soldering techniques for building reliable FPV drones.',
    thumbnailUrl: '/images/courses/soldering.jpg',
    category: 'assembly',
    difficulty: 'beginner',
    durationMinutes: 60,
    requiredTier: 'free',
    modules: [
      { id: 'module-6-1', courseId: 'course-6', title: 'Tools and Equipment', videoUrl: '/videos/courses/soldering-for-fpv/tools-and-equipment.mp4', content: '# Soldering Tools\n\nChoosing the right soldering iron (65W+, temperature-controlled), solder (63/37 rosin core), flux pen, and helping hands. A good iron makes all the difference.', order: 1 },
      { id: 'module-6-2', courseId: 'course-6', title: 'Basic Soldering Techniques', videoUrl: '/videos/courses/soldering-for-fpv/basic-techniques.mp4', content: '# Basic Techniques\n\nTinning wires and pads, forming good joints, avoiding cold joints and bridges. Practice on scrap wire before touching your FC.', order: 2 },
    ],
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'course-7',
    slug: 'freestyle-flying-techniques',
    title: 'Freestyle Flying Techniques',
    description: 'Learn advanced freestyle maneuvers including rolls, flips, and power loops.',
    thumbnailUrl: '/images/courses/freestyle.jpg',
    category: 'flying',
    difficulty: 'advanced',
    durationMinutes: 200,
    requiredTier: 'pro',
    modules: [
      { id: 'module-7-1', courseId: 'course-7', title: 'Rolls and Flips', videoUrl: '/videos/courses/freestyle-flying-techniques/rolls-and-flips.mp4', content: '# Rolls and Flips\n\nMastering basic rolls and flips. Entry speed, throttle management during the maneuver, and clean exits. Practice in the simulator until they are automatic.', order: 1 },
      { id: 'module-7-2', courseId: 'course-7', title: 'Power Loops', videoUrl: '/videos/courses/freestyle-flying-techniques/power-loops.mp4', content: '# Power Loops\n\nThe power loop is the signature freestyle maneuver. Fly toward an object, pull up into a vertical loop, and use throttle to maintain speed through the top. Timing is everything.', order: 2 },
      { id: 'module-7-3', courseId: 'course-7', title: 'Split-S and Dives', videoUrl: '/videos/courses/freestyle-flying-techniques/split-s-and-dives.mp4', content: '# Split-S and Dives\n\nThe split-S: roll inverted, then pull through to level flight in the opposite direction. Dives: controlled vertical descents with precise pull-outs. Both require good altitude awareness.', order: 3 },
    ],
    createdAt: new Date('2024-03-12'),
  },
  {
    id: 'course-8',
    slug: 'fpv-camera-and-vtx',
    title: 'FPV Camera and Video Transmitter Setup',
    description: 'Configure your FPV camera and video transmitter for the best image quality.',
    thumbnailUrl: '/images/courses/camera-vtx.jpg',
    category: 'fundamentals',
    difficulty: 'intermediate',
    durationMinutes: 90,
    requiredTier: 'basic',
    modules: [
      { id: 'module-8-1', courseId: 'course-8', title: 'Camera Settings', videoUrl: '/videos/courses/fpv-camera-and-vtx/camera-settings.mp4', content: '# Camera Settings\n\nConfiguring exposure, WDR (wide dynamic range), sharpness, and OSD. Proper exposure prevents blown-out skies and dark shadows. WDR helps in high-contrast environments.', order: 1 },
      { id: 'module-8-2', courseId: 'course-8', title: 'VTX Power and Channels', videoUrl: '/videos/courses/fpv-camera-and-vtx/vtx-power-channels.mp4', content: '# VTX Setup\n\nSelecting power levels (25mW for indoor/close range, 200–800mW for outdoor), channels (avoid channel conflicts with other pilots), and using SmartAudio for in-flight VTX control via Betaflight OSD.', order: 2 },
    ],
    createdAt: new Date('2024-03-18'),
  },
  {
    id: 'course-9',
    slug: 'long-range-fpv',
    title: 'Long Range FPV with ELRS',
    description: 'Set up ExpressLRS for long-range FPV flying with low latency.',
    thumbnailUrl: '/images/courses/long-range.jpg',
    category: 'flying',
    difficulty: 'advanced',
    durationMinutes: 180,
    requiredTier: 'pro',
    modules: [
      { id: 'module-9-1', courseId: 'course-9', title: 'ELRS Overview', videoUrl: '/videos/courses/long-range-fpv/elrs-overview.mp4', content: '# ELRS Overview\n\nExpressLRS is an open-source RC link protocol designed for low latency and long range. It operates on 900MHz (longer range) or 2.4GHz (lower latency). Packet rates from 25Hz (max range) to 1000Hz (minimum latency).', order: 1 },
      { id: 'module-9-2', courseId: 'course-9', title: 'Flashing and Configuration', videoUrl: '/videos/courses/long-range-fpv/flashing-configuration.mp4', content: '# Flashing ELRS\n\nFlashing firmware via ExpressLRS Configurator. Set your binding phrase (replaces traditional binding), configure packet rate and telemetry ratio. Both TX and RX must run the same firmware version.', order: 2 },
      { id: 'module-9-3', courseId: 'course-9', title: 'Range Testing', videoUrl: '/videos/courses/long-range-fpv/range-testing.mp4', content: '# Range Testing\n\nSafe range testing: start close, verify link quality (LQ) in OSD, gradually increase distance. Monitor RSSI and LQ — never fly below 70% LQ. Always have a failsafe configured before range testing.', order: 3 },
    ],
    createdAt: new Date('2024-03-20'),
  },
  {
    id: 'course-10',
    slug: 'drone-maintenance',
    title: 'Drone Maintenance and Repair',
    description: 'Keep your drone in top condition with proper maintenance and repair techniques.',
    thumbnailUrl: '/images/courses/maintenance.jpg',
    category: 'fundamentals',
    difficulty: 'beginner',
    durationMinutes: 75,
    requiredTier: 'free',
    modules: [
      { id: 'module-10-1', courseId: 'course-10', title: 'Post-Flight Inspection', videoUrl: '/videos/courses/drone-maintenance/post-flight-inspection.mp4', content: '# Post-Flight Inspection\n\nCheck props for chips and cracks, motor screws for looseness, frame for cracks (especially arm roots), solder joints for cold joints or cracks, and battery for swelling. 5 minutes after every flight prevents 90% of crashes.', order: 1 },
      { id: 'module-10-2', courseId: 'course-10', title: 'Replacing Props and Motors', videoUrl: '/videos/courses/drone-maintenance/replacing-props-motors.mp4', content: '# Replacing Components\n\nProp replacement: always replace in pairs (or all four) to maintain balance. Motor replacement: desolder the three phase wires, remove the four motor screws, install new motor, re-solder. Verify direction before flying.', order: 2 },
    ],
    createdAt: new Date('2024-03-25'),
  },
  {
    id: 'course-11',
    slug: 'racing-drone-setup',
    title: 'Racing Drone Setup and Strategy',
    description: 'Optimize your racing drone setup and learn race strategy for competitive flying.',
    thumbnailUrl: '/images/courses/racing.jpg',
    category: 'tuning',
    difficulty: 'advanced',
    durationMinutes: 210,
    requiredTier: 'pro',
    modules: [
      { id: 'module-11-1', courseId: 'course-11', title: 'Race-Spec Hardware', videoUrl: '/videos/courses/racing-drone-setup/race-spec-hardware.mp4', content: '# Race Hardware\n\nChoosing components for competitive racing: lightweight frames (sub-200g), high-KV motors (2400–2700KV on 4S), fast ESCs with low latency, and a flight controller with a fast loop time (8kHz+).', order: 1 },
      { id: 'module-11-2', courseId: 'course-11', title: 'Gate and Flag Racing', videoUrl: '/videos/courses/racing-drone-setup/gate-flag-racing.mp4', content: '# Race Strategy\n\nLine selection: the fastest line is not always the straightest. Carry speed through corners by entering wide and exiting tight. Brake early for tight gates. Consistency beats raw speed in multi-lap races.', order: 2 },
    ],
    createdAt: new Date('2024-04-01'),
  },
  {
    id: 'course-12',
    slug: 'battery-care-and-storage',
    title: 'LiPo Battery Care and Storage',
    description: 'Extend the life of your LiPo batteries with proper care, charging, and storage.',
    thumbnailUrl: '/images/courses/battery.jpg',
    category: 'fundamentals',
    difficulty: 'beginner',
    durationMinutes: 45,
    requiredTier: 'free',
    modules: [
      { id: 'module-12-1', courseId: 'course-12', title: 'Charging Best Practices', videoUrl: '/videos/courses/battery-care-and-storage/charging-best-practices.mp4', content: '# Charging\n\nCharge at 1C (1500mAh battery = 1.5A charge rate). Never exceed 4.2V/cell. Always balance charge. Never leave charging unattended. Use a LiPo-safe bag. A quality charger like the ISDT Q6 Plus pays for itself in saved batteries.', order: 1 },
      { id: 'module-12-2', courseId: 'course-12', title: 'Storage and Disposal', videoUrl: '/videos/courses/battery-care-and-storage/storage-and-disposal.mp4', content: '# Storage\n\nStore at 3.8V/cell (storage voltage) if not flying within 24–48 hours. Most chargers have a storage charge/discharge mode. For disposal: fully discharge to 3.0V/cell, puncture in a bucket of salt water, then dispose as electronics waste.', order: 2 },
    ],
    createdAt: new Date('2024-04-05'),
  },
]
