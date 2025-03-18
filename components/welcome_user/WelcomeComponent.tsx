'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'

const WelcomeComponent = ({
    mainText,
    secondaryText,
    mainButtonText,
    secondaryButtonText,
    mainLink,
    secondaryLink,
}: {
    mainText: string
    secondaryText: string
    mainButtonText: string
    secondaryButtonText?: string
    mainLink: string
    secondaryLink?: string
}) => {
    return (
        <motion.div
            className="flex flex-col justify-center items-center gap-2 border rounded-xl p-8 bg-foreground"
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
                {mainText}
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-muted-foreground text-center"
            >
                {secondaryText}
            </motion.p>
            <motion.div
                className="mt-4 flex justify-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                {secondaryLink && secondaryButtonText && (
                    <>
                        <Link href={mainLink}>
                            <Button size={'xl'} className="h-[40px]">
                                {mainButtonText}
                            </Button>
                        </Link>
                        <Link href={secondaryLink}>
                            <Button size={'xl'} variant={'secondary'} className="h-[40px]">
                                {secondaryButtonText}
                            </Button>
                        </Link>
                    </>
                )}
                {!secondaryLink && (
                    <Link href={mainLink}>
                        <Button size={'xl'} className="h-[40px]">
                            {mainButtonText}
                        </Button>
                    </Link>
                )}
            </motion.div>
        </motion.div>
    )
}

export default WelcomeComponent
