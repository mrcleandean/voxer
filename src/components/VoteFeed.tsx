"use client";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { FeedVote } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { Vote } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useRef } from "react";
import FeedCommentComponent from "./FeedCommentComponent";
import Post from "./Post";
import { Loader2 } from "lucide-react";

type VoteFeedProps = {
    initialVotes: FeedVote[],
    userId: string,
    qKey: string
}

const VoteFeed: FC<VoteFeedProps> = ({ initialVotes, userId, qKey }) => {
    const lastVoteRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastVoteRef.current,
        threshold: 1
    });
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['vox-votes', qKey],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            let query: string;
            if (userId) query = `/api/get/voted/${userId}?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            else query = `/api/get/voted?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}`;
            const { data } = await axios.get(query);
            return data as FeedVote[];
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1
        }
    })
    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])
    const voted: FeedVote[] = (data?.pages.flatMap((page) => page) ?? initialVotes);
    return (
        <ul className='flex flex-col py-4 gap-4'>
            {voted.length === 0 ? (
                <div className="w-full flex justify-center">
                    <p className="text-muted-foreground">Nothing here yet...</p>
                </div>
            ) : (
                voted.map((vote, index) => {
                    if (vote.vox) {
                        const votesAmt = vote.vox.votes.reduce((acc: number, vote: Vote) => acc + vote.net, 0);
                        if (index === voted.length - 1) {
                            return (
                                <li key={vote.vox.id + vote.vox.updatedAt} ref={ref}>
                                    <Post
                                        vox={vote.vox}
                                        votesAmt={votesAmt}
                                        commentAmt={vote.vox.comments.length}
                                    />
                                </li>
                            )
                        } else {
                            return (
                                <Post
                                    key={vote.vox.id + vote.vox.updatedAt}
                                    vox={vote.vox}
                                    votesAmt={votesAmt}
                                    commentAmt={vote.vox.comments.length}
                                />
                            )
                        }
                    }
                    if (vote.comment) {
                        const votesAmt = vote.comment.votes.reduce((acc: number, vote: Vote) => acc + vote.net, 0);
                        if (index === voted.length - 1) {
                            return (
                                <li key={vote.comment.id} ref={ref}>
                                    <FeedCommentComponent
                                        comment={vote.comment}
                                        votesAmt={votesAmt}
                                        replyAmt={vote.comment.replies.length}
                                    />
                                </li>
                            )
                        } else {
                            return (
                                <FeedCommentComponent
                                    key={vote.comment.id}
                                    comment={vote.comment}
                                    votesAmt={votesAmt}
                                    replyAmt={vote.comment.replies.length}
                                />
                            )
                        }
                    }
                    if (index === voted.length - 1) {
                        return (
                            <li key={vote.id + vote.updatedAt} ref={ref}>
                                Item not found
                            </li>
                        )
                    } else {
                        return null;
                    }
                })
            )}
            {
                isFetchingNextPage && (
                    <li className='flex justify-center'>
                        <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                    </li>
                )
            }
        </ul >
    )
}

export default VoteFeed;