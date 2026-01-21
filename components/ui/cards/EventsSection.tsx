// components/EventsSection.tsx
'use client'

import { useEffect, useState } from 'react'
import { ScrollShadow } from '@heroui/react'
import { Spinner } from '@heroui/spinner'

import EventCard from '@/components/ui/cards/EventCard'
import { Event } from '@/lib/primitives'

export default function EventsSection() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/event/active')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data)
                setLoading(false)
            })
    }, [])

    if (loading) return <Spinner />

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 mt-5 md:mt-10">
                Upcoming Events
            </h1>

            {events.length === 0 && <p>No upcoming Events</p>}

            <ScrollShadow
                hideScrollBar
                className="flex flex-row gap-5 overflow-x-auto px-2 mb-30"
                offset={100}
                orientation="horizontal"
                onWheel={(e) => {
                    e.currentTarget.scrollLeft += e.deltaY
                }}
            >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </ScrollShadow>
        </>
    )
}
