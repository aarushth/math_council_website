import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'

import { Event, Registration, User } from '@/lib/primitives'

export const queryKeys = {
    events: ['events'] as const,
    users: ['users'] as const,
    registrations: (eventId: number) => ['registrations', eventId] as const,
}

export function useEvents() {
    return useQuery({
        queryKey: queryKeys.events,
        queryFn: async (): Promise<Event[]> => {
            const res = await fetch('/api/event/')

            if (!res.ok) throw new Error('Failed to fetch events')

            return res.json()
        },
    })
}

export function useUsers() {
    return useQuery({
        queryKey: queryKeys.users,
        queryFn: async (): Promise<User[]> => {
            const res = await fetch('/api/user/')

            if (!res.ok) throw new Error('Failed to fetch users')

            return res.json()
        },
        enabled: false, // Only fetch when drawer is opened
        staleTime: Infinity, // Never consider stale - only refetch on page refresh/navigation
        refetchOnMount: true, // Refetch when component mounts (navigation back)
        refetchOnWindowFocus: false, // Don't refetch when drawer regains focus
    })
}

export function useRegistrations(eventId: number) {
    return useQuery({
        queryKey: queryKeys.registrations(eventId),
        queryFn: async (): Promise<Registration[]> => {
            const res = await fetch(`/api/registration/${eventId}`)

            if (!res.ok) throw new Error('Failed to fetch registrations')
            const data = await res.json()

            return data.registration
        },
        enabled: false, // Only fetch when manually triggered
        staleTime: 0, // Always consider stale
        refetchOnMount: false, // Don't auto-refetch on mount
        refetchOnWindowFocus: false, // Don't refetch on focus
    })
}

export function useCreateEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (eventData: {
            name: string
            description: string
            date: string
            location: string
            active: boolean
            totalScore?: number
            questionPdf: string | null
        }): Promise<Event> => {
            const res = await fetch('/api/event/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            })

            if (!res.ok) throw new Error('Failed to create event')

            return res.json()
        },
        onSuccess: (newEvent) => {
            queryClient.setQueryData<Event[]>(queryKeys.events, (old = []) => [
                ...old,
                newEvent,
            ])
        },
        onError: () => {
            addToast({
                title: 'An Error Occurred',
                description: 'Please Try Again Later',
            })
        },
    })
}

export function useUpdateEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            ...eventData
        }: {
            id: number
            name: string
            description: string
            date: string
            location: string
            active: boolean
            totalScore?: number
            questionPdf: string | null
        }): Promise<Event> => {
            const res = await fetch(`/api/event/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            })

            if (!res.ok) throw new Error('Failed to update event')
            const data = await res.json()

            return data.event
        },
        onSuccess: (updatedEvent) => {
            queryClient.setQueryData<Event[]>(queryKeys.events, (old = []) =>
                old.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            )
        },
        onError: () => {
            addToast({ title: 'An error occurred. Please try again later.' })
        },
    })
}

export function useDeleteEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            const res = await fetch(`/api/event/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete event')
        },
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<Event[]>(queryKeys.events, (old = []) =>
                old.filter((event) => event.id !== deletedId)
            )
        },
        onError: () => {
            addToast({ title: 'An error occurred. Please try again later.' })
        },
    })
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            admin,
        }: {
            id: number
            admin: boolean
        }): Promise<User> => {
            const res = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin }),
            })

            if (!res.ok) throw new Error('Failed to update user role')
            const data = await res.json()

            return data.user
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData<User[]>(queryKeys.users, (old = []) =>
                old.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            )
        },
        onError: () => {
            addToast({ title: 'An error occurred. Please try again later.' })
        },
    })
}

export function useUpdateRegistration(eventId: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            scoreReport,
            score,
        }: {
            id: number
            scoreReport: boolean[]
            score: number
        }): Promise<Registration> => {
            const res = await fetch(`/api/registration/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scoreReport, score }),
            })

            if (!res.ok) throw new Error('Failed to update registration')
            const data = await res.json()

            return data.registration
        },
        onSuccess: (updatedRegistration) => {
            queryClient.setQueryData<Registration[]>(
                queryKeys.registrations(eventId),
                (old = []) =>
                    old.map((registration) =>
                        registration.id === updatedRegistration.id
                            ? { ...registration, ...updatedRegistration }
                            : registration
                    )
            )
        },
        onError: () => {
            addToast({
                title: 'An Error Occurred',
                description: 'Please Try Again Later',
            })
        },
    })
}
