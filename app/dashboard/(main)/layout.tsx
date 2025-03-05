import type { Metadata } from 'next'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
    title: 'ApolloTrack',
    description: 'Train like a legend, eat like a champion! ApolloTrack makes fitness and nutrition effortless.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
