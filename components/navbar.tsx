import Link from 'next/link'
import { Dumbbell, ShoppingBasket, Apple } from 'lucide-react'

const Navbar = () => {
    return (
        <header className="sticky z-10 flex justify-between items-center px-6 py-4 h-[64px] bg-background border-b border-border">
            <nav>
                <Link href="/dashboard">
                    <h1 className="text-3xl font-bold text-foreground hover:text-primary/80 transition-colors">
                        ApolloTrack
                    </h1>
                </Link>
            </nav>
            <div className="flex items-center gap-6">
                <Link href="/dashboard/training">
                    <Dumbbell className="w-8 h-8 text-foreground hover:text-primary/80 transition-colors" />
                </Link>
                <Link href="/dashboard/supermarket">
                    <ShoppingBasket className="w-8 h-8 text-foreground hover:text-primary/80 transition-colors" />
                </Link>
                <Link href="/dashboard/diet">
                    <Apple className="w-8 h-8 text-foreground hover:text-primary/80 transition-colors" />
                </Link>
            </div>
        </header>
    )
}

export default Navbar
