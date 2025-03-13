'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { createExerciseGroups } from '@/lib/actions'
import { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

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
    setNumberOfItems,
}: {
    numberOfItems: number
    setNumberOfItems: React.Dispatch<React.SetStateAction<number>>
}) => {
    const { pending } = useFormStatus()
    return (
        <div className="flex flex-col gap-2">
            <div className="w-full grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfItems(numberOfItems + 1)}
                    disabled={pending}
                >
                    Add Item
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfItems(numberOfItems - 1)}
                    disabled={numberOfItems === 1 || pending}
                >
                    Remove Item
                </Button>
            </div>
            <SubmitButton />
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
                <span className="text-accent">{'Item #' + (i + 1)}</span>
                <Label htmlFor={'exercise' + i}>Exercise</Label>
            </motion.div>,
        )
    }
    return inputs
}

const CreateExercises = ({ exercises }: { exercises: Exercise[] }) => {
    const [numberOfItems, setNumberOfItems] = useState(1)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        await createExerciseGroups(formData)
        router.push('/dashboard')
    }

    return (
        <motion.div
            className="max-h-[80vh] overflow-scroll rounded-lg"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <form action={handleSubmit}>
                <div className="flex flex-col gap-4 p-4 bg-accent-foreground">
                    <AnimatePresence>{formInputs(numberOfItems, exercises)}</AnimatePresence>
                    <FormButtons numberOfItems={numberOfItems} setNumberOfItems={setNumberOfItems} />
                </div>
            </form>
        </motion.div>
    )
}

export default CreateExercises
