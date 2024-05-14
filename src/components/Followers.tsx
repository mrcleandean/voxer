import { ExtendedFollower } from "@/types/db";
import { FC } from "react";
import { UserAvatar } from "./UserAvatar";
import FollowUnfollowButton from "./FollowUnfollowButton";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db";

type FollowersProps = {
    followers: ExtendedFollower[],
    userId: string
}

// TODO: Fix follow button conditionally for YourProfile and UserAuthedProfile
// Refer to below
// TODO: Fix image uploading such that images only upload if a post is successful.

const Followers: FC<FollowersProps> = async ({ followers, userId }) => {
    const session = await getAuthSession();
    const mutualMap: { [key: string]: true } = {};
    if (session?.user.id === userId) {
        const followerIds = followers.map(follower => follower.followerId);
        const mutual = await db.follow.findMany({
            where: {
                followerId: userId,
                followeeId: {
                    in: followerIds
                }
            },
            select: {
                followeeId: true
            }
        });
        mutual.forEach(m => {
            mutualMap[m.followeeId] = true;
        })
    }
    return (
        <div className="flex flex-col gap-2">
            {followers.length === 0 ? (
                <p className="text-center mt-2 text-foreground">No followers yet.</p>
            ) : (
                <>
                    {followers.map((follow) => {
                        return (
                            <div key={follow.followerId} className="bg-secondary p-2 rounded-xl flex justify-between">
                                <Link href={`/user/${follow.followerId}`} className="flex items-center">
                                    <div key={follow.followerId} className="flex items-center gap-2">
                                        <UserAvatar user={follow.follower} className="h-7 w-7" />
                                        <p className="text-md text-foreground">@{follow.follower.username}</p>
                                        <p className="text-sm">{follow.follower.name}</p>
                                    </div>
                                </Link>
                                {/* TODO HERE: Refer to above */}
                                {session?.user.id === userId && (
                                    <FollowUnfollowButton className="scale-[0.8]" initialFollowing={mutualMap[follow.followerId] ?? false} viewerId={follow.followeeId} vieweeId={follow.followerId} />
                                )}
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Followers;