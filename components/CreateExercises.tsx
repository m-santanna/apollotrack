'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { createExerciseGroups } from '@/lib/actions'
import { useState } from 'react'
import { Label } from './ui/label'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

type Exercise = {
    id: string
    name: string
    mainMuscle: string
}

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
        </Button>
    )
}

const FormButtons = ({
    numberOfItems,
    setNumberOfExercises,
}: {
    numberOfItems: number
    setNumberOfExercises: React.Dispatch<React.SetStateAction<number>>
}) => {
    const { pending } = useFormStatus()
    return (
        <div className="flex flex-col gap-2 bg-accent-foreground">
            <div className="w-full grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfExercises(numberOfItems + 1)}
                    disabled={pending}
                >
                    Add Item
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfExercises(numberOfItems - 1)}
                    disabled={numberOfItems === 1 || pending}
                >
                    Remove Item
                </Button>
            </div>
            <SubmitButton />
        </div>
    )
}

const FilterButtom = ({
    exercises,
    setFilteredExercises,
}: {
    exercises: { id: string; name: string; mainMuscle: string }[]
    setFilteredExercises: React.Dispatch<React.SetStateAction<{ id: string; name: string; mainMuscle: string }[]>>
}) => {
    const setOfMuscleGroup = new Set(exercises.map((exercise) => exercise.mainMuscle))
    const arrayOfMuscleGroup = Array.from(setOfMuscleGroup)
    return (
        <div className="flex gap-2 mb-2">
            <Select
                onValueChange={(value) => {
                    setFilteredExercises(exercises.filter((exercise) => exercise.mainMuscle === value))
                }}
                defaultValue="Upper Chest"
            >
                <SelectTrigger className="bg-accent-foreground text-accent">
                    <SelectValue placeholder="Filtrar por:" />
                </SelectTrigger>
                <SelectContent className="w-56">
                    {arrayOfMuscleGroup.map((muscle) => (
                        <SelectItem key={muscle} value={muscle}>
                            {muscle}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

const formInputs = (numberOfItems: number, exercises: { id: string; name: string; mainMuscle: string }[]) => {
    const inputs = []
    for (let i = 0; i < numberOfItems; i++) {
        inputs.push(
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex flex-col gap-4"
                key={i}
            >
                {exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-2">
                        <Checkbox id={exercise.id} name={`exercise-${i}`} value={exercise.id} />
                        <Label className="text-accent" htmlFor={`exercise-${i}`}>
                            {exercise.name}
                        </Label>
                    </div>
                ))}
            </motion.div>,
        )
    }
    return inputs
}

const CreateExercises = ({ exercises }: { exercises: Exercise[] }) => {
    const [numberOfExercises, setNumberOfExercises] = useState(1)
    const [filteredExercises, setFilteredExercises] = useState(
        exercises.filter((exercise) => exercise.mainMuscle === 'Upper Chest'),
    )
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        console.log('Form data:', formData)
        //await createExerciseGroups(formData)
        //router.push('/dashboard')
    }

    return (
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <FilterButtom exercises={exercises} setFilteredExercises={setFilteredExercises} />
            <div className="max-h-[70vh] overflow-scroll rounded-lg">
                <form action={handleSubmit}>
                    <div className="flex flex-col gap-4 p-4 bg-accent-foreground rounded-lg">
                        <AnimatePresence>{formInputs(numberOfExercises, filteredExercises)}</AnimatePresence>
                        <FormButtons numberOfItems={numberOfExercises} setNumberOfExercises={setNumberOfExercises} />
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default CreateExercises
