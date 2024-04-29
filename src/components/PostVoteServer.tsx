import { getAuthSession } from '@/lib/auth'
import type { Vox, Vote } from '@prisma/client'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'

interface PostVoteServerProps {
    voxId: string
    initialVotesAmt?: number
    getData?: () => Promise<(Vox & { votes: Vote[] }) | null>
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const PostVoteServer = async ({
    voxId,
    initialVotesAmt,
    getData,
}: PostVoteServerProps) => {
    let _votesAmt: number = 0
    if (getData) {
        // fetch data in component
        const post = await getData()
        if (!post) return notFound()

        _votesAmt = post.votes.reduce((acc, vote) => acc + vote.net, 0)
    } else {
        // passed as props
        _votesAmt = initialVotesAmt!
    }

    return (
        <PostVoteClient
            voxId={voxId}
            initialVotesAmt={_votesAmt}
        />
    )
}

export default PostVoteServer