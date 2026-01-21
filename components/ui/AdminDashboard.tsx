'use client'

import React, { useEffect, useState } from 'react'
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
import { FaPlus, FaUsers } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import EventForm from './modals/EventModal'
import AdminEventTable from './tables/AdminEventTable'
import UserList from './cards/UserList'

import { Event, User } from '@/lib/primitives'

export default function AdminDashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<Event[]>([])
    const [users, setUsers] = useState<User[]>([])
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

    function addEvent(event: Event) {
        setEvents((prev) => {
            const exists = prev.some((e) => e.id === event.id)

            if (exists) {
                return prev.map((e) => (e.id === event.id ? event : e))
            }

            return [...prev, event]
        })
    }
    function updateUser(user: User) {
        setUsers((prev) => {
            const exists = prev.some((u) => u.id === user.id)

            if (exists) {
                return prev.map((u) => (u.id === user.id ? user : u))
            }

            return [...prev, user]
        })
    }
    function deleteEvent(id: number) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
    }
    const activeEvents = [...events]
        .filter((event) => event.active)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const inactiveEvents = [...events]
        .filter((event) => !event.active)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    useEffect(() => {
        fetch('/api/event/')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data)
                setLoading(false)
            })
    }, [])

    if (status === 'loading' || loading) {
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
                                fetch('/api/user/')
                                    .then((res) => res.json())
                                    .then((data) => {
                                        setUsers(data)
                                        onDrawerOpen()
                                    })
                            } else {
                                onDrawerOpen()
                            }
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
                        onDeleteEvent={deleteEvent}
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
                        onDeleteEvent={deleteEvent}
                        onEditClick={(e) => {
                            setExistingEvent(e)
                            onModalOpen()
                        }}
                    />
                </div>
            ))}
            <EventForm
                addEvent={addEvent}
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
                                <UserList
                                    updateUser={updateUser}
                                    users={users}
                                />
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
