import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import {
    dailyIntakeAtom,
    infoDailyIntakeDialogAtom,
    priceViewAtom,
    setupDailyIntakeDialogAtom,
} from '@/lib/atoms'
import { roundNumber } from '@/lib/utils'

const priceFactor = {
    Daily: 1,
    Weekly: 7,
    Monthly: 30,
    Yearly: 365,
}

export default function DailyIntakeSection() {
    const dailyIntake = useAtomValue(dailyIntakeAtom)
    const setSetupDialogOpen = useSetAtom(setupDailyIntakeDialogAtom)
    const setInfoDialogOpen = useSetAtom(infoDailyIntakeDialogAtom)
    const priceView = useAtomValue(priceViewAtom)

    if (dailyIntake.meals.length == 0)
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl md:text-3xl text-center">
                        Daily Intake not setup yet.
                    </h1>
                    <p className="text-accent-muted font-light text-justify">
                        We suggest you to scroll all the way to the buttom and
                        add all your food items first. Then, create your meals.
                        After you have all your meals, you come back here, and
                        setup your daily intake! :)
                    </p>
                </div>
                <Button onClick={() => setSetupDialogOpen(true)}>
                    Setup Daily Intake
                </Button>
            </div>
        )
    return (
        <div className="flex flex-col items-center gap-4 w-6/7 md:w-1/2 animate-in slide-in-from-left duration-300">
            <h1 className="text-xl md:text-3xl font-bold text-primary">
                Your Daily Intake
            </h1>
            <div className="flex w-full flex-col gap-4 border rounded-2xl p-4">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center text-base md:text-lg">
                    {[
                        {
                            label: 'Calories',
                            value: dailyIntake.calories,
                        },
                        {
                            label: 'Carbs',
                            value: `${dailyIntake.carbs}g`,
                        },
                        {
                            label: 'Fat',
                            value: `${dailyIntake.fat}g`,
                        },
                        {
                            label: 'Protein',
                            value: `${dailyIntake.protein}g`,
                        },
                        {
                            label: 'Price',
                            value: roundNumber(
                                dailyIntake.price * priceFactor[priceView],
                            ),
                        },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col gap-1 items-center"
                        >
                            <span className="uppercase text-xs text-muted-foreground tracking-wide">
                                {label}
                            </span>
                            <span className="font-semibold text-xl">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end items-center gap-2 w-full">
                <Button
                    onClick={() => setInfoDialogOpen(true)}
                    variant="secondary"
                >
                    Adjust Daily Intake
                </Button>
            </div>
        </div>
    )
}
