// app/api/event/inactive/route.ts
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id)
        return Response.json({ error: 'Not authenticated' }, { status: 401 })

    const userId = Number(session.user.id)

    try {
        const inactiveEvents = await prisma.event.findMany({
            where: {
                active: false,
                registrations: { some: { userId } },
            },
            include: {
                registrations: { where: { userId } },
            },
            orderBy: { date: 'asc' },
        })

        const serialized = inactiveEvents.map((event) => ({
            ...event,
            date: event.date.toISOString(),
        }))

        return Response.json(serialized)
    } catch {
        return Response.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}
