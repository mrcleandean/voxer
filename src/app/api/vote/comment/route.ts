import { VOTE_COOLDOWN_INTERVAL } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CooldownResponse } from '@/lib/validators/cooldown'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { commentId, voteType } = CommentVoteValidator.parse(body)
        const session = await getAuthSession()
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }
        let cooldown = await db.cooldowns.findUnique({
            where: {
                userId: session.user.id,
            }
        })
        const now = new Date();
        if (!cooldown || cooldown.voteCooldownEnds < now) {
            await db.cooldowns.upsert({
                where: {
                    userId: session.user.id,
                },
                create: {
                    userId: session.user.id,
                    voteCooldownEnds: new Date(now.getTime() + VOTE_COOLDOWN_INTERVAL),
                },
                update: {
                    voteCooldownEnds: new Date(now.getTime() + VOTE_COOLDOWN_INTERVAL),
                }
            });
            await db.vote.upsert({
                where: {
                    unique_user_comment: {
                        userId: session.user.id,
                        commentId,
                    }
                },
                create: {
                    userId: session.user.id,
                    commentId,
                    net: voteType === 'UP' ? 1 : -1
                },
                update: {
                    net: {
                        increment: voteType === 'UP' ? 1 : -1
                    }
                },
            })
            return new Response('OK');
        }
        const cooldownResponse: CooldownResponse = {
            timeLeft: Math.ceil((cooldown.voteCooldownEnds.getTime() - now.getTime()) / 1000),
            type: 'vote'
        }
        return new Response(JSON.stringify(cooldownResponse), { status: 429 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response(
            'Could not comment on vote at this time. Please try later',
            { status: 500 }
        )
    }
}