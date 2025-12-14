'use client'

import React, { useEffect, useState } from 'react'
import { Event, User } from '@/components/primitives'
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
import AdminEventTable from './AdminEventTable'
import EventForm from './EventForm'
import { FaPlus, FaUsers } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import UserList from './UserList'

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
        fetch('/api/event/events')
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
        <>
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                <div className="flex gap-5 flex-col md:flex-row">
                    <Button
                        color="default"
                        variant="faded"
                        startContent={<FaUsers />}
                        onPress={() => {
                            if (users.length <= 0) {
                                fetch('/api/user/users')
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
                        variant="faded"
                        startContent={<FaPlus />}
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
                        onDeleteEvent={deleteEvent}
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
                        onDeleteEvent={deleteEvent}
                    />
                </div>
            ))}
            <EventForm
                addEvent={addEvent}
                isOpen={isModalOpen}
                onOpenChange={onModalOpenChange}
                existingEvent={existingEvent}
                clearExisting={() => setExistingEvent(null)}
            ></EventForm>

            <Drawer isOpen={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">
                                Users
                            </DrawerHeader>
                            <DrawerBody>
                                <UserList
                                    users={users}
                                    updateUser={updateUser}
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
        </>
    )
}
