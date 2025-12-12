import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '@/prisma/prisma'

type Data = { error: string } | { events: any[] }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Get user session
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }

    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' },
        })
        return res.status(200).json({ events })
    } catch (error) {
        console.error('Error fetching events:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
