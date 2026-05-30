import type { Product } from '@/types'

export type WireId = string  // `${instanceIdA}--${instanceIdB}` (sorted)

export interface PadConnection {
  padIdA: string   // pad id on instance A
  padIdB: string   // pad id on instance B
}

export interface Wire {
  id: WireId
  productIdA: string          // instanceId of component A
  productIdB: string          // instanceId of component B
  connectionType: WiringConnection
  /** Individual pad-to-pad connections made in the wiring dialog */
  padConnections: PadConnection[]
}

export interface WiringConnection {
  label: string          // e.g. "Power + Signal"
  description: string    // e.g. "ESC receives throttle commands from the FC via DSHOT"
  color: string          // hex color for the wire line
  valid: boolean
}

// ── Wiring rules ───────────────────────────────────────────────────────────
// Key: `${categoryA}:${categoryB}` — always sorted alphabetically so lookup
// is order-independent.

type CategoryPair = `${Product['category']}:${Product['category']}`

const RULES: Partial<Record<CategoryPair, WiringConnection>> = {
  'battery:esc': {
    label: 'Power',
    description: 'Battery supplies high-current DC power to the ESC.',
    color: '#ef4444',
    valid: true,
  },
  'battery:flight_controller': {
    label: 'Power (5V regulated)',
    description: 'Flight controller draws regulated 5V from the ESC/PDB or directly from the battery via BEC.',
    color: '#f59e0b',
    valid: true,
  },
  'camera:flight_controller': {
    label: 'OSD + Power',
    description: 'FC overlays OSD data on the camera feed and supplies 5V power.',
    color: '#ec4899',
    valid: true,
  },
  'esc:flight_controller': {
    label: 'Signal (DSHOT)',
    description: 'FC sends digital throttle commands to the ESC via DSHOT protocol.',
    color: '#3b82f6',
    valid: true,
  },
  'esc:motor': {
    label: 'Power + Phase',
    description: 'ESC drives the motor with three-phase AC power derived from the battery.',
    color: '#10b981',
    valid: true,
  },
  'frame:motor': {
    label: 'Mechanical mount',
    description: 'Motor bolts to the frame arm with M3 screws.',
    color: '#6366f1',
    valid: true,
  },
  'frame:battery': {
    label: 'Mechanical mount',
    description: 'Battery strapped to the frame bottom plate.',
    color: '#6366f1',
    valid: true,
  },
  'frame:camera': {
    label: 'Mechanical mount',
    description: 'Camera mounted in the frame\'s front camera bay.',
    color: '#6366f1',
    valid: true,
  },
  'frame:esc': {
    label: 'Mechanical mount',
    description: 'ESC stack mounted inside the frame using M3 standoffs.',
    color: '#6366f1',
    valid: true,
  },
  'frame:flight_controller': {
    label: 'Mechanical mount',
    description: 'FC mounted on top of the ESC stack inside the frame.',
    color: '#6366f1',
    valid: true,
  },
  'frame:propeller': {
    label: 'Mechanical (via motor)',
    description: 'Propellers attach to motor shafts which are mounted on the frame arms.',
    color: '#8b5cf6',
    valid: true,
  },
  'motor:propeller': {
    label: 'Mechanical mount',
    description: 'Propeller press-fits or bolts onto the motor shaft.',
    color: '#8b5cf6',
    valid: true,
  },
}

/** Make a canonical wire ID — sorted so A→B and B→A produce the same ID */
export function makeWireId(idA: string, idB: string): WireId {
  return [idA, idB].sort().join('--')
}

/** Look up the wiring connection between two product categories */
export function getWiringConnection(
  catA: Product['category'],
  catB: Product['category']
): WiringConnection {
  const key = [catA, catB].sort().join(':') as CategoryPair
  return (
    RULES[key] ?? {
      label: 'No standard connection',
      description: 'These two component types do not have a defined electrical or mechanical connection.',
      color: '#6b7280',
      valid: false,
    }
  )
}

/** Check if two products can be wired (compatible + valid category pair) */
export function canWire(productA: Product, productB: Product): boolean {
  const conn = getWiringConnection(productA.category, productB.category)
  if (!conn.valid) return false
  // Also check the products are mutually compatible
  return (
    productA.compatibleWith.includes(productB.id) ||
    productB.compatibleWith.includes(productA.id)
  )
}
