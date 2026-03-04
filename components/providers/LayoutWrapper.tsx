'use client'

import { addToast } from '@heroui/react'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

interface LayoutWrapperProps {
    children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const { data: session } = useSession()

    useEffect(() => {
        if (session && !sessionStorage.getItem('toastShown')) {
            addToast({
                title: 'Logged in as ' + session.user.email,
                color: 'success',
            })
            sessionStorage.setItem('toastShown', 'true')
        }
        if (!session) {
            sessionStorage.removeItem('toastShown')
        }
    }, [session])

    return <>{children}</>
}
