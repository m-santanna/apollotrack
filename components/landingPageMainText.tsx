'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const LandingPageMainText = () => {
    return (
        <div className="flex flex-col gap-6 lg:w-[60%] h-fit">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-semibold text-start md:text-6xl text-4xl">
                    Train like a legend, eat like a champion! ApolloTrack makes
                    fitness and nutrition{' '}
                    <span className="text-amber-400">effortless</span>. And the
                    best part? It's free!
                </h1>
            </motion.div>

            <motion.p
                className="text-muted-foreground text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Track your workouts, plan your meals, and achieve your fitness
                goals with our all-in-one platform. Join thousands of users
                transforming their lives with ApolloTrack.
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
    )
}

export default LandingPageMainText
