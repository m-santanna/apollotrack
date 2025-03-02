'use client'

import { motion } from 'framer-motion'
import { Button } from './button'
import Link from 'next/link'
import { ArrowRight, Dumbbell, Apple, ShoppingBasket } from 'lucide-react'
import { useEffect, useState } from 'react'

const Hero = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-gradient-to-br from-background to-secondary-foreground/20">
            <div className="h-[calc(100vh-128px)] lg:h-full flex flex-col lg:flex-row lg:items-center justify-center lg:justify-between max-w-7xl mx-auto px-6 py-12 gap-12">
                <div className="flex flex-col gap-6 lg:w-[60%] h-fit">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-semibold text-start md:text-6xl text-4xl">
                            Train like a legend, eat like a champion!
                            ApolloTrack makes fitness and nutrition{' '}
                            <span className="text-amber-400">effortless</span>.
                            And the best part? It's free!
                        </h1>
                    </motion.div>

                    <motion.p
                        className="text-muted-foreground text-lg md:text-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Track your workouts, plan your meals, and achieve your
                        fitness goals with our all-in-one platform. Join
                        thousands of users transforming their lives with
                        ApolloTrack.
                    </motion.p>

                    <motion.div
                        className="flex flex-col md:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link href="/sign-in">
                            <Button size="lg" className="w-full md:w-auto">
                                Get Started <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="w-full md:w-auto"
                            >
                                View Demo
                            </Button>
                        </Link>
                    </motion.div>
                </div>
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
                            animate={{ scale: [1, 1.5, 1], rotate: [0, 360] }}
                            transition={{
                                duration: 5,
                                ease: 'linear',
                            }}
                        >
                            <Dumbbell className="w-24 h-24" />
                        </motion.div>
                        <motion.div
                            className="absolute top-10 right-10"
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 5,
                                ease: 'linear',
                            }}
                        >
                            <Apple className="w-16 h-16" />
                        </motion.div>
                        <motion.div
                            className="absolute bottom-10 left-10"
                            animate={{
                                rotate: [0, -360],
                            }}
                            transition={{
                                duration: 5,
                                ease: 'linear',
                            }}
                        >
                            <ShoppingBasket className="w-16 h-16" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero
