'use client'

import { Card } from '@heroui/react'
import { Event } from './primitives'
import { useDateFormatter } from '@react-aria/i18n'
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'

interface Props {
    event: Event
}

export default function EventCard({ event }: Props) {
    let formatter = useDateFormatter({
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    })
    return (
        <Card className="p-5 gap-2 w-60 md:w-100 shrink-0 mb-5">
            <p className="block text-xl ">{event.name}</p>
            <p className="block text-xs text-body">{event.description}</p>

            <div className="flex flex-row gap-4 mt-4">
                <FaCalendar className="size-4"></FaCalendar>
                <p className="text-xs font-normal text-body text-center">
                    {formatter.format(new Date(event.date))}
                </p>
            </div>
            <div className="flex flex-row gap-4 mt-2">
                <FaMapMarkerAlt className="size-4"></FaMapMarkerAlt>
                <p className="text-xs font-normal text-body">
                    {event.location}
                </p>
            </div>
        </Card>
    )
}
