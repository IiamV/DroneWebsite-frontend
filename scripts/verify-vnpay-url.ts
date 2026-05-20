/**
 * Parse a full vpcpay.html URL and test which signing payload matches vnp_SecureHash.
 * Usage: npx tsx scripts/verify-vnpay-url.ts "<full url>"
 * Loads VNP_HASH_SECRET from .env.local (same as other scripts).
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import crypto from 'crypto'
import qs from 'qs'

const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}

const secret = process.env.VNP_HASH_SECRET
if (!secret) {
  console.error('Missing VNP_HASH_SECRET (.env.local)')
  process.exit(1)
}

const urlArg = process.argv[2]
if (!urlArg) {
  console.error('Usage: npx tsx scripts/verify-vnpay-url.ts "<vpcpay url>"')
  process.exit(1)
}

const u = new URL(urlArg)
const actualHash = (u.searchParams.get('vnp_SecureHash') ?? '').toLowerCase()

const params: Record<string, string> = {}
u.searchParams.forEach((v, k) => {
  if (k === 'vnp_SecureHash' || k === 'vnp_SecureHashType') return
  params[k] = v
})

function sortKeys(o: Record<string, string>) {
  const s: Record<string, string> = {}
  for (const k of Object.keys(o).sort()) s[k] = o[k]
  return s
}

const sorted = sortKeys(params)

function hmac(data: string) {
  return crypto.createHmac('sha512', secret).update(Buffer.from(data, 'utf8')).digest('hex').toLowerCase()
}

// A) Official Node demo — qs.stringify, encode: false (raw spaces, raw :// in values)
const signA = qs.stringify(sorted, { encode: false })

// B) PHP-style — urlencode key and value (PHP uses + for space)
function phpUrlEncode(str: string) {
  return encodeURIComponent(str).replace(/%20/g, '+')
}
const signB = Object.keys(sorted)
  .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(sorted[k])}`)
  .join('&')

// C) RFC3986 encodeURIComponent (space %20)
const signC = Object.keys(sorted)
  .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(sorted[k])}`)
  .join('&')

// D) Java demo style — US_ASCII URLEncoder: encodeURIComponent but * etc. differs; approximate with encodeURIComponent
const signD = signC

console.log('vnp_TmnCode:', params.vnp_TmnCode)
console.log('actual vnp_SecureHash:', actualHash)
console.log('')

for (const [name, signData] of [
  ['A qs encode:false (Node sample only — sandbox often rejects)', signA],
  ['B PHP urlencode (matches VNPAY sandbox verification)', signB],
  ['C encodeURIComponent (%20 space)', signC],
] as const) {
  const hash = hmac(signData)
  const match = hash === actualHash
  console.log(`${match ? '✓ MATCH' : '✗'} [${name}]`)
  console.log('  signData (first 120 chars):', signData.slice(0, 120) + (signData.length > 120 ? '…' : ''))
  console.log('  computed:', hash)
  console.log('')
}

console.log('If B matches but A does not: URL was signed with PHP-style (this project).')
console.log('If none match: wrong VNP_HASH_SECRET or params were edited after signing.')
