import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
    const url = new URL(req.url)

    try {
        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string()
            })
            .parse({
                limit: url.searchParams.get('limit'),
                page: url.searchParams.get('page'),
            })

        const comments = await db.comment.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                votes: true,
                author: true,
                replies: true
            },
        });
        return new Response(JSON.stringify(comments))
    } catch (error) {
        return new Response('Could not fetch posts', { status: 500 })
    }
}