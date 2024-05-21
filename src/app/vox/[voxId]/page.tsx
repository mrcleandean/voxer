import CommentsSection from '@/components/CommentsSection'
import PostVoteServer from '@/components/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { formatTimeToNow } from '@/lib/utils'
import { Vox, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import Link from 'next/link'
import { UserAvatar } from '@/components/UserAvatar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel'
import gradientTextClasses from '@/components/templates/gradientTextClasses'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type VoxPageExtendedVox = Vox & {
    votes: Vote[]
    author: User
} | null;

const VoxPage = async ({ params: { voxId } }: { params: { voxId: string } }) => {
    const vox: VoxPageExtendedVox = await db.vox.findFirst({
        where: {
            id: voxId,
        },
        include: {
            votes: true,
            author: true
        },
    })

    if (!vox) return notFound()

    return (
        <div>
            <div className='h-full flex items-start justify-between'>
                <Suspense fallback={<PostVoteShell />}>
                    <PostVoteServer
                        voxId={vox.id}
                        getData={async () => {
                            return await db.vox.findUnique({
                                where: {
                                    id: voxId,
                                },
                                include: {
                                    votes: true,
                                },
                            })
                        }}
                    />
                </Suspense>

                <div className='w-full flex-1 p-4 rounded-sm'>
                    <div className={`${vox.isVoxxed ? 'text-primary' : 'text-foreground'} h-fit py-1 mt-1 text-xs px-4 flex items-center`}>
                        <Link
                            className='underline text-sm underline-offset-2 flex items-center gap-2'
                            href={`/user/${vox.author.id}`}
                        >
                            <UserAvatar user={vox.author} className='w-7 h-7' />
                            @{vox.author.username ? vox.author.username : 'Anonymous'}
                        </Link>
                        <span className='px-1 select-none'>•</span>
                        {formatTimeToNow(new Date(vox.createdAt))}
                        {vox.location && (
                            <>
                                <span className='px-1 select-none'>•</span>
                                <div className='flex items-center justify-center gap-1'>
                                    <MapPin className='h-4 w-4' />
                                    <p>{vox.location}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='bg-secondary min-h-14 h-fit p-3 mt-3 rounded-lg'>
                        <p className='ml-2 text-foreground text-sm text-wrap break-words break-all'>{vox.content.toString()}</p>
                        {vox.imageUrls.length > 0 && (
                            <div className='mt-2 flex justify-center items-center w-full px-12 py-2.5 bg-background rounded-lg border-border border'>
                                <Carousel
                                    className='w-[95%] max-w-2xl'
                                    opts={{
                                        loop: true,
                                    }}
                                >
                                    <CarouselContent>
                                        {vox.imageUrls.map((url, i) => {
                                            return (
                                                <CarouselItem key={`${vox.id}-image-${i}`}>
                                                    <div className='select-none w-full h-full overflow-hidden rounded-lg'>
                                                        <a target='_blank' href={url}>
                                                            <img
                                                                alt="vox carousel image"
                                                                src={url}
                                                                className="object-cover min-w-full min-h-full"
                                                            />
                                                        </a>
                                                    </div>
                                                </CarouselItem>
                                            )
                                        })}
                                    </CarouselContent>
                                    <CarouselNext className='text-foreground' />
                                    <CarouselPrevious className='text-foreground' />
                                </Carousel>
                            </div>
                        )}
                        {vox.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                                {vox.tags.map((tag, i) => {
                                    const color = gradientTextClasses[i % gradientTextClasses.length];
                                    return (
                                        <Link key={`${vox.id}-tag-${i}`} href='/'>
                                            {/* TODO: Create tag page */}
                                            <div className="z-[1] bg-background transition-all px-2 py-1.5 rounded-lg flex items-center gap-0.5" key={`tag-${tag}-${i}`}>
                                                <p className={`${color} text-xs`}>#{tag}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <Suspense
                        fallback={
                            <ImSpinner2 className='mr-2 h-4 w-4 animate-spin' />
                        }>
                        <CommentsSection voxId={vox.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function PostVoteShell() {
    return (
        <div className='flex flex-col py-2 bg-secondary'>
            {/* upvote */}
            <div className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                <ArrowBigUp className='h-5 w-5 text-foreground' />
            </div>

            {/* score */}
            <div className='flex items-center justify-center w-full py-2 font-medium text-foreground'>
                <Loader2 className='h-3 w-3 animate-spin text-lg' />
            </div>

            {/* downvote */}
            <div className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                <ArrowBigDown className='h-5 w-5 text-foreground' />
            </div>
        </div>
    )
}

export default VoxPage