import crypto from 'crypto'

function getConfig() {
  const partnerCode = process.env.MOMO_PARTNER_CODE?.trim()
  const accessKey = process.env.MOMO_ACCESS_KEY?.trim()
  const secretKey = process.env.MOMO_SECRET_KEY?.trim()
  const endpoint = (process.env.MOMO_ENDPOINT?.trim() ?? 'https://test-payment.momo.vn').replace(/\/+$/, '')
  if (!partnerCode || !accessKey || !secretKey) throw new Error('MoMo not configured.')
  return { partnerCode, accessKey, secretKey, endpoint }
}

function createSignature(rawData: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(rawData).digest('hex')
}

function safeParam(params: Record<string, string>, key: string): string {
  return params[key] ?? ''
}

function signaturesMatch(actual: string | undefined, expected: string): boolean {
  if (!actual) return false
  const actualBuffer = Buffer.from(actual, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer)
}

interface CreatePaymentParams {
  orderId: string
  amount: number
  orderInfo: string
  returnUrl: string
  notifyUrl: string
}

export async function createMomoPaymentUrl(params: CreatePaymentParams): Promise<string> {
  const { partnerCode, accessKey, secretKey, endpoint } = getConfig()
  const requestId = `${partnerCode}_${Date.now()}`
  const requestType = 'payWithMethod'
  const extraData = ''
  const autoCapture = true
  const lang = 'vi'

  const rawSignature = `accessKey=${accessKey}&amount=${params.amount}&extraData=${extraData}&ipnUrl=${params.notifyUrl}&orderId=${params.orderId}&orderInfo=${params.orderInfo}&partnerCode=${partnerCode}&redirectUrl=${params.returnUrl}&requestId=${requestId}&requestType=${requestType}`
  const signature = createSignature(rawSignature, secretKey)

  const body = {
    partnerCode,
    partnerName: 'Flyntic Studio',
    storeId: partnerCode,
    requestId,
    amount: params.amount,
    orderId: params.orderId,
    orderInfo: params.orderInfo,
    redirectUrl: params.returnUrl,
    ipnUrl: params.notifyUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    signature,
  }

  const res = await fetch(`${endpoint}/v2/gateway/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = await res.json().catch(() => null) as {
    resultCode?: number
    message?: string
    payUrl?: string
  } | null

  if (!res.ok || json?.resultCode !== 0 || !json.payUrl) {
    const details = json?.message ?? `HTTP ${res.status}`
    throw new Error(`MoMo payment creation failed: ${details}`)
  }

  return json.payUrl
}

export function verifyMomoIpn(params: Record<string, string>): { isValid: boolean; resultCode: number } {
  const { accessKey, secretKey } = getConfig()

  const rawSignature = `accessKey=${accessKey}&amount=${safeParam(params, 'amount')}&extraData=${safeParam(params, 'extraData')}&message=${safeParam(params, 'message')}&orderId=${safeParam(params, 'orderId')}&orderInfo=${safeParam(params, 'orderInfo')}&orderType=${safeParam(params, 'orderType')}&partnerCode=${safeParam(params, 'partnerCode')}&payType=${safeParam(params, 'payType')}&requestId=${safeParam(params, 'requestId')}&responseTime=${safeParam(params, 'responseTime')}&resultCode=${safeParam(params, 'resultCode')}&transId=${safeParam(params, 'transId')}`
  const expectedSignature = createSignature(rawSignature, secretKey)

  return {
    isValid: signaturesMatch(params.signature, expectedSignature),
    resultCode: parseInt(safeParam(params, 'resultCode'), 10),
  }
}
