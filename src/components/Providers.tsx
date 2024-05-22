'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { FC, ReactNode } from 'react'
import { type ThemeProviderProps } from "next-themes/dist/types"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TooltipProvider } from './ui/Tooltip'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
type ProvidersProps = {
    children: ReactNode
} & ThemeProviderProps

const queryClient = new QueryClient()

// TODO: Implement a provider to handle cooldowns on the client side with the server as a back up
// ^Will prevent unnecessary requests to the server (spam)
// ^Will also make the app more responsive

const Providers: FC<ProvidersProps> = ({ children, ...props }) => {
    return (
        <>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <NextThemesProvider {...props}>
                <TooltipProvider>
                    <QueryClientProvider client={queryClient}>
                        <SessionProvider>{children}</SessionProvider>
                    </QueryClientProvider>
                </TooltipProvider>
            </NextThemesProvider>
        </>
    )
}

export default Providers