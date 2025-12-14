// components/useMediaQuery.js
'use client' // Marks this file and its imports as client-side code

import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false) // Default to false or a server fallback value

    useEffect(() => {
        // This code runs only in the browser
        const mediaQueryList = window.matchMedia(query)
        const listener = (event) => setMatches(event.matches)

        // Initial check and event listener setup
        setMatches(mediaQueryList.matches)
        mediaQueryList.addEventListener('change', listener)

        return () => {
            mediaQueryList.removeEventListener('change', listener)
        }
    }, [query])

    return matches
}
