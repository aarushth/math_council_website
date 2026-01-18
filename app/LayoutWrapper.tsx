'use client'

import { addToast } from '@heroui/react'
import { useSession } from 'next-auth/react'
import { ReactNode, useEffect, useRef } from 'react'

interface LayoutWrapperProps {
    children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const { data: session } = useSession()
    const toastShown = useRef(false)

    useEffect(() => {
        console.log(session)
        if (session && !toastShown.current) {
            addToast({
                title: 'Logged in as ' + session.user.email,
                color: 'success',
            })
            toastShown.current = true
        }
    }, [session])
    return <>{children}</>
}
