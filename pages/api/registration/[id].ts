import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/prisma/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query
    const registrationId = Number(id)

    if (!registrationId || isNaN(registrationId)) {
        return res.status(400).json({ message: 'Invalid registration ID' })
    }

    try {
        switch (req.method) {
            case 'DELETE':
                const deletedRegistration = await prisma.registration.delete({
                    where: { id: registrationId },
                })
                return res.status(200).json({
                    success: true,
                    registration: deletedRegistration,
                })

            case 'PUT': {
                const { studentName, grade, score, scoreReport } = req.body

                // Build update payload dynamically
                const data: any = {}

                if (studentName !== undefined) {
                    if (!studentName) {
                        return res
                            .status(400)
                            .json({ message: 'studentName cannot be empty' })
                    }
                    data.studentName = studentName
                }

                if (grade !== undefined) {
                    data.grade = Number(grade)
                }

                if (score !== undefined) {
                    data.score = Number(score)
                }

                if (scoreReport !== undefined) {
                    if (!Array.isArray(scoreReport)) {
                        return res
                            .status(400)
                            .json({ message: 'scoreReport must be an array' })
                    }
                    data.scoreReport = scoreReport
                }

                if (Object.keys(data).length === 0) {
                    return res.status(400).json({
                        message: 'No valid fields provided for update',
                    })
                }

                const updatedRegistration = await prisma.registration.update({
                    where: { id: registrationId },
                    data,
                })

                return res.status(200).json({
                    success: true,
                    registration: updatedRegistration,
                })
            }
            case 'GET':
                const session = await getServerSession(req, res, authOptions)

                if (!session?.user?.admin) {
                    return res.status(403).json({ error: 'Admin only' })
                }
                const allRegistrations = await prisma.registration.findMany({
                    where: { eventId: registrationId },
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                })
                return res.status(200).json({
                    success: true,
                    registration: allRegistrations,
                })
            default:
                return res.status(405).json({ message: 'Method Not Allowed' })
        }
    } catch (error: any) {
        console.error('Error handling registration:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
