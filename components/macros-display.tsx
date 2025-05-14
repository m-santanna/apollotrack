import {
    macrosAtom,
    macrosDialogYourselfAtom,
    macrosDialogEstimateAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { Cog } from 'lucide-react'

export default function MacrosDisplay() {
    const setMacrosYourselfDialog = useSetAtom(macrosDialogYourselfAtom)
    const setMacrosEstimateDialog = useSetAtom(macrosDialogEstimateAtom)
    const setEditMacrosDialog = useSetAtom(macrosEditDialogAtom)
    const macros = useAtomValue(macrosAtom)
    if (
        macros.calories == 0 &&
        macros.protein == 0 &&
        macros.fat == 0 &&
        macros.carbs == 0
    ) {
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-3/4 md:w-1/2 p-4 mt-8 animate-in slide-in-from-left duration-300">
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
    }
    return (
        <div className="relative flex flex-col gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 mt-8 animate-in slide-in-from-left duration-300">
            <Button
                onClick={() => setEditMacrosDialog(true)}
                variant={'secondary'}
                size={'sm'}
                className="absolute top-3 right-3"
            >
                <Cog className="size-6 md:size-7" />
            </Button>
            <h1 className="text-xl md:text-4xl flex justify-center w-full gap-1">
                <span>Your {macros.dietGoal} plan </span>
            </h1>
            <div className="flex items-center justify-around text-lg md:text-2xl mt-4">
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
    )
}
