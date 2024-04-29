import type { Preferences } from "@prisma/client";
import { Calendar, MapPin, ShieldHalf } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { cn, formatTimeToNow } from "@/lib/utils";
import { buttonVariants, } from "./ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";
import PostFeed from "./PostFeed";
import BackButton from "./BackButton";
import Link from "next/link";
import CommentFeed from "./CommentFeed";
import { ProfileUser } from "@/types/db";
import VoteFeed from "./VoteFeed";

export function toLowerExceptFirst(str: string) {
    if (!str) return str;  // Return the original string if it's empty
    return str.charAt(0) + str.slice(1).toLowerCase();
}

const YourProfile = ({ dbUser, prefs }: { dbUser: ProfileUser, prefs: Preferences }) => {
    const name = dbUser.name || 'No Name';
    const username = dbUser.username || 'No Username';
    const location = dbUser.location || 'No Location';
    return (
        <>
            <div className="w-full border-b border-border py-4 px-1 md:px-6 flex gap-2 items-center text-foreground text-2xl font-bold">
                <BackButton />
                <h1>{name}</h1>
            </div>
            <div className="pt-5 pb-2.5 px-7 flex justify-between">
                <div className="flex flex-col items-left justify-center gap-0.5">
                    <UserAvatar user={dbUser} className="h-28 w-28 border-[3px] border-foreground" />
                    <p className="ml-1 mt-2 text-foreground font-semibold text-lg">{name}</p>
                    <p className="ml-1 text-muted-foreground text-sm">@{username}</p>
                </div>
                <Link href={`/edit-user`} className={cn(buttonVariants({
                    variant: 'ghost'
                }), 'text-foreground'
                )}>
                    Edit Profile
                </Link>
            </div>
            <div className="px-8 pb-5 flex flex-col gap-1">
                <p className="text-foreground">{dbUser.biography}</p>
                <div className="-ml-1 flex gap-2 items-center text-md text-muted-foreground">
                    {
                        prefs.showLocation && (
                            <div className="flex gap-1 items-center">
                                <MapPin />
                                <p>{location}</p>
                            </div>
                        )
                    }
                    {
                        prefs.showPower && (
                            <div className="flex gap-1 items-center">
                                <ShieldHalf />
                                <p>{toLowerExceptFirst(dbUser.type)}</p>
                            </div>
                        )
                    }
                    <div className="flex gap-1 items-center">
                        <Calendar />
                        <p>Joined {formatTimeToNow(new Date(dbUser.createdAt))}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center text-md">
                    <Link href={`/user/${dbUser.id}/following`} className="flex gap-1 items-center">
                        <p className="text-foreground font-semibold">{dbUser.following.length}</p>
                        <p className="text-muted-foreground">Following</p>
                    </Link>
                    <Link href={`/user/${dbUser.id}/followers`} className="flex gap-1 items-center">
                        <p className="text-foreground font-semibold">{dbUser.followers.length}</p>
                        <p className="text-muted-foreground">Followers</p>
                    </Link>
                </div>
                <div className="mt-3">
                    <Tabs defaultValue="voxes">
                        <TabsList>
                            <TabsTrigger value="voxes">Voxes</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                            <TabsTrigger value="voted">Voted</TabsTrigger>
                        </TabsList>
                        <TabsContent value="voxes">
                            <PostFeed qKey={`own-user-feed-${dbUser.id}`} initialPosts={dbUser.voxes} userId={dbUser.id} />
                        </TabsContent>
                        <TabsContent value="comments">
                            <CommentFeed qKey={`own-user-feed-${dbUser.id}`} initialComments={dbUser.comments} userId={dbUser.id} />
                        </TabsContent>
                        <TabsContent value="voted">
                            <VoteFeed initialVotes={dbUser.votes} userId={dbUser.id} qKey={`own-user-feed-${dbUser.id}`} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}



export default YourProfile;