'use client'
import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { VoteTypes } from '@/config'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { CooldownResponseValidator } from '@/lib/validators/cooldown'

interface CommentVotesProps {
    commentId: string;
    votesAmt: number;
    isVoxxed: boolean;
    setIsVoxxed: Dispatch<SetStateAction<boolean>>;
}

const CommentVotes: FC<CommentVotesProps> = ({
    commentId,
    votesAmt: _votesAmt,
    isVoxxed,
    setIsVoxxed
}) => {
    const { loginToast } = useCustomToasts();
    const [votesAmt, setVotesAmt] = useState<number>(_votesAmt)

    const { mutate: vote } = useMutation({
        mutationFn: async (type: VoteTypes) => {
            if (isVoxxed) throw Error('Already Voxxed');
            const payload: CommentVoteRequest = {
                voteType: type,
                commentId,
            }
            await axios.patch('/api/vote/comment', payload)
        },
        onError: (err, voteType) => {
            if (isVoxxed || err instanceof AxiosError && err.response?.status === 409) {
                setIsVoxxed(true);
                return toast({
                    title: 'Already Voxxed.',
                    description: 'This post was previously deleted.',
                })
            }
            if (err instanceof AxiosError && err.response?.status === 410) {
                setIsVoxxed(true);
                return toast({
                    title: 'You have successfully voxxed this comment.',
                    description: "It's content has been removed."
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

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
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
        <div className='flex gap-1 items-center'>
            {/* upvote */}
            <Button
                onClick={() => vote('UP')}
                size='sm'
                variant='ghost'
                aria-label='upvote'
                disabled={isVoxxed}
            >
                <ArrowBigUp className='h-5 w-5 text-foreground' />
            </Button>

            {/* score */}
            <p className={`${isVoxxed ? 'text-primary' : 'text-foreground'} text-center py-2 px-1 font-medium text-sm`}>
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote('DOWN')}
                size='sm'
                variant='ghost'
                aria-label='downvote'
                disabled={isVoxxed}
            >
                <ArrowBigDown className='h-5 w-5 text-foreground' />
            </Button>
        </div>
    )
}

export default CommentVotes