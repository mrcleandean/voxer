import { z } from 'zod'

export const CooldownResponseValidator = z.object({
    timeLeft: z.number(),
    type: z.union([z.literal('vox'), z.literal('comment'), z.literal('vote')])
})

export type CooldownResponse = z.infer<typeof CooldownResponseValidator>