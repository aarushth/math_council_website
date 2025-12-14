'use client'
import EventCard from '@/components/EventCard'
import { Event } from '@/components/primitives'
import { ScrollShadow } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'

export default function Home() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: 'linear',
    }
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
            {/* <div className="inline-block max-w-xl text-center justify-center">
                <span className={title()}>Make&nbsp;</span>
                <span className={title({ color: 'violet' })}>
                    beautiful&nbsp;
                </span>
                <br />
                <span className={title()}>
                    websites regardless of your design experience.
                </span>
                <div className={subtitle({ class: 'mt-4' })}>
                    Beautiful, fast and modern React UI library.
                </div>
            </div> */}

            <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
            <ScrollShadow
                className="flex flex-row gap-5 overflow-x-auto"
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
