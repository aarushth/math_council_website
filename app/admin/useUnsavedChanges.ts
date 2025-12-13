'use client'

import { useEffect } from 'react'

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges) return

            e.preventDefault()
            e.returnValue = ''
        }

        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [hasUnsavedChanges])
}
