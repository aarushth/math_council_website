'use client'

import { Spinner } from '@heroui/spinner'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import EventCard from '@/components/ui/cards/EventCard'
import { useEvents } from '@/components/hooks/useAdminQueries'

export default function EventsSection() {
    const { data: events = [], isLoading } = useEvents()
    const router = useRouter()

    const activeEvents = useMemo(
        () =>
            [...events]
                .filter((event) => event.active)
                .sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                ),
        [events]
    )

    const inactiveEvents = useMemo(
        () =>
            [...events]
                .filter((event) => !event.active)
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                ),
        [events]
    )

    if (isLoading) return <Spinner />

    return (
        <>
            {activeEvents.length !== 0 && (
                <>
                    <h1 className="text-3xl font-bold mb-6 mt-5 md:mt-10">
                        Upcoming Events:
                    </h1>

                    <ScrollShadow
                        hideScrollBar
                        className="flex flex-row gap-5 overflow-x-auto px-2 py-5 mb-30"
                        offset={100}
                        orientation="horizontal"
                        onWheel={(e: any) => {
                            e.currentTarget.scrollLeft += e.deltaY
                        }}
                    >
                        {activeEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                clickText="Click To Register"
                                event={event}
                                onPress={() => router.push('/registration')}
                            />
                        ))}
                    </ScrollShadow>
                </>
            )}
            {inactiveEvents.length !== 0 && (
                <>
                    <h1 className="text-3xl font-bold mb-6 mt-5 md:mt-10">
                        Past Events:
                    </h1>

                    <ScrollShadow
                        hideScrollBar
                        className="flex flex-row gap-5 overflow-x-auto px-2 py-5 mb-30"
                        offset={100}
                        orientation="horizontal"
                        onWheel={(e: any) => {
                            e.currentTarget.scrollLeft += e.deltaY
                        }}
                    >
                        {inactiveEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                clickText="Click to View Questions and Answers"
                                event={event}
                                onPress={() => {
                                    window.open(event.questionPdf!, '_blank')
                                }}
                            />
                        ))}
                    </ScrollShadow>
                </>
            )}
        </>
    )
}
