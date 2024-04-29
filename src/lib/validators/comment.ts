import { z } from 'zod'

export const CommentValidator = z.object({
    voxId: z.string(),
    text: z.string(),
    replyToId: z.string().optional()
})

export type CommentRequest = z.infer<typeof CommentValidator>