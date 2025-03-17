import Link from 'next/link'
import React from 'react'
import MacrosDisplay from './MacrosDisplay'

interface DashboardBlockProps {
    firstTime: boolean
    type: 'diet' | 'macros' | 'supermarket' | 'training'
}

const DashboardMacros = ({ firstTime, type }: DashboardBlockProps) => {
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
        return (
            <div className="rounded-lg bg-foreground/10 border border-accent w-full p-4 flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center">Your Macros</h1>
                <MacrosDisplay calories={2000} protein={150} carbs={250} fat={70} />
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
