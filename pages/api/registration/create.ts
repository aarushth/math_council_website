import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/prisma/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { studentName, grade, userId, eventId, score } = req.body

        if (!studentName || !userId || !eventId || grade < 0 || grade > 8) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const registration = await prisma.registration.create({
            data: {
                studentName,
                grade: grade,
                score: score || null,
                user: { connect: { id: Number(userId) } },
                event: { connect: { id: Number(eventId) } },
            },
        })

        res.status(201).json(registration)
    } catch (error) {
        console.error('Error creating registration:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
