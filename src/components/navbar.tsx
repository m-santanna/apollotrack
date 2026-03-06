import { Link } from '@tanstack/react-router'
import ThemeButton from './theme-button'
import { Zap } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Zap className="h-4 w-4 text-primary-foreground" />
                    </div>
                    ApolloTrack
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeButton />
                </div>
            </div>
        </nav>
    )
}
