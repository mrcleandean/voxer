import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Voxer",
  description: 'You decide what can and cannot be said.'
}

export default function RootLayout({ children, authModal }: { children: React.ReactNode, authModal: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className='bg-background'>
      <body className={inter.className}>
        <Providers
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background min-h-screen h-fit flex justify-center">
            <Navbar />
            {authModal}
            <div className="w-full md:container max-w-7xl mx-auto h-full pt-20 md:pt-24">
              {children}
            </div>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
