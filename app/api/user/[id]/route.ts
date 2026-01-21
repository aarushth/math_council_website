import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { id } = await params
    const userId = Number(id)

    if (!userId || isNaN(userId))
        return NextResponse.json(
            { message: 'Invalid user ID' },
            { status: 400 }
        )

    const body = await req.json()
    const { admin } = body

    if (admin === undefined)
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 400 }
        )

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { admin },
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        )
    }
}
