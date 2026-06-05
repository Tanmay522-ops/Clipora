import React from 'react'
import { completeSubscription } from '@/actions/user'

type Props = {
    searchParams: Promise<{
        subscription_id?: string
        cancel?: boolean
        ba_token?: string
        token?: string
    }>
}

const page = async ({ searchParams }: Props) => {
    const { cancel, subscription_id } = await searchParams

    if (cancel) {
        return (
            <div className="flex flex-col justify-center items-center h-screen w-full bg-[#111111]">
                <h4 className="text-white text-5xl font-bold">Cancelled</h4>
                <p className="text-[#9D9D9D] text-xl text-center mt-4">
                    Your subscription was cancelled
                </p>
                <a
                    href="/dashboard"
                    className="mt-8 bg-white text-black px-10 py-3 rounded-full font-semibold"
                >
                    Go Back
                </a>
            </div >
        )
    }

    if (subscription_id) {
        const customer = await completeSubscription(subscription_id)
        if (customer?.status === 200) {
            return (
                <div className="flex flex-col justify-center items-center h-screen w-full bg-[#111111]">
                    <h4 className="text-white text-5xl font-bold">🎉 Success!</h4>
                    <p className="text-[#9D9D9D] text-xl text-center mt-4">
                        You are now a Pro member!
                    </p>
                    <a
                        href="/"
                        className="mt-8 bg-white text-black px-10 py-3 rounded-full font-semibold"
                    >
                        Go to Dashboard
                    </a>
                </div >
            )
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-[#111111]">
            <h4 className="text-white text-5xl font-bold">404</h4>
            <p className="text-[#9D9D9D] text-xl text-center mt-4">
                Oops! Something went wrong
            </p>
            <a
                href="/dashboard"
                className="mt-8 bg-white text-black px-10 py-3 rounded-full font-semibold"
            >
                Go Back
            </a>
        </div >
    )
}

export default page