import { Link } from '@tanstack/react-router'
import ThemeButton from './theme-button'

export default function Navbar() {
    return (
        <nav className="sticky bg-primary-foreground z-10 h-16 w-3/4 translate-x-1/6 md:w-1/2 md:translate-x-1/2 flex items-center justify-between p-8 rounded-full mt-4 animate-in slide-in-from-top duration-300">
            <Link
                to="/"
                className="text-xl md:text-2xl font-bold text-primary hover:text-primary/70"
            >
                ApolloTrack
            </Link>
            <div className="flex items-center gap-2">
                <ThemeButton />
            </div>
        </nav>
    )
}
