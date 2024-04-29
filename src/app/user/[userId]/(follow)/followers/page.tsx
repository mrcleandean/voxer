import BackButton from "@/components/BackButton";
import Followers from "@/components/Followers";
import { db } from "@/lib/db";
import { ExtendedFollower } from "@/types/db";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const FollowersPage = async ({ params: { userId } }: { params: { userId: string } }) => {
    const followers: ExtendedFollower[] = await db.follow.findMany({
        where: {
            followeeId: userId
        },
        include: {
            follower: true
        }
    });
    return (
        <div className="relative w-full h-fit flex justify-center">
            <div className="w-full flex flex-col max-w-5xl border-0 md:border border-border rounded-lg mb-5">
                <div className="w-full border-b border-border py-4 px-1 md:px-6 flex gap-2 items-center text-foreground text-2xl font-bold">
                    <BackButton />
                    Followers
                </div>
                <div className="p-4">
                    <Followers followers={followers} userId={userId} />
                </div>
            </div>
        </div>
    );
}

export default FollowersPage;