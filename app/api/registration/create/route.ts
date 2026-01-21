import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user)
        return Response.json({ message: 'Unauthorized' }, { status: 403 })

    const userId = session.user.id
    const body = await req.json()
    const { studentName, grade, eventId, score } = body

    if (!studentName || !userId || !eventId || grade < 0 || grade > 8) {
        return Response.json(
            { message: 'Missing required fields' },
            { status: 400 }
        )
    }

    try {
        const registration = await prisma.registration.create({
            data: {
                studentName,
                grade,
                score: score || null,
                user: { connect: { id: Number(userId) } },
                event: { connect: { id: Number(eventId) } },
            },
        })

        return Response.json(registration, { status: 201 })
    } catch {
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
