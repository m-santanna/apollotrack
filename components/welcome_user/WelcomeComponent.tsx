'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

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
    const router = useRouter()
    return (
        <motion.div
            className="w-[80vw] sm:w-auto max-w-[80vw] flex flex-col justify-center items-center gap-4 border rounded-xl py-8 px-4 bg-foreground"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-between items-center w-full"
            >
                <button
                    className="bg-foreground rounded-2xl hover:cursor-pointer hover:scale-120 transition-all duration-200"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={32} className="text-accent" />
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-accent text-center">{mainText}</h1>
                <div className="w-8" />
            </motion.div>
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
