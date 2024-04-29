import { FeedVote } from "@/types/db";
import { db } from "@/lib/db";
import { FC } from "react";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import UserPanels from "./UserPanels";

type UserPanelsServerProps = {
    userId: string
}

const UserPanelsServer: FC<UserPanelsServerProps> = async ({ userId }) => {
    const initialVotes: FeedVote[] = await db.vote.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
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
        }
    });
    return (
        <UserPanels userId={userId} initialVotes={initialVotes} />
    )
}

export default UserPanelsServer;