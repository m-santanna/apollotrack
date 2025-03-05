import MacrosDisplay from '@/components/MacrosDisplay'

const DailyMacros = async ({
    calories,
    protein,
    carbs,
    fat,
}: {
    calories: number
    protein: number
    carbs: number
    fat: number
}) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Daily Macros</h1>
            </div>

            <MacrosDisplay calories={calories} protein={protein} carbs={carbs} fat={fat} />
        </div>
    )
}

export default DailyMacros
