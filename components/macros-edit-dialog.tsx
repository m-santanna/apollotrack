import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    macrosDialogEstimateAtom,
    macrosDialogYourselfAtom,
    macrosEditDialogAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function MacrosEditDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosEditDialogAtom)
    const setEstimateDialogOpen = useSetAtom(macrosDialogEstimateAtom)
    const setYourselfDialogOpen = useSetAtom(macrosDialogYourselfAtom)
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>How do you want to edit?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            setDialogOpen(false)
                            setEstimateDialogOpen(true)
                        }}
                    >
                        Macros Estimation
                    </Button>
                    <Button
                        onClick={() => {
                            setDialogOpen(false)
                            setYourselfDialogOpen(true)
                        }}
                    >
                        Do it yourself
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
