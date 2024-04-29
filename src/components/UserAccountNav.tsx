"use client";

import { User } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropdownMenu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { UserAvatar } from "./UserAvatar";

type UserAccountNavProps = {
    user: Pick<User, 'name' | 'image' | 'email' | 'id'>
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={{ name: user.name || null, image: user.image || null }}
                    className='h-11 w-11'
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                        {user.name && <p className='font-medium'>{user.name}</p>}
                        {user.email && (
                            <p className='w-[200px] truncate text-sm text-muted-foreground'>
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/'>Feed</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={`/user/${user.id}`}>Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={`/edit-user`}>Preferences</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='cursor-pointer'
                    onSelect={(event) => {
                        event.preventDefault()
                        signOut({
                            callbackUrl: `${window.location.origin}/sign-in`,
                        })
                    }}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav