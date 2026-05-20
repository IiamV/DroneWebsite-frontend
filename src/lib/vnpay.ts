/**
 * VNPay payment helpers — signing matches the PHP integration sample on VNPay docs.
 * The Node.js sample uses qs.stringify(encode:false); the live sandbox rejects that
 * for many merchants and expects PHP urlencode(key)=urlencode(value) for HMAC input.
 * @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 */
import crypto from 'crypto'

const VNPAY_VERSION    = '2.1.1'
const VNPAY_COMMAND    = 'pay'
const VNPAY_CURR       = 'VND'
const VNPAY_ORDER_TYPE = 'billpayment'
const EXPIRE_MINUTES   = 15

function getConfig() {
  const tmnCode    = process.env.VNP_TMN_CODE?.trim()
  const hashSecret = process.env.VNP_HASH_SECRET?.trim()
  const vnpUrl     = process.env.VNP_URL?.trim() ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
  if (!tmnCode || !hashSecret) throw new Error('VNPay not configured.')
  return { tmnCode, hashSecret, vnpUrl }
}

/** yyyyMMddHHmmss in GMT+7 (Asia/Ho_Chi_Minh) */
function formatVnDate(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '00'

  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {}
  for (const key of Object.keys(obj).sort()) sorted[key] = obj[key]
  return sorted
}

/** Drop empty optional fields — Java/PHP demos skip blank values before hashing */
function dropEmpty(obj: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v != null && String(v).length > 0) out[k] = String(v)
  }
  return out
}

/** PHP `urlencode`: spaces → +, same as encodeURIComponent then %20 → + */
function phpUrlEncode(str: string): string {
  return encodeURIComponent(str).replace(/%20/g, '+')
}

/** Payload for HMAC — matches PHP sample: sorted keys, urlencode(k)=urlencode(v) */
function buildPhpSignData(params: Record<string, string>): string {
  const sorted = sortObject(params)
  return Object.keys(sorted)
    .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(sorted[k])}`)
    .join('&')
}

function signParams(params: Record<string, string>, hashSecret: string): string {
  const signData = buildPhpSignData(params)
  return crypto
    .createHmac('sha512', hashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')
}

/**
 * VNPay examples use IPv4; sandbox verification often fails with IPv6 loopback (::1)
 * when the request hits Next.js via localhost/ngrok.
 */
export function normalizeVnpayClientIp(ip: string | null | undefined): string {
  if (ip == null || !String(ip).trim()) return '127.0.0.1'
  const first = String(ip).split(',')[0].trim()
  if (!first) return '127.0.0.1'
  const lower = first.toLowerCase()
  if (lower === '::1' || lower === '0:0:0:0:0:0:0:1' || lower === '::ffff:127.0.0.1') {
    return '127.0.0.1'
  }
  return first
}

export interface CreatePaymentParams {
  amountVnd: number
  orderRef:  string
  orderInfo: string
  returnUrl: string
  ipAddr:    string
  locale?:   'vn' | 'en'
  bankCode?: string
}

export function buildPaymentUrl(params: CreatePaymentParams): string {
  const { tmnCode, hashSecret, vnpUrl } = getConfig()

  const now = new Date()
  const createDate = formatVnDate(now)
  const expireDate = formatVnDate(new Date(now.getTime() + EXPIRE_MINUTES * 60 * 1000))

  let vnpParams: Record<string, string> = dropEmpty({
    vnp_Version:    VNPAY_VERSION,
    vnp_Command:    VNPAY_COMMAND,
    vnp_TmnCode:    tmnCode,
    vnp_Locale:     params.locale ?? 'vn',
    vnp_CurrCode:   VNPAY_CURR,
    vnp_TxnRef:     params.orderRef,
    vnp_OrderInfo:  params.orderInfo,
    vnp_OrderType:  VNPAY_ORDER_TYPE,
    vnp_Amount:     String(Math.round(params.amountVnd * 100)),
    vnp_ReturnUrl:  params.returnUrl,
    vnp_IpAddr:     normalizeVnpayClientIp(params.ipAddr),
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
    ...(params.bankCode ? { vnp_BankCode: params.bankCode } : {}),
  })

  vnpParams = sortObject(vnpParams)
  const signed = signParams(vnpParams, hashSecret)

  const query = Object.keys(vnpParams)
    .map((k) => `${phpUrlEncode(k)}=${phpUrlEncode(vnpParams[k])}`)
    .join('&')
  return `${vnpUrl}?${query}&vnp_SecureHash=${signed}`
}

export interface VerifyResult {
  isSuccess:         boolean
  responseCode:      string
  transactionStatus: string
  transactionNo:     string | null
  orderRef:          string | null
  amountVnd:         number | null
  message:           string
}

export function verifyParams(query: Record<string, string>): VerifyResult {
  const { hashSecret } = getConfig()

  const secureHash = query.vnp_SecureHash
  if (!secureHash) {
    return { isSuccess: false, responseCode: '97', transactionStatus: '', transactionNo: null, orderRef: null, amountVnd: null, message: 'Missing secure hash' }
  }

  const params = dropEmpty({ ...query })
  delete params.vnp_SecureHash
  delete params.vnp_SecureHashType

  const expected = signParams(params, hashSecret)

  if (expected.toLowerCase() !== secureHash.toLowerCase()) {
    return { isSuccess: false, responseCode: '97', transactionStatus: '', transactionNo: null, orderRef: null, amountVnd: null, message: 'Invalid signature' }
  }

  const responseCode      = query.vnp_ResponseCode      ?? ''
  const transactionStatus = query.vnp_TransactionStatus ?? ''
  const isSuccess         = responseCode === '00' && transactionStatus === '00'
  const rawAmount         = query.vnp_Amount ? parseInt(query.vnp_Amount, 10) / 100 : null

  return {
    isSuccess,
    responseCode,
    transactionStatus,
    transactionNo: query.vnp_TransactionNo ?? null,
    orderRef:      query.vnp_TxnRef        ?? null,
    amountVnd:     rawAmount,
    message:       isSuccess ? 'Payment successful' : `Payment failed (code: ${responseCode})`,
  }
}
