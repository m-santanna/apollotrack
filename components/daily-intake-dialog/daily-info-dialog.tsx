import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from '@/components/ui/dialog'
import {
    dailyIntakeAtom,
    editDailyIntakeDialogAtom,
    infoDailyIntakeDialogAtom,
    priceViewAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'

const pricePeriod = ['Daily', 'Weekly', 'Monthly', 'Yearly']

export default function InfoDailyIntakeDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(infoDailyIntakeDialogAtom)
    const [priceView, setPriceView] = useAtom(priceViewAtom)
    const setDailyIntake = useSetAtom(dailyIntakeAtom)
    const setEditDialogOpen = useSetAtom(editDailyIntakeDialogAtom)

    function deleteDailyIntake() {
        setDailyIntake({
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            price: 0,
            meals: [],
        })
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px] gap-2">
                <DialogHeader className="my-2">
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="mt-2 w-2/3 translate-x-1/4"
                            variant="outline"
                        >
                            Price View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-24">
                        <DropdownMenuRadioGroup
                            value={priceView}
                            onValueChange={(value) => {
                                setPriceView(value)
                                setDialogOpen(false)
                            }}
                        >
                            {pricePeriod.map((factor) => (
                                <DropdownMenuRadioItem value={factor}>
                                    {factor}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    className="w-2/3 translate-x-1/4"
                    onClick={() => {
                        setEditDialogOpen(true)
                        setDialogOpen(false)
                    }}
                    variant="secondary"
                >
                    Edit Daily Meals
                </Button>
                <Button
                    className="w-2/3 translate-x-1/4"
                    onClick={() => {
                        deleteDailyIntake()
                        setDialogOpen(false)
                    }}
                    variant="destructive"
                >
                    Delete
                </Button>
            </DialogContent>
        </Dialog>
    )
}
