// app/api/paypal-setup/route.ts  (temporary - delete after use)
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

    // Step 1 - Create Product
    const product = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            name: 'Cliporra Pro',
            description: 'Cliporra Pro Plan',
            type: 'SERVICE',
            category: 'SOFTWARE',
        }),
    })
    const productData = await product.json()
    console.log('Product ID:', productData.id)

    // Step 2 - Create Plan
    const plan = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            product_id: productData.id,
            name: 'Cliporra Pro Monthly',
            description: 'Monthly Pro subscription',
            billing_cycles: [
                {
                    frequency: {
                        interval_unit: 'MONTH',
                        interval_count: 1,
                    },
                    tenure_type: 'REGULAR',
                    sequence: 1,
                    total_cycles: 0,
                    pricing_scheme: {
                        fixed_price: {
                            value: '9.99',  // ← your price
                            currency_code: 'USD',
                        },
                    },
                },
            ],
            payment_preferences: {
                auto_bill_outstanding: true,
                payment_failure_threshold: 3,
            },
        }),
    })
    const planData = await plan.json()
    console.log('Plan ID:', planData.id)

    return NextResponse.json({
        productId: productData.id,
        planId: planData.id,
    })
}