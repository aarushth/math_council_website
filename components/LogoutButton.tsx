'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@heroui/button'
function LogoutButton() {
    return (
        <Button
            onPress={() => signOut({ callbackUrl: '/' })}
            variant="ghost"
            color="primary"
        >
            Logout
        </Button>
    )
}
export default LogoutButton
