import { MAX_IMAGES_AMT, MAX_LOCATION_L, MAX_TAG_AMT, TAG_BOUNDS } from '@/config'
import { z } from 'zod'

export const VoxValidator = z.object({
    content: z.string().max(450),
    location: z.string().max(MAX_LOCATION_L),
    tags: z.array(z.string().min(TAG_BOUNDS[0]).max(TAG_BOUNDS[1])).max(MAX_TAG_AMT).refine((data) => {
        const uniqueSet = new Set(data);
        return uniqueSet.size === data.length;
    }, {
        message: 'Tags must be unique'
    }),
    imageUrls: z.array(z.string()).max(MAX_IMAGES_AMT),
})

export const VoxPreImageUploadValidator = z.object({
    content: z.string().max(450),
    location: z.string().max(MAX_LOCATION_L),
    tags: z.array(z.string().min(TAG_BOUNDS[0]).max(TAG_BOUNDS[1])).max(MAX_TAG_AMT).refine((data) => {
        const uniqueSet = new Set(data);
        return uniqueSet.size === data.length;
    }, {
        message: 'Tags must be unique'
    }),
    files: z.array(z.instanceof(File)).max(MAX_IMAGES_AMT),
})

export type VoxCreationRequest = z.infer<typeof VoxValidator>