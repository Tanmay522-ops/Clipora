// app/api/paypal-check/route.ts
import { NextResponse } from 'next/server'

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

const getAccessToken = async () => {
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
            ).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
    })
    const data = await response.json()
    return data.access_token
}

export async function GET() {
    const accessToken = await getAccessToken()

    // Check plan status
    const plan = await fetch(
        `${PAYPAL_API}/v1/billing/plans/${process.env.PAYPAL_PLAN_ID}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    const planData = await plan.json()
    console.log('Plan Status:', planData.status)

    return NextResponse.json(planData)
}