"use client";
import { Preferences, User } from '@prisma/client';
import { FC, useState } from 'react'
import { UserAvatar } from './UserAvatar';
import BackButton from './BackButton';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import DarkModeToggle from './DarkModeToggle';
import { useMutation } from '@tanstack/react-query';
import { ChangesRequest, ChangesValidator, NewInfo, NewPreferences } from '@/lib/validators/changes';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MAX_BIO_L, MAX_LOCATION_L, NAME_BOUNDS, USERNAME_BOUNDS } from '@/config';
import { Textarea } from './ui/Textarea';
import { Switch } from './ui/Switch';
import { Camera, X } from 'lucide-react';

interface EditUserClientProps {
    dbUser: User,
    preferences: Preferences

}

const UpdateProfileParser = ({ item, input, successString, failureString }: {
    item: keyof NewInfo,
    input: string,
    successString: string,
    failureString: string
}) => {
    const safeParseChangesValidator = (item: keyof NewInfo, input: string) => {
        return ChangesValidator.shape.newInfo.shape[item].safeParse(input).success
    }
    return (
        <>
            {safeParseChangesValidator(item, input) ? (
                <p className='text-xs text-lime-400'>{successString}</p>
            ) : (
                <p className='text-xs text-primary'>{failureString}</p>
            )}
        </>
    )
}

const EditUserClient: FC<EditUserClientProps> = ({ dbUser, preferences }) => {
    const router = useRouter();
    const [newInfo, setNewInfo] = useState<NewInfo>({
        username: dbUser.username || 'Anon',
        name: dbUser.name || 'Anon',
        biography: dbUser.biography || '',
        location: dbUser.location || 'No Location',
        website: dbUser.website || ''
    });
    const [newPreferences, setNewPreferences] = useState<NewPreferences>({
        darkMode: preferences.darkMode ?? true,
        showLocation: preferences.showLocation ?? true,
        showPower: preferences.showPower ?? true,
        showVoxes: preferences.showVoxes ?? true,
        showComments: preferences.showComments ?? true,
        showVoted: preferences.showVoted ?? true,
        showEmail: preferences.showEmail ?? false,
        privateProfile: preferences.privateProfile ?? false
    });

    const infoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewInfo({
            ...newInfo,
            [e.target.id]: e.target.value
        });
    }

    const { mutate: saveChanges, isPending } = useMutation({
        mutationFn: async ({ newInfo, newPreferences }: ChangesRequest) => {
            const payload = { newInfo, newPreferences };
            const { data } = await axios.patch('/api/edit/user', payload);
            return data;
        },
        onError: () => {
            return toast({
                title: 'Something went wrong.',
                description: "Changes weren't saved successfully. Please try again.",
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            router.push(`/user/${dbUser.id}`);
            router.refresh();
            return toast({
                title: 'Success',
                description: 'Changes saved successfully.',
                variant: 'default'
            })
        }
    });

    return (
        <div className="w-full h-fit flex justify-center mb-6">
            <div className="w-full flex flex-col max-w-5xl border-0 md:border border-border rounded-lg">
                <div className="w-full border-b border-border py-4 px-1 md:px-6 flex gap-2 items-center text-foreground text-2xl font-bold">
                    <BackButton />
                    <h1>Edit Profile</h1>
                </div>
                <div className='relative h-48 w-full overflow-hidden'>
                    <img
                        alt="Profile banner"
                        src="https://pbs.twimg.com/profile_banners/1567309199063007232/1662513160/1500x500"
                        className="w-full h-full object-cover"
                    />
                    <div className='absolute inset-0 flex justify-center items-center gap-4'>
                        <button className='bg-secondary opacity-70 hover:opacity-50 rounded-full p-2.5 flex items-center justify-center text-foreground transition-all'>
                            <Camera className='w-6 h-6' />
                        </button>
                        <button className='bg-secondary opacity-70 hover:opacity-50 rounded-full p-2.5 flex items-center justify-center text-foreground transition-all'>
                            <X className='w-6 h-6' />
                        </button>
                    </div>
                </div>
                <div className='px-6 -translate-y-[4.5rem]'>
                    <UserAvatar user={dbUser} className="h-36 w-36 border-[3px] border-foreground mb-4" Pressable={{
                        symbol: Camera,
                        callback: () => console.log('Change Profile Picture')
                    }} />
                    <div className='flex flex-col gap-2 text-foreground'>
                        <Label htmlFor='username'>Username</Label>
                        <Input className='max-w-lg' type="text" id="username" value={newInfo.username} onChange={infoChange} />
                        <UpdateProfileParser
                            item='username'
                            input={newInfo.username}
                            successString='Valid username.'
                            failureString={`Username must be ${USERNAME_BOUNDS[0]}-${USERNAME_BOUNDS[1]} characters, alphanumeric only.`}
                        />

                        <Label htmlFor='name'>Name</Label>
                        <Input className='max-w-lg' type="text" id="name" value={newInfo.name} onChange={infoChange} />
                        <UpdateProfileParser
                            item='name'
                            input={newInfo.name}
                            successString='Valid name.'
                            failureString={`Name must be ${NAME_BOUNDS[0]}-${NAME_BOUNDS[1]} characters.`}
                        />

                        <Label htmlFor='biography'>Bio</Label>
                        <Textarea className='max-w-lg resize-none' id="biography" value={newInfo.biography} onChange={infoChange} />
                        <UpdateProfileParser
                            item='biography'
                            input={newInfo.biography}
                            successString='Valid bio.'
                            failureString={`Bio cannot exceed ${MAX_BIO_L} characters.`}
                        />

                        <Label htmlFor='location'>Location</Label>
                        <Input className='max-w-lg' type="text" id="location" value={newInfo.location} onChange={infoChange} />
                        <UpdateProfileParser
                            item='location'
                            input={newInfo.location}
                            successString='Valid location.'
                            failureString={`Location cannot exceed ${MAX_LOCATION_L} characters.`}
                        />

                        <Label htmlFor='website'>Website</Label>
                        <Input className='max-w-lg' type="text" id="website" value={newInfo.website} onChange={infoChange} />
                        <UpdateProfileParser
                            item='website'
                            input={newInfo.website}
                            successString='Valid URL.'
                            failureString="Invalid URL. Ex. https://example.com"
                        />
                    </div>
                    <div className='text-foreground mt-5 flex flex-col gap-1'>
                        <h1 className='text-md font-semibold'>Preferences</h1>
                        <div className='flex gap-3 items-center flex-wrap'>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Location</p>
                                <Switch checked={newPreferences.showLocation} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showLocation: !prev.showLocation
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Power</p>
                                <Switch checked={newPreferences.showPower} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showPower: !prev.showPower
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Voxes</p>
                                <Switch checked={newPreferences.showVoxes} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showVoxes: !prev.showVoxes
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Comments</p>
                                <Switch checked={newPreferences.showComments} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showComments: !prev.showComments
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Voted</p>
                                <Switch checked={newPreferences.showVoted} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showVoted: !prev.showVoted
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Show Email</p>
                                <Switch checked={newPreferences.showEmail} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        showEmail: !prev.showEmail
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-2.5 items-center'>
                                <p className='text-sm'>Private Profile</p>
                                <Switch checked={newPreferences.privateProfile} onCheckedChange={() => {
                                    setNewPreferences(prev => ({
                                        ...prev,
                                        privateProfile: !prev.privateProfile
                                    }))
                                }} />
                            </div>
                            <div className='flex gap-1 items-center'>
                                <p className='text-sm'>Dark Mode</p>
                                <DarkModeToggle className='' />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex gap-2'>
                        <Button disabled={isPending} variant='secondary' onClick={() => saveChanges({ newInfo, newPreferences })}>
                            Save
                        </Button>
                        <Button onClick={() => router.push(`/user/${dbUser.id}`)}>
                            Discard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EditUserClient;