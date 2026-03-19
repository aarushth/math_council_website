'use client'

import { Card, CardBody, CardFooter } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'

import { Event, GRADES } from '@/lib/primitives'
import { useAppDateFormatter } from '@/components/hooks/useAppDateFormatter'

interface Props {
    event: Event
    onPress: () => void
    clickText: string
}

export default function EventCard({ event, onPress, clickText }: Props) {
    let formatter = useAppDateFormatter()

    return (
        <Card
            isHoverable
            isPressable
            className="min-w-50 md:w-100"
            onPress={onPress}
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
                    <div className="flex flex-row gap-4 items-center">
                        <FaUsers className="shrink-0" size={18} />
                        <p className="text-xs md:text-sm flex-1">
                            {`Grades ${GRADES[event.minGrade]?.label} to ${GRADES[event.maxGrade]?.label}`}
                        </p>
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-center ">
                <p className="text-sm text-black/60 dark:text-white/60">
                    {clickText}
                </p>
            </CardFooter>
        </Card>
    )
}
