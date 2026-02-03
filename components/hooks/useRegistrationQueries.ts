import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'

import { Event, Registration } from '@/lib/primitives'

export const queryKeys = {
    activeEvents: ['activeEvents'] as const,
}

export function useActiveEvents() {
    return useQuery({
        queryKey: queryKeys.activeEvents,
        queryFn: async (): Promise<Event[]> => {
            const res = await fetch('/api/event/active')

            if (!res.ok) throw new Error('Failed to fetch active events')

            return res.json()
        },
    })
}

export function useCreateRegistration() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (registrationData: {
            studentName: string
            grade: number
            eventId: number
        }): Promise<Registration> => {
            const res = await fetch('/api/registration/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            })

            if (!res.ok) throw new Error('Failed to create registration')

            return res.json()
        },
        onSuccess: (newRegistration, variables) => {
            // Optimistically update the local cache
            queryClient.setQueryData<Event[]>(
                queryKeys.activeEvents,
                (old = []) =>
                    old.map((event) =>
                        event.id === variables.eventId
                            ? {
                                  ...event,
                                  registrations: [
                                      ...event.registrations,
                                      newRegistration,
                                  ],
                              }
                            : event
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

export function useUpdateRegistration() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            studentName,
            grade,
        }: {
            id: number
            studentName: string
            grade: number
            eventId: number
        }): Promise<Registration> => {
            const res = await fetch(`/api/registration/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, grade }),
            })

            if (!res.ok) throw new Error('Failed to update registration')
            const data = await res.json()

            return data.registration
        },
        onSuccess: (updatedRegistration, variables) => {
            queryClient.setQueryData<Event[]>(
                queryKeys.activeEvents,
                (old = []) =>
                    old.map((event) =>
                        event.id === variables.eventId
                            ? {
                                  ...event,
                                  registrations: event.registrations.map(
                                      (reg) =>
                                          reg.id === updatedRegistration.id
                                              ? updatedRegistration
                                              : reg
                                  ),
                              }
                            : event
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

// Delete Registration Mutation
export function useDeleteRegistration() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
        }: {
            id: number
            eventId: number
        }): Promise<void> => {
            const res = await fetch(`/api/registration/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete registration')
        },
        onSuccess: (_, variables) => {
            // Optimistically update the local cache
            queryClient.setQueryData<Event[]>(
                queryKeys.activeEvents,
                (old = []) =>
                    old.map((event) =>
                        event.id === variables.eventId
                            ? {
                                  ...event,
                                  registrations: event.registrations.filter(
                                      (reg) => reg.id !== variables.id
                                  ),
                              }
                            : event
                    )
            )
        },
        onError: () => {
            addToast({ title: 'An error occurred. Please try again later.' })
        },
    })
}
