import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ChangesValidator } from '@/lib/validators/changes'
import { z } from 'zod'

export async function PATCH(req: Request) {
    try {
        const body = await req.json()

        const { newInfo, newPreferences } = ChangesValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: newInfo
        });

        await db.preferences.upsert({
            where: {
                userId: session.user.id
            },
            update: newPreferences,
            create: {
                userId: session.user.id,
                ...newPreferences
            }
        });

        return new Response('OK')
    } catch (error) {
        (error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }
        return new Response(
            'Could not update profile. Please try again.',
            { status: 500 }
        )
    }
}

