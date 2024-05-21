import { MIN_NET_SCORE_FOR_DELETION, MIN_TOTAL_VOTES_FOR_DELETION, VOTE_COOLDOWN_INTERVAL } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CooldownResponse } from '@/lib/validators/cooldown'
import { PostVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { voxId, voteType } = PostVoteValidator.parse(body)
        const session = await getAuthSession()
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }
        const vox = await db.vox.findUnique({
            where: {
                id: voxId
            },
            include: {
                votes: true
            }
        });
        if (!vox) {
            return new Response('Vox not found', { status: 404 });
        }
        if (vox.isVoxxed) {
            return new Response('Already Voxxed', { status: 409 });
        }
        let cooldown = await db.cooldowns.findUnique({
            where: {
                userId: session.user.id,
            }
        })
        const now = new Date();
        if (!cooldown || cooldown.voteCooldownEnds < now) {
            const netScore = vox.votes.reduce((acc, vote) => acc + vote.net, 0) + (voteType === 'UP' ? 1 : -1);
            if (netScore <= MIN_NET_SCORE_FOR_DELETION) {
                await db.vox.update({
                    where: {
                        id: voxId,
                    },
                    data: {
                        isVoxxed: true,
                        content: 'VOXXED',
                        imageUrls: [],
                    }
                });
                return new Response('You have successfully voxxed this post.', { status: 410 });
            } else {
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
                        unique_user_vox: {
                            userId: session.user.id,
                            voxId,
                        }
                    },
                    create: {
                        userId: session.user.id,
                        voxId,
                        net: voteType === 'UP' ? 1 : -1
                    },
                    update: {
                        net: {
                            increment: voteType === 'UP' ? 1 : -1
                        }
                    },
                });
                return new Response('OK');
            }

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
            'Could not post at this time. Please try later',
            { status: 500 }
        )
    }
}

