'use client'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@heroui/react'

import SignInButton from '@/components/ui/buttons/SignInButton'
import InactiveEventTable from '@/components/ui/tables/InactiveEventTable'
import { useInactiveEvents } from '@/components/hooks/useScoresQueries'

export default function RegistrationPage() {
    const { data: session, status } = useSession()
    const { data: events = [], isLoading } = useInactiveEvents()

    const inactiveEvents = useMemo(
        () =>
            [...events].sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        [events]
    )

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex justify-center h-full">
                <Spinner />
            </div>
        )
    }
    if (status === 'unauthenticated' || !session?.user?.email) {
        return (
            <div className="flex flex-col items-center">
                <p className="p-6 text-xl text-center">
                    Please sign in to view your scores.
                </p>
                <SignInButton />
            </div>
        )
    }

    if (!events.length) return <p>No scores found.</p>

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Scores</h1>
            {inactiveEvents.map((event) => (
                <InactiveEventTable key={event.id} event={event} />
            ))}
        </>
    )
}
