'use client'

import { signIn } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from '@heroui/button'
import { usePathname } from 'next/navigation'

function SignInButton() {
    const pathname = usePathname()

    return (
        <Button
            color="primary"
            variant="ghost"
            onPress={() =>
                signIn('google', {
                    pathname,
                    prompt: 'select_account',
                })
            }
        >
            <FaGoogle className="mr-2" />
            Sign in with Google
        </Button>
    )
}

export default SignInButton
