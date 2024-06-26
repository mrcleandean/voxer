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
import { useRouter } from 'next/navigation';

interface PostVoteClientProps {
    voxId: string
    initialVotesAmt: number
    setIsVoxxed: Dispatch<SetStateAction<boolean>> | 'server-rendered'
    isVoxxed: boolean;
}

const PostVoteClient = ({
    voxId,
    initialVotesAmt,
    setIsVoxxed,
    isVoxxed
}: PostVoteClientProps) => {
    const router = useRouter();
    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)

    const makeVoxxedVisible = () => {
        if (setIsVoxxed === 'server-rendered') {
            // Toast notification still works properly here, no refactoring needed for now
            router.refresh();
        } else {
            setIsVoxxed(true);
        };
    }

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
            if (isVoxxed || err instanceof AxiosError && err.response?.status === 409) {
                makeVoxxedVisible();
                return toast({
                    title: 'Already Voxxed.',
                    description: 'This post was previously deleted.',
                })
            }
            if (err instanceof AxiosError && err.response?.status === 410) {
                makeVoxxedVisible();
                return toast({
                    title: 'You have successfully voxxed this post.',
                    description: "It's content and images have been removed."
                });
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
        <div className="bg-secondary flex flex-col py-2">
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
            <p className={`${isVoxxed ? 'text-primary' : 'text-foreground'} text-center py-2 font-medium text-sm`}>
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