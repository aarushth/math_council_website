'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@heroui/button'
function SignOutButton() {
    return (
        <Button
            onPress={() => signOut({ callbackUrl: '/' })}
            variant="ghost"
            color="danger"
        >
            Sign Out
        </Button>
    )
}
export default SignOutButton
