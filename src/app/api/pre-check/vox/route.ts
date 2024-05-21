import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CooldownResponse } from '@/lib/validators/cooldown'
import { z } from 'zod'

export async function GET() {
    try {
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
        if (cooldowns && cooldowns.voxCooldownEnds >= now) {
            const cooldownResponse: CooldownResponse = {
                timeLeft: Math.ceil((cooldowns.voxCooldownEnds.getTime() - now.getTime()) / 1000),
                type: 'vox'
            }
            return new Response(JSON.stringify(cooldownResponse), { status: 429 });
        }
        return new Response('OK');
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