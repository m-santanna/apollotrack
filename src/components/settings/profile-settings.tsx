"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  calculateMacroTargets,
  calculateTDEE,
  formatActivityMultiplier,
  formatCalorieAdjustment,
} from "@/lib/macros";
import type { HeightUnit, Sex, UserProfile, WeightUnit } from "@/lib/types";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileSettings({
  profile,
  updateProfileAction,
}: {
  profile: UserProfile;
  updateProfileAction: (updates: Partial<UserProfile>) => void;
}) {
  const router = useRouter();
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [age, setAge] = useState(profile.age);
  const [weight, setWeight] = useState(profile.weight);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(profile.weightUnit);
  const [height, setHeight] = useState(profile.height);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(profile.heightUnit);
  const [activityMultiplier, setActivityMultiplier] = useState(
    profile.activityMultiplier,
  );
  const [calorieAdjustment, setCalorieAdjustment] = useState(
    profile.calorieAdjustment,
  );

  const handleSave = () => {
    updateProfileAction({
      sex,
      age,
      weight,
      weightUnit,
      height,
      heightUnit,
      activityMultiplier,
      calorieAdjustment,
    });
    router.push("/");
    toast.success(
      "Profile updated! Your macro targets have been recalculated.",
    );
  };

  // Preview new targets
  const previewProfile: UserProfile = {
    ...profile,
    sex,
    age,
    weight,
    weightUnit,
    height,
    heightUnit,
    activityMultiplier,
    calorieAdjustment,
  };
  const previewTargets = calculateMacroTargets(previewProfile);
  const previewTDEE = calculateTDEE(previewProfile);

  return (
    <div className="space-y-6">
      {/* Sex */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={sex === "male" ? "default" : "outline"}
          onClick={() => setSex("male")}
        >
          Male
        </Button>
        <Button
          type="button"
          variant={sex === "female" ? "default" : "outline"}
          onClick={() => setSex("female")}
        >
          Female
        </Button>
      </div>

      {/* Age */}
      <div className="space-y-1.5">
        <Label>Age</Label>
        <Input
          type="number"
          min={10}
          max={120}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>

      {/* Weight */}
      <div className="space-y-1.5">
        <Label>Weight</Label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={20}
            max={500}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1"
          />
          <Select
            value={weightUnit}
            onValueChange={(v) => setWeightUnit(v as WeightUnit)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Height */}
      <div className="space-y-1.5">
        <Label>Height</Label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={50}
            max={300}
            step={0.1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="flex-1"
          />
          <Select
            value={heightUnit}
            onValueChange={(v) => setHeightUnit(v as HeightUnit)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="ft">ft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Level Slider */}
      <div className="space-y-3">
        <Label>Activity Level</Label>
        <div className="px-1">
          <Slider
            value={[activityMultiplier]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setActivityMultiplier(Math.round(val * 100) / 100);
            }}
            min={1.2}
            max={1.9}
            step={0.05}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Sedentary</span>
          <span className="font-medium text-sm text-foreground">
            {activityMultiplier.toFixed(2)}x &middot;{" "}
            {formatActivityMultiplier(activityMultiplier)}
          </span>
          <span>Very Active</span>
        </div>
      </div>

      {/* Calorie Goal Slider */}
      <div className="space-y-3">
        <Label>Calorie Goal</Label>
        <div className="px-1">
          <Slider
            value={[calorieAdjustment]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setCalorieAdjustment(val);
            }}
            min={-750}
            max={500}
            step={50}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Deficit</span>
          <span className="font-medium text-sm text-foreground">
            {formatCalorieAdjustment(calorieAdjustment)}
          </span>
          <span>Surplus</span>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase">
          Updated Targets
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-orange-600 dark:text-orange-400">
              {previewTargets.calories}
            </div>
            <div className="text-[10px] text-muted-foreground">kcal</div>
          </div>
          <div>
            <div className="font-bold text-blue-600 dark:text-blue-400">
              {previewTargets.protein}g
            </div>
            <div className="text-[10px] text-muted-foreground">protein</div>
          </div>
          <div>
            <div className="font-bold text-green-600 dark:text-green-400">
              {previewTargets.carbs}g
            </div>
            <div className="text-[10px] text-muted-foreground">carbs</div>
          </div>
          <div>
            <div className="font-bold text-purple-600 dark:text-purple-400">
              {previewTargets.fat}g
            </div>
            <div className="text-[10px] text-muted-foreground">fat</div>
          </div>
        </div>
        <div className="text-center text-[10px] text-muted-foreground">
          TDEE: {previewTDEE} kcal/day
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Save Changes
      </Button>
    </div>
  );
}
