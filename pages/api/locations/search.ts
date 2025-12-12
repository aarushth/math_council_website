import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/prisma/prisma' // adjust path if needed

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Only GET requests
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method not allowed' })
        }

        const { q } = req.query

        if (!q || typeof q !== 'string' || q.length < 1) {
            return res
                .status(400)
                .json({ message: "Query parameter 'q' is required" })
        }

        // Use raw query to search FTS5 table
        const results = await prisma.$queryRaw<{ address: string }[]>`
      SELECT address
      FROM locations
      WHERE address MATCH ${q + '*'}
      LIMIT 5
    `

        return res.status(200).json(results.map((r) => r.address))
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
