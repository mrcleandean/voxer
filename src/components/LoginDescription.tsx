import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { CircleUser, Hand } from "lucide-react";

const LoginDescription = () => {
    return (
        <div className='h-fit rounded-lg md:border border-border flex-1 w-full md:max-w-[30rem]'>
            <div className='border-b border-border px-6 py-3'>
                <p className='font-semibold text-foreground py-3 flex items-center gap-1.5'>
                    Welcome to Voxer!
                    <Hand className='h-5 w-5' />
                </p>
            </div>
            <dl className='px-6 py-4 text-sm'>
                <div className="w-full flex flex-col gap-3 px-0.5">
                    <p className="text-foreground">
                        This is a unique social experiment where the community holds the power.
                        Engage in discussions, share your views, and use your votes to directly moderate content,
                        steering the platform away from centralized control. Join Voxer and shape the conversation
                        in a truly democratic space.
                    </p>
                </div>
                <Link
                    className={
                        buttonVariants({
                            className: 'mt-4 mb-6 w-1/2 flex justify-center gap-1',
                        })
                    }
                    href={`/sign-up`}>
                    <CircleUser className="w-5 h-5" />
                    Create an Account
                </Link>
            </dl>
        </div>
    )
}

export default LoginDescription;