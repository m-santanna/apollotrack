'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Dumbbell, Apple, ShoppingBasket } from 'lucide-react'
import { useEffect, useState } from 'react'

const LandingPageIcons = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024)
        }
        // Initial check
        handleResize()
        // Add debounced resize listener to reduce frequent calls
        let resizeTimer: NodeJS.Timeout
        const debouncedResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(handleResize, 100)
        }
        window.addEventListener('resize', debouncedResize)
        return () => {
            window.removeEventListener('resize', debouncedResize)
            clearTimeout(resizeTimer)
        }
    }, [])
    return (
        <>
            {isLargeScreen && (
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
            )}
        </>
    )
}

export default LandingPageIcons
