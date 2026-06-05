import { currentUser } from '@clerk/nextjs/server'
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

    if (!response.ok) {
        throw new Error(`Failed to get PayPal access token: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.access_token) {
        throw new Error('PayPal access token is missing in response')
    }

    return data.access_token
}

export async function GET() {
    try {
        const user = await currentUser()
        if (!user) return NextResponse.json({ status: 404, message: 'User not found' })

        if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
            return NextResponse.json({ status: 500, message: 'PayPal credentials not configured' })
        }

        if (!process.env.PAYPAL_PLAN_ID) {
            return NextResponse.json({ status: 500, message: 'PayPal plan ID not configured' })
        }

        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                plan_id: process.env.PAYPAL_PLAN_ID,
                application_context: {
                    brand_name: 'Cliporra',
                    locale: 'en-US',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'SUBSCRIBE_NOW',
                    payment_method: {
                        payer_selected: 'PAYPAL',
                        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
                    },
                    return_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment`,
                    cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
                },
            }),
        })

        if (!response.ok) {
            return NextResponse.json({
                status: 500,
                message: `PayPal subscription creation failed: ${response.statusText}`,
            })
        }

        const data = await response.json()

        const approvalUrl = data.links?.find(
            (link: any) => link.rel === 'approve'
        )?.href

        if (!approvalUrl) {
            return NextResponse.json({
                status: 500,
                message: 'PayPal approval URL not found in response',
            })
        }

        return NextResponse.json({
            status: 200,
            session_url: approvalUrl,
        })

    } catch (error: any) {
        console.error('PayPal payment error:', error)
        return NextResponse.json({
            status: 500,
            message: error.message || 'Internal server error',
        })
    }
}