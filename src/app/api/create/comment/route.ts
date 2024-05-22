import { COMMENT_COOLDOWN_INTERVAL } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentValidator } from '@/lib/validators/comment'
import { CooldownResponse } from '@/lib/validators/cooldown'
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { voxId, text, replyToId } = CommentValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        let cooldowns = await db.cooldowns.findUnique({
            where: {
                userId: session.user.id
            }
        });

        const now = new Date();

        if (!cooldowns || cooldowns.commentCooldownEnds < now) {
            await db.cooldowns.upsert({
                where: {
                    userId: session.user.id
                },
                create: {
                    userId: session.user.id,
                    commentCooldownEnds: new Date(now.getTime() + COMMENT_COOLDOWN_INTERVAL)
                },
                update: {
                    commentCooldownEnds: new Date(now.getTime() + COMMENT_COOLDOWN_INTERVAL)
                }
            })

            await db.comment.create({
                data: {
                    text,
                    postId: voxId,
                    authorId: session.user.id,
                    replyToId,
                },
            })

            return new Response('OK')
        }

        const cooldownResponse: CooldownResponse = {
            timeLeft: Math.ceil((cooldowns.voxCooldownEnds.getTime() - now.getTime()) / 1000),
            type: 'comment'
        }

        return new Response(JSON.stringify(cooldownResponse), { status: 429 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response(
            'Could not post at this time. Please try later',
            { status: 500 }
        )
    }
}