'use client'

import { saveUserMacrosYourself } from '@/lib/actions'
import { yourselfMacrosFormSchema, YourselfMacrosFormValues } from '@/lib/macros-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const WelcomeMacrosYourself = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<YourselfMacrosFormValues>({
        resolver: zodResolver(yourselfMacrosFormSchema),
        defaultValues: {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fat: 50,
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
            })
        } catch (error) {
            console.error(error)
        }
        router.push('/dashboard')
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
            className="space-y-6 p-6 bg-foreground rounded-lg border shadow-sm max-w-2xl mx-auto"
        >
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-2xl font-bold text-accent"
                >
                    Set Your Macros
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
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
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
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
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
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
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
                                            onChange={(e) => handleNumberChange(e, field.onChange)}
                                        />
                                    </FormControl>
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
