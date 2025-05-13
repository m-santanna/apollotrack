import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { macrosAtom, macrosDialogEstimateAtom } from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { calculateCalories, calculateMacros } from '@/lib/utils'
import { Select } from '@radix-ui/react-select'
import { useState } from 'react'

export default function MacrosEstimateDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosDialogEstimateAtom)
    const [formData, setFormData] = useState<{
        gender: 'male' | 'female'
        weight: number
        height: number
        age: number
        activityLevel: number
        dietGoal: string
    }>({})
    const setMacros = useSetAtom(macrosAtom)
    function handleSubmitForm() {
        const calories = calculateCalories(...formData)
        const { protein, carbs, fat } = calculateMacros(
            formData.calories,
            formData.weight,
            formData.dietGoal,
        )
        setMacros({ calories, protein, fat, carbs })
    }
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
                        <div className="text-right">Gender</div>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">
                                        Banana
                                    </SelectItem>
                                    <SelectItem value="blueberry">
                                        Blueberry
                                    </SelectItem>
                                    <SelectItem value="grapes">
                                        Grapes
                                    </SelectItem>
                                    <SelectItem value="pineapple">
                                        Pineapple
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                    <Button onClick={handleSubmitForm}>Calculate Macros</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
