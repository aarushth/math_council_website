import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return Response.json({ error: 'Admin only' }, { status: 403 })
    const { id } = await params
    const eventId = Number(id)

    if (!eventId || isNaN(eventId))
        return Response.json({ message: 'Invalid event ID' }, { status: 400 })

    try {
        const deletedEvent = await prisma.event.delete({
            where: { id: eventId },
        })

        return Response.json({ success: true, event: deletedEvent })
    } catch (error: any) {
        return Response.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return Response.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const eventId = Number(id)

    if (!eventId || isNaN(eventId))
        return Response.json({ message: 'Invalid event ID' }, { status: 400 })

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
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
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

        return Response.json({ success: true, event: updatedEvent })
    } catch (error: any) {
        return Response.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        )
    }
}
