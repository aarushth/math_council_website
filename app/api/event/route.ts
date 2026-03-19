import { prisma } from '@/prisma/prisma'

export async function GET(_req: Request) {
    try {
        const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })
        const serialized = events.map((event) => ({
            ...event,
            date: event.date.toISOString(),
        }))

        return Response.json(serialized)
    } catch {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
