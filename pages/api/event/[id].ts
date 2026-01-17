import type { NextApiRequest, NextApiResponse } from 'next'

import { getServerSession } from 'next-auth'

import { authOptions } from '../auth/[...nextauth]'

import { prisma } from '@/prisma/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }

    const { id } = req.query
    const eventId = Number(id)

    if (!eventId || isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' })
    }

    try {
        switch (req.method) {
            case 'DELETE':
                const deletedEvent = await prisma.event.delete({
                    where: { id: eventId },
                })

                return res.status(200).json({
                    success: true,
                    event: deletedEvent,
                })

            case 'PUT':
                const {
                    name,
                    description,
                    date,
                    location,
                    active,
                    totalScore,
                } = req.body

                if (
                    !name ||
                    !description ||
                    !date ||
                    !location ||
                    active == undefined
                ) {
                    return res
                        .status(400)
                        .json({ message: 'Missing required fields' })
                }
                const updatedEvent = await prisma.event.update({
                    where: { id: eventId },
                    data: {
                        name: name,
                        description: description,
                        date: date,
                        location: location,
                        active: active,
                        totalScore: totalScore,
                    },
                })

                return res.status(200).json({
                    success: true,
                    event: updatedEvent,
                })

            default:
                return res.status(405).json({ message: 'Method Not Allowed' })
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
