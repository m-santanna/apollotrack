import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { macrosDialogEstimateAtom } from '@/lib/atoms'
import { useAtom } from 'jotai/react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export default function MacrosEstimateDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosDialogEstimateAtom)
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Macros estimation</DialogTitle>
                    <DialogDescription>
                        We will do our best to calculate your needed macros
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">Name</div>
                        <Input
                            id="name"
                            value="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">Username</div>
                        <Input
                            id="username"
                            value="@peduarte"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
