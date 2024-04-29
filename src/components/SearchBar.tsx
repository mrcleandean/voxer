'use client'

import { Prisma, User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { Users, Users2 } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import Link from 'next/link'
import { UserAvatar } from './UserAvatar'

interface SearchBarProps { }

const SearchBar: FC<SearchBarProps> = ({ }) => {
    const [input, setInput] = useState<string>('')
    const pathname = usePathname()
    const commandRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(commandRef, () => {
        setInput('')
    })

    const request = useDebouncedCallback(async () => {
        refetch()
    }, 300)

    const {
        isFetching,
        data: queryResults,
        refetch,
        isFetched,
    } = useQuery({
        queryFn: async () => {
            if (!input) return []
            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (User & {
                name: string
                username: string
                _count: Prisma.UserCountOutputType
            })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    useEffect(() => {
        setInput('')
    }, [pathname])

    useEffect(() => {
        request();
    }, [input])

    return (
        <Command
            ref={commandRef}
            className='relative rounded-lg border max-w-lg z-50 overflow-visible'
        >
            <CommandInput
                isLoading={isFetching}
                onValueChange={setInput}
                value={input}
                className='outline-none border-none focus:border-none focus:outline-none ring-0'
                placeholder='Find users...'
            />

            {input.length > 0 ? (
                <CommandList className='absolute bg-background top-full inset-x-0 rounded-b-md'>
                    {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Users'>
                            {queryResults?.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.name + user.username}
                                >
                                    <Link href={`/user/${user.id}`} className='flex gap-2 items-center'>
                                        <UserAvatar user={user} className='h-6 w-6' />
                                        <p className='font-semibold text-foreground'>@{user.username}</p>
                                        <p className='text-foreground text-xs'>{user.name}</p>
                                    </Link>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : (<CommandList className='hidden' />)}
        </Command>
    )
}

export default SearchBar