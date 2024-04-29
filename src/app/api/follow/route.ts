import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FollowValidator } from "@/lib/validators/follow";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { viewerId, vieweeId } = FollowValidator.parse(body);
        const session = await getAuthSession();
        if (!session || session.user.id !== viewerId) {
            return new Response('Unauthorized', { status: 401 });
        }
        const follow = await db.follow.findUnique({
            where: {
                followerId_followeeId: {
                    followerId: viewerId,
                    followeeId: vieweeId
                }
            }
        });
        if (follow) {
            await db.follow.delete({
                where: {
                    followerId_followeeId: {
                        followerId: viewerId,
                        followeeId: vieweeId
                    }
                }
            });
        } else {
            await db.follow.create({
                data: {
                    followerId: viewerId,
                    followeeId: vieweeId
                }
            });
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