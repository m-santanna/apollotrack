import type { Metadata } from 'next'
import { Exo_2, Cinzel } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const exo2 = Exo_2({
    variable: '--font-exo2',
    subsets: ['latin'],
})

const cinzel = Cinzel({
    variable: '--font-cinzel',
    subsets: ['latin'],
})

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
        <html lang="en">
            <body className={cn(exo2.variable, cinzel.variable, 'antialiased')}>
                <div className="min-h-screen bg-gradient-to-tl from-background to-secondary-foreground/20">
                    {children}
                </div>
            </body>
        </html>
    )
}
