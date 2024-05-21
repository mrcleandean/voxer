'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { PostVoteRequest } from '@/lib/validators/vote'
import { VoteTypes } from '@/config';
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from '../hooks/use-toast'
import { Button } from './ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { CooldownResponseValidator } from '@/lib/validators/cooldown';

interface PostVoteClientProps {
    voxId: string
    initialVotesAmt: number
    setIsVoxxed: Dispatch<SetStateAction<boolean>>
    isVoxxed: boolean;
}

const PostVoteClient = ({
    voxId,
    initialVotesAmt,
    setIsVoxxed,
    isVoxxed
}: PostVoteClientProps) => {
    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)

    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteTypes) => {
            if (isVoxxed) throw Error('Already Voxxed');
            const payload: PostVoteRequest = {
                voteType: type,
                voxId: voxId,
            }
            await axios.patch(`/api/vote/vox`, payload)
        },
        onError: (err, voteType) => {
            if (err instanceof AxiosError && err.response?.status === 410) {
                setIsVoxxed(true);
                return toast({
                    title: 'You have successfully voxxed this post.',
                    description: 'Content and images have been removed.'
                });
            }
            if (isVoxxed || err instanceof AxiosError && err.response?.status === 409) {
                setIsVoxxed(true);
                return toast({
                    title: 'Already Voxxed.',
                    description: 'This post was previously deleted.',
                })
            }
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
            if (isVoxxed) return;
            setVotesAmt(prev => type === 'UP' ? prev + 1 : prev - 1);
        },
    })

    return (
        <div className={`${isVoxxed ? 'bg-primary brightness-[1.175]' : 'bg-secondary'} flex flex-col py-2`}>
            {/* upvote */}
            <Button
                onClick={() => vote('UP')}
                size='sm'
                variant='ghost'
                disabled={isVoxxed}
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
                disabled={isVoxxed}
                aria-label='downvote'>
                <ArrowBigDown className='h-5 w-5 text-foreground' />
            </Button>
        </div>
    )
}

export default PostVoteClient