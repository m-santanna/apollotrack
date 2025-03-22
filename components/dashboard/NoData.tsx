'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const NoData = ({ type }: { type: string }) => {
    return (
        <motion.div
            className="rounded-lg bg-foreground/10 border border-accent w-full h-full p-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link href={`/dashboard/welcome/${type}`}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-2xl font-bold text-center"
                >
                    You don't have any {type} data yet. Please add some to get started!
                </motion.h1>
            </Link>
        </motion.div>
    )
}

export default NoData
