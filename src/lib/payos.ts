import crypto from 'crypto'

function getConfig() {
  const clientId = process.env.PAYOS_CLIENT_ID?.trim()
  const apiKey = process.env.PAYOS_API_KEY?.trim()
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY?.trim()
  if (!clientId || !apiKey || !checksumKey) throw new Error('PayOS not configured.')
  return { clientId, apiKey, checksumKey }
}

function createChecksum(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex')
}

export function createPayosDescription(orderCode: number): string {
  return `FLY${String(orderCode).slice(-6)}`.slice(0, 9)
}

interface CreatePaymentParams {
  orderCode: number
  amount: number
  description: string
  returnUrl: string
  cancelUrl: string
}

export async function createPayosPaymentUrl(params: CreatePaymentParams): Promise<string> {
  const { clientId, apiKey, checksumKey } = getConfig()
  const description = params.description.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 9)

  const checksumData = `amount=${params.amount}&cancelUrl=${params.cancelUrl}&description=${description}&orderCode=${params.orderCode}&returnUrl=${params.returnUrl}`
  const signature = createChecksum(checksumData, checksumKey)

  const body = {
    orderCode: params.orderCode,
    amount: params.amount,
    description,
    returnUrl: params.returnUrl,
    cancelUrl: params.cancelUrl,
    signature,
  }

  const res = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': clientId,
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json().catch(() => null) as {
    code?: string
    desc?: string
    data?: { checkoutUrl?: string }
  } | null

  if (!res.ok) {
    throw new Error(json?.desc ?? `PayOS request failed with HTTP ${res.status}`)
  }

  if (!json) {
    throw new Error('PayOS returned an empty response')
  }

  if (json.code !== '00' || !json.data?.checkoutUrl) {
    throw new Error(json.desc ?? 'PayOS payment creation failed')
  }

  return json.data.checkoutUrl
}

export function verifyPayosWebhook(body: Record<string, unknown>): boolean {
  const { checksumKey } = getConfig()
  const data = body.data as Record<string, unknown> | undefined
  if (!data) return false

  const checksumData = `amount=${data.amount}&code=${data.code}&desc=${data.desc}&orderCode=${data.orderCode}&paymentLinkId=${data.paymentLinkId}&status=${data.status}&transactionDateTime=${data.transactionDateTime}`
  const expectedSignature = createChecksum(checksumData, checksumKey)
  return body.signature === expectedSignature
}
