'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query)
        const listener = (event) => setMatches(event.matches)

        setMatches(mediaQueryList.matches)
        mediaQueryList.addEventListener('change', listener)

        return () => {
            mediaQueryList.removeEventListener('change', listener)
        }
    }, [query])

    return matches
}
