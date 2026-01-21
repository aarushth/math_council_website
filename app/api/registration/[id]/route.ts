import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user)
        return Response.json({ message: 'Unauthorized' }, { status: 403 })

    const { id } = await params
    const registrationId = Number(id)

    if (!registrationId || isNaN(registrationId))
        return Response.json(
            { message: 'Invalid registration ID' },
            { status: 400 }
        )

    try {
        const deletedRegistration = await prisma.registration.delete({
            where: { id: registrationId },
        })

        return Response.json({
            success: true,
            registration: deletedRegistration,
        })
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

    if (!session?.user)
        return Response.json({ message: 'Unauthorized' }, { status: 403 })

    const { id } = await params
    const registrationId = Number(id)

    if (!registrationId || isNaN(registrationId))
        return Response.json(
            { message: 'Invalid registration ID' },
            { status: 400 }
        )
    const body = await req.json()
    const { studentName, grade, score, scoreReport } = body
    const data: any = {}

    if (studentName !== undefined) {
        if (!studentName)
            return Response.json(
                { message: 'studentName cannot be empty' },
                { status: 400 }
            )
        data.studentName = studentName
    }
    if (grade !== undefined) data.grade = Number(grade)
    if (score !== undefined) data.score = Number(score)
    if (scoreReport !== undefined) {
        if (!Array.isArray(scoreReport))
            return Response.json(
                { message: 'scoreReport must be an array' },
                { status: 400 }
            )
        data.scoreReport = scoreReport
    }
    if (Object.keys(data).length === 0)
        return Response.json(
            { message: 'No valid fields provided for update' },
            { status: 400 }
        )

    try {
        const updatedRegistration = await prisma.registration.update({
            where: { id: registrationId },
            data,
        })

        return Response.json({
            success: true,
            registration: updatedRegistration,
        })
    } catch (error: any) {
        return Response.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        )
    }
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return Response.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const eventId = Number(id)

    if (!eventId || isNaN(eventId))
        return Response.json(
            { message: 'Invalid registration ID' },
            { status: 400 }
        )

    try {
        const allRegistrations = await prisma.registration.findMany({
            where: { eventId: eventId },
            include: { user: { select: { email: true } } },
        })

        return Response.json({
            success: true,
            registration: allRegistrations,
        })
    } catch (error: any) {
        return Response.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        )
    }
}
