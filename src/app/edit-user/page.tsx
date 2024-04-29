import EditUserClient from "@/components/EditUserClient";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Preferences, User } from "@prisma/client";

export type EditUserPageDBUser = (User & { preferences: Preferences | null }) | null

const EditUserPage = async () => {
    const session = await getAuthSession();

    if (!session || !session.user) {
        return (
            <div>
                No session found, please sign in.
            </div>
        );
    }

    const dbUser = await db.user.findUnique({
        where: {
            id: session.user.id
        }
    });

    let preferences = await db.preferences.findUnique({
        where: {
            userId: session.user.id
        }
    });

    if (!dbUser) {
        return (
            <div>
                No user found.
            </div>
        )
    }

    if (!preferences) {
        preferences = await db.preferences.create({
            data: {
                userId: session.user.id
            }
        })
    }

    return <EditUserClient dbUser={dbUser} preferences={preferences} />
}

export default EditUserPage;