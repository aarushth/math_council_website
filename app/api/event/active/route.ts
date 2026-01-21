import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function GET(_req: Request) {
    try {
        const session = await getServerSession(authOptions)

        let activeEvents

        if (!session?.user?.id) {
            activeEvents = await prisma.event.findMany({
                where: { active: true },
                orderBy: { date: 'asc' },
            })
        } else {
            const userId = Number(session.user.id)

            activeEvents = await prisma.event.findMany({
                where: { active: true },
                include: {
                    registrations: {
                        where: { userId },
                    },
                },
                orderBy: { date: 'asc' },
            })
        }

        const serialized = activeEvents.map((event) => ({
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
