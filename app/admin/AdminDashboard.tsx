'use client'

import React, { useState, useEffect } from 'react'
import { Event } from '@/components/primitives'
import { Spinner } from '@heroui/react'
import AdminEventTable from './AdminEventTable'
import LocationInput from './LocationInput'

export default function AdminDashboard() {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        fetch('/api/event/events')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data.events)
                setLoading(false)
                console.log(data.events)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center h-full">
                <Spinner />
            </div>
        )
    }

    if (!events.length) return <p>No Events found.</p>

    return (
        <>
            {events.map((event) => (
                <div key={event.id}>
                    <AdminEventTable event={event} />
                </div>
            ))}
            <LocationInput placeholder="location" />
        </>
    )
}
