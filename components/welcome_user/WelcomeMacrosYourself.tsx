'use client'

import { saveUserMacrosYourself } from '@/lib/actions'
import { yourselfMacrosFormSchema, YourselfMacrosFormValues } from '@/lib/macros-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { dietGoalArray } from '@/lib/macros-utils'
import { Input } from '../ui/input'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleInputNumberChange } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'

const WelcomeMacrosYourself = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dietGoalPopoverOpen, setDietGoalPopoverOpen] = useState(false)
    const form = useForm<YourselfMacrosFormValues>({
        resolver: zodResolver(yourselfMacrosFormSchema),
        defaultValues: {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fat: 50,
            dietGoal: 'Maintenance',
        },
    })

    async function onSubmit(data: YourselfMacrosFormValues) {
        try {
            setIsSubmitting(true)
            await saveUserMacrosYourself({
                calories: data.calories,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
                dietGoal: data.dietGoal,
            })
        } catch (error) {
            console.error(error)
        }
        router.push('/dashboard')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 p-6 bg-foreground rounded-lg border shadow-sm max-w-2xl mx-auto"
        >
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-2xl flex font-bold text-accent"
                >
                    <button
                        className="rounded-2xl hover:cursor-pointer hover:scale-120 transition-all duration-200"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={32} className="text-accent" />
                    </button>
                    <p className="text-2xl md:text-3xl font-bold text-accent text-center">Set your macros</p>
                    <div className="w-8" />
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-muted-foreground"
                >
                    Enter your details to calculate your recommended daily calories and macros.
                </motion.p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="calories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Calories</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleInputNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="protein"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Protein</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleInputNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="carbs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Carbs</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleInputNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-accent">Fat</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="text-muted"
                                            type="number"
                                            {...field}
                                            onChange={(e) => handleInputNumberChange(e, field.onChange)}
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Macros'}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    )
}

export default WelcomeMacrosYourself
