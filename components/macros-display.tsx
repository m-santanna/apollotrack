import {
    macrosAtom,
    macrosDialogYourselfAtom,
    macrosDialogEstimateAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { Pencil, Trash } from 'lucide-react'

export default function MacrosDisplay() {
    const setMacrosYourselfDialog = useSetAtom(macrosDialogYourselfAtom)
    const setMacrosEstimateDialog = useSetAtom(macrosDialogEstimateAtom)
    const setEditMacrosDialog = useSetAtom(macrosEditDialogAtom)
    const [macros, setMacros] = useAtom(macrosAtom)
    const goal =
        macros.caloricVariance > 0
            ? 'bulk'
            : macros.caloricVariance < 0
              ? 'cut'
              : 'maintanance'
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
                <div className="flex items-center justify-center gap-3">
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
        <div className="relative flex flex-col gap-4 border rounded-2xl w-3/4 md:w-1/2 p-4 mt-8 animate-in slide-in-from-left duration-300">
            <Button
                onClick={() => setEditMacrosDialog(true)}
                variant={'secondary'}
                className="absolute top-3 right-3"
            >
                <Pencil className="size-6 md:size-7" />
            </Button>
            <Button
                onClick={() =>
                    setMacros({
                        calories: 0,
                        protein: 0,
                        fat: 0,
                        carbs: 0,
                        caloricVariance: 0,
                    })
                }
                variant={'secondary'}
                className="absolute top-6 right-3"
            >
                <Trash className="size-6 md:size-7" />
            </Button>
            <h1 className="text-xl md:text-4xl flex justify-center w-full">
                <span>Your {goal} plan </span>
                <span> ({macros.caloricVariance})</span>
            </h1>
            <div className="flex items-center justify-around text-xl md:text-2xl mt-4">
                <div className="flex flex-col gap-2 items-center">
                    <span>Calories</span>
                    <span>{macros.calories}</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <span>Carbs</span>
                    <span>{macros.carbs}g</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <span>Fat</span>
                    <span>{macros.fat}g</span>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <span>Protein</span>
                    <span>{macros.protein}g</span>
                </div>
            </div>
        </div>
    )
}
