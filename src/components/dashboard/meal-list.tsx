"use client";

import { useState } from "react";
import type { FoodEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { Trash2, Pencil, Save, Bookmark } from "lucide-react";

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface MealListProps {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
  onEdit?: (id: string, updates: Partial<FoodEntry>) => void;
  onSaveFavorite?: (entry: FoodEntry) => void;
}

export function MealList({ entries, onRemove, onEdit, onSaveFavorite }: MealListProps) {
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    servingSize: "",
  });

  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

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
      <div className="space-y-2">
        {sorted.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between py-2 px-2 rounded-md bg-muted/30"
          >
            <span className="text-xs text-muted-foreground shrink-0 w-14 text-right">
              {formatTime(entry.timestamp)}
            </span>
            <div className="flex-1 min-w-0 ml-4">
              <span className="font-medium text-sm truncate block">{entry.name}</span>
              <div className="text-xs text-muted-foreground mt-0.5">
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {entry.calories} kcal
                </span>
                {" · "}C {entry.carbs}g · P {entry.protein}g · F {entry.fat}g
              </div>
            </div>
            <div className="flex items-center gap-0.5 ml-2 shrink-0">
              {onSaveFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => onSaveFavorite(entry)}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </Button>
              )}
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

      {/* Edit Sheet */}
      <Sheet
        open={editingEntry !== null}
        onOpenChange={(open) => { if (!open) setEditingEntry(null); }}
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
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Calories</Label>
                <Input
                  type="number"
                  value={editForm.calories}
                  onChange={(e) => setEditForm((f) => ({ ...f, calories: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Protein (g)</Label>
                <Input
                  type="number"
                  value={editForm.protein}
                  onChange={(e) => setEditForm((f) => ({ ...f, protein: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Carbs (g)</Label>
                <Input
                  type="number"
                  value={editForm.carbs}
                  onChange={(e) => setEditForm((f) => ({ ...f, carbs: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fat (g)</Label>
                <Input
                  type="number"
                  value={editForm.fat}
                  onChange={(e) => setEditForm((f) => ({ ...f, fat: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Serving Size</Label>
              <Input
                value={editForm.servingSize}
                onChange={(e) => setEditForm((f) => ({ ...f, servingSize: e.target.value }))}
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
