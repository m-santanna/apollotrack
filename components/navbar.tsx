import Link from 'next/link'
import React from 'react'
import { Dumbbell, ShoppingBasket, Apple } from 'lucide-react'

const Navbar = () => {
    return (
        <header className="flex justify-between items-center p-4">
            <nav>
                <Link href="/">
                    <h1>ApolloTrack</h1>
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <h1>Dashboard</h1>
                </Link>
                <Link href="/dashboard/training">
                    <Dumbbell />
                </Link>
                <Link href="/dashboard/supermarket">
                    <ShoppingBasket />
                </Link>
                <Link href="/dashboard/diet">
                    <Apple />
                </Link>
            </div>
        </header>
    )
}

export default Navbar
