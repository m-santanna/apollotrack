'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const WelcomeMacros = () => {
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
                className="text-2xl md:text-4xl font-bold text-accent text-center"
            >
                Let's see your macros!
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-muted-foreground text-center"
            >
                You can either set your macros yourself or let us estimate them for you.
            </motion.p>
            <motion.div
                className="mt-4 flex justify-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <Link href="/dashboard/welcome/macros/estimate">
                    <Button size={'xl'} className="h-[40px]">
                        Estimate it for me
                    </Button>
                </Link>
                <Link href="/dashboard/welcome/macros/yourself">
                    <Button size={'xl'} variant={'secondary'} className="h-[40px]">
                        I'll do it
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default WelcomeMacros
