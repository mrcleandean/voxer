import { Preferences } from "@prisma/client";
import BackButton from "./BackButton";
import { UserAvatar } from "./UserAvatar";
import { formatTimeToNow, toLowerExceptFirst } from "@/lib/utils";
import Link from "next/link";
import { Calendar, MapPin, ShieldHalf } from "lucide-react";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import PostFeed from "./PostFeed";
import CommentFeed from "./CommentFeed";
import VoteFeed from "./VoteFeed";
import { ProfileUser } from "@/types/db";

const AnonViewProfile = async ({ viewee, prefs }: { viewee: ProfileUser, prefs: Preferences }) => {
    const name = viewee.name || 'No Name';
    const username = viewee.username || 'No Username';
    const location = viewee.location || 'No Location';
    return (
        <>
            <div className="w-full border-b border-border py-4 px-1 md:px-6 flex gap-2 items-center text-foreground text-2xl font-bold">
                <BackButton />
                <h1>{name}</h1>
            </div>
            <div className="pt-5 pb-2.5 px-7 flex justify-between">
                <div className="flex flex-col items-left justify-center gap-0.5">
                    <UserAvatar user={viewee} className="h-28 w-28 border-[3px] border-foreground" />
                    <p className="ml-1 mt-2 text-foreground font-semibold text-lg">{name}</p>
                    <p className="ml-1 text-muted-foreground text-sm">@{username}</p>
                </div>
            </div>
            <div className="px-8 pb-5 flex flex-col gap-1">
                <p className="text-foreground">{viewee.biography}</p>
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
                                <p>{toLowerExceptFirst(viewee.type)}</p>
                            </div>
                        )
                    }
                    <div className="flex gap-1 items-center">
                        <Calendar />
                        <p>Joined {formatTimeToNow(new Date(viewee.createdAt))}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center text-md">
                    <Link href={`/user/${viewee.id}/following`} className="flex gap-1 items-center">
                        <p className="text-foreground font-semibold">{viewee.following.length}</p>
                        <p className="text-muted-foreground">Following</p>
                    </Link>
                    <Link href={`/user/${viewee.id}/followers`} className="flex gap-1 items-center">
                        <p className="text-foreground font-semibold">{viewee.followers.length}</p>
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
                            <PostFeed qKey={`own-user-feed-${viewee.id}`} initialPosts={viewee.voxes} userId={viewee.id} />
                        </TabsContent>
                        <TabsContent value="comments">
                            <CommentFeed qKey={`own-user-feed-${viewee.id}`} initialComments={viewee.comments} userId={viewee.id} />
                        </TabsContent>
                        <TabsContent value="voted">
                            <VoteFeed initialVotes={viewee.votes} userId={viewee.id} qKey={`own-user-feed-${viewee.id}`} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default AnonViewProfile;