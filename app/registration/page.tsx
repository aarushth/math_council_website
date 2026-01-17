'use client'
import { useEffect, useState } from 'react'
import ActiveEventTable from './ActiveEventTable'
import RegistrationForm from './RegistrationForm'
import { useSession } from 'next-auth/react'
import { Spinner, useDisclosure } from '@heroui/react'
import type { Event, Registration } from '@/components/primitives'
import SignInButton from '@/components/SignInButton'

export default function RegistrationPage() {
    const { data: session, status } = useSession()
    const [events, setEvents] = useState<Event[]>([])
    const [registerEvent, setRegisterEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [existingRegistration, setExistingRegistration] =
        useState<Registration | null>(null)

    function addRegistrationToEvent(
        eventId: number,
        registration: Registration
    ) {
        if (!registration.id) {
            console.error('Registration missing id!', registration)
            return
        }
        setEvents((prevEvents) =>
            prevEvents.map((ev) =>
                ev.id === eventId
                    ? {
                          ...ev,
                          registrations: [...ev.registrations, registration],
                      }
                    : ev
            )
        )
    }
    function updateRegistration(eventId: number, registration: Registration) {
        if (!registration.id) {
            console.error('Cannot update registration without id', registration)
            return
        }
        setEvents((prevEvents) =>
            prevEvents.map((ev) =>
                ev.id === eventId
                    ? {
                          ...ev,
                          registrations: [
                              ...ev.registrations.filter(
                                  (r) => r.id !== registration.id
                              ),
                              registration,
                          ],
                      }
                    : ev
            )
        )
    }
    function cancelRegistration(eventId: number, registrationId: number) {
        setEvents((prevEvents) =>
            prevEvents.map((ev) =>
                ev.id === eventId
                    ? {
                          ...ev,
                          registrations: ev.registrations.filter(
                              (reg) => reg.id !== registrationId
                          ),
                      }
                    : ev
            )
        )
    }
    useEffect(() => {
        fetch('/api/event/active')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data)
                setLoading(false)
            })
    }, [])

    if (status === 'loading' || loading) {
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

    const activeEvents = [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

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
                    onCancelRegistration={cancelRegistration}
                />
            ))}
            <RegistrationForm
                event={registerEvent}
                addRegistration={addRegistrationToEvent}
                updateRegistration={updateRegistration}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                existingRegistration={existingRegistration}
                clearExisting={() => setExistingRegistration(null)}
            />
        </>
    )
}
