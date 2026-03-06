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
} from '@/components/ui/dialog'
import {
    dailyIntakeAtom,
    editDailyIntakeDialogAtom,
    infoDailyIntakeDialogAtom,
    priceViewAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

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
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Daily Intake Settings</DialogTitle>
                    <DialogDescription>
                        Manage your daily intake configuration and price view.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2.5 mt-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full justify-start gap-3 h-11" variant="outline">
                                <Calendar className="size-4" />
                                Price View: {priceView}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-32">
                            <DropdownMenuRadioGroup
                                value={priceView}
                                onValueChange={(value) => {
                                    setPriceView(value)
                                    setDialogOpen(false)
                                }}
                            >
                                {pricePeriod.map((factor) => (
                                    <DropdownMenuRadioItem key={factor} value={factor}>
                                        {factor}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        className="w-full justify-start gap-3 h-11"
                        variant="secondary"
                        onClick={() => {
                            setEditDialogOpen(true)
                            setDialogOpen(false)
                        }}
                    >
                        <Pencil className="size-4" />
                        Edit Daily Meals
                    </Button>
                    <Button
                        className="w-full justify-start gap-3 h-11"
                        variant="destructive"
                        onClick={() => {
                            deleteDailyIntake()
                            setDialogOpen(false)
                        }}
                    >
                        <Trash2 className="size-4" />
                        Reset Daily Intake
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
