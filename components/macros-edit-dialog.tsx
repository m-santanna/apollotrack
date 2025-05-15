import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from '@/components/ui/dialog'
import {
    macrosAtom,
    macrosDialogEstimateAtom,
    macrosDialogYourselfAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
import { DialogDescription } from '@radix-ui/react-dialog'

export default function MacrosEditDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosEditDialogAtom)
    const setEstimateDialogOpen = useSetAtom(macrosDialogEstimateAtom)
    const setYourselfDialogOpen = useSetAtom(macrosDialogYourselfAtom)
    const setMacros = useSetAtom(macrosAtom)
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="gap-2 sm:max-w-[425px]">
                <DialogHeader className="my-2">
                    <DialogTitle>Macros Config</DialogTitle>
                    <DialogDescription>What do you wanna do?</DialogDescription>
                </DialogHeader>
                <Button
                    className="w-full mt-2"
                    onClick={() => {
                        setDialogOpen(false)
                        setEstimateDialogOpen(true)
                    }}
                >
                    Reestimate Macros
                </Button>
                <Button
                    variant={'secondary'}
                    className="w-full"
                    onClick={() => {
                        setDialogOpen(false)
                        setYourselfDialogOpen(true)
                    }}
                >
                    Change it yourself
                </Button>
                <Button
                    variant={'destructive'}
                    className="w-full"
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
                    Delete Macros
                </Button>
            </DialogContent>
        </Dialog>
    )
}
