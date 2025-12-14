import {
    macrosAtom,
    macrosDialogYourselfAtom,
    macrosDialogEstimateAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'

export default function MacrosSection() {
    const setMacrosYourselfDialog = useSetAtom(macrosDialogYourselfAtom)
    const setMacrosEstimateDialog = useSetAtom(macrosDialogEstimateAtom)
    const setEditMacrosDialog = useSetAtom(macrosEditDialogAtom)
    const macros = useAtomValue(macrosAtom)
    if (
        macros.calories == 0 &&
        macros.protein == 0 &&
        macros.fat == 0 &&
        macros.carbs == 0
    )
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 animate-in slide-in-from-left duration-300">
                <h1 className="text-xl md:text-3xl text-center">
                    Looks like you are new here!
                </h1>
                <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => setMacrosEstimateDialog(true)}>
                        Estimate calories
                    </Button>
                    <Button
                        variant={'secondary'}
                        onClick={() => setMacrosYourselfDialog(true)}
                    >
                        Do it yourself
                    </Button>
                </div>
            </div>
        )
    return (
        <div className="flex flex-col items-center gap-4 w-6/7 md:w-1/2 animate-in slide-in-from-left duration-300">
            <h1 className="text-xl md:text-3xl font-bold text-primary">
                <span>Your {macros.dietGoal} plan </span>
            </h1>
            <div className="relative flex w-full flex-col gap-4 border rounded-2xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-base md:text-lg">
                    {[
                        {
                            label: 'Calories',
                            value: macros.calories,
                        },
                        {
                            label: 'Carbs',
                            value: `${macros.carbs}g`,
                        },
                        {
                            label: 'Fat',
                            value: `${macros.fat}g`,
                        },
                        {
                            label: 'Protein',
                            value: `${macros.protein}g`,
                        },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col gap-1 items-center"
                        >
                            <span className="uppercase text-xs text-muted-foreground tracking-wide">
                                {label}
                            </span>
                            <span className="font-semibold text-xl">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end items-center gap-2 w-full">
                <Button
                    onClick={() => setEditMacrosDialog(true)}
                    variant="secondary"
                >
                    Edit Macros
                </Button>
            </div>
        </div>
    )
}
