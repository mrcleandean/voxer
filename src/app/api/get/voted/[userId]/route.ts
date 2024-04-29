import { db } from '@/lib/db'
import { FeedVote } from '@/types/db';
import { z } from 'zod'

export async function GET(req: Request, { params }: { params: { userId: string; } }) {
    const url = new URL(req.url)
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

        const votes: FeedVote[] = await db.vote.findMany({
            where: {
                userId,
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                vox: {
                    include: {
                        votes: true,
                        author: true,
                        comments: true
                    }
                },
                comment: {
                    include: {
                        votes: true,
                        author: true,
                        replies: true
                    }
                }
            },
        });
        return new Response(JSON.stringify(votes))
    } catch (error) {
        return new Response('Could not fetch posts', { status: 500 })
    }
}