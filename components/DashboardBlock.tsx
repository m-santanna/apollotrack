import Link from 'next/link'
import React from 'react'
import MacrosDisplay from './MacrosDisplay'
import { UserMacros, FoodItem, ExerciseGroup } from '@/src/db/schema'
import { Button } from './ui/button'
import NoData from './dashboard/NoData'
import MacrosDashboard from './dashboard/MacrosDashboard'

interface DashboardBlockProps {
    type: 'diet' | 'macros' | 'supermarket' | 'training'
    databaseData: FoodItem[] | UserMacros[] | ExerciseGroup[]
}

const DashboardMacros = ({ databaseData, type }: DashboardBlockProps) => {
    const firstTime = databaseData.length === 0
    if (firstTime) {
        return <NoData type={type} />
    } else if (type === 'macros') {
        const { daily_protein, daily_carbs, daily_fat, daily_calories, diet_goal } = databaseData[0] as UserMacros
        return (
            <MacrosDashboard
                daily_calories={daily_calories}
                daily_protein={daily_protein}
                daily_fat={daily_fat}
                daily_carbs={daily_carbs}
                diet_goal={diet_goal}
                type={type}
            />
        )
    } else
        return (
            <div className="rounded-lg bg-foreground/10 border border-accent w-full h-full p-4">
                <h1>{type} Dashboard</h1>
            </div>
        )
}

export default DashboardMacros
