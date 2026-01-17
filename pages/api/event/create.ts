import type { NextApiRequest, NextApiResponse } from 'next'

import { getServerSession } from 'next-auth'

import { authOptions } from '../auth/[...nextauth]'

import { prisma } from '@/prisma/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }

    try {
        const { name, description, date, location, active, totalScore } =
            req.body

        if (
            !name ||
            !description ||
            !date ||
            !location ||
            active == undefined
        ) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const event = await prisma.event.create({
            data: {
                name: name,
                description: description,
                date: date,
                location: location,
                active: active,
                totalScore: totalScore,
            },
        })

        res.status(201).json(event)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
