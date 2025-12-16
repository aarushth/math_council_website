'use client'

import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from '@heroui/button'
import { usePathname, useSearchParams } from 'next/navigation'

function SignInButton() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const query = searchParams?.toString()
    const callbackUrl = query ? `${pathname}?${query}` : pathname || undefined

    return (
        <Button
            onPress={() =>
                signIn('google', {
                    callbackUrl,
                    prompt: 'select_account',
                })
            }
            variant="ghost"
            color="primary"
        >
            <FaGoogle className="mr-2" />
            Sign in with Google
        </Button>
    )
}

export default SignInButton
