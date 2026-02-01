'use client'
import type { Event, Registration } from '@/lib/primitives'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner, useDisclosure } from '@heroui/react'

import ActiveEventTable from '../../components/ui/tables/ActiveEventTable'
import RegistrationModal from '../../components/ui/modals/RegistrationModal'

import SignInButton from '@/components/ui/buttons/SignInButton'
import { useActiveEvents } from '@/components/hooks/useRegistrationQueries'

export default function RegistrationPage() {
    const { data: session, status } = useSession()
    const { data: events = [], isLoading } = useActiveEvents()
    const [registerEvent, setRegisterEvent] = useState<Event | null>(null)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [existingRegistration, setExistingRegistration] =
        useState<Registration | null>(null)

    const activeEvents = useMemo(
        () =>
            [...events].sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
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
                    Please sign in to register for an event.
                </p>
                <SignInButton />
            </div>
        )
    }

    if (!events.length) return <p>No active events.</p>

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
            {activeEvents.map((event) => (
                <ActiveEventTable
                    key={event.id}
                    event={event}
                    onRegisterClick={(e, r) => {
                        setExistingRegistration(r ? r : null)
                        setRegisterEvent(e)
                        onOpen()
                    }}
                />
            ))}
            <RegistrationModal
                clearExisting={() => setExistingRegistration(null)}
                event={registerEvent}
                existingRegistration={existingRegistration}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
        </>
    )
}
