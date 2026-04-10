"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AIFoodItem, FoodEntry } from "@/lib/types";
import { Plus, Trash2, Edit2, Check, Bookmark } from "lucide-react";

interface ManualEntryProps {
  onConfirm: (items: Omit<FoodEntry, "id" | "timestamp">[]) => void;
  onSaveAsMeal: (name: string, foods: AIFoodItem[]) => void;
}

const emptyForm = (): AIFoodItem => ({
  name: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  servingSize: "",
});

export function ManualEntry({ onConfirm, onSaveAsMeal }: ManualEntryProps) {
  const [items, setItems] = useState<AIFoodItem[]>([]);
  const [form, setForm] = useState<AIFoodItem>(emptyForm());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [mealName, setMealName] = useState("");

  const setFormField = (field: keyof AIFoodItem, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "name" || field === "servingSize"
          ? value
          : Number(value) || 0,
    }));
  };

  const canAddForm =
    form.name.trim().length > 0 &&
    form.calories > 0 &&
    form.protein > 0 &&
    form.carbs > 0 &&
    form.fat > 0;

  const handleAdd = () => {
    if (!canAddForm) return;
    if (editingIndex !== null) {
      setItems((prev) =>
        prev.map((item, i) => (i === editingIndex ? { ...form } : item)),
      );
      setEditingIndex(null);
    } else {
      setItems((prev) => [...prev, { ...form }]);
    }
    setForm(emptyForm());
  };

  const handleEdit = (index: number) => {
    setForm({ ...items[index] });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setForm(emptyForm());
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setForm(emptyForm());
  };

  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const handleConfirm = () => {
    onConfirm(
      items.map((item) => ({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        servingSize: item.servingSize,
        source: "manual" as const,
      })),
    );
  };

  const openMealDialog = () => {
    setMealName(items.length === 1 ? items[0].name : "");
    setMealDialogOpen(true);
  };

  const handleSaveMeal = () => {
    if (!mealName.trim()) return;
    onSaveAsMeal(mealName.trim(), items);
    setMealDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Add food form */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Food name</Label>
            <Input
              placeholder='e.g. "Chicken breast"'
              value={form.name}
              onChange={(e) => setFormField("name", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["calories", "protein", "carbs", "fat"] as const).map((field) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground capitalize">
                  {field} {field !== "calories" ? "(g)" : "(kcal)"}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form[field] || ""}
                  onChange={(e) => setFormField(field, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Serving size <span className="opacity-50">(optional)</span>
            </Label>
            <Input
              placeholder='e.g. "150g" or "1 cup"'
              value={form.servingSize}
              onChange={(e) => setFormField("servingSize", e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!canAddForm}
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingIndex !== null ? "Update Food" : "Add Food"}
            </Button>
            {editingIndex !== null && (
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items list */}
      {items.length > 0 && (
        <>
          <div className="space-y-2">
            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      {item.servingSize && (
                        <div className="text-xs text-muted-foreground">{item.servingSize}</div>
                      )}
                      <div className="text-xs mt-1 space-x-2">
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                          {item.calories} kcal
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">P {item.protein}g</span>
                        <span className="text-green-600 dark:text-green-400">C {item.carbs}g</span>
                        <span className="text-purple-600 dark:text-purple-400">F {item.fat}g</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Totals */}
          <div className="flex items-center justify-between px-1 text-sm">
            <span className="font-medium text-muted-foreground">Total</span>
            <div className="space-x-3 text-xs">
              <span className="text-orange-600 dark:text-orange-400 font-semibold">
                {totals.calories} kcal
              </span>
              <span className="text-blue-600 dark:text-blue-400">P {totals.protein}g</span>
              <span className="text-green-600 dark:text-green-400">C {totals.carbs}g</span>
              <span className="text-purple-600 dark:text-purple-400">F {totals.fat}g</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={openMealDialog}>
              <Bookmark className="w-4 h-4 mr-2" />
              Save Meal
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              <Check className="w-4 h-4 mr-2" />
              Add to Log
            </Button>
          </div>
        </>
      )}

      {/* Save Meal Dialog */}
      <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Save Meal
            </DialogTitle>
            <DialogDescription>
              Save all {items.length} item{items.length !== 1 ? "s" : ""} as a reusable favorite meal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. Morning Protein Shake"
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveMeal(); }}
              autoFocus
            />
            <div className="mt-3 space-y-1">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.name}</span>
                  <span>{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMealDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMeal} disabled={!mealName.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
