import type { NextApiRequest, NextApiResponse } from 'next'

import { getServerSession } from 'next-auth'

import { authOptions } from '../auth/[...nextauth]'

import { prisma } from '@/prisma/prisma'

type UpdatePayload = {
    id: number
    score: number | null
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }

    try {
        const updates: UpdatePayload[] = req.body

        if (!Array.isArray(updates)) {
            return res.status(400).json({ error: 'Invalid payload' })
        }

        await prisma.$transaction(
            updates.map(({ id, score }) =>
                prisma.registration.update({
                    where: { id },
                    data: { score },
                })
            )
        )

        return res.status(200).json({ success: true })
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
}
