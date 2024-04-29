import { db } from '@/lib/db'
import { FeedComment } from '@/types/db';
import { z } from 'zod'

export async function GET(req: Request, { params }: { params: { userId: string; } }) {
    const url = new URL(req.url);
    try {
        const { userId } = z.object({ userId: z.string() }).parse(params);
        const { limit, page } = z
            .object({
                limit: z.string(),
                page: z.string()
            })
            .parse({
                limit: url.searchParams.get('limit'),
                page: url.searchParams.get('page'),
            })

        const comments: FeedComment[] = await db.comment.findMany({
            where: {
                authorId: userId
            },
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