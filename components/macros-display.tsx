import { caloricVarianceAtom, macrosAtom, macrosDialogAtom } from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { Pencil } from 'lucide-react'

export default function MacrosDisplay() {
    const caloricVariance = useAtomValue(caloricVarianceAtom)
    const setEditMacrosDialog = useSetAtom(macrosDialogAtom)
    const macros = useAtomValue(macrosAtom)
    const goal =
        caloricVariance > 0
            ? 'bulk'
            : caloricVariance < 0
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
                <h1 className="text-xl md:text-4xl">
                    Looks like you are new here!
                </h1>
                <div className="flex items-center justify-center">
                    <Button onClick={() => setEditMacrosDialog(true)}>
                        Setup Macros
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
            <h1 className="text-xl md:text-4xl flex justify-center w-full">
                <span>Your {goal} plan </span>
                <span> ({caloricVariance})</span>
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
