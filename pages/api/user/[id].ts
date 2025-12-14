import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/prisma/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }

    const { id } = req.query
    const userId = Number(id)
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid event ID' })
    }

    try {
        switch (req.method) {
            case 'PUT':
                const { admin } = req.body

                if (admin == undefined) {
                    return res
                        .status(400)
                        .json({ message: 'Missing required fields' })
                }
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        admin: admin,
                    },
                })

                return res.status(200).json({
                    success: true,
                    user: updatedUser,
                })

            default:
                return res.status(405).json({ message: 'Method Not Allowed' })
        }
    } catch (error: any) {
        console.error('Error handling user:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
