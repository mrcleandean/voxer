'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { PostVoteRequest } from '@/lib/validators/vote'
import { VoteTypes } from '@/config';
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { toast } from '../hooks/use-toast'
import { Button } from './ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { CooldownResponseValidator } from '@/lib/validators/cooldown';

interface PostVoteClientProps {
    voxId: string
    initialVotesAmt: number
    initialVote?: VoteTypes | null
}

const PostVoteClient = ({
    voxId,
    initialVotesAmt,
}: PostVoteClientProps) => {
    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)

    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteTypes) => {
            const payload: PostVoteRequest = {
                voteType: type,
                voxId: voxId,
            }
            await axios.patch(`/api/vote/vox`, payload)
        },
        onError: (err, voteType) => {
            if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
            else setVotesAmt((prev) => prev + 1)

            if (err instanceof AxiosError && err.response?.status === 429 && CooldownResponseValidator.safeParse(err.response.data)) {
                return toast({
                    title: 'Vote cooldown active.',
                    description: `You can vote again in ${err.response.data.timeLeft} seconds.`,
                    variant: 'destructive'
                })
            }

            if (err instanceof AxiosError && err.response?.status === 401) {
                return loginToast()
            }

            return toast({
                title: 'Something went wrong.',
                description: 'Your vote was not registered. Please try again.',
                variant: 'destructive',
            })
        },
        onMutate: (type: VoteTypes) => {
            setVotesAmt(prev => type === 'UP' ? prev + 1 : prev - 1);
        },
    })

    return (
        <div className='flex flex-col py-2 bg-secondary'>
            {/* upvote */}
            <Button
                onClick={() => vote('UP')}
                size='sm'
                variant='ghost'
                className='hover:bg-background'
                aria-label='upvote'>
                <ArrowBigUp className='h-5 w-5 text-foreground' />
            </Button>

            {/* score */}
            <p className='text-center py-2 font-medium text-sm text-foreground'>
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote('DOWN')}
                size='sm'
                variant='ghost'
                aria-label='downvote'>
                <ArrowBigDown className='h-5 w-5 text-foreground' />
            </Button>
        </div>
    )
}

export default PostVoteClient