'use client'

import { Card, CardBody, CardFooter, Divider } from '@heroui/react'
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

import { Event } from '../../../lib/primitives'
import { useAppDateFormatter } from '../../hooks/useAppDateFormatter'

interface Props {
    event: Event
}

export default function EventCard({ event }: Props) {
    const router = useRouter()
    let formatter = useAppDateFormatter()

    return (
        <Card
            isHoverable
            isPressable
            className="min-w-50 md:w-100"
            onPress={() => router.push('/registration')}
        >
            <CardBody className="text-black/80 dark:text-white/80 gap-4 p-5 flex flex-col justify-between">
                <div>
                    <p className="text-lg text-black dark:text-white">
                        {event.name}
                    </p>
                    <p className="text-xs text-body line-clamp-4">
                        {event.description}
                    </p>
                </div>
                <div>
                    <div className="flex flex-row gap-4 mb-2 items-center">
                        <FaCalendar className="shrink-0" size={18} />
                        <p className="text-xs md:text-sm flex-1">
                            {formatter.format(new Date(event.date))}
                        </p>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <FaMapMarkerAlt className="shrink-0" size={18} />
                        <p className="text-xs md:text-sm flex-1">
                            {event.location}
                        </p>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-center ">
                <p className="text-sm text-black/60 dark:text-white/60">
                    Click to Register
                </p>
            </CardFooter>
        </Card>
    )
}
