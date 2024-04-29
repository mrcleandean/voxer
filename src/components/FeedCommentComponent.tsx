"use client";
import { FeedComment } from "@/types/db"
import { UserAvatar } from "./UserAvatar"
import Link from "next/link"
import CommentVotes from "./CommentVotes"
import { cn, formatTimeToNow } from "@/lib/utils"
import { FC, useRef } from "react"
import { buttonVariants } from "./ui/Button";
import { MessageSquare } from "lucide-react";

type FeedCommentProps = {
    comment: FeedComment,
    votesAmt: number,
    replyAmt: number
}

const FeedCommentComponent: FC<FeedCommentProps> = ({
    comment,
    votesAmt,
    replyAmt
}) => {
    const commentRef = useRef<HTMLDivElement>(null)
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
            <Link href={`/vox/${comment.postId}`}>
                <div className='h-fit bg-secondary px-3 py-2'>
                    <p className='text-sm text-foreground'>{comment.text}</p>
                </div>
            </Link>
            <div className='flex gap-2 items-center justify-between py-2 px-2'>
                <CommentVotes
                    commentId={comment.id}
                    votesAmt={votesAmt}
                />
                <Link
                    href={`/vox/${comment.postId}`}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'w-fit h-7 flex items-center gap-2 text-foreground')}>
                    <MessageSquare className='h-4 w-4' /> {replyAmt} {replyAmt !== 1 ? 'replies' : 'reply'}
                </Link>
            </div>
        </div>
    )
}

export default FeedCommentComponent;