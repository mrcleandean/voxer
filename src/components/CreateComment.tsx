'use client'

import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'

interface CreateCommentProps {
    voxId: string
    replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ voxId, replyToId }) => {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const { loginToast } = useCustomToasts()

    const { mutate: comment, isPending } = useMutation({
        mutationFn: async ({ voxId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = { voxId, text, replyToId }
            const { data } = await axios.patch(`/api/create/comment`, payload)
            return data
        },

        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong.',
                description: "Comment wasn't created successfully. Please try again.",
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            router.refresh()
            setInput('')
        },
    })

    return (
        <div className='mt-4'>
            <Textarea
                id='comment'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder='Share your thoughts'
                className='text-foreground resize-none h-28'
            />

            <div className='mt-2 flex justify-end'>
                <Button
                    isLoading={isPending}
                    disabled={input.length === 0}
                    onClick={() => comment({ voxId, text: input, replyToId })}>
                    Comment
                </Button>
            </div>
        </div>
    )
}

export default CreateComment