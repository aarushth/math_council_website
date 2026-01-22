'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@heroui/react'
function SignOutButton() {
    return (
        <Button
            color="danger"
            variant="ghost"
            onPress={() => signOut({ callbackUrl: '/' })}
        >
            Sign Out
        </Button>
    )
}
export default SignOutButton
