import CloseModal from "@/components/CloseModal";
import Followers from "@/components/Followers";
import { db } from "@/lib/db";
import { ExtendedFollower } from "@/types/db";

const FollowersModal = async ({ params: { userId } }: { params: { userId: string } }) => {
    const followers: ExtendedFollower[] = await db.follow.findMany({
        where: {
            followeeId: userId
        },
        include: {
            follower: true
        }
    });
    return (
        <div className='fixed top-24 inset-x-0 h-full max-h-[calc(100vh-7rem)] bg-background/10 z-10'>
            <div className='px-5 flex h-full max-w-2xl mx-auto'>
                <div className='bg-background border border-border w-full h-full rounded-lg flex flex-col gap-3 pb-4'>
                    <div className="p-3 flex justify-between border-b border-border rounded-t-lg">
                        <h1 className="text-foreground font-bold text-xl">Followers</h1>
                        <CloseModal />
                    </div>
                    <div className="w-full px-3 overflow-auto">
                        <Followers followers={followers} userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FollowersModal;