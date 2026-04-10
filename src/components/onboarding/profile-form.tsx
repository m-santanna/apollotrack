'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useProfile } from '@/hooks/use-profile'
import { APIKeySettings } from '@/components/settings/api-key-settings'
import {
    calculateMacroTargets,
    calculateTDEE,
    formatActivityMultiplier,
    formatCalorieAdjustment,
} from '@/lib/macros'
import type { HeightUnit, Sex, UserProfile, WeightUnit } from '@/lib/types'
import {
    Target,
    Dumbbell,
    Scale,
    Ruler,
    User,
    Activity,
    ChevronRight,
    ChevronLeft,
    Check,
    Key,
} from 'lucide-react'

const STEPS = [
    'Personal Info',
    'Body Metrics',
    'Activity & Goal',
    'API Keys',
    'Review',
] as const

export function ProfileForm() {
    const router = useRouter()
    const { createProfile } = useProfile()
    const [step, setStep] = useState(0)

    const [sex, setSex] = useState<Sex>('male')
    const [age, setAge] = useState<number>(25)
    const [weight, setWeight] = useState<number>(70)
    const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')
    const [height, setHeight] = useState<number>(175)
    const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm')
    const [activityMultiplier, setActivityMultiplier] = useState(1.55)
    const [calorieAdjustment, setCalorieAdjustment] = useState(0)

    const buildProfile = (): UserProfile => ({
        sex,
        age,
        weight,
        weightUnit,
        height,
        heightUnit,
        activityMultiplier,
        calorieAdjustment,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    const previewProfile = buildProfile()
    const previewTargets = calculateMacroTargets(previewProfile)
    const previewTDEE = calculateTDEE(previewProfile)

    const handleFinish = () => {
        createProfile(buildProfile())
        router.push('/')
    }

    const canProceed = () => {
        if (step === 0) return age > 0 && age < 120
        if (step === 1) return weight > 0 && height > 0
        return true
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg">
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                    i <= step
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {i < step ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-6 h-0.5 ${i < step ? 'bg-primary' : 'bg-muted'}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {STEPS[step]}
                        </CardTitle>
                        <CardDescription>
                            {step === 0 &&
                                'Tell us about yourself to calculate your nutritional needs.'}
                            {step === 1 &&
                                'We need your body metrics for accurate calorie calculations.'}
                            {step === 2 &&
                                'Set your activity level and calorie goal.'}
                            {step === 3 &&
                                'Add your AI API keys to enable food photo analysis.'}
                            {step === 4 &&
                                'Review your profile and daily targets.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Personal Info */}
                        {step === 0 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> Sex
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant={
                                                sex === 'male'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="h-11"
                                            onClick={() => setSex('male')}
                                        >
                                            Male
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={
                                                sex === 'female'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="h-11"
                                            onClick={() => setSex('female')}
                                        >
                                            Female
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        min={10}
                                        max={120}
                                        value={age}
                                        onChange={(e) =>
                                            setAge(Number(e.target.value))
                                        }
                                        placeholder="Enter your age"
                                        className="h-10"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Body Metrics */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4" /> Height
                                    </Label>
                                    <div className="flex gap-3">
                                        <Input
                                            type="number"
                                            min={50}
                                            max={300}
                                            step={0.1}
                                            value={height}
                                            onChange={(e) =>
                                                setHeight(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="flex-1 h-10"
                                        />
                                        <Select
                                            value={heightUnit}
                                            onValueChange={(v) =>
                                                setHeightUnit(v as HeightUnit)
                                            }
                                        >
                                            <SelectTrigger className="w-24 h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cm">
                                                    cm
                                                </SelectItem>
                                                <SelectItem value="ft">
                                                    ft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <Scale className="w-4 h-4" /> Weight
                                    </Label>
                                    <div className="flex gap-3">
                                        <Input
                                            type="number"
                                            min={20}
                                            max={500}
                                            step={0.1}
                                            value={weight}
                                            onChange={(e) =>
                                                setWeight(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="flex-1 h-10"
                                        />
                                        <Select
                                            value={weightUnit}
                                            onValueChange={(v) =>
                                                setWeightUnit(v as WeightUnit)
                                            }
                                        >
                                            <SelectTrigger className="w-24 h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="kg">
                                                    kg
                                                </SelectItem>
                                                <SelectItem value="lbs">
                                                    lbs
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Activity & Goal */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <Activity className="w-4 h-4" />{' '}
                                        Activity Level
                                    </Label>
                                    <div className="px-1">
                                        <Slider
                                            value={[activityMultiplier]}
                                            onValueChange={(v) => {
                                                const val = Array.isArray(v)
                                                    ? v[0]
                                                    : v
                                                setActivityMultiplier(
                                                    Math.round(val * 100) / 100,
                                                )
                                            }}
                                            min={1.2}
                                            max={1.9}
                                            step={0.05}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Sedentary</span>
                                        <span className="font-medium text-sm text-foreground">
                                            {activityMultiplier.toFixed(2)}x
                                            &middot;{' '}
                                            {formatActivityMultiplier(
                                                activityMultiplier,
                                            )}
                                        </span>
                                        <span>Very Active</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <Target className="w-4 h-4" /> Calorie
                                        Goal
                                    </Label>
                                    <div className="px-1">
                                        <Slider
                                            value={[calorieAdjustment]}
                                            onValueChange={(v) => {
                                                const val = Array.isArray(v)
                                                    ? v[0]
                                                    : v
                                                setCalorieAdjustment(val)
                                            }}
                                            min={-750}
                                            max={500}
                                            step={50}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Deficit</span>
                                        <span className="font-medium text-sm text-foreground">
                                            {formatCalorieAdjustment(
                                                calorieAdjustment,
                                            )}
                                        </span>
                                        <span>Surplus</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {calorieAdjustment < -400
                                            ? 'Aggressive deficit. Higher protein to preserve muscle. May feel fatigued.'
                                            : calorieAdjustment < 0
                                              ? 'Steady fat loss. Sustainable for most people.'
                                              : calorieAdjustment === 0
                                                ? 'Maintain current weight. Good for recomposition.'
                                                : calorieAdjustment <= 250
                                                  ? 'Slow, lean muscle gain with minimal fat.'
                                                  : 'Faster muscle gain. Expect some fat gain.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 4: API Keys */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                                    <Key className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>
                                        You need an API key to use the
                                        application. You can skip this step and
                                        add keys later in Settings.
                                    </span>
                                </div>
                                <APIKeySettings />
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Sex
                                        </div>
                                        <div className="font-medium capitalize">
                                            {sex}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Age
                                        </div>
                                        <div className="font-medium">
                                            {age} years
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Weight
                                        </div>
                                        <div className="font-medium">
                                            {weight} {weightUnit}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Height
                                        </div>
                                        <div className="font-medium">
                                            {height} {heightUnit}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Activity
                                        </div>
                                        <div className="font-medium">
                                            {activityMultiplier.toFixed(2)}x
                                            &middot;{' '}
                                            {formatActivityMultiplier(
                                                activityMultiplier,
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-muted-foreground">
                                            Goal
                                        </div>
                                        <div className="font-medium">
                                            {formatCalorieAdjustment(
                                                calorieAdjustment,
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4" /> Your
                                        Daily Targets
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {previewTargets.calories}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Calories
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {previewTargets.protein}g
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Protein
                                            </div>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {previewTargets.carbs}g
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Carbs
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {previewTargets.fat}g
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Fat
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center text-xs text-muted-foreground mt-2">
                                        TDEE: {previewTDEE} kcal/day
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-8">
                            <Button
                                variant="outline"
                                className="h-10 px-5"
                                onClick={() => setStep((s) => s - 1)}
                                disabled={step === 0}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                            {step < STEPS.length - 1 ? (
                                <Button
                                    className="h-10 px-5"
                                    onClick={() => setStep((s) => s + 1)}
                                    disabled={!canProceed()}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            ) : (
                                <Button
                                    className="h-10 px-5"
                                    onClick={handleFinish}
                                >
                                    <Check className="w-4 h-4 mr-1" /> Start
                                    Tracking
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
