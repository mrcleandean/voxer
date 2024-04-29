import { User as DBUser } from "@prisma/client";

const AnonViewProfile = async ({ viewee }: { viewee: DBUser }) => {
    return (
        <>
            <h1>Anon view</h1>
            <p>{viewee.name || 'No Name'}</p>
        </>
    )
}

export default AnonViewProfile;