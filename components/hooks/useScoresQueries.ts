import { useQuery } from '@tanstack/react-query'

import { Event } from '@/lib/primitives'

export const queryKeys = {
    inactiveEvents: ['inactiveEvents'] as const,
}

export function useInactiveEvents() {
    return useQuery({
        queryKey: queryKeys.inactiveEvents,
        queryFn: async (): Promise<Event[]> => {
            const res = await fetch('/api/event/inactive')

            if (!res.ok) throw new Error('Failed to fetch inactive events')

            return res.json()
        },
    })
}
