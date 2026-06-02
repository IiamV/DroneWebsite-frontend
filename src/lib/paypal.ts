function getConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim()
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim()
  const mode = process.env.PAYPAL_MODE?.trim() ?? 'sandbox'
  if (!clientId || !clientSecret) throw new Error('PayPal not configured.')
  const baseUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
  return { clientId, clientSecret, baseUrl }
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, baseUrl } = getConfig()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const json = await res.json()
  if (!json.access_token) throw new Error('Failed to get PayPal access token')
  return json.access_token
}

interface CreateOrderParams {
  amount: string
  currency: string
  description: string
  returnUrl: string
  cancelUrl: string
}

export async function createPaypalOrder(params: CreateOrderParams): Promise<{ id: string; approvalUrl: string }> {
  const { baseUrl } = getConfig()
  const token = await getAccessToken()

  const body = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: params.currency,
        value: params.amount,
      },
      description: params.description,
    }],
    payment_source: {
      paypal: {
        experience_context: {
          return_url: params.returnUrl,
          cancel_url: params.cancelUrl,
          brand_name: 'Flyntic Studio',
          user_action: 'PAY_NOW',
        },
      },
    },
  }

  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()
  if (!json.id) throw new Error(json.message ?? 'PayPal order creation failed')

  const approvalUrl = json.links?.find((l: { rel: string; href: string }) => l.rel === 'payer-action')?.href
  if (!approvalUrl) throw new Error('No PayPal approval URL returned')

  return { id: json.id, approvalUrl }
}

export async function capturePaypalOrder(orderId: string): Promise<{ status: string; transactionId: string; amountUsd: number | null }> {
  const { baseUrl } = getConfig()
  const token = await getAccessToken()

  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const json = await res.json()
  const capture = json.purchase_units?.[0]?.payments?.captures?.[0]
  const rawAmount = capture?.amount?.value ?? json.purchase_units?.[0]?.amount?.value
  return {
    status: json.status ?? 'UNKNOWN',
    transactionId: capture?.id ?? orderId,
    amountUsd: rawAmount ? Number(rawAmount) : null,
  }
}
