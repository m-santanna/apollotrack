'use client'
import Link from 'next/link'
import { Button } from '../ui/button'
import MacrosDisplay from '@/components/MacrosDisplay'
import { motion } from 'framer-motion'

const MacrosDashboard = ({
    daily_calories,
    daily_carbs,
    daily_fat,
    daily_protein,
    diet_goal,
    type,
}: {
    daily_calories: number
    daily_protein: number
    daily_fat: number
    daily_carbs: number
    diet_goal: string
    type: string
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-foreground/10 border border-accent w-full p-4 flex flex-col gap-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-between items-center"
            >
                <div className="w-8" />
                <h1 className="text-3xl font-bold text-center">Your {diet_goal} Macros</h1>
                <Button
                    asChild
                    variant="outline"
                    className="rounded-lg hover:cursor-pointer hover:scale-120 transition-all duration-200"
                >
                    <Link href={`/dashboard/welcome/${type}`}>Edit</Link>
                </Button>
            </motion.div>
            <MacrosDisplay calories={daily_calories} protein={daily_protein} fat={daily_fat} carbs={daily_carbs} />
        </motion.div>
    )
}

export default MacrosDashboard
