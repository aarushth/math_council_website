import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/prisma/prisma'

export async function GET(_req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin)
        return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    try {
        const users = await prisma.user.findMany({ orderBy: { admin: 'desc' } })

        return NextResponse.json(users)
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
