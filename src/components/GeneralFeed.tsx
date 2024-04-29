import { db } from '@/lib/db'
import PostFeed from './PostFeed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'

const GeneralFeed = async () => {
    const voxes = await db.vox.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            votes: true,
            author: true,
            comments: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS, // 4 to demonstrate infinite scroll, should be higher in production
    });

    return <PostFeed qKey="general-feed" initialPosts={voxes} userId={null} />
}

export default GeneralFeed