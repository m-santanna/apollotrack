'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <Link href="/sign-in">
                <Button>Sign In</Button>
            </Link>
            <Button onClick={async () => await signOut()}>Sign Out</Button>
        </div>
    )
}
