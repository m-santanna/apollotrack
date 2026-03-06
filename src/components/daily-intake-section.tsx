import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import {
    dailyIntakeAtom,
    infoDailyIntakeDialogAtom,
    priceViewAtom,
    setupDailyIntakeDialogAtom,
} from '@/lib/atoms'
import { roundNumber } from '@/lib/utils'
import {
    CalendarDays,
    Settings,
    Flame,
    Beef,
    Wheat,
    Droplets,
    DollarSign,
} from 'lucide-react'

const priceFactor: Record<string, number> = {
    Daily: 1,
    Weekly: 7,
    Monthly: 30,
    Yearly: 365,
}

export default function DailyIntakeSection() {
    const dailyIntake = useAtomValue(dailyIntakeAtom)
    const setSetupDialogOpen = useSetAtom(setupDailyIntakeDialogAtom)
    const setInfoDialogOpen = useSetAtom(infoDailyIntakeDialogAtom)
    const priceView = useAtomValue(priceViewAtom)

    if (dailyIntake.meals.length === 0)
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 card-shadow">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Daily Intake Not Set
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add your food items first, create meals, then come
                            back to set up your daily plan.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setSetupDialogOpen(true)}
                    >
                        Setup Daily Intake
                    </Button>
                </div>
            </div>
        )

    const items = [
        {
            label: 'Calories',
            value: dailyIntake.calories,
            unit: 'kcal',
            icon: Flame,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        },
        {
            label: 'Protein',
            value: dailyIntake.protein,
            unit: 'g',
            icon: Beef,
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
        {
            label: 'Carbs',
            value: dailyIntake.carbs,
            unit: 'g',
            icon: Wheat,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
        {
            label: 'Fat',
            value: dailyIntake.fat,
            unit: 'g',
            icon: Droplets,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            label: 'Price',
            value: roundNumber(
                dailyIntake.price * (priceFactor[priceView] ?? 1),
            ),
            unit: ` / ${priceView.toLowerCase()}`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
    ]

    return (
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Daily Intake</h2>
                    <p className="text-sm text-muted-foreground">
                        {dailyIntake.meals.length} meal
                        {dailyIntake.meals.length !== 1 ? 's' : ''} in your plan
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setInfoDialogOpen(true)}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {items.map(
                    ({ label, value, unit, icon: Icon, color, bgColor }) => (
                        <div
                            key={label}
                            className={`flex items-center gap-3 rounded-xl p-3 ${bgColor}`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                            <div className="min-w-0">
                                <p className="truncate text-xs text-muted-foreground">
                                    {label}
                                </p>
                                <p className="text-sm font-semibold">
                                    {value}
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {unit}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    )
}
