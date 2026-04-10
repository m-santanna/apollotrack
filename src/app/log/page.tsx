'use client'

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDailyLog } from '@/hooks/use-daily-log'
import {
    formatDate,
    getSavedMeals,
    deleteSavedMeal,
    saveNewMeal,
    updateSavedMeal,
} from '@/lib/storage'
import type {
    AIAnalysisResult,
    AIFoodItem,
    FoodEntry,
    SavedMeal,
} from '@/lib/types'
import { PhotoCapture } from '@/components/food-log/photo-capture'
import { Review } from '@/components/food-log/review'
import { ManualEntry } from '@/components/food-log/manual-entry'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet'
import {
    ArrowLeft,
    Sparkles,
    Loader2,
    Bookmark,
    Trash2,
    Pencil,
    Check,
    Edit2,
    Plus,
    PenLine,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function LogPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dateParam = searchParams.get('date') ?? formatDate(new Date())
    const date = new Date(dateParam + 'T00:00:00')
    const { addEntry } = useDailyLog(date)

    const [images, setImages] = useState<string[]>([])
    const [textPrompt, setTextPrompt] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isRefining, setIsRefining] = useState(false)
    const [reviewResult, setReviewResult] = useState<AIAnalysisResult | null>(
        null,
    )
    const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
    const [editingMeal, setEditingMeal] = useState<SavedMeal | null>(null)
    const [editName, setEditName] = useState('')
    const [editFoods, setEditFoods] = useState<AIFoodItem[]>([])
    const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(
        null,
    )

    useEffect(() => {
        setSavedMeals(getSavedMeals())
    }, [])

    const handleAnalyze = useCallback(async () => {
        const hasImages = images.length > 0
        const hasText = textPrompt.trim().length > 0

        if (!hasImages && !hasText) {
            toast.error('Add at least one photo or enter a text description.')
            return
        }

        setIsAnalyzing(true)
        setReviewResult(null)

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    images: hasImages ? images : undefined,
                    text: hasText ? textPrompt.trim() : undefined,
                }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Analysis failed')

            setReviewResult(data)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to analyze'
            toast.error(message)
        } finally {
            setIsAnalyzing(false)
        }
    }, [images, textPrompt])

    const handleRefine = useCallback(
        async (refinementText: string) => {
            if (!reviewResult) return
            setIsRefining(true)
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: refinementText,
                        previousResult: reviewResult,
                    }),
                })
                const data = await response.json()
                if (!response.ok)
                    throw new Error(data.error || 'Refinement failed')
                setReviewResult(data)
                toast.success('Results updated!')
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : 'Failed to refine'
                toast.error(message)
            } finally {
                setIsRefining(false)
            }
        },
        [reviewResult],
    )

    const handleConfirm = useCallback(
        (items: Omit<FoodEntry, 'id' | 'timestamp'>[]) => {
            items.forEach((item) => addEntry(item))
            toast.success(
                `Added ${items.length} item${items.length !== 1 ? 's' : ''} to your log`,
            )
            router.push('/')
        },
        [addEntry, router],
    )

    const handleSaveAsPack = useCallback(
        (name: string, foods: AIFoodItem[]) => {
            saveNewMeal(name, foods)
            setSavedMeals(getSavedMeals())
            toast.success(`"${name}" saved to favorites!`)
        },
        [],
    )

    const handleUseSavedMeal = useCallback(
        (meal: SavedMeal) => {
            const totals = meal.foods.reduce(
                (acc, f) => ({
                    calories: acc.calories + f.calories,
                    protein: acc.protein + f.protein,
                    carbs: acc.carbs + f.carbs,
                    fat: acc.fat + f.fat,
                }),
                { calories: 0, protein: 0, carbs: 0, fat: 0 },
            )
            addEntry({ name: meal.name, ...totals, source: 'ai' })
            toast.success(`Added "${meal.name}" to your log`)
            router.push('/')
        },
        [addEntry, router],
    )

    const handleDeleteSavedMeal = useCallback((id: string) => {
        deleteSavedMeal(id)
        setSavedMeals(getSavedMeals())
    }, [])

    const openEditMeal = useCallback((meal: SavedMeal) => {
        setEditingMeal(meal)
        setEditName(meal.name)
        setEditFoods(meal.foods.map((f) => ({ ...f })))
        setEditingFoodIndex(null)
    }, [])

    const handleSaveEditMeal = useCallback(() => {
        if (!editingMeal || !editName.trim()) return
        updateSavedMeal(editingMeal.id, {
            name: editName.trim(),
            foods: editFoods,
        })
        setSavedMeals(getSavedMeals())
        setEditingMeal(null)
    }, [editingMeal, editName, editFoods])

    const handleEditFoodField = useCallback(
        (index: number, field: keyof AIFoodItem, value: string) => {
            setEditFoods((prev) => {
                const updated = [...prev]
                if (field === 'name' || field === 'servingSize') {
                    updated[index] = { ...updated[index], [field]: value }
                } else {
                    updated[index] = {
                        ...updated[index],
                        [field]: Number(value) || 0,
                    }
                }
                return updated
            })
        },
        [],
    )

    const canAnalyze =
        (images.length > 0 || textPrompt.trim().length > 0) && !isAnalyzing

    const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold">Log Food</h1>
                        <p className="text-xs text-muted-foreground">
                            {displayDate}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
                <Tabs defaultValue="analyze">
                    <TabsList className="w-full">
                        <TabsTrigger value="analyze" className="flex-1">
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Analyze
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex-1">
                            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                            Favorites
                            {savedMeals.length > 0 && (
                                <span className="ml-1.5 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 leading-none">
                                    {savedMeals.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="create" className="flex-1">
                            <PenLine className="w-3.5 h-3.5 mr-1.5" />
                            Create
                        </TabsTrigger>
                    </TabsList>

                    {/* Analyze Tab */}
                    <TabsContent value="analyze" className="space-y-4 mt-4">
                        {/* Input section — hidden while reviewing */}
                        {!reviewResult && (
                            <>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">
                                            Context
                                        </CardTitle>
                                        <CardDescription>
                                            Describe what you ate. The more
                                            precise with servings the better.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            placeholder='e.g. "Two scoops of whey protein with 200g of oat milk and a banana"'
                                            value={textPrompt}
                                            onChange={(e) =>
                                                setTextPrompt(e.target.value)
                                            }
                                            rows={3}
                                            className="resize-none text-sm"
                                            disabled={isAnalyzing}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">
                                            Photos
                                        </CardTitle>
                                        <CardDescription>
                                            Add up to 5 photos of your food or
                                            nutrition labels.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PhotoCapture
                                            images={images}
                                            onImagesChange={setImages}
                                            disabled={isAnalyzing}
                                        />
                                    </CardContent>
                                </Card>

                                <Button
                                    className="w-full h-12 text-base"
                                    onClick={handleAnalyze}
                                    disabled={!canAnalyze}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{' '}
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />{' '}
                                            Analyze with AI
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        {/* Review section */}
                        {reviewResult && (
                            <>
                                <Card>
                                    <CardContent>
                                        <Review
                                            result={reviewResult}
                                            onConfirm={handleConfirm}
                                            onSaveAsPack={handleSaveAsPack}
                                            onRefine={handleRefine}
                                            isRefining={isRefining}
                                        />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </TabsContent>

                    {/* Favorites Tab */}
                    <TabsContent value="favorites" className="mt-4">
                        {savedMeals.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-40" />
                                <p className="text-sm font-medium">
                                    No favorites yet
                                </p>
                                <p className="text-xs mt-1">
                                    Tap the bookmark icon on any logged food, or
                                    save a meal from the review screen.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {savedMeals.map((meal) => {
                                    const totalCals = meal.foods.reduce(
                                        (sum, f) => sum + f.calories,
                                        0,
                                    )
                                    const totalProtein = meal.foods.reduce(
                                        (sum, f) => sum + f.protein,
                                        0,
                                    )
                                    return (
                                        <Card key={meal.id}>
                                            <CardContent className="py-3 px-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold truncate">
                                                            {meal.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                                                                {totalCals} kcal
                                                            </span>
                                                            <span className="mx-1">
                                                                ·
                                                            </span>
                                                            <span className="text-blue-600 dark:text-blue-400">
                                                                P {totalProtein}
                                                                g
                                                            </span>
                                                            <span className="mx-1">
                                                                ·
                                                            </span>
                                                            {meal.foods.length}{' '}
                                                            item
                                                            {meal.foods
                                                                .length !== 1
                                                                ? 's'
                                                                : ''}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            onClick={() =>
                                                                handleUseSavedMeal(
                                                                    meal,
                                                                )
                                                            }
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            onClick={() =>
                                                                openEditMeal(
                                                                    meal,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={() =>
                                                                handleDeleteSavedMeal(
                                                                    meal.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Create Tab */}
                    <TabsContent value="create" className="mt-4">
                        <ManualEntry
                            onConfirm={handleConfirm}
                            onSaveAsMeal={handleSaveAsPack}
                        />
                    </TabsContent>
                </Tabs>

                {/* Edit Saved Meal Sheet */}
                <Sheet
                    open={!!editingMeal}
                    onOpenChange={(open) => {
                        if (!open) setEditingMeal(null)
                    }}
                >
                    <SheetContent
                        side="bottom"
                        className="max-h-[90vh] overflow-y-auto"
                    >
                        <SheetHeader>
                            <SheetTitle>Edit Favorite</SheetTitle>
                        </SheetHeader>

                        <div className="px-4 space-y-4 pb-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label>Meal name</Label>
                                <Input
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    placeholder="e.g. Morning Protein Shake"
                                />
                            </div>

                            {/* Foods */}
                            <div className="space-y-2">
                                <Label>Foods</Label>
                                {editFoods.map((food, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border p-3 space-y-2"
                                    >
                                        {editingFoodIndex === index ? (
                                            <>
                                                <Input
                                                    value={food.name}
                                                    onChange={(e) =>
                                                        handleEditFoodField(
                                                            index,
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Food name"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    {(
                                                        [
                                                            'calories',
                                                            'protein',
                                                            'carbs',
                                                            'fat',
                                                        ] as const
                                                    ).map((field) => (
                                                        <div key={field}>
                                                            <label className="text-xs text-muted-foreground capitalize">
                                                                {field}
                                                                {field !==
                                                                'calories'
                                                                    ? ' (g)'
                                                                    : ' (kcal)'}
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    food[field]
                                                                }
                                                                onChange={(e) =>
                                                                    handleEditFoodField(
                                                                        index,
                                                                        field,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Input
                                                    value={food.servingSize}
                                                    onChange={(e) =>
                                                        handleEditFoodField(
                                                            index,
                                                            'servingSize',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Serving size"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setEditingFoodIndex(
                                                            null,
                                                        )
                                                    }
                                                >
                                                    <Check className="w-3 h-3 mr-1" />{' '}
                                                    Done
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">
                                                        {food.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5 space-x-2">
                                                        <span className="text-orange-600 dark:text-orange-400">
                                                            {food.calories} kcal
                                                        </span>
                                                        <span>
                                                            P {food.protein}g
                                                        </span>
                                                        <span>
                                                            C {food.carbs}g
                                                        </span>
                                                        <span>
                                                            F {food.fat}g
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0"
                                                    onClick={() =>
                                                        setEditingFoodIndex(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <SheetFooter className="px-4">
                            <Button
                                className="w-full"
                                onClick={handleSaveEditMeal}
                                disabled={!editName.trim()}
                            >
                                Save Changes
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <div className="h-8" />
            </main>
        </div>
    )
}

export default function LogPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="animate-pulse text-muted-foreground">
                        Loading...
                    </div>
                </div>
            }
        >
            <LogPageContent />
        </Suspense>
    )
}
