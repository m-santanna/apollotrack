import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    macrosAtom,
    macrosDialogEstimateAtom,
    macrosDialogYourselfAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import { Calculator, Pencil, Trash2 } from 'lucide-react'

export default function MacrosEditDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosEditDialogAtom)
    const setEstimateDialogOpen = useSetAtom(macrosDialogEstimateAtom)
    const setYourselfDialogOpen = useSetAtom(macrosDialogYourselfAtom)
    const setMacros = useSetAtom(macrosAtom)
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Macro Settings</DialogTitle>
                    <DialogDescription>
                        Choose how you'd like to configure your daily macros.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2.5 mt-1">
                    <Button
                        className="w-full justify-start gap-3 h-11"
                        onClick={() => {
                            setDialogOpen(false)
                            setEstimateDialogOpen(true)
                        }}
                    >
                        <Calculator className="size-4" />
                        Re-estimate Macros
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full justify-start gap-3 h-11"
                        onClick={() => {
                            setDialogOpen(false)
                            setYourselfDialogOpen(true)
                        }}
                    >
                        <Pencil className="size-4" />
                        Set Manually
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-3 h-11"
                        onClick={() => {
                            setDialogOpen(false)
                            setMacros({
                                calories: 0,
                                protein: 0,
                                fat: 0,
                                carbs: 0,
                                dietGoal: 'Maintenance',
                            })
                        }}
                    >
                        <Trash2 className="size-4" />
                        Reset Macros
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
