'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { ArrowRight, Dumbbell, Apple, ShoppingBasket } from 'lucide-react'
import { signOut, useSession } from '@/lib/auth-client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogAction,
} from './ui/alert-dialog'

export default function LandingPageHero() {
    const { data: session, isPending } = useSession()

    // Waiting for session to load
    if (isPending) {
        return (
            <div className="h-full w-full flex items-center justify-center gap-4">
                <Apple className="w-12 h-12 animate-bounce" />
                <Dumbbell className="w-12 h-12 animate-bounce" />
                <ShoppingBasket className="w-12 h-12 animate-bounce" />
            </div>
        )
    }

    // Common wrapper for both logged in and logged out states
    return (
        <>
            <div className="h-[calc(100vh-128px)] lg:h-[calc(100vh-64px)] flex flex-col lg:flex-row lg:items-center justify-center lg:justify-between max-w-7xl mx-auto px-6 py-12 gap-12">
                <LandingPageMainText hasUser={!!session} username={session?.user?.name} />
                <LandingPageIcons />
            </div>
            <LandingPageFooter />
        </>
    )
}

const LandingPageMainText = ({ hasUser, username }: { hasUser: boolean; username?: string }) => {
    if (hasUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6 lg:w-[50%] h-fit"
            >
                <h1 className="font-semibold text-center md:text-6xl text-4xl">Welcome back, {username}!</h1>
                <div className="flex justify-center items-center gap-4">
                    <Link href="/dashboard/welcome">
                        <Button variant="default" size="xl" className="w-full md:w-auto text-lg">
                            Go to Dashboard
                            <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary" size="xl" className="w-auto text-lg">
                                Sign Out
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>You sure?</AlertDialogTitle>
                                <AlertDialogDescription>Just asking.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col gap-6 lg:w-[60%] h-fit">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="font-semibold text-start md:text-6xl text-4xl">
                    Train like a legend, eat like a champion! ApolloTrack makes fitness and nutrition{' '}
                    <span className="text-amber-400">effortless</span>. And the best part? It's free!
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground text-lg md:text-xl"
            >
                Track your workouts, plan your meals, and achieve your fitness goals with our all-in-one platform. Join
                us, and see for yourself how convenient our platform is.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col md:flex-row gap-4"
            >
                <Link href="/sign-in">
                    <Button variant="default" size="xl" className="w-full md:w-auto text-lg">
                        Login <ArrowRight className="ml-2" />
                    </Button>
                </Link>
                <Link href="/dashboard/welcome">
                    <Button variant="secondary" size="xl" className="w-full md:w-auto text-lg">
                        DEV DASHBOARD
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}

const LandingPageIcons = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(false)

    const handleResize = useCallback(() => {
        setIsLargeScreen(window.innerWidth >= 1024)
    }, [])

    useEffect(() => {
        handleResize()
        const mediaQuery = window.matchMedia('(min-width: 1024px)')
        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsLargeScreen(e.matches)
        }
        mediaQuery.addEventListener('change', handleMediaChange)
        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange)
        }
    }, [handleResize])

    if (!isLargeScreen) return null

    return (
        <motion.div
            className="hidden lg:flex items-center justify-center lg:w-[40%] h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
        >
            <div className="relative w-full aspect-square max-w-md">
                <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360, 0],
                    }}
                    transition={{
                        duration: 3,
                        ease: 'easeInOut',
                        times: [0, 0.5, 1],
                        repeat: 0,
                    }}
                >
                    <Link href="/dashboard/training">
                        <Dumbbell className="w-24 h-24" />
                    </Link>
                </motion.div>
                <motion.div
                    className="absolute top-10 right-10"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 3,
                        ease: 'easeInOut',
                        repeat: 0,
                    }}
                >
                    <Link href="/dashboard/diet">
                        <Apple className="w-16 h-16" />
                    </Link>
                </motion.div>
                <motion.div
                    className="absolute bottom-10 left-10"
                    animate={{
                        rotate: [0, -360],
                    }}
                    transition={{
                        duration: 3,
                        ease: 'easeInOut',
                        repeat: 0,
                    }}
                >
                    <Link href="/dashboard/supermarket">
                        <ShoppingBasket className="w-16 h-16" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

const LandingPageFooter = () => {
    return (
        <div className="flex items-center justify-center gap-4 h-[64px]">
            <p className="text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} ApolloTrack. All rights reserved.
            </p>
            <Link href="/privacy" className="text-muted-foreground text-sm hover:text-primary">
                Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground text-sm hover:text-primary">
                Terms of Service
            </Link>
        </div>
    )
}
