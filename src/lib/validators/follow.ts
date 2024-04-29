import { z } from "zod";

export const FollowValidator = z.object({
    viewerId: z.string(),
    vieweeId: z.string()
});

export type FollowRequest = z.infer<typeof FollowValidator>