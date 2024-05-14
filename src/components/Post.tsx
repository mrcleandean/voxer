'use client'

import { cn, formatTimeToNow } from '@/lib/utils'
import { Vox, User, Vote } from '@prisma/client'
import { MessageSquare, Repeat2, Share } from 'lucide-react'
import Link from 'next/link'
import { FC, useRef } from 'react'
import PostVoteClient from './PostVoteClient'
import { UserAvatar } from './UserAvatar'
import { Button, buttonVariants } from './ui/Button'

interface PostProps {
    vox: Vox & {
        author: User
        votes: Vote[]
    }
    votesAmt: number
    commentAmt: number
}

interface VoxUserDisplayProps {
    vox: Vox & {
        author: User
    }
}

const VoxUserDisplay = ({ vox }: VoxUserDisplayProps) => {
    return (
        <div className='h-fit py-1 mt-1 text-xs text-foreground px-4 flex items-center'>
            <Link
                className='underline text-foreground text-sm underline-offset-2 flex items-center gap-2'
                href={`/user/${vox.author.id}`}
            >
                <UserAvatar user={vox.author} className='w-7 h-7' />
                @{vox.author.username ? vox.author.username : 'Anonymous'}
            </Link>
            <span className='px-1'>•</span>
            {formatTimeToNow(new Date(vox.createdAt))}
        </div>
    )
}

const Post: FC<PostProps> = ({
    vox,
    votesAmt: _votesAmt,
    commentAmt,
}) => {
    const pRef = useRef<HTMLParagraphElement>(null)
    return (
        <div className='rounded-md bg-background border border-border overflow-hidden'>
            <div className='flex'>
                <PostVoteClient
                    voxId={vox.id}
                    initialVotesAmt={_votesAmt}
                />
                <div className='w-full'>
                    <VoxUserDisplay vox={vox} />
                    <Link href={`/vox/${vox.id}`}>
                        <div className='relative px-4 text-sm max-h-48 w-full overflow-clip' ref={pRef}>
                            <p className='overflow-hidden text-sm py-2 leading-6 text-foreground text-wrap break-words break-all'>
                                {vox.content?.toString()}
                            </p>
                            {vox.imageUrls.length > 0 && (
                                <div className='h-48 w-48 overflow-hidden rounded-lg'>
                                    <img
                                        alt="thumbnail image"
                                        src={vox.imageUrls[0]}
                                        className="object-cover min-w-full min-h-full"
                                    />
                                </div>
                            )}
                            {pRef.current?.clientHeight === 192 ? (
                                <div className='absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent' />
                            ) : null}
                        </div>
                    </Link>
                </div>
            </div>
            <div className='bg-background border-t border-border z-20 text-sm px-3 py-2 flex justify-between'>
                <Link
                    href={`/vox/${vox.id}`}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'w-fit h-7 flex items-center gap-2 text-foreground')}>
                    <MessageSquare className='h-4 w-4' /> {commentAmt} {commentAmt !== 1 ? 'comments' : 'comment'}
                </Link>
                <div className='flex justify-center items-center gap-1'>
                    <Button variant={'ghost'} size={'icon'} className='h-7'>
                        <Repeat2 className='text-foreground h-5 w-5' />
                    </Button>
                    <Button variant={'ghost'} size={'icon'} className='h-7'>
                        <Share className='text-foreground h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Post