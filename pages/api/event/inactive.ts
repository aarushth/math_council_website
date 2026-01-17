import type { NextApiRequest, NextApiResponse } from 'next'

import { getServerSession } from 'next-auth'

import { prisma } from '@/prisma/prisma'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Not authenticated' })
        }

        const userId = Number(session.user.id)

        const inactiveEvents = await prisma.event.findMany({
            where: {
                active: false,
                registrations: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                registrations: {
                    where: {
                        userId: userId, // optional: only return this user's registrations
                    },
                },
            },
            orderBy: { date: 'asc' },
        })

        const serialized = inactiveEvents.map((event) => ({
            ...event,
            date: event.date.toISOString(),
        }))

        return res.status(200).json(serialized)
    } catch {
        return res.status(500).json({ error: 'Failed to fetch events' })
    }
}
