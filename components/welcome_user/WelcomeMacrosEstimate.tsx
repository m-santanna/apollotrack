'use client'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { saveUserMacrosEstimate } from '@/lib/actions'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { EstimateMacrosFormValues, estimateMacrosFormSchema, activityLevels, dietGoalArray } from '@/lib/macros-utils'
import { motion } from 'framer-motion'

const WelcomeMacrosEstimate = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [genderPopoverOpen, setGenderPopoverOpen] = useState(false)
    const [activityPopoverOpen, setActivityPopoverOpen] = useState(false)
    const [dietGoalPopoverOpen, setDietGoalPopoverOpen] = useState(false)

    const form = useForm<EstimateMacrosFormValues>({
        resolver: zodResolver(estimateMacrosFormSchema),
        defaultValues: {
            gender: 'male',
            weight: 70,
            height: 180,
            age: 20,
            activityLevel: 2,
            dietGoal: 'Maintenance',
        },
    })
    async function onSubmit(data: EstimateMacrosFormValues) {
        setIsSubmitting(true)
        try {
            await saveUserMacrosEstimate({
                gender: data.gender,
                weight: data.weight,
                height: data.height,
                age: data.age,
                activityLevel: data.activityLevel as 0 | 1 | 2 | 3 | 4,
                dietGoal: data.dietGoal,
            })
            router.push('/dashboard')
        } catch (error) {
            console.error('Error saving macros:', error)
        }
    }

    // Function to handle number input changes
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
        if (e.target.value === '' || e.target.value === '-') {
            e.target.value = ''
            onChange(0)
            return
        }
        if (e.target.value.length > 1 && e.target.value.startsWith('0') && !e.target.value.startsWith('0.')) {
            e.target.value = e.target.value.replace(/^0+/, '')
        }
        onChange(Number(e.target.value))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 p-6 bg-foreground rounded-lg border border-border shadow-sm max-w-2xl mx-auto"
        >
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-2xl font-bold text-accent"
                >
                    Let's estimate your macros
                </motion.h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Gender</FormLabel>
                                    <Popover open={genderPopoverOpen} onOpenChange={setGenderPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        'w-full justify-between bg-foreground text-muted',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value === 'male' ? 'Male' : 'Female'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="grid grid-cols-1 gap-1 p-1">
                                                {['male', 'female'].map((gender) => (
                                                    <Button
                                                        key={gender}
                                                        variant="ghost"
                                                        className="justify-start"
                                                        onClick={() => {
                                                            form.setValue('gender', gender as 'male' | 'female')
                                                            setGenderPopoverOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                gender === field.value ? 'opacity-100' : 'opacity-0',
                                                            )}
                                                        />
                                                        {gender === 'male' ? 'Male' : 'Female'}
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Age</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Height (cm)</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dietGoal"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="text-accent">Diet Goal</FormLabel>
                                    <Popover open={dietGoalPopoverOpen} onOpenChange={setDietGoalPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between bg-foreground text-muted"
                                                >
                                                    {dietGoalArray.find((goal) => goal.value === field.value)?.label ||
                                                        'Select diet goal'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="grid grid-cols-1 gap-1 p-1">
                                                {dietGoalArray.map((goal) => (
                                                    <Button
                                                        key={goal.value}
                                                        variant="ghost"
                                                        className="justify-start"
                                                        onClick={() => {
                                                            form.setValue('dietGoal', goal.value)
                                                            setDietGoalPopoverOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                goal.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {goal.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        What are you doing (or want to do) with your diet.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="activityLevel"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel className="text-accent">Activity Level</FormLabel>
                                    <Popover open={activityPopoverOpen} onOpenChange={setActivityPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between bg-foreground text-muted"
                                                >
                                                    {activityLevels.find((level) => level.value === field.value)
                                                        ?.label || 'Select activity level'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <div className="grid grid-cols-1 gap-1 p-1">
                                                {activityLevels.map((level) => (
                                                    <Button
                                                        key={level.value}
                                                        variant="ghost"
                                                        className="justify-start"
                                                        onClick={() => {
                                                            form.setValue('activityLevel', level.value)
                                                            setActivityPopoverOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                level.value === field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                        {level.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Choose the activity level that best describes your typical week.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Cooking...' : 'Calculate and Save'}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    )
}

export default WelcomeMacrosEstimate
