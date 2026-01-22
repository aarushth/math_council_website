'use client'

import { Button } from '@heroui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {}, [error])

    return (
        <div>
            <div className="flex flex-col items-center">
                <p className="p-6 text-xl text-center">Something went wrong!</p>
                <Button onPress={() => reset()}>Try again</Button>
            </div>
        </div>
    )
}
