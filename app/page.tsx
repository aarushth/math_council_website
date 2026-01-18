'use client'
import { ScrollShadow, Image } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'

import { Event } from '@/lib/primitives'
import EventCard from '@/components/ui/EventCard'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'

export default function Home() {
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
            <Carousel
                className="w-full"
                opts={{
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
            >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="flex items-center justify-center max-h-100 rounded-lg overflow-hidden">
                                <Image
                                    alt={'homepage' + index}
                                    className="flex items-center justify-center w-full object-cover"
                                    src={'/images/homepage' + index + '.jpg'}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <h1 className="text-3xl font-bold mb-6 mt-5 md:mt-10">
                Upcoming Events
            </h1>
            {events.length == 0 && <p>No upcoming Events</p>}
            <ScrollShadow
                className="flex flex-row gap-5 overflow-x-auto px-2"
                offset={100}
                orientation="horizontal"
            >
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </ScrollShadow>
        </>
    )
}
