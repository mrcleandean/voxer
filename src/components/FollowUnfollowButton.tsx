"use client";

import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FollowRequest } from "@/lib/validators/follow";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

type FollowUnfollowUserButtonProps = {
    initialFollowing: boolean,
    viewerId: string,
    vieweeId: string,
    className?: string
}

const FollowUnfollowButton: FC<FollowUnfollowUserButtonProps> = ({ viewerId, vieweeId, initialFollowing, className = '' }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const router = useRouter();
    const { loginToast } = useCustomToasts();
    const { mutate: followUnfollow } = useMutation({
        mutationFn: async () => {
            const payload: FollowRequest = {
                viewerId,
                vieweeId
            };
            await axios.patch('/api/follow', payload);
        },
        onError: (err) => {
            const triedToFollow = isFollowing;
            setIsFollowing(prev => !prev);
            if (err instanceof AxiosError && err.response?.status === 401) {
                // Just for safety since the follow unfollow button only displays for logged in users
                // (Renders conditionally on the server)
                return loginToast();
            }
            return toast({
                title: 'Something went wrong.',
                description: `User was not ${triedToFollow ? 'followed' : 'unfollowed'} successfully. Please try again.`,
                variant: 'destructive',
            });
        },
        onMutate: () => {
            setIsFollowing(prev => !prev);
        },
        onSuccess: () => {
            router.refresh();
            return toast({
                title: 'Success',
                description: `User was ${isFollowing ? 'followed' : 'unfollowed'} successfully.`,
                variant: 'default',
            })
        }
    });
    return (
        <Button className={className} variant={'default'} onClick={() => followUnfollow()}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    )
}

export default FollowUnfollowButton;