'use client'
import EventCard from '@/components/EventCard'
import { Event } from '@/components/primitives'
import { ScrollShadow } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { useEffect, useState } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

export default function Home() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
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
            <Slider {...settings}>
                <div className="bg-red-500 w-100 h-100"></div>
                <div className="bg-blue-500 w-100 h-100"></div>
                <div className="bg-green-500 w-100 h-100"></div>
                <div className="bg-orange-500 w-100 h-100"></div>
                <div className="bg-yellow-500 w-100 h-100"></div>
                <div className="bg-purple-500 w-100 h-100"></div>
            </Slider>
            <h1 className="text-3xl font-bold mb-6 mt-10">Upcoming Events</h1>
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
