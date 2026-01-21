import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin) {
        return Response.json({ error: 'Admin only' }, { status: 403 })
    }

    const body = (await req.json()) as HandleUploadBody

    try {
        const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async () => ({
                allowedContentTypes: ['application/pdf'],
                addRandomSuffix: true,
                callbackUrl: '/api/blob/upload',
            }),
        })

        return Response.json(jsonResponse)
    } catch (error) {
        return Response.json(
            { error: (error as Error).message },
            { status: 400 }
        )
    }
}
