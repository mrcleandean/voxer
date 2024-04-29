"use client";
import { MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { SetState, VoxDataType } from "./UserPanels";
import { Input } from "./ui/Input";
import { useState } from "react";
import { MAX_LOCATION_L } from "@/config";
import { toast } from "@/hooks/use-toast";

type LocationPopoverProps = {
    location: string,
    setVoxData: SetState<VoxDataType>
}

const LocationPopover = ({ location, setVoxData }: LocationPopoverProps) => {
    const [tempLocation, setTempLocation] = useState<string>('');
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={'ghost'} size={'sm'} className="border-border border">
                                <MapPin className="text-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add location</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </PopoverTrigger>
            <PopoverContent className="relative z-[2] bg-background border border-border rounded-lg p-3 m-3 max-w-72">
                <div className="flex flex-col gap-3">
                    <div>
                        <h4 className="text-foreground">Location</h4>
                        <p className="text-muted-foreground">Where are you voxing from?</p>
                    </div>
                    <Input value={tempLocation} onChange={(e) => setTempLocation(e.target.value)} className="text-foreground" />
                    <div className="flex items-center justify-between">
                        <Button className="w-fit h-fit text-xs px-2" onClick={() => {
                            if (tempLocation.trim().length > MAX_LOCATION_L) return toast({
                                title: 'Location is too long.',
                                description: `Ensure it does not exceed ${MAX_LOCATION_L} characters.`,
                                variant: 'destructive',
                            })
                            setVoxData(prev => ({
                                ...prev,
                                location: tempLocation.trim()
                            }));
                            setTempLocation('');
                        }}>
                            Set location
                        </Button>
                        <p className={`${tempLocation.trim().length <= MAX_LOCATION_L ? 'text-foreground' : 'text-primary'}`}>{tempLocation.trim().length}/{MAX_LOCATION_L}</p>
                    </div>
                    {location && (
                        <div className="flex gap-1 text-foreground">
                            <MapPin className="w-4 h-4" />
                            <p>{location}</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default LocationPopover;