'use client'

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import { Vote } from '@prisma/client'
import type { FeedComment } from '@/types/db'
import FeedCommentComponent from '@/components/FeedCommentComponent';

interface CommentFeedProps {
    initialComments: FeedComment[],
    userId: string | null,
    qKey: string
}

const CommentFeed: FC<CommentFeedProps> = ({ initialComments, userId, qKey }) => {
    const lastCommentRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastCommentRef.current,
        threshold: 1,
    })
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['vox-comments', qKey],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            let query: string;
            if (userId) query = `/api/get/comments/${userId}?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            else query = `/api/get/comments?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            const { data } = await axios.get(query)
            return data as FeedComment[]
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        }
    });
    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])
    const comments: FeedComment[] = (data?.pages.flatMap((page) => page) ?? initialComments);
    return (
        <ul className='flex flex-col py-4 gap-4'>
            {comments.map((comment, index) => {
                const votesAmt = comment.votes.reduce((acc: number, vote: Vote) => acc + vote.net, 0)

                if (index === comments.length - 1) {
                    // Add a ref to the last post in the list
                    return (
                        <li key={comment.id} ref={ref}>
                            <FeedCommentComponent
                                comment={comment}
                                votesAmt={votesAmt}
                                replyAmt={comment.replies.length}
                            />
                        </li>
                    )
                } else {
                    return (
                        <FeedCommentComponent
                            key={comment.id}
                            comment={comment}
                            votesAmt={votesAmt}
                            replyAmt={comment.replies.length}
                        />
                    )
                }
            })}

            {isFetchingNextPage && (
                <li className='flex justify-center'>
                    <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                </li>
            )}
        </ul>
    )
}

export default CommentFeed;