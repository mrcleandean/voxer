import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostFeed from './PostFeed'
import { notFound } from 'next/navigation'

const CustomFeed = async () => {
    const session = await getAuthSession()

    // only rendered if session exists, so this will not happen
    if (!session) return notFound()

    const followedPeople = await db.follow.findMany({
        where: {
            followerId: session.user.id,
        },
        include: {
            followee: true
        },
    })

    const voxes = await db.vox.findMany({
        where: {
            authorId: {
                in: followedPeople.map((user) => user.followee.id)
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: true,
            comments: true,
            votes: true,
            reshares: true
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
    })

    return <PostFeed qKey={`custom-feed-${session.user.id}`} initialPosts={voxes} userId={null} />
}

export default CustomFeed