"use client";
import { Hash } from "lucide-react";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import type { SetState, VoxDataType } from "./UserPanels";
import { Input } from "./ui/Input";
import { MAX_TAG_AMT, TAG_BOUNDS } from "@/config";
import { toast } from "@/hooks/use-toast";

type TagPopoverProps = {
    tag: string,
    tags: string[],
    setVoxData: SetState<VoxDataType>
}

const TagPopover = ({ tag, tags, setVoxData }: TagPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={'ghost'} size={'sm'} className="border-border border">
                                <Hash className="text-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add tags</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </PopoverTrigger>
            <PopoverContent className="bg-background border border-border rounded-lg p-3 m-3 max-w-72 relative z-[2]">
                <div className="flex flex-col gap-3">
                    <div>
                        <h4 className="text-foreground">Tags</h4>
                        <p className="text-muted-foreground">Add relevant identifiers</p>
                    </div>
                    <Input value={tag} onChange={(e) => setVoxData(prev => ({ ...prev, tag: e.target.value }))} className="text-foreground" />
                    <div className="flex items-center justify-between">
                        <Button disabled={tags.length >= MAX_TAG_AMT} className="w-fit h-fit text-xs px-2" onClick={() => {
                            if (tag.trim().length > TAG_BOUNDS[1] || tag.trim().length < 1) return toast({
                                title: 'Invalid tag.',
                                description: `Ensure it ${TAG_BOUNDS[0]}-${TAG_BOUNDS[1]} characters.`,
                                variant: 'destructive',
                            });
                            setVoxData(prev => ({
                                ...prev,
                                tags: Array.from(new Set([...prev.tags, prev.tag.toLowerCase().trim()])),
                                tag: ''
                            }));
                        }}>
                            Add tag
                        </Button>
                        <p className={`${tag.trim().length <= TAG_BOUNDS[1] ? 'text-foreground' : 'text-primary'}`}>{tag.trim().length}/{TAG_BOUNDS[1]}</p>
                    </div>
                    <p className={`${MAX_TAG_AMT - tags.length <= 0 ? 'text-primary' : 'text-foreground'}`}>Tags Remaining: {MAX_TAG_AMT - tags.length}</p>
                    <div className="flex gap-1 flex-wrap">
                        {tags.map((tag, i) => {
                            return (
                                <p key={`tag-${tag}-${i}`} className="text-foreground">#{tag}</p>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default TagPopover;