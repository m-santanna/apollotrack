"use client";

import { useState } from "react";
import type { FoodEntry, MealType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Trash2, Pencil, Coffee, Sun, Moon, Cookie, Save } from "lucide-react";

const MEAL_CONFIG: Record<MealType, { label: string; icon: React.ReactNode }> =
  {
    breakfast: { label: "Breakfast", icon: <Coffee className="w-4 h-4" /> },
    lunch: { label: "Lunch", icon: <Sun className="w-4 h-4" /> },
    dinner: { label: "Dinner", icon: <Moon className="w-4 h-4" /> },
    snack: { label: "Snack", icon: <Cookie className="w-4 h-4" /> },
  };

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manual",
  ai: "AI",
};

interface MealListProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
  onEdit?: (id: string, updates: Partial<FoodEntry>) => void;
}

export function MealList({ entries, onRemove, onEdit }: MealListProps) {
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: "",
  });

  const groupedEntries = mealTypes.map((type) => ({
    type,
    ...MEAL_CONFIG[type],
    entries: entries.filter((e) => e.mealType === type),
  }));

  const nonEmptyMeals = groupedEntries.filter((m) => m.entries.length > 0);

  const openEdit = (entry: FoodEntry) => {
    setEditingEntry(entry);
    setEditForm({
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      servingSize: entry.servingSize || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingEntry || !onEdit) return;
    onEdit(editingEntry.id, {
      name: editForm.name,
      calories: editForm.calories,
      protein: editForm.protein,
      carbs: editForm.carbs,
      fat: editForm.fat,
      servingSize: editForm.servingSize || undefined,
    });
    setEditingEntry(null);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No food logged today.</p>
        <p className="text-sm mt-1">Tap the + button to add your first meal.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {nonEmptyMeals.map((meal) => (
          <Card key={meal.type} className="border-border/50">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {meal.icon}
                {meal.label}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {meal.entries.reduce((sum, e) => sum + e.calories, 0)} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-0">
              <div className="space-y-2">
                {meal.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {entry.name}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {entry.calories} kcal &middot; Carbs {entry.carbs}g
                        &middot; Protein {entry.protein}g &middot; Fat{" "}
                        {entry.fat}g
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(entry)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(entry.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Sheet */}
      <Sheet
        open={editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null);
        }}
      >
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Entry</SheetTitle>
            <SheetDescription>
              Update the nutritional information for this item.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Calories</Label>
                <Input
                  type="number"
                  value={editForm.calories}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      calories: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Protein (g)</Label>
                <Input
                  type="number"
                  value={editForm.protein}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      protein: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Carbs (g)</Label>
                <Input
                  type="number"
                  value={editForm.carbs}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      carbs: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fat (g)</Label>
                <Input
                  type="number"
                  value={editForm.fat}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      fat: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Serving Size</Label>
              <Input
                value={editForm.servingSize}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, servingSize: e.target.value }))
                }
                placeholder="e.g. 1 cup, 200g"
              />
            </div>
          </div>

          <SheetFooter>
            <Button onClick={handleSaveEdit} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
