'use client'

import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from '@heroui/button'
import { usePathname, useSearchParams } from 'next/navigation'

function SignInButton() {
    const pathname = usePathname()

    return (
        <Button
            onPress={() =>
                signIn('google', {
                    pathname,
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
