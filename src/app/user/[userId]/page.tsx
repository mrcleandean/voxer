import AnonViewProfile from "@/components/AnonViewProfile";
import AuthedViewProfile from "@/components/AuthedViewProfile";
import YourProfile from "@/components/YourProfile";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { ProfileUser } from "@/types/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const UserPage = async ({ params: { userId } }: { params: { userId: string } }) => {
    const session = await getAuthSession();
    const dbUser: ProfileUser | null = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            followers: true,
            following: true,
            voxes: {
                orderBy: {
                    updatedAt: 'desc'
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
                include: {
                    votes: true,
                    author: true,
                    comments: true
                }
            },
            comments: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
                include: {
                    votes: true,
                    author: true,
                    replies: true
                }
            },
            votes: {
                orderBy: {
                    updatedAt: 'desc'
                },
                take: INFINITE_SCROLL_PAGINATION_RESULTS,
                include: {
                    vox: {
                        include: {
                            votes: true,
                            author: true,
                            comments: true
                        }
                    },
                    comment: {
                        include: {
                            votes: true,
                            author: true,
                            replies: true
                        }
                    }
                }
            },
        }
    });

    let preferences = await db.preferences.findUnique({
        where: {
            userId
        }
    });

    if (!dbUser) {
        return notFound();
    }

    if (!preferences) {
        preferences = await db.preferences.create({
            data: {
                userId: userId
            }
        })
    }

    return (
        <div className="relative w-full h-fit flex justify-center">
            <div className="w-full flex flex-col max-w-5xl border-0 md:border border-border rounded-lg">
                {session && session.user.id === userId ? (
                    <YourProfile dbUser={dbUser} prefs={preferences} />
                ) : session && session.user.id !== userId ? (
                    <AuthedViewProfile viewer={session.user} viewee={dbUser} prefs={preferences} />
                ) : (
                    <AnonViewProfile viewee={dbUser} prefs={preferences} />
                )}
            </div>
        </div>
    )
}

export default UserPage;