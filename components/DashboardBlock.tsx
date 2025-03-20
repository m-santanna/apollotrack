import Link from 'next/link'
import React from 'react'
import MacrosDisplay from './MacrosDisplay'
import { UserMacros, FoodItem, ExerciseGroup } from '@/src/db/schema'

interface DashboardBlockProps {
    type: 'diet' | 'macros' | 'supermarket' | 'training'
    databaseData: FoodItem[] | UserMacros[] | ExerciseGroup[]
}

const DashboardMacros = ({ databaseData, type }: DashboardBlockProps) => {
    const firstTime = databaseData.length === 0
    if (firstTime) {
        return (
            <Link
                href={`/dashboard/welcome/${type}`}
                className="rounded-lg bg-foreground/10 border border-accent w-full h-full p-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    You don't have any {type} data yet. Please add some to get started!
                </h1>
            </Link>
        )
    } else if (type === 'macros') {
        const { daily_protein, daily_carbs, daily_fat, daily_calories } = databaseData[0] as UserMacros
        return (
            <div className="rounded-lg bg-foreground/10 border border-accent w-full p-4 flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center">Your Maintenance Macros</h1>
                <MacrosDisplay calories={daily_calories} protein={daily_protein} fat={daily_fat} carbs={daily_carbs} />
            </div>
        )
    } else
        return (
            <div className="rounded-lg bg-foreground/10 border border-accent w-full h-full p-4">
                <h1>{type} Dashboard</h1>
            </div>
        )
}

export default DashboardMacros
