"use client";

import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDailyLog } from "@/hooks/use-daily-log";
import { useProfile } from "@/hooks/use-profile";
import { formatDate, getItem, setItem } from "@/lib/storage";
import { STORAGE_KEYS, MODEL_REGISTRY } from "@/lib/types";
import type { AIAnalysisResult, FoodEntry, MealType } from "@/lib/types";
import { PhotoCapture } from "@/components/food-log/photo-capture";
import { AIResult } from "@/components/food-log/ai-result";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const MEAL_OPTIONS: {
  value: MealType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "breakfast",
    label: "Breakfast",
    icon: <Coffee className="w-4 h-4" />,
  },
  { value: "lunch", label: "Lunch", icon: <Sun className="w-4 h-4" /> },
  { value: "dinner", label: "Dinner", icon: <Moon className="w-4 h-4" /> },
  { value: "snack", label: "Snack", icon: <Cookie className="w-4 h-4" /> },
];

function LogPageContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") ?? formatDate(new Date());
  const date = new Date(dateParam + "T00:00:00");
  const { addEntry } = useDailyLog(date);
  const { profile } = useProfile();

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [textPrompt, setTextPrompt] = useState("");
  const [mealType, setMealType] = useState<MealType>("snack");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Derive available models from the profile's provider list (no server fetch)
  const availableModels = useMemo(() => {
    const providers = profile?.providers ?? [];
    return MODEL_REGISTRY.filter((m) => providers.includes(m.provider));
  }, [profile?.providers]);

  // Load saved model preference, auto-select if needed
  useEffect(() => {
    const storedModel = getItem<string>(STORAGE_KEYS.PREFERRED_MODEL);
    if (storedModel && availableModels.some((m) => m.id === storedModel)) {
      setSelectedModel(storedModel);
    } else if (availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    } else {
      setSelectedModel("");
    }
  }, [availableModels]);

  const handleModelChange = useCallback((modelId: string | null) => {
    if (!modelId) return;
    setSelectedModel(modelId);
    setItem(STORAGE_KEYS.PREFERRED_MODEL, modelId);
  }, []);

  const handleAnalyze = useCallback(async () => {
    const hasImages = images.length > 0;
    const hasText = textPrompt.trim().length > 0;

    if (!hasImages && !hasText) {
      toast.error("Add at least one photo or enter a text description.");
      return;
    }

    if (!selectedModel) {
      toast.error("Please select an AI model.");
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          images: hasImages ? images : undefined,
          text: hasText ? textPrompt.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAiResult(data);
      toast.success("Analysis complete!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze";
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [images, textPrompt, selectedModel]);

  const handleAIAddItem = useCallback(
    (item: Omit<FoodEntry, "id" | "timestamp">) => {
      addEntry(item);
      toast.success(`Added ${item.name}`);
    },
    [addEntry],
  );

  const handleAIAddAll = useCallback(
    (items: Omit<FoodEntry, "id" | "timestamp">[]) => {
      items.forEach((item) => addEntry(item));
      toast.success(`Added ${items.length} items`);
    },
    [addEntry],
  );

  const canAnalyze =
    (images.length > 0 || textPrompt.trim().length > 0) &&
    selectedModel &&
    !isAnalyzing;

  const selectedModelEntry = MODEL_REGISTRY.find((m) => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Meal Type Selector */}
        <div className="grid grid-cols-4 gap-2">
          {MEAL_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={mealType === opt.value ? "default" : "outline"}
              className="flex-col gap-1 h-auto py-2.5"
              onClick={() => setMealType(opt.value)}
            >
              {opt.icon}
              <span className="text-[10px]">{opt.label}</span>
            </Button>
          ))}
        </div>

        {/* Model Selector */}
        <Card>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Label className="text-base">Model</Label>
              {availableModels.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No API keys configured. Add your keys in{" "}
                  <Link href="/settings" className="text-primary underline">
                    Settings
                  </Link>{" "}
                  to use AI analysis.
                </p>
              ) : (
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    {selectedModelEntry?.label ?? "Select model"}
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Text Prompt Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Context</CardTitle>
            <CardDescription>
              Describe what you ate. The more precise with servings the better.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder='e.g. "Two scoops of whey protein with 200g of oat milk and a banana"'
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              rows={3}
              className="resize-none text-sm"
              disabled={isAnalyzing}
            />
          </CardContent>
        </Card>

        {/* Photos Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Photos</CardTitle>
            <CardDescription>
              Add up to 5 photos of your food or nutrition labels, if you think
              that will help the AI.
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

        {/* Analyze Button */}
        <Button
          className="w-full h-12 text-base flex items-center gap-1"
          onClick={handleAnalyze}
          disabled={!canAnalyze}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Analyze with AI
            </>
          )}
        </Button>

        {/* AI Results */}
        {aiResult && (
          <Card>
            <CardContent className="pt-6">
              <AIResult
                result={aiResult}
                onAddItem={handleAIAddItem}
                onAddAll={handleAIAddAll}
                mealType={mealType}
                source="ai"
              />
            </CardContent>
          </Card>
        )}

        {/* Spacer at bottom */}
        <div className="h-8" />
      </main>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <LogPageContent />
    </Suspense>
  );
}
