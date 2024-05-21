"use client";
import { Image, MapPin, MessageCircleQuestion, NotebookPen, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { FC, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { VoxCreationRequest, VoxPreImageUploadValidator } from "@/lib/validators/post";
import axios, { AxiosError } from "axios";
import { uploadFiles } from "@/lib/uploadthing";
import gradientTextClasses from "./templates/gradientTextClasses";
import TagPopover from "./TagPopover";
import LocationPopover from "./LocationPopover";
import { MAX_IMAGES_AMT } from "@/config";
import { CooldownResponseValidator } from "@/lib/validators/cooldown";
import { ScrollArea } from "./ui/ScrollArea";
import VoteFeed from "./VoteFeed";
import { FeedVote } from "@/types/db";
import Link from "next/link";

// TODO: Fix post creation backend to handle images, tags, and locations

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type VoxDataType = {
    content: string,
    tag: string,
    tags: string[],
    location: string,
    images: {
        file: File,
        preview: string
    }[],
}

type UserPanelsProps = {
    userId: string,
    initialVotes: FeedVote[]
}

const UserPanels: FC<UserPanelsProps> = ({ userId, initialVotes }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const postPanelContainerRef = useRef<HTMLDivElement>(null);
    const [recentlyVotedVoxesHeight, setRecentlyVotedVoxesHeight] = useState('23.2rem');
    const initialData: VoxDataType = {
        content: '',
        tag: '',
        tags: [],
        location: '',
        images: [],
    }
    const [voxData, setVoxData] = useState<VoxDataType>({ ...initialData })
    useEffect(() => {
        if (postPanelContainerRef.current) {
            const { height } = postPanelContainerRef.current.getBoundingClientRect();
            setRecentlyVotedVoxesHeight(height + 'px');
        }
    }, [voxData.images, voxData.location, voxData.tags]);
    const { mutate: createVox, isPending } = useMutation({
        mutationFn: async ({ content, location, tags, images }: Pick<VoxDataType, 'content' | 'location' | 'tags' | 'images'>) => {
            const files = images.map(({ file }) => file);

            VoxPreImageUploadValidator.parse({ content, location, tags, files });

            // Preliminary check to see if the user is in cooldown 
            // Prevents unnecessary image uploads
            await axios.get('/api/pre-check/vox');

            const uploadedImages = await uploadFiles('imageUploader', { files });
            const imageUrls: string[] = uploadedImages.map((image) => image.url);

            // Uploads the post and assigns a cooldown
            const creationPayload: VoxCreationRequest = { content, location, tags, imageUrls }
            const { data } = await axios.post('/api/create/vox', creationPayload);

            return data
        },
        onError: (error) => {
            if (error instanceof AxiosError && error.response?.status === 429 && CooldownResponseValidator.safeParse(error.response.data)) {
                return toast({
                    title: 'Vox cooldown active.',
                    description: `You can post again in ${error.response.data.timeLeft} seconds.`,
                    variant: 'destructive',
                })
            }
            return toast({
                title: 'Something went wrong.',
                description: 'Your post was not published. Please try again.',
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            setVoxData({ ...initialData });
            return toast({
                description: 'Successfully Voxxed!',
            })
        },
    })
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        fileInputRef.current?.click();
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const imagesArray = Array.from(event.target.files)
                .slice(0, MAX_IMAGES_AMT)
                .map(file => ({
                    file,
                    preview: URL.createObjectURL(file)
                }));
            setVoxData(prev => ({ ...prev, images: imagesArray }));
            if (event.target.files.length > MAX_IMAGES_AMT) {
                return toast({
                    title: 'Too many images.',
                    description: `You can only upload ${MAX_IMAGES_AMT} on a single post. ${event.target.files.length - MAX_IMAGES_AMT} images were not uploaded.`,
                    variant: 'destructive',
                });
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (
        <>
            <div ref={postPanelContainerRef} className='h-fit rounded-lg md:border border-border flex-1 w-full md:max-w-[45rem]'>
                <div className='border-b border-border px-6 md:py-3 pb-2'>
                    <p className='font-semibold text-foreground py-3 flex items-center gap-1.5'>
                        What&apos;s on your mind?
                        <MessageCircleQuestion className="w-5 h-5" />
                    </p>
                </div>
                <dl className='px-6 py-4 text-sm flex flex-col gap-2'>
                    <div className="w-full flex flex-col gap-3 px-0.5">
                        <Textarea value={voxData.content} onChange={(e) => setVoxData(prev => ({ ...prev, content: e.target.value }))} className="h-40 resize-none text-foreground" placeholder="Write something..." />
                        {voxData.images.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {voxData.images.map(({ preview }, i) => (
                                    <div key={`${i}-user-image-${preview}`} className="relative overflow-hidden h-16 w-16 border border-border rounded-lg">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="object-cover min-w-full min-h-full"
                                        />
                                        <div className="inset-0 absolute flex items-center justify-center group">
                                            <div className="absolute inset-0 bg-transparent group-hover:bg-secondary opacity-0 group-hover:opacity-40" />
                                            <div className="bg-background opacity-0 group-hover:opacity-85 rounded-full p-2 cursor-pointer" onClick={() => {
                                                setVoxData(prev => ({
                                                    ...prev,
                                                    images: prev.images.filter(image => {
                                                        if (image.preview === preview) {
                                                            URL.revokeObjectURL(image.preview);
                                                            return false;
                                                        }
                                                        return true;
                                                    }),
                                                }));
                                            }}>
                                                <X className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="w-full flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={'ghost'} size={'sm'} className="border-border border" onClick={triggerFileInput}>
                                        <Image className="text-foreground" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="flex flex-col justify-center items-center">
                                    <p>Upload media</p>
                                    <p className="text-muted-foreground text-xs">.jpeg .png</p>
                                </TooltipContent>
                            </Tooltip>
                            <input
                                type="file"
                                ref={fileInputRef}
                                multiple
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <TagPopover tag={voxData.tag} tags={voxData.tags} setVoxData={setVoxData} />
                            <LocationPopover location={voxData.location} setVoxData={setVoxData} />
                        </div>
                    </div>
                    <Button isLoading={isPending} onClick={() => createVox(voxData)} className="w-1/2 flex justify-center gap-1">
                        <NotebookPen className="w-5 h-5" />
                        Post
                    </Button>
                    {voxData.location && (
                        <div className="flex gap-1">
                            <MapPin className="w-5 h-5" />
                            <p>{voxData.location}</p>
                        </div>
                    )}
                    <div className="flex gap-1 flex-wrap">
                        {voxData.tags.map((tag, i) => {
                            const color = gradientTextClasses[i % gradientTextClasses.length];
                            return (
                                <div className="z-[1] bg-secondary transition-all px-2 py-1.5 rounded-lg flex items-center gap-0.5" key={`tag-${tag}-${i}`}>
                                    <p className={`${color}`}>#{tag}</p>
                                    <div className="p-1 rounded-lg bg-secondary hover:bg-background text-foreground flex items-center justify-center cursor-pointer" onClick={() => {
                                        setVoxData(prev => ({
                                            ...prev,
                                            tags: prev.tags.filter(curr => curr !== tag)
                                        }));
                                    }}>
                                        <X className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </dl>
            </div>
            <div className='flex flex-col rounded-lg md:border border-b border-border flex-1 w-full md:max-w-[45rem]' style={{ height: recentlyVotedVoxesHeight }}>
                <div className='border-b border-border px-6 pb-2 md:py-3'>
                    <p className='font-semibold text-foreground py-3 flex items-center gap-1'>
                        Recently voted Voxes
                        <ThumbsUp className="w-5 h-5" />
                        <ThumbsDown className="w-5 h-5" />
                    </p>
                </div>
                <ScrollArea className="md:rounded-b-lg px-6 py-3 flex-1 max-h-64 md:max-h-full overflow-auto">
                    <VoteFeed initialVotes={initialVotes} userId={userId} qKey={`main-feed-${userId}`} />
                </ScrollArea>
            </div>
        </>
    )
}

export default UserPanels;