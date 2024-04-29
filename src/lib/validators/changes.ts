import { MAX_BIO_L, MAX_LOCATION_L, NAME_BOUNDS, USERNAME_BOUNDS } from "@/config";
import { z } from "zod";

export const ChangesValidator = z.object({
    newInfo: z.object({
        username: z.string().min(USERNAME_BOUNDS[0]).max(USERNAME_BOUNDS[1]).regex(/^[a-zA-Z0-9]*$/, "Username must be alphanumeric and contain no spaces"),
        name: z.string().min(NAME_BOUNDS[0]).max(NAME_BOUNDS[1]),
        biography: z.string().max(MAX_BIO_L),
        location: z.string().max(MAX_LOCATION_L),
        website: z.string().url().or(z.string().length(0))
    }),
    newPreferences: z.object({
        darkMode: z.boolean(),
        showLocation: z.boolean(),
        showPower: z.boolean(),
        showVoxes: z.boolean(),
        showComments: z.boolean(),
        showVoted: z.boolean(),
        showEmail: z.boolean(),
        privateProfile: z.boolean()
    })
});

export type ChangesRequest = z.infer<typeof ChangesValidator>;
export type NewInfo = z.infer<typeof ChangesValidator.shape.newInfo>;
export type NewPreferences = z.infer<typeof ChangesValidator.shape.newPreferences>;