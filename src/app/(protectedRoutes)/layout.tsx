// app/(dashboard)/layout.tsx
import { onAuthenticateUser } from '@/actions/user'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
    
    const userExist = await onAuthenticateUser()

    if (!userExist.user) {
        redirect('/sign-in')
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default Layout