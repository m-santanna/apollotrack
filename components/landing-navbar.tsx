'use client'

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'

const LandingNavbar = () => {
    return (
        <nav className="flex gap-4 items-center justify-center h-[64px]">
            <Link href="/sign-in">
                <Button>Sign In</Button>
            </Link>
            <Link href="/dashboard">
                <Button variant={'secondary'}>Dashboard</Button>
            </Link>
            <Button onClick={async () => await signOut()}>Sign Out</Button>
        </nav>
    )
}

export default LandingNavbar
