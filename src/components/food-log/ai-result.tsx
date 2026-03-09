"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type {
  AIAnalysisResult,
  AIFoodItem,
  FoodEntry,
  MealType,
} from "@/lib/types";
import { Check, Edit2, Plus, Sparkles, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIResultProps {
  result: AIAnalysisResult;
  onAddItem: (item: Omit<FoodEntry, "id" | "timestamp">) => void;
  onAddAll: (items: Omit<FoodEntry, "id" | "timestamp">[]) => void;
  mealType: MealType;
  source: "ai" | "manual";
}

export function AIResult({
  result,
  onAddItem,
  onAddAll,
  mealType,
  source,
}: AIResultProps) {
  const router = useRouter();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItems, setEditedItems] = useState<AIFoodItem[]>(result.foods);
  const [addedIndices, setAddedIndices] = useState<Set<number>>(new Set());

  const confidenceColor = {
    high: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleEdit = (
    index: number,
    field: keyof AIFoodItem,
    value: string,
  ) => {
    setEditedItems((prev) => {
      const updated = [...prev];
      if (field === "name" || field === "servingSize") {
        updated[index] = { ...updated[index], [field]: value };
      } else {
        updated[index] = { ...updated[index], [field]: Number(value) || 0 };
      }
      return updated;
    });
  };

  const addSingleItem = (index: number) => {
    const item = editedItems[index];
    onAddItem({
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      servingSize: item.servingSize,
      mealType,
      source,
    });
    setAddedIndices((prev) => new Set(prev).add(index));
    if (allAdded) router.push("/");
  };

  const addAllItems = () => {
    const items = editedItems
      .filter((_, i) => !addedIndices.has(i))
      .map((item) => ({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        servingSize: item.servingSize,
        mealType,
        source,
      }));
    onAddAll(items);
    setAddedIndices(new Set(editedItems.map((_, i) => i)));
    router.push("/");
  };

  const allAdded = addedIndices.size === editedItems.length;

  return (
    <div className="space-y-4">
      {/* Confidence Badge */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI Analysis Result</span>
        <Badge className={confidenceColor[result.confidence]}>
          {result.confidence} confidence
        </Badge>
      </div>

      {result.notes && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {result.notes}
        </div>
      )}

      {/* Food Items */}
      <div className="space-y-3">
        {editedItems.map((item, index) => {
          const isEditing = editingIndex === index;
          const isAdded = addedIndices.has(index);

          return (
            <Card
              key={index}
              className={`transition-opacity ${isAdded ? "opacity-50" : ""}`}
            >
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        handleEdit(index, "name", e.target.value)
                      }
                      placeholder="Food name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Calories
                        </label>
                        <Input
                          type="number"
                          value={item.calories}
                          onChange={(e) =>
                            handleEdit(index, "calories", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Protein (g)
                        </label>
                        <Input
                          type="number"
                          value={item.protein}
                          onChange={(e) =>
                            handleEdit(index, "protein", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Carbs (g)
                        </label>
                        <Input
                          type="number"
                          value={item.carbs}
                          onChange={(e) =>
                            handleEdit(index, "carbs", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Fat (g)
                        </label>
                        <Input
                          type="number"
                          value={item.fat}
                          onChange={(e) =>
                            handleEdit(index, "fat", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Input
                      value={item.servingSize}
                      onChange={(e) =>
                        handleEdit(index, "servingSize", e.target.value)
                      }
                      placeholder="Serving size"
                    />
                    <Button size="sm" onClick={() => setEditingIndex(null)}>
                      <Check className="w-3 h-3 mr-1" /> Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.servingSize}
                      </div>
                      <div className="text-xs mt-1 space-x-2">
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                          {item.calories} kcal
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          P {item.protein}g
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          C {item.carbs}g
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">
                          F {item.fat}g
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingIndex(index)}
                        disabled={isAdded}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => addSingleItem(index)}
                        disabled={isAdded}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add All Button */}
      {!allAdded && editedItems.length > 1 && (
        <Button onClick={addAllItems} className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add All Items ({editedItems.length - addedIndices.size} remaining)
        </Button>
      )}

      {allAdded && (
        <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium py-2">
          All items added to your log!
        </div>
      )}
    </div>
  );
}
