import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return Response.json({ error: 'Admin only' }, { status: 403 })

    const body = await req.json()
    const {
        name,
        description,
        date,
        location,
        active,
        totalScore,
        questionPdf,
    } = body

    if (!name || !description || !date || !location || active === undefined) {
        return Response.json(
            { message: 'Missing required fields' },
            { status: 400 }
        )
    }

    try {
        const event = await prisma.event.create({
            data: {
                name,
                description,
                date,
                location,
                active,
                totalScore,
                questionPdf,
            },
        })

        return Response.json(event, { status: 201 })
    } catch {
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
