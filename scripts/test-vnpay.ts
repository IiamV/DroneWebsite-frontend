/**
 * Smoke test: buildPaymentUrl + verifyParams + optional sandbox HTTP check.
 * Usage:
 *   npx tsx scripts/test-vnpay.ts
 *   VNPAY_SMOKE=1 npx tsx scripts/test-vnpay.ts   # GET sandbox (needs network)
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import crypto from 'crypto'
import { buildPaymentUrl, verifyParams } from '../src/lib/vnpay'

const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
}

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {}
  for (const key of Object.keys(obj).sort()) sorted[key] = obj[key]
  return sorted
}

function phpUrlEncode(str: string): string {
  return encodeURIComponent(str).replace(/%20/g, '+')
}

function phpSignData(params: Record<string, string>): string {
  const sorted = sortObject(params)
  return Object.keys(sorted)
    .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(sorted[k])}`)
    .join('&')
}

async function main() {
  const tmnCode   = process.env.VNP_TMN_CODE!.trim()
  const secretKey = process.env.VNP_HASH_SECRET!.trim()

  console.log('tmnCode:', tmnCode)

  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  const orderId = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`

  const expire = new Date(date.getTime() + 15 * 60 * 1000)
  const expireDate = `${expire.getFullYear()}${pad(expire.getMonth() + 1)}${pad(expire.getDate())}${pad(expire.getHours())}${pad(expire.getMinutes())}${pad(expire.getSeconds())}`

  const vnpParams: Record<string, string> = sortObject({
    vnp_Version:    '2.1.1',
    vnp_Command:    'pay',
    vnp_TmnCode:    tmnCode,
    vnp_Locale:     'vn',
    vnp_CurrCode:   'VND',
    vnp_TxnRef:     orderId,
    vnp_OrderInfo:  'Thanh toan don hang',
    vnp_OrderType:  'billpayment',
    vnp_Amount:     String(10000 * 100),
    vnp_ReturnUrl:  'http://localhost:3000/api/payment/return',
    vnp_IpAddr:     '127.0.0.1',
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  })

  const signData = phpSignData(vnpParams)
  const signed = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex')
  const query = Object.keys(vnpParams)
    .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(vnpParams[k])}`)
    .join('&')
  const phpUrl = `${process.env.VNP_URL?.trim() ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'}?${query}&vnp_SecureHash=${signed}`

  console.log('PHP signData (first 90 chars):', signData.slice(0, 90) + '…')
  console.log('PHP reference URL (first 120 chars):', phpUrl.slice(0, 120) + '…')

  const ourUrl = buildPaymentUrl({
    amountVnd: 10000,
    orderRef: orderId,
    orderInfo: 'Thanh toan don hang',
    returnUrl: 'http://localhost:3000/api/payment/return',
    ipAddr: '127.0.0.1',
    locale: 'vn',
  })

  const ourQuery = Object.fromEntries(new URL(ourUrl).searchParams) as Record<string, string>
  const v = verifyParams(ourQuery)
  const ok =
    v.message !== 'Invalid signature' && v.message !== 'Missing secure hash'

  console.log('\nbuildPaymentUrl verifyParams:', ok ? 'OK' : v.message)
  if (!ok) process.exit(1)

  if (process.env.VNPAY_SMOKE === '1') {
    const res = await fetch(ourUrl, { redirect: 'manual' })
    const loc = res.headers.get('location') ?? ''
    console.log('Sandbox GET status:', res.status, 'Location:', loc.slice(0, 80))
    if (res.status === 302 && loc.includes('Error.html')) {
      console.error('FAIL: redirected to VNPay error page')
      process.exit(1)
    }
    if (res.status !== 200 && res.status !== 302) {
      console.error('Unexpected status', res.status)
      process.exit(1)
    }
    if (res.status === 302) {
      const nextLoc = loc.startsWith('http') ? loc : new URL(loc, 'https://sandbox.vnpayment.vn').href
      const r2 = await fetch(nextLoc, { redirect: 'follow' })
      const text = await r2.text()
      const bad = /Error\.html\?code=70|Invalid signature/i.test(text)
      if (bad) {
        console.error('FAIL: error 70 / invalid signature in followed page')
        process.exit(1)
      }
    }
    console.log('Smoke: no code=70 in response chain (basic check).')
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
