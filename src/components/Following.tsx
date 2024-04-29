import { ExtendedFollowee } from "@/types/db";
import { FC } from "react";
import { UserAvatar } from "./UserAvatar";
import FollowUnfollowButton from "./FollowUnfollowButton";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";

type FollowingProps = {
    following: ExtendedFollowee[],
    userId: string
}

const Following: FC<FollowingProps> = async ({ following, userId }) => {
    const session = await getAuthSession();
    return (
        <div className="flex flex-col gap-2">
            {following.length === 0 ? (
                <p className="text-center mt-2 text-foreground">No following yet.</p>
            ) : (
                <>
                    {following.map((follow) => {
                        return (
                            <div key={follow.followeeId} className="bg-secondary p-2 rounded-xl flex justify-between">
                                <Link href={`/user/${follow.followeeId}`} className="flex items-center">
                                    <div key={follow.followeeId} className="flex items-center gap-2">
                                        <UserAvatar user={follow.followee} className="h-7 w-7" />
                                        <p className="text-md text-foreground">@{follow.followee.username}</p>
                                        <p className="text-sm">{follow.followee.name}</p>
                                    </div>
                                </Link>
                                {session?.user.id === userId && (
                                    <FollowUnfollowButton className='scale-[0.8]' initialFollowing={true} viewerId={follow.followerId} vieweeId={follow.followeeId} />
                                )}
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Following;