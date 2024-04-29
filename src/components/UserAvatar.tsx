import { User } from '@prisma/client'
import { AvatarProps } from '@radix-ui/react-avatar'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import Image from 'next/image'
import Icons from './Icons'
import { LucideIcon } from 'lucide-react'

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'image' | 'name'>,
    Pressable?: {
        symbol: LucideIcon,
        callback: () => void
    }
}

export function UserAvatar({ user, Pressable, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <div className='relative aspect-square h-full w-full'>
                    {
                        Pressable && (
                            <div className='absolute inset-0 rounded-full z-[1] flex items-center justify-center'>
                                <button onClick={Pressable.callback} className='bg-secondary opacity-70 hover:opacity-50 rounded-full p-2.5 flex items-center justify-center text-foreground transition-all'>
                                    <Pressable.symbol />
                                </button>
                            </div>
                        )
                    }
                    <Image
                        fill
                        src={user.image}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                        sizes='24px 44px 112px 144px'
                    />
                    {/* TODO: Add dynamic sizes using tailwind converter functions */}
                </div>
            ) : (
                <AvatarFallback>
                    <span className='sr-only'>{user?.name}</span>
                    <Icons.user className='h-4 w-4' />
                </AvatarFallback>
            )}
        </Avatar>
    )
}