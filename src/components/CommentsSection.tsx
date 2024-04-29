import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { Comment, Vote, User } from '@prisma/client'
import CreateComment from './CreateComment'
import PostComment from './PostComment'

type ExtendedComment = Comment & {
    votes: Vote[]
    author: User
    replies: ReplyComment[]
}

type ReplyComment = Comment & {
    votes: Vote[]
    author: User
}

interface CommentsSectionProps {
    voxId: string
}

const CommentsSection = async ({ voxId }: CommentsSectionProps) => {
    const session = await getAuthSession()

    const comments: ExtendedComment[] = await db.comment.findMany({
        where: {
            postId: voxId,
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    });

    return (
        <div className='flex flex-col gap-y-4 border-t border-border mt-4'>

            <CreateComment voxId={voxId} />

            <div className='flex flex-col gap-y-4'>
                {comments.map((topLevelComment) => {
                    const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => acc + vote.net, 0)

                    return (
                        <div key={topLevelComment.id} className='flex flex-col'>
                            <div className='mb-1'>
                                <PostComment
                                    comment={topLevelComment}
                                    votesAmt={topLevelCommentVotesAmt}
                                    voxId={voxId}
                                />
                            </div>

                            {/* Render replies */}
                            {topLevelComment.replies
                                .sort((a, b) => a.votes.length - b.votes.length) // Sort replies by most disliked
                                .map((reply) => {
                                    const replyVotesAmt = reply.votes.reduce((acc, vote) => acc + vote.net, 0)

                                    return (
                                        <div
                                            key={reply.id}
                                            className='ml-2 py-0.5 pl-3 border-l border-foreground'>
                                            <PostComment
                                                comment={reply}
                                                votesAmt={replyVotesAmt}
                                                voxId={voxId}
                                            />
                                        </div>
                                    )
                                })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CommentsSection