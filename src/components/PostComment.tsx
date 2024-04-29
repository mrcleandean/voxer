'use client'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { formatTimeToNow } from '@/lib/utils'
import { CommentRequest } from '@/lib/validators/comment'
import { Comment, Vote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useRef, useState } from 'react'
import CommentVotes from './CommentVotes'
import { UserAvatar } from './UserAvatar'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'
import { toast } from '../hooks/use-toast'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export type ExtendedComment = Comment & {
    votes: Vote[]
    author: User
}

export interface PostCommentProps {
    comment: ExtendedComment
    votesAmt: number
    voxId: string
}

const PostComment: FC<PostCommentProps> = ({
    comment,
    votesAmt,
    voxId,
}) => {
    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const commentRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState<string>(`@${comment.author.username} `)
    const router = useRouter()
    useOnClickOutside(commentRef, () => {
        setIsReplying(false)
    })

    const { mutate: postComment, isPending } = useMutation({
        mutationFn: async ({ voxId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = { voxId, text, replyToId }
            const { data } = await axios.patch('/api/create/comment', payload)
            return data
        },

        onError: () => {
            return toast({
                title: 'Something went wrong.',
                description: "Comment wasn't created successfully. Please try again.",
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            router.refresh()
            setIsReplying(false)
        },
    })

    return (
        <div ref={commentRef} className='flex flex-col rounded-lg overflow-hidden border border-border'>
            <div className='h-fit py-2 text-xs text-foreground px-3 flex items-center'>
                <Link
                    className='underline text-foreground text-sm underline-offset-2 flex items-center gap-2'
                    href={`/user/${comment.author.id}`}
                >
                    <UserAvatar user={comment.author} className='w-6 h-6' />
                    @{comment.author.username ? comment.author.username : 'Anonymous'}
                </Link>
                <span className='px-1'>•</span>
                {formatTimeToNow(new Date(comment.createdAt))}
            </div>
            <div className='h-fit bg-secondary px-3 py-2'>
                <p className='text-sm text-foreground'>{comment.text}</p>
            </div>
            <div className='flex gap-2 items-center justify-between py-2 px-2'>
                <CommentVotes
                    commentId={comment.id}
                    votesAmt={votesAmt}
                />

                <Button
                    onClick={() => {
                        if (!session) return router.push('/sign-in')
                        setIsReplying(true)
                    }}
                    variant='ghost'
                    size="sm">
                    <MessageSquare className='h-4 w-4 mr-1.5' />
                    Reply
                </Button>
            </div>

            {isReplying ? (
                <div className='grid w-full gap-1.5 px-1'>
                    <div className='mt-2 px-2'>
                        <Textarea
                            onFocus={(e) =>
                                e.currentTarget.setSelectionRange(
                                    e.currentTarget.value.length,
                                    e.currentTarget.value.length
                                )
                            }
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={1}
                            className='resize-none select-none text-foreground'
                            placeholder='Reply'
                        />

                        <div className='mt-2 flex justify-end gap-2 py-2'>
                            <Button
                                tabIndex={-1}
                                variant='ghost'
                                onClick={() => setIsReplying(false)}>
                                Cancel
                            </Button>
                            <Button
                                isLoading={isPending}
                                onClick={() => {
                                    if (!input) return
                                    postComment({
                                        voxId,
                                        text: input,
                                        replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                                    })
                                }}>
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default PostComment