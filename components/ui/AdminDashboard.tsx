'use client'

import React, { useMemo, useState } from 'react'
import { FaPlus, FaUsers } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    Spinner,
    useDisclosure,
} from '@heroui/react'

import UserList from './cards/UserList'
import AdminEventTable from './tables/AdminEventTable'
import EventForm from './modals/EventModal'

import { Event } from '@/lib/primitives'
import { useEvents, useUsers } from '@/components/hooks/useAdminQueries'

export default function AdminDashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const { data: events = [], isLoading } = useEvents()
    const { data: users = [], refetch: refetchUsers } = useUsers()
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onOpenChange: onModalOpenChange,
    } = useDisclosure()
    const {
        isOpen: isDrawerOpen,
        onOpen: onDrawerOpen,
        onOpenChange: onDrawerOpenChange,
    } = useDisclosure()
    const [existingEvent, setExistingEvent] = useState<Event | null>(null)

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

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex justify-center h-full">
                <Spinner />
            </div>
        )
    }
    if (status === 'unauthenticated' || !session?.user?.email) {
        router.push('/')
    }

    return (
        <div className="mb-30">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="flex gap-5 flex-col md:flex-row">
                    <Button
                        color="default"
                        startContent={<FaUsers />}
                        variant="faded"
                        onPress={() => {
                            if (users.length <= 0) {
                                refetchUsers()
                            }
                            onDrawerOpen()
                        }}
                    >
                        View Users
                    </Button>
                    <Button
                        color="success"
                        startContent={<FaPlus />}
                        variant="faded"
                        onPress={onModalOpen}
                    >
                        Create an Event
                    </Button>
                </div>
            </div>

            <h1 className="text-2xl mb-3 mt-6">Active Events</h1>
            {!activeEvents.length && <p>No active events found.</p>}
            {activeEvents.map((event) => (
                <div key={event.id}>
                    <AdminEventTable
                        event={event}
                        onEditClick={(e) => {
                            setExistingEvent(e)
                            onModalOpen()
                        }}
                    />
                </div>
            ))}
            <Divider className="my-4" />
            <h1 className="text-2xl mb-3 mt-6">Inactive Events</h1>
            {!inactiveEvents.length && <p>No inactive events found.</p>}
            {inactiveEvents.map((event) => (
                <div key={event.id}>
                    <AdminEventTable
                        event={event}
                        onEditClick={(e) => {
                            setExistingEvent(e)
                            onModalOpen()
                        }}
                    />
                </div>
            ))}
            <EventForm
                clearExisting={() => setExistingEvent(null)}
                existingEvent={existingEvent}
                isOpen={isModalOpen}
                onOpenChange={onModalOpenChange}
            />

            <Drawer isOpen={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                Users
                            </DrawerHeader>
                            <DrawerBody>
                                <UserList users={users} />
                            </DrawerBody>
                            <DrawerFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}
