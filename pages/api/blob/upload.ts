import type { NextApiResponse, NextApiRequest } from 'next'

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getServerSession } from 'next-auth'

import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user.admin) {
        return res.status(403).json({ error: 'Admin only' })
    }
    const body = req.body as HandleUploadBody

    try {
        const jsonResponse = await handleUpload({
            body: body,
            request: req,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: ['application/pdf'],
                    addRandomSuffix: true,
                    callbackUrl: '/api/blob/upload',
                }
            },
        })

        return res.status(200).json(jsonResponse)
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message })
    }
}
