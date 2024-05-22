import Link from "next/link"
import Icons from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"
import SearchBar from "./SearchBar"
import DarkModeToggle from "./DarkModeToggle"

const Navbar = async () => {
    const session = await getAuthSession();
    return (
        <div className="fixed top-0 inset-x-0 h-18 bg-background border-b border-border z-[10] py-3">
            <div className='max-w-7xl h-full mx-auto flex items-center justify-between px-7 md:px-12 gap-3'>
                <Link href='/' className='flex items-center'>
                    <Icons.logo className='h-8 w-8 sm:h-9 sm:w-9 translate-y-0.5' />
                    <p className='hidden text-foreground text-2xl font-extrabold md:block'>Voxer</p>
                </Link>
                <SearchBar />
                <div className="flex justify-center items-center gap-4">
                    <DarkModeToggle className="hidden md:block" />
                    {
                        session?.user ? (
                            <UserAccountNav user={session.user} />
                        ) : (
                            <Link href='/sign-in' className={buttonVariants({ size: 'sm' })}>
                                Sign In
                            </Link>
                        )
                    }
                </div>
            </div>
        </div >
    )
}

export default Navbar