'use client'

import { Card, CardBody, CardFooter, Divider } from '@heroui/react'
import { useDateFormatter } from '@react-aria/i18n'
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

import { Event } from '../../lib/primitives'

interface Props {
    event: Event
}

export default function EventCard({ event }: Props) {
    const router = useRouter()
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
        <Card
            isHoverable
            isPressable
            onPress={() => router.push('/registration')}
        >
            <CardBody className="text-white/80 gap-4 p-5">
                <div>
                    <p className="block text-xl text-white">{event.name}</p>
                    <p className="block text-xs text-body">
                        {event.description}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <FaCalendar size={15} />
                    <p className="text-xs font-normal text-body text-center">
                        {formatter.format(new Date(event.date))}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <FaMapMarkerAlt size={15} />
                    <p className="text-xs">{event.location}</p>
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-center ">
                <p className="text-sm text-white/60">Click to Register</p>
            </CardFooter>
        </Card>
    )
}
