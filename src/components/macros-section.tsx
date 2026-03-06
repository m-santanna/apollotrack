import {
    macrosAtom,
    macrosDialogYourselfAtom,
    macrosDialogEstimateAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { Settings, Target, Flame, Beef, Wheat, Droplets } from 'lucide-react'

export default function MacrosSection() {
    const setMacrosYourselfDialog = useSetAtom(macrosDialogYourselfAtom)
    const setMacrosEstimateDialog = useSetAtom(macrosDialogEstimateAtom)
    const setEditMacrosDialog = useSetAtom(macrosEditDialogAtom)
    const macros = useAtomValue(macrosAtom)

    const isEmpty =
        macros.calories === 0 &&
        macros.protein === 0 &&
        macros.fat === 0 &&
        macros.carbs === 0

    if (isEmpty)
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 card-shadow">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Set Your Macro Targets
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Get started by setting your daily calorie and macro
                            goals.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setMacrosEstimateDialog(true)}
                            size="sm"
                        >
                            Estimate for Me
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMacrosYourselfDialog(true)}
                        >
                            Set Manually
                        </Button>
                    </div>
                </div>
            </div>
        )

    const macroItems = [
        {
            label: 'Calories',
            value: macros.calories,
            unit: 'kcal',
            icon: Flame,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        },
        {
            label: 'Protein',
            value: macros.protein,
            unit: 'g',
            icon: Beef,
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
        {
            label: 'Carbs',
            value: macros.carbs,
            unit: 'g',
            icon: Wheat,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
        {
            label: 'Fat',
            value: macros.fat,
            unit: 'g',
            icon: Droplets,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
    ]

    return (
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Macro Targets</h2>
                    <p className="text-sm text-muted-foreground">
                        {macros.dietGoal === 'own'
                            ? 'Your custom plan'
                            : `${macros.dietGoal} plan`}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditMacrosDialog(true)}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {macroItems.map(
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
