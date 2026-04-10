"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { AIAnalysisResult, AIFoodItem, FoodEntry } from "@/lib/types";
import {
  Sparkles,
  AlertTriangle,
  Edit2,
  Check,
  Plus,
  Bookmark,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface ReviewProps {
  result: AIAnalysisResult;
  onConfirm: (items: Omit<FoodEntry, "id" | "timestamp">[]) => void;
  onSaveAsPack: (name: string, foods: AIFoodItem[]) => void;
  onRefine: (refinementText: string) => Promise<void>;
  isRefining: boolean;
}

export function Review({ result, onConfirm, onSaveAsPack, onRefine, isRefining }: ReviewProps) {
  const [editedItems, setEditedItems] = useState<AIFoodItem[]>(result.foods);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [refinementText, setRefinementText] = useState("");
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [mealName, setMealName] = useState("");
  const [savedMealName, setSavedMealName] = useState<string | null>(null);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addGroupName, setAddGroupName] = useState("");

  // Keep items in sync when result changes (after refinement)
  // We reset edits when a new result comes in
  const [lastResultFoods, setLastResultFoods] = useState(result.foods);
  if (result.foods !== lastResultFoods) {
    setLastResultFoods(result.foods);
    setEditedItems(result.foods);
    setEditingIndex(null);
    setSavedMealName(null);
    setNotesExpanded(false);
  }

  const confidenceColor = {
    high: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const totals = editedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const handleEditField = (index: number, field: keyof AIFoodItem, value: string) => {
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

  const handleDelete = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleConfirm = () => {
    if (savedMealName) {
      onConfirm([{
        name: savedMealName,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        source: "ai" as const,
      }]);
    } else {
      // Ask the user if they want to group before committing
      setAddGroupName("");
      setAddDialogOpen(true);
    }
  };

  const handleAddIndividually = () => {
    setAddDialogOpen(false);
    onConfirm(
      editedItems.map((item) => ({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        servingSize: item.servingSize,
        source: "ai" as const,
      })),
    );
  };

  const handleAddAsGroup = () => {
    if (!addGroupName.trim()) return;
    setAddDialogOpen(false);
    onConfirm([{
      name: addGroupName.trim(),
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      source: "ai" as const,
    }]);
  };

  const openMealDialog = () => {
    setMealName(editedItems.length === 1 ? editedItems[0].name : "");
    setMealDialogOpen(true);
  };

  const handleSaveMeal = () => {
    if (!mealName.trim()) return;
    onSaveAsPack(mealName.trim(), editedItems);
    setSavedMealName(mealName.trim());
    setMealDialogOpen(false);
  };

  const handleRefine = async () => {
    if (!refinementText.trim()) return;
    await onRefine(refinementText.trim());
    setRefinementText("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-medium">Review Results</span>
        <Badge className={confidenceColor[result.confidence]}>
          {result.confidence} confidence
        </Badge>
      </div>

      {result.notes && (
        <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-foreground/70">Notes</span>
          </div>
          <p className={notesExpanded ? undefined : "line-clamp-2"}>
            {result.notes}
          </p>
          {result.notes.length > 120 && (
            <button
              className="text-xs text-primary underline-offset-2 hover:underline"
              onClick={() => setNotesExpanded((v) => !v)}
            >
              {notesExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Food Items */}
      <div className="space-y-2">
        {editedItems.map((item, index) => {
          const isEditing = editingIndex === index;
          return (
            <Card key={index}>
              <CardContent className="py-3 px-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={item.name}
                      onChange={(e) => handleEditField(index, "name", e.target.value)}
                      placeholder="Food name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {(["calories", "protein", "carbs", "fat"] as const).map((field) => (
                        <div key={field}>
                          <label className="text-xs text-muted-foreground capitalize">
                            {field}{field !== "calories" ? " (g)" : " (kcal)"}
                          </label>
                          <Input
                            type="number"
                            value={item[field]}
                            onChange={(e) => handleEditField(index, field, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <Input
                      value={item.servingSize}
                      onChange={(e) => handleEditField(index, "servingSize", e.target.value)}
                      placeholder="Serving size"
                    />
                    <Button size="sm" onClick={() => setEditingIndex(null)}>
                      <Check className="w-3 h-3 mr-1" /> Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.servingSize}</div>
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
                        onClick={() => setEditingIndex(index)}
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
                )}
              </CardContent>
            </Card>
          );
        })}
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={openMealDialog}>
          <Bookmark className="w-4 h-4 mr-2" />
          {savedMealName ? "Rename Meal" : "Save Meal"}
        </Button>
        <Button className="flex-1" onClick={handleConfirm}>
          <Plus className="w-4 h-4 mr-2" />
          {savedMealName ? `Add "${savedMealName}"` : "Add to Log"}
        </Button>
      </div>
      {savedMealName && (
        <p className="text-xs text-muted-foreground text-center -mt-2">
          Will be logged as a single entry · {totals.calories} kcal
        </p>
      )}

      <Separator />

      {/* Refinement */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Not quite right?</p>
        <Textarea
          placeholder='e.g. "The chicken was 300g not 150g" or "I also had a side of rice"'
          value={refinementText}
          onChange={(e) => setRefinementText(e.target.value)}
          rows={2}
          className="resize-none text-sm"
          disabled={isRefining}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={handleRefine}
          disabled={!refinementText.trim() || isRefining}
        >
          {isRefining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Refining...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" /> Refine with AI
            </>
          )}
        </Button>
      </div>

      {/* Add to Log Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add to Log</DialogTitle>
            <DialogDescription>
              Add {editedItems.length} item{editedItems.length !== 1 ? "s" : ""} individually, or group them under a single name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <Input
              value={addGroupName}
              onChange={(e) => setAddGroupName(e.target.value)}
              placeholder="Group name (optional)"
              onKeyDown={(e) => { if (e.key === "Enter" && addGroupName.trim()) handleAddAsGroup(); }}
              autoFocus
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
              <span>{editedItems.length} item{editedItems.length !== 1 ? "s" : ""}</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">{totals.calories} kcal total</span>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={handleAddIndividually}>
              Add Individually
            </Button>
            <Button className="flex-1" onClick={handleAddAsGroup} disabled={!addGroupName.trim()}>
              Add as Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Meal Dialog */}
      <Dialog open={mealDialogOpen} onOpenChange={setMealDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Save Meal
            </DialogTitle>
            <DialogDescription>
              Save all {editedItems.length} item{editedItems.length !== 1 ? "s" : ""} as a
              reusable favorite meal.
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
              {editedItems.map((item, i) => (
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
