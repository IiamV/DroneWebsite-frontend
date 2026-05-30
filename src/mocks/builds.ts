import type { DroneBuild } from '@/types'

export const mockBuilds: DroneBuild[] = [
  // ── DJI F450 Beginner Build ──────────────────────────────────────────────
  {
    id: 'build-f450-beginner',
    slug: 'dji-f450-beginner-build',
    name: 'DJI F450 Beginner Quad',
    description: 'The classic learning platform. The F450 frame\'s integrated PCB power distribution makes wiring straightforward, and its 450mm wheelbase gives stable, forgiving flight characteristics perfect for first-time builders.',
    thumbnailUrl: '/images/mock/f450.png',
    difficulty: 'beginner',
    estimatedCost: 180,
    estimatedCostVnd: 4500000,
    flightTime: '10–14 min',
    useCase: 'Learning to build & fly',
    productIds: [
      'prod-frame-4',    // DJI F450 frame
      'prod-motor-1',    // iFlight XING2 2207 (×4)
      'prod-esc-1',      // Tekko32 4-in-1 45A ESC
      'prod-fc-1',       // SpeedyBee F405 V3
      'prod-battery-2',  // GNB 4S 1500mAh
      'prod-prop-1',     // HQProp 5x4x3
    ],
    steps: [
      {
        order: 1,
        title: 'Prepare the frame',
        description: 'Assemble the DJI F450 frame by attaching the four arms to the bottom plate. The bottom plate doubles as a power distribution board — note the positive and negative solder pads on each arm. Tighten all M3 screws with a 2mm hex driver. Apply a small drop of Loctite Blue to each screw before tightening.',
        productIds: ['prod-frame-4'],
      },
      {
        order: 2,
        title: 'Mount the motors',
        description: 'Mount one motor on each arm tip using the M3 screws included with the motors. Route the three motor phase wires through the arm channel toward the center. Apply Loctite Blue to motor screws. Tighten in a cross pattern to ensure even seating. Front-left and back-right motors spin CW; front-right and back-left spin CCW.',
        productIds: ['prod-motor-1'],
        wiringNote: 'Motor orientation: FL=CW, FR=CCW, BL=CCW, BR=CW',
      },
      {
        order: 3,
        title: 'Solder the ESC',
        description: 'Mount the 4-in-1 ESC on the bottom plate using M3 nylon standoffs (30×30mm pattern). Solder the battery lead (XT60 connector) to the ESC\'s main power pads — red to positive, black to negative. Add a 1000µF capacitor across the battery pads to filter voltage spikes. Then solder each motor\'s three phase wires to the corresponding ESC motor pads.',
        productIds: ['prod-esc-1', 'prod-motor-1'],
        wiringNote: 'Battery lead: red=+VBAT, black=GND. Motor phase order doesn\'t matter — direction is set in Betaflight.',
      },
      {
        order: 4,
        title: 'Mount and wire the flight controller',
        description: 'Stack the SpeedyBee F405 V3 on top of the ESC using the provided M3 standoffs. Connect the ESC-to-FC ribbon cable (or solder the signal pads directly). The FC draws 5V power from the ESC\'s BEC output. Connect the motor signal wires: ESC S1→FC M1, S2→M2, S3→M3, S4→M4.',
        productIds: ['prod-fc-1', 'prod-esc-1'],
        wiringNote: 'FC power: +5V from ESC BEC. Signal: DSHOT600 on M1–M4 pads.',
      },
      {
        order: 5,
        title: 'Install propellers',
        description: 'Press the HQProp 5×4×3 propellers onto the motor shafts. CW motors (FL, BR) get CW props; CCW motors (FR, BL) get CCW props. Props are usually marked with a small arrow or "CW"/"CCW" on the hub. Tighten the prop nuts firmly — loose props cause vibration and crashes.',
        productIds: ['prod-prop-1'],
      },
      {
        order: 6,
        title: 'Configure Betaflight',
        description: 'Connect the FC to your PC via USB. In Betaflight Configurator: set ESC protocol to DSHOT600, configure receiver (ELRS/SBUS on UART2), set motor directions, configure failsafe to "Drop". Run the motor test with props OFF to verify all four motors spin in the correct direction. Set rates to 200 deg/s for a beginner-friendly feel.',
        productIds: ['prod-fc-1'],
      },
      {
        order: 7,
        title: 'First flight check',
        description: 'Perform a pre-flight checklist: props secure, battery voltage correct (16.8V for 4S), all screws tight, failsafe configured. Arm in an open area, gently increase throttle to hover height (~1m). The F450 should lift evenly. If it drifts, check motor directions and prop orientation.',
        productIds: ['prod-battery-2'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power positive', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Main power negative', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power (BEC)', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'GND', toComponent: 'Flight Controller', toPad: 'GND', label: 'FC ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1 signal (DSHOT)', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2 signal (DSHOT)', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3 signal (DSHOT)', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4 signal (DSHOT)', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'M1-A', toComponent: 'Motor FL', toPad: 'Phase A', label: 'Motor FL phase A', color: '#f59e0b' },
      { fromComponent: 'ESC', fromPad: 'M1-B', toComponent: 'Motor FL', toPad: 'Phase B', label: 'Motor FL phase B', color: '#f59e0b' },
      { fromComponent: 'ESC', fromPad: 'M1-C', toComponent: 'Motor FL', toPad: 'Phase C', label: 'Motor FL phase C', color: '#f59e0b' },
    ],
    modelUrl: '/models/products/DJI_F450_Flame_Wheel_Frame.glb',
    stats: {
      topSpeedKmh: 60,
      totalWeightG: 980,
      maxPayloadG: 200,
      thrustToWeightRatio: 3.2,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 4,
      maxRangeKm: 1.5,
      hoverThrustPct: 35,
    },
    createdAt: new Date('2024-01-15'),
  },

  // ── 5-inch Freestyle Build ───────────────────────────────────────────────
  {
    id: 'build-5inch-freestyle',
    slug: '5inch-freestyle-build',
    name: '5-inch Freestyle Ripper',
    description: 'A high-performance 5-inch freestyle build on the iFlight Nazgul5 V3 frame. Punchy 2207 motors, BLHeli_32 ESC, and an F405 FC with Bluetooth configuration. Built for aggressive freestyle flying and smooth cinematic lines.',
    thumbnailUrl: '/images/mock/ripper.png',
    difficulty: 'intermediate',
    estimatedCost: 320,
    estimatedCostVnd: 8000000,
    flightTime: '4–6 min',
    useCase: '5-inch freestyle & FPV',
    productIds: [
      'prod-frame-1',    // iFlight Nazgul5 V3
      'prod-motor-1',    // iFlight XING2 2207 1800KV (×4)
      'prod-esc-1',      // Tekko32 F4 Metal 45A
      'prod-fc-1',       // SpeedyBee F405 V3
      'prod-battery-1',  // Tattu R-Line 6S 1300mAh
      'prod-prop-3',     // DAL Cyclone 5045C
      'prod-camera-1',   // RunCam Phoenix 2
    ],
    steps: [
      {
        order: 1,
        title: 'Frame assembly',
        description: 'Assemble the Nazgul5 V3 frame. Attach the four arms to the bottom plate using M3 screws with Loctite Blue. The frame uses a 30×30mm stack mount. Route motor wires through the arm channels before mounting the arms.',
        productIds: ['prod-frame-1'],
      },
      {
        order: 2,
        title: 'Motor installation',
        description: 'Mount the XING2 2207 motors on each arm. Use M3×8mm screws with Loctite Blue. Route the three phase wires through the arm channel. Motor spin directions: FL=CW, FR=CCW, BL=CCW, BR=CW. Tighten to ~0.5 Nm.',
        productIds: ['prod-motor-1'],
        wiringNote: 'Phase wire order to ESC doesn\'t matter — swap any two to reverse direction.',
      },
      {
        order: 3,
        title: 'ESC stack mounting & soldering',
        description: 'Mount the Tekko32 ESC on the bottom plate using M3 nylon standoffs. Solder the XT60 battery lead to the main power pads. Add a 1000µF 35V capacitor. Solder each motor\'s phase wires to the ESC motor pads (M1–M4, three wires each).',
        productIds: ['prod-esc-1', 'prod-motor-1'],
        wiringNote: 'Use 12AWG silicone wire for the battery lead. Tin all pads before soldering.',
      },
      {
        order: 4,
        title: 'Flight controller installation',
        description: 'Stack the SpeedyBee F405 V3 on top of the ESC. Connect the ESC-to-FC ribbon cable. The FC gets 5V from the ESC BEC. Connect the camera to the FC\'s CAM pad for OSD overlay.',
        productIds: ['prod-fc-1', 'prod-esc-1', 'prod-camera-1'],
        wiringNote: 'Camera: +5V from FC, GND, VIDEO to CAM pad for OSD.',
      },
      {
        order: 5,
        title: 'Camera mounting',
        description: 'Mount the RunCam Phoenix 2 in the frame\'s front camera bay. Set the tilt angle to 30–45° for freestyle flying. Connect the camera\'s video output to the FC\'s CAM pad and power from the FC\'s 5V output.',
        productIds: ['prod-camera-1'],
      },
      {
        order: 6,
        title: 'Betaflight configuration',
        description: 'Flash Betaflight 4.4+. Set DSHOT600, enable RPM filtering (requires bidirectional DSHOT). Set rates: RC Rate 1.0, Super Rate 0.7, Expo 0.2. Configure OSD to show battery voltage, flight time, and RSSI. Enable turtle mode for post-crash recovery.',
        productIds: ['prod-fc-1'],
      },
      {
        order: 7,
        title: 'Install props and maiden flight',
        description: 'Install DAL Cyclone 5045C props. CW on FL/BR, CCW on FR/BL. Maiden in a large open area. Start in Angle mode, verify all axes respond correctly, then switch to Acro for freestyle.',
        productIds: ['prod-prop-3', 'prod-battery-1'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power positive', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Main power negative', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4 DSHOT', color: '#3b82f6' },
      { fromComponent: 'Flight Controller', fromPad: 'CAM', toComponent: 'Camera', toPad: 'VIDEO', label: 'OSD video signal', color: '#ec4899' },
      { fromComponent: 'Flight Controller', fromPad: '+5V', toComponent: 'Camera', toPad: '+5V', label: 'Camera power', color: '#f97316' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 140,
      totalWeightG: 680,
      maxPayloadG: 0,
      thrustToWeightRatio: 8.5,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 6,
      maxRangeKm: 0.8,
      hoverThrustPct: 22,
    },
    createdAt: new Date('2024-02-01'),
  },

  // ── Advanced Racing Build ────────────────────────────────────────────────
  {
    id: 'build-racing-advanced',
    slug: 'advanced-racing-build',
    name: 'Advanced Racing Quad',
    description: 'A competition-spec racing build on the TBS Source One V5 stretch-X frame. T-Motor F40 Pro IV motors, Hobbywing XRotor ESC, and Matek H743 dual-gyro FC. Built for maximum speed and precision gate flying.',
    thumbnailUrl: '/images/mock/advanced-racing.png',
    difficulty: 'advanced',
    estimatedCost: 480,
    estimatedCostVnd: 12000000,
    flightTime: '3–5 min',
    useCase: 'Competitive FPV racing',
    productIds: [
      'prod-frame-2',    // TBS Source One V5
      'prod-motor-2',    // T-Motor F40 Pro IV (×4)
      'prod-esc-3',      // Hobbywing XRotor 45A
      'prod-fc-2',       // Matek H743-SLIM
      'prod-battery-1',  // Tattu R-Line 6S 1300mAh
      'prod-prop-2',     // Gemfan 51466
      'prod-camera-2',   // Caddx Ratel 2
    ],
    steps: [
      {
        order: 1,
        title: 'Frame assembly',
        description: 'Assemble the TBS Source One V5 stretch-X frame. The stretch-X geometry pushes the rear motors back for better high-speed stability. Use M3 screws with Loctite Blue on all arm bolts. The frame supports 30×30mm stack mounting.',
        productIds: ['prod-frame-2'],
      },
      {
        order: 2,
        title: 'Motor installation',
        description: 'Mount T-Motor F40 Pro IV motors. These are premium racing motors — handle with care. Use M3×8mm titanium screws if available. Ceramic bearings require no break-in period. Route phase wires cleanly through arm channels.',
        productIds: ['prod-motor-2'],
        wiringNote: 'T-Motor uses a specific phase order for optimal performance — check the motor documentation.',
      },
      {
        order: 3,
        title: 'ESC installation',
        description: 'Mount the Hobbywing XRotor 4-in-1 ESC. This ESC has excellent thermal management — ensure airflow is not blocked. Solder the XT60 lead with 12AWG wire. The Hobbywing firmware provides smooth throttle response critical for racing.',
        productIds: ['prod-esc-3'],
        wiringNote: 'Hobbywing ESC uses its own firmware — do not flash BLHeli_32 on it.',
      },
      {
        order: 4,
        title: 'Flight controller stack',
        description: 'Mount the Matek H743-SLIM. This FC has dual gyros for redundancy and 8 UARTs for maximum peripheral connectivity. Connect the ESC via the 8-pin connector. Enable dual gyro mode in Betaflight for the smoothest possible flight.',
        productIds: ['prod-fc-2', 'prod-esc-3'],
        wiringNote: 'Enable dual gyro averaging in Betaflight → Configuration → Gyro.',
      },
      {
        order: 5,
        title: 'Camera and VTX',
        description: 'Mount the Caddx Ratel 2 in the front camera bay at 45–60° tilt for racing. The starlight sensor excels in the varied lighting conditions of indoor and outdoor race tracks. Connect video output to the FC\'s CAM pad.',
        productIds: ['prod-camera-2'],
      },
      {
        order: 6,
        title: 'Advanced Betaflight tuning',
        description: 'Flash Betaflight 4.4. Enable RPM filtering with bidirectional DSHOT. Use the Hobbywing-specific PID preset as a starting point. Enable dual gyro in Configuration. Set loop rate to 8kHz. Use Blackbox logging for PID tuning sessions.',
        productIds: ['prod-fc-2'],
      },
      {
        order: 7,
        title: 'Race prep',
        description: 'Install Gemfan 51466 props. These are optimized for smooth power delivery at racing speeds. Balance props if needed. Set VTX to the correct channel for your race event. Verify failsafe drops motors immediately on signal loss.',
        productIds: ['prod-prop-2', 'prod-battery-1'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'TELEM', toComponent: 'Flight Controller', toPad: 'RX2', label: 'ESC telemetry', color: '#10b981' },
      { fromComponent: 'Flight Controller', fromPad: 'CAM', toComponent: 'Camera', toPad: 'VIDEO', label: 'OSD video', color: '#ec4899' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 160,
      totalWeightG: 720,
      maxPayloadG: 0,
      thrustToWeightRatio: 9.2,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 6,
      maxRangeKm: 0.6,
      hoverThrustPct: 20,
    },
    createdAt: new Date('2024-03-01'),
  },


  // ── Micro Whoop Indoor Build ─────────────────────────────────────────────
  {
    id: 'build-micro-whoop',
    slug: 'micro-whoop-indoor-build',
    name: 'Micro Whoop Indoor Flyer',
    description: 'A tiny, safe indoor flyer built around the Holybro Kakute H7 Mini FC and compact components. Prop guards keep it safe around furniture and people. Perfect for learning FPV in your living room before heading outside.',
    thumbnailUrl: '/images/mock/whoop.png',
    difficulty: 'beginner',
    estimatedCost: 120,
    estimatedCostVnd: 3000000,
    flightTime: '4–6 min',
    useCase: 'Indoor FPV practice',
    productIds: [
      'prod-fc-3',       // Holybro Kakute H7 Mini
      'prod-esc-2',      // Aikon AK32 40A
      'prod-motor-3',    // EMAX ECO II 2306
      'prod-battery-3',  // Lumenier 4S 1300mAh
      'prod-prop-1',     // HQProp 5x4x3
      'prod-camera-1',   // RunCam Phoenix 2
    ],
    steps: [
      {
        order: 1,
        title: 'Plan your build',
        description: 'The Kakute H7 Mini uses a 20×20mm stack mount — verify all components fit before soldering. Lay everything out on a clean workspace. The compact form factor means cable management is critical.',
        productIds: ['prod-fc-3'],
      },
      {
        order: 2,
        title: 'Solder the ESC',
        description: 'Mount the Aikon AK32 ESC on the 20×20mm standoffs. Solder the battery lead (XT30 for micro builds) and motor phase wires. The built-in current sensor will give you real-time power data in Betaflight.',
        productIds: ['prod-esc-2'],
        wiringNote: 'Use XT30 connector for micro builds — lighter and sufficient for 40A.',
      },
      {
        order: 3,
        title: 'Stack the flight controller',
        description: 'Stack the Kakute H7 Mini on top of the ESC. Connect the ESC-to-FC cable. The H7 processor gives you 8kHz loop rate even on this tiny board.',
        productIds: ['prod-fc-3', 'prod-esc-2'],
      },
      {
        order: 4,
        title: 'Mount motors and camera',
        description: 'Mount the EMAX ECO II motors. These are lightweight and efficient — ideal for micro builds. Mount the RunCam Phoenix 2 at 20° tilt for indoor flying.',
        productIds: ['prod-motor-3', 'prod-camera-1'],
      },
      {
        order: 5,
        title: 'Configure and fly',
        description: 'Flash Betaflight, set DSHOT300 (lower for micro builds), configure rates to 200 deg/s max. Start in Angle mode indoors. The prop guards will save your furniture.',
        productIds: ['prod-fc-3', 'prod-battery-3'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4', color: '#3b82f6' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 45,
      totalWeightG: 280,
      maxPayloadG: 0,
      thrustToWeightRatio: 5.8,
      motorCount: 4,
      propSizeInch: 3,
      batteryCell: 4,
      maxRangeKm: 0.3,
      hoverThrustPct: 30,
    },
    createdAt: new Date('2024-01-20'),
  },

  // ── Long Range Cruiser ───────────────────────────────────────────────────
  {
    id: 'build-long-range',
    slug: 'long-range-cruiser-build',
    name: 'Long Range FPV Cruiser',
    description: 'A 7-inch long-range build optimized for efficiency and flight time. The Matek H743 FC with ELRS receiver gives you multi-kilometre range. Ideal for exploring open landscapes and capturing smooth cinematic footage.',
    thumbnailUrl: '/images/mock/cruiser.png',
    difficulty: 'advanced',
    estimatedCost: 420,
    estimatedCostVnd: 10500000,
    flightTime: '20–30 min',
    useCase: 'Long range & cinematography',
    productIds: [
      'prod-frame-2',    // TBS Source One V5 (7-inch config)
      'prod-motor-2',    // T-Motor F40 Pro IV (lower KV for 7-inch)
      'prod-esc-2',      // Aikon AK32 40A
      'prod-fc-2',       // Matek H743-SLIM
      'prod-battery-1',  // Tattu R-Line 6S 1300mAh
      'prod-prop-2',     // Gemfan 51466
      'prod-camera-2',   // Caddx Ratel 2 (starlight for dawn/dusk)
    ],
    steps: [
      {
        order: 1,
        title: 'Frame configuration',
        description: 'Configure the TBS Source One V5 for 7-inch arms. The stretch-X geometry is excellent for long-range as it improves forward-flight efficiency. Mount the arms and secure with M3 screws.',
        productIds: ['prod-frame-2'],
      },
      {
        order: 2,
        title: 'Motor selection and mounting',
        description: 'For long-range, use lower KV motors (1300–1500KV) with larger props. The T-Motor F40 Pro IV at 1950KV is on the higher end — pair with 5-inch props for efficiency, or swap to a lower KV motor for true 7-inch long range.',
        productIds: ['prod-motor-2'],
        wiringNote: 'Lower KV = more torque, better efficiency with larger props.',
      },
      {
        order: 3,
        title: 'ESC and power system',
        description: 'Mount the Aikon AK32 ESC. For long range, power efficiency is critical — the built-in current sensor lets you monitor mAh consumed in real time via OSD.',
        productIds: ['prod-esc-2'],
      },
      {
        order: 4,
        title: 'Flight controller and GPS',
        description: 'Mount the Matek H743-SLIM. Configure INAV for GPS-assisted flight modes: Position Hold, Return to Home, and Waypoint missions. Connect GPS to UART4.',
        productIds: ['prod-fc-2'],
        wiringNote: 'GPS: TX→RX4, RX→TX4. Enable GPS in INAV → Configuration.',
      },
      {
        order: 5,
        title: 'Camera for dawn/dusk flying',
        description: 'Mount the Caddx Ratel 2 with its starlight sensor. Long-range flights often extend into low-light conditions — the Ratel 2\'s exceptional sensitivity ensures clear video even at dusk.',
        productIds: ['prod-camera-2'],
      },
      {
        order: 6,
        title: 'INAV configuration',
        description: 'Flash INAV 7.0+. Configure GPS, compass, and barometer. Set up Return to Home with a safe altitude (50m+). Configure OSD to show distance from home, battery voltage, and mAh consumed.',
        productIds: ['prod-fc-2'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'CURR', toComponent: 'Flight Controller', toPad: 'CURR', label: 'Current sensor', color: '#8b5cf6' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4', color: '#3b82f6' },
      { fromComponent: 'Flight Controller', fromPad: 'CAM', toComponent: 'Camera', toPad: 'VIDEO', label: 'OSD video', color: '#ec4899' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 80,
      totalWeightG: 850,
      maxPayloadG: 150,
      thrustToWeightRatio: 4.1,
      motorCount: 4,
      propSizeInch: 7,
      batteryCell: 6,
      maxRangeKm: 15,
      hoverThrustPct: 28,
    },
    createdAt: new Date('2024-02-15'),
  },

  // ── Budget 5-inch Build ──────────────────────────────────────────────────
  {
    id: 'build-budget-5inch',
    slug: 'budget-5inch-build',
    name: 'Budget 5-inch Starter',
    description: 'Get into 5-inch FPV without breaking the bank. EMAX ECO II motors, Aikon ESC, and SpeedyBee FC keep costs low while delivering genuine freestyle performance. A great first 5-inch build.',
    thumbnailUrl: '/images/mock/budget.png',
    difficulty: 'beginner',
    estimatedCost: 210,
    estimatedCostVnd: 5250000,
    flightTime: '5–7 min',
    useCase: 'Budget freestyle',
    productIds: [
      'prod-frame-3',    // Diatone Roma F5 V2
      'prod-motor-3',    // EMAX ECO II 2306 2400KV
      'prod-esc-2',      // Aikon AK32 40A
      'prod-fc-1',       // SpeedyBee F405 V3
      'prod-battery-2',  // GNB 4S 1500mAh
      'prod-prop-1',     // HQProp 5x4x3
    ],
    steps: [
      {
        order: 1,
        title: 'Assemble the Diatone Roma F5',
        description: 'The Roma F5 V2 has integrated camera protection — a great feature for a beginner build. Assemble the frame, noting the 30×30 and 20×20 stack mount options.',
        productIds: ['prod-frame-3'],
      },
      {
        order: 2,
        title: 'Mount EMAX ECO II motors',
        description: 'The EMAX ECO II series offers excellent value. At 2400KV on 4S, these motors are punchy and responsive. Mount with M3 screws and Loctite Blue.',
        productIds: ['prod-motor-3'],
      },
      {
        order: 3,
        title: 'Solder the Aikon AK32 ESC',
        description: 'The Aikon AK32 is a solid budget ESC with BLHeli_32 and a built-in current sensor. Solder the battery lead and motor phase wires.',
        productIds: ['prod-esc-2'],
      },
      {
        order: 4,
        title: 'Stack the SpeedyBee FC',
        description: 'The SpeedyBee F405 V3 has built-in Bluetooth — configure Betaflight wirelessly from your phone using the SpeedyBee app. No USB cable needed for tuning.',
        productIds: ['prod-fc-1', 'prod-esc-2'],
        wiringNote: 'Use SpeedyBee app on iOS/Android for wireless Betaflight configuration.',
      },
      {
        order: 5,
        title: 'First flights on 4S',
        description: 'The GNB 4S 1500mAh is a great value battery. Start with conservative rates and work up as your skills improve. The Roma F5\'s camera protection will save your camera on early crashes.',
        productIds: ['prod-battery-2', 'prod-prop-1'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4', color: '#3b82f6' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 110,
      totalWeightG: 620,
      maxPayloadG: 0,
      thrustToWeightRatio: 6.8,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 4,
      maxRangeKm: 1.0,
      hoverThrustPct: 26,
    },
    createdAt: new Date('2024-02-20'),
  },

  // ── Premium 6S Freestyle ─────────────────────────────────────────────────
  {
    id: 'build-6s-premium',
    slug: '6s-premium-freestyle-build',
    name: '6S Premium Freestyle',
    description: 'A top-tier 6S freestyle build for experienced pilots. Tattu R-Line 6S battery, iFlight XING2 motors, and Hobbywing XRotor ESC deliver explosive power and crisp throttle response for the most demanding freestyle maneuvers.',
    thumbnailUrl: '/images/mock/premium.png',
    difficulty: 'advanced',
    estimatedCost: 550,
    estimatedCostVnd: 13750000,
    flightTime: '3–5 min',
    useCase: 'High-performance freestyle',
    productIds: [
      'prod-frame-1',    // iFlight Nazgul5 V3
      'prod-motor-1',    // iFlight XING2 2207 1800KV (6S)
      'prod-esc-3',      // Hobbywing XRotor 45A
      'prod-fc-2',       // Matek H743-SLIM
      'prod-battery-1',  // Tattu R-Line 6S 1300mAh
      'prod-prop-3',     // DAL Cyclone 5045C
      'prod-camera-2',   // Caddx Ratel 2
    ],
    steps: [
      {
        order: 1,
        title: 'Premium frame prep',
        description: 'The Nazgul5 V3 is a proven freestyle frame. Assemble carefully — this is a high-power build and frame integrity is critical. Use titanium screws if available.',
        productIds: ['prod-frame-1'],
      },
      {
        order: 2,
        title: 'XING2 motors on 6S',
        description: 'The XING2 2207 at 1800KV is rated for 6S. On 6S, these motors produce significantly more power than on 4S. Handle with respect — this build has serious thrust.',
        productIds: ['prod-motor-1'],
        wiringNote: '6S = 22.2V nominal. Motor max power: 1408W each. Total: ~5.6kW.',
      },
      {
        order: 3,
        title: 'Hobbywing XRotor ESC',
        description: 'The Hobbywing XRotor has excellent thermal management — critical on 6S where heat generation is higher. Mount with good airflow. The smooth throttle response is ideal for freestyle.',
        productIds: ['prod-esc-3'],
      },
      {
        order: 4,
        title: 'Matek H743 dual-gyro FC',
        description: 'The H743-SLIM with dual gyros gives the smoothest possible flight on a high-power build. Enable dual gyro averaging. Set loop rate to 8kHz. Use RPM filtering.',
        productIds: ['prod-fc-2'],
      },
      {
        order: 5,
        title: 'Caddx Ratel 2 camera',
        description: 'Mount the Ratel 2 at 30–40° for freestyle. The starlight sensor handles the full range of lighting conditions you\'ll encounter during freestyle sessions.',
        productIds: ['prod-camera-2'],
      },
      {
        order: 6,
        title: 'Advanced PID tuning',
        description: 'This build requires careful PID tuning. Start with a community preset for the Nazgul5 on 6S. Use Blackbox logging to analyze and refine. RPM filtering is essential at 6S power levels.',
        productIds: ['prod-fc-2', 'prod-battery-1'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: '6S main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3 DSHOT', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4 DSHOT', color: '#3b82f6' },
      { fromComponent: 'Flight Controller', fromPad: 'CAM', toComponent: 'Camera', toPad: 'VIDEO', label: 'OSD video', color: '#ec4899' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 155,
      totalWeightG: 710,
      maxPayloadG: 0,
      thrustToWeightRatio: 10.1,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 6,
      maxRangeKm: 0.7,
      hoverThrustPct: 18,
    },
    createdAt: new Date('2024-03-10'),
  },

  // ── Cinematic Smooth Build ───────────────────────────────────────────────
  {
    id: 'build-cinematic',
    slug: 'cinematic-smooth-build',
    name: 'Cinematic Smooth Flyer',
    description: 'Optimized for smooth, cinematic footage. Lower KV motors, efficient props, and a carefully tuned FC deliver the buttery-smooth flight characteristics needed for professional video work. Pairs perfectly with a GoPro or DJI action camera.',
    thumbnailUrl: '/images/mock/flyer.png',
    difficulty: 'intermediate',
    estimatedCost: 380,
    estimatedCostVnd: 9500000,
    flightTime: '8–12 min',
    useCase: 'Cinematic & aerial video',
    productIds: [
      'prod-frame-2',    // TBS Source One V5
      'prod-motor-2',    // T-Motor F40 Pro IV (smooth power delivery)
      'prod-esc-1',      // Tekko32 45A
      'prod-fc-2',       // Matek H743-SLIM
      'prod-battery-3',  // Lumenier 4S 1300mAh (consistent discharge)
      'prod-prop-2',     // Gemfan 51466 (smooth power)
      'prod-camera-2',   // Caddx Ratel 2
    ],
    steps: [
      {
        order: 1,
        title: 'Frame for cinematic flying',
        description: 'The TBS Source One V5 stretch-X geometry provides excellent forward-flight stability — ideal for cinematic work. Build it clean with minimal vibration sources.',
        productIds: ['prod-frame-2'],
      },
      {
        order: 2,
        title: 'T-Motor F40 Pro IV for smooth power',
        description: 'The T-Motor F40 Pro IV is known for its exceptionally smooth power delivery — critical for cinematic footage. Ceramic bearings ensure quiet, vibration-free operation.',
        productIds: ['prod-motor-2'],
      },
      {
        order: 3,
        title: 'Vibration isolation',
        description: 'Mount the FC on soft silicone standoffs to isolate it from frame vibrations. Use foam tape under the ESC. Vibration is the enemy of smooth footage.',
        productIds: ['prod-esc-1', 'prod-fc-2'],
        wiringNote: 'Use M3 silicone grommets on FC standoffs for vibration isolation.',
      },
      {
        order: 4,
        title: 'Lumenier battery for consistent power',
        description: 'The Lumenier 4S 1300mAh is known for consistent discharge across its cycle life — important for predictable flight characteristics during filming sessions.',
        productIds: ['prod-battery-3'],
      },
      {
        order: 5,
        title: 'Tune for smoothness',
        description: 'In Betaflight, reduce rates significantly (RC Rate 0.7, Super Rate 0.5). Enable filtering aggressively. The goal is smooth, predictable response — not raw performance. Use Angle or Horizon mode for beginners.',
        productIds: ['prod-fc-2'],
      },
    ],
    wires: [
      { fromComponent: 'Battery', fromPad: '+', toComponent: 'ESC', toPad: '+VBAT', label: 'Main power', color: '#ef4444' },
      { fromComponent: 'Battery', fromPad: '−', toComponent: 'ESC', toPad: 'GND', label: 'Ground', color: '#6b7280' },
      { fromComponent: 'ESC', fromPad: '+5V', toComponent: 'Flight Controller', toPad: '+5V', label: 'FC power', color: '#f97316' },
      { fromComponent: 'ESC', fromPad: 'S1', toComponent: 'Flight Controller', toPad: 'M1', label: 'Motor 1', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S2', toComponent: 'Flight Controller', toPad: 'M2', label: 'Motor 2', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S3', toComponent: 'Flight Controller', toPad: 'M3', label: 'Motor 3', color: '#3b82f6' },
      { fromComponent: 'ESC', fromPad: 'S4', toComponent: 'Flight Controller', toPad: 'M4', label: 'Motor 4', color: '#3b82f6' },
      { fromComponent: 'Flight Controller', fromPad: 'CAM', toComponent: 'Camera', toPad: 'VIDEO', label: 'OSD video', color: '#ec4899' },
    ],
    modelUrl: null,
    stats: {
      topSpeedKmh: 90,
      totalWeightG: 760,
      maxPayloadG: 250,
      thrustToWeightRatio: 5.2,
      motorCount: 4,
      propSizeInch: 5,
      batteryCell: 4,
      maxRangeKm: 3.0,
      hoverThrustPct: 32,
    },
    createdAt: new Date('2024-03-20'),
  },
]
