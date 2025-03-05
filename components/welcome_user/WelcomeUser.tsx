'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const WelcomeUser = () => {
    return (
        <motion.div
            className="flex flex-col gap-2 border rounded-xl p-8 bg-foreground"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-2xl md:text-4xl font-bold text-accent"
            >
                Welcome to ApolloTrack!
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-muted-foreground text-center"
            >
                First of all, we need to get some information about you.
            </motion.p>
            <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <Link href="/dashboard/welcome/macros">
                    <Button size={'xl'} className="h-[40px]">
                        Get Started
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default WelcomeUser
