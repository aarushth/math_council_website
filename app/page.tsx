'use client'
import EventCard from '@/components/EventCard'
import { Event } from '@/components/primitives'
import { Card, ScrollShadow } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
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
                            <div className="p-1">
                                <Card>
                                    <div className="flex items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">
                                            {index + 1}
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <h1 className="text-3xl font-bold mb-6 mt-10">Upcoming Events</h1>
            {events.length == 0 && <p>No upcoming Events</p>}
            <ScrollShadow
                className="flex flex-row gap-5 overflow-x-auto p-5"
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
