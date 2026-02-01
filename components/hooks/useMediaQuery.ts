'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query)
        const listener = (event: MediaQueryListEvent) =>
            setMatches(event.matches)

        setMatches(mediaQueryList.matches)
        mediaQueryList.addEventListener('change', listener)

        return () => {
            mediaQueryList.removeEventListener('change', listener)
        }
    }, [query])

    return matches
}
