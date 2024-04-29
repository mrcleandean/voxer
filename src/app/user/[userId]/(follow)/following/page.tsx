import BackButton from "@/components/BackButton";
import Following from "@/components/Following";
import { db } from "@/lib/db";
import { ExtendedFollowee } from "@/types/db";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const FollowingPage = async ({ params: { userId } }: { params: { userId: string } }) => {
    const following: ExtendedFollowee[] = await db.follow.findMany({
        where: {
            followerId: userId
        },
        include: {
            followee: true,
        }
    });
    return (
        <div className="relative w-full h-fit flex justify-center">
            <div className="w-full flex flex-col max-w-5xl border-0 md:border border-border rounded-lg mb-5">
                <div className="w-full border-b border-border py-4 px-1 md:px-6 flex gap-2 items-center text-foreground text-2xl font-bold">
                    <BackButton />
                    Following
                </div>
                <div className="p-4">
                    <Following following={following} userId={userId} />
                </div>
            </div>
        </div>
    );
}

export default FollowingPage;