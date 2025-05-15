import {
    macrosAtom,
    macrosDialogYourselfAtom,
    macrosDialogEstimateAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { Cog } from 'lucide-react'

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
            <div className="relative flex w-full flex-col gap-4 border rounded-2xl p-4 ">
                <Button
                    onClick={() => setEditMacrosDialog(true)}
                    size={'icon'}
                    variant={'link'}
                    className="absolute top-3 right-3 text-primary/50 hover:text-primary-foreground"
                >
                    <Cog className="size-6 md:size-7" />
                </Button>
                <div className="flex items-center justify-around text-lg md:text-2xl">
                    <div className="flex flex-col gap-1 items-center">
                        <span>Calories</span>
                        <span className="font-light">{macros.calories}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span>Carbs</span>
                        <span className="font-light">{macros.carbs}g</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span>Fat</span>
                        <span className="font-light">{macros.fat}g</span>
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                        <span>Protein</span>
                        <span className="font-light">{macros.protein}g</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
