import { VOX_COOLDOWN_INTERVAL } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CooldownResponse } from '@/lib/validators/cooldown'
import { VoxValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { content, location, tags, imageUrls } = VoxValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        let cooldowns = await db.cooldowns.findUnique({
            where: {
                userId: session.user.id,
            },
        })

        const now = new Date();

        if (!cooldowns || cooldowns.voxCooldownEnds < now) {
            await db.cooldowns.upsert({
                where: {
                    userId: session.user.id,
                },
                create: {
                    userId: session.user.id,
                    voxCooldownEnds: new Date(now.getTime() + VOX_COOLDOWN_INTERVAL),
                },
                update: {
                    voxCooldownEnds: new Date(now.getTime() + VOX_COOLDOWN_INTERVAL),
                }
            });

            await db.vox.create({
                data: {
                    content,
                    location,
                    tags,
                    imageUrls,
                    authorId: session.user.id,
                },
            })

            return new Response('OK');
        }

        const cooldownResponse: CooldownResponse = {
            timeLeft: Math.ceil((cooldowns.voxCooldownEnds.getTime() - now.getTime()) / 1000),
            type: 'vox'
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