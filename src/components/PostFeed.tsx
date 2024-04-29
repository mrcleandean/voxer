'use client'

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { FeedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import Post from './Post'
import { Vote } from '@prisma/client'

interface PostFeedProps {
    initialPosts: FeedPost[],
    qKey: string,
    userId?: string | null
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, qKey, userId = null }) => {
    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['vox-posts', qKey],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            let query: string;
            if (userId) query = `/api/get/posts/${userId}?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            else query = `/api/get/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            const { data } = await axios.get(query)
            return data as FeedPost[]
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        }
    });
    // Need way to include initialPosts
    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage() // Load more posts when the last post comes into view
        }
    }, [entry, fetchNextPage])
    const voxes = (data?.pages.flatMap((page) => page) ?? initialPosts) as FeedPost[];
    return (
        <ul className='flex flex-col py-4 gap-4'>
            {voxes.map((vox, index) => {
                const votesAmt = vox.votes.reduce((acc: number, vote: Vote) => acc + vote.net, 0)

                if (index === voxes.length - 1) {
                    // Add a ref to the last post in the list
                    return (
                        <li key={vox.id + vox.updatedAt} ref={ref}>
                            <Post
                                vox={vox}
                                votesAmt={votesAmt}
                                commentAmt={vox.comments.length}
                            />
                        </li>
                    )
                } else {
                    return (
                        <Post
                            key={vox.id + vox.updatedAt}
                            vox={vox}
                            votesAmt={votesAmt}
                            commentAmt={vox.comments.length}
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

export default PostFeed