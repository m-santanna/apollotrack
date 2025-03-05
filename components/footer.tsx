import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t border-border bg-background flex items-center justify-center gap-6 h-[64px] px-6">
            <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} ApolloTrack. All rights reserved.
            </p>
            <Link href="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Terms of Service
            </Link>
        </footer>
    )
}

export default Footer
