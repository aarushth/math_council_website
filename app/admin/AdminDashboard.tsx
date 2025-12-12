'use client'

import React, { useEffect, useState } from 'react'
import { Event } from '@/components/primitives'
import { Button, Divider, Spinner, useDisclosure } from '@heroui/react'
import AdminEventTable from './AdminEventTable'
import EventForm from './EventForm'
import { FaPlus } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<Event[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [existingEvent, setExistingEvent] = useState<Event | null>(null)
    function addEvent(event: Event) {
        setEvents((prev) => {
            const exists = prev.some((e) => e.id === event.id)

            if (exists) {
                return prev.map((e) => (e.id === event.id ? event : e))
            }

            return [...prev, event]
        })
    }
    function deleteEvent(id: number) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
    }
    const activeEvents = [...events]
        .filter((event) => event.active)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const inactiveEvents = [...events]
        .filter((event) => !event.active)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    useEffect(() => {
        fetch('/api/event/events')
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
        router.push('/')
    }

    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <Button
                    color="success"
                    variant="faded"
                    startContent={<FaPlus />}
                    onPress={onOpen}
                >
                    Create an Event
                </Button>
            </div>
            {!events.length && <p>No events found.</p>}
            <h1 className="text-xl mb-3 mt-6">Active Events</h1>
            {activeEvents.map((event) => (
                <div key={event.id}>
                    <AdminEventTable
                        event={event}
                        onEditClick={(e) => {
                            setExistingEvent(e)
                            onOpen()
                        }}
                        onDeleteEvent={deleteEvent}
                    />
                </div>
            ))}
            <Divider className="my-4" />
            <h1 className="text-xl mb-3 mt-6">Inactive Events</h1>
            {inactiveEvents.map((event) => (
                <div key={event.id}>
                    <AdminEventTable
                        event={event}
                        onEditClick={(e) => {
                            setExistingEvent(e)
                            onOpen()
                        }}
                        onDeleteEvent={deleteEvent}
                    />
                </div>
            ))}
            <EventForm
                addEvent={addEvent}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                existingEvent={existingEvent}
                clearExisting={() => setExistingEvent(null)}
            ></EventForm>
        </>
    )
}
