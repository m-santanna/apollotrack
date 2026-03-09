"use client";

import { useMemo } from "react";
import type { MacroTargets } from "@/lib/types";

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
}

export function CalorieRing({
  consumed,
  target,
  size = 180,
}: CalorieRingProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const isOver = consumed > target;

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-700 ease-out ${
            isOver ? "text-destructive" : "text-orange-500"
          }`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`text-3xl font-bold ${isOver ? "text-destructive" : ""}`}
        >
          {consumed}
        </span>
        <span className="text-xs text-muted-foreground">of {target} kcal</span>
      </div>
    </div>
  );
}

interface MacroBarsProps {
  consumed: MacroTargets;
  targets: MacroTargets;
}

export function MacroBars({ consumed, targets }: MacroBarsProps) {
  const macros = useMemo(
    () => [
      {
        label: "Carbs",
        consumed: consumed.carbs,
        target: targets.carbs,
        unit: "g",
        color: "bg-green-500",
        bgColor: "bg-green-500/15",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "Protein",
        consumed: consumed.protein,
        target: targets.protein,
        unit: "g",
        color: "bg-blue-500",
        bgColor: "bg-blue-500/15",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Fat",
        consumed: consumed.fat,
        target: targets.fat,
        unit: "g",
        color: "bg-purple-500",
        bgColor: "bg-purple-500/15",
        textColor: "text-purple-600 dark:text-purple-400",
      },
    ],
    [consumed, targets],
  );

  return (
    <div className="space-y-4">
      {macros.map((macro) => {
        const percentage = Math.min((macro.consumed / macro.target) * 100, 100);
        const isOver = macro.consumed > macro.target;
        return (
          <div key={macro.label} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${macro.textColor}`}>
                {macro.label}
              </span>
              <span className="text-muted-foreground">
                <span
                  className={`font-semibold ${isOver ? "text-destructive" : "text-foreground"}`}
                >
                  {Math.round(macro.consumed)}
                </span>
                {" / "}
                {macro.target}
                {macro.unit}
              </span>
            </div>
            <div className={`h-2.5 rounded-full ${macro.bgColor}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOver ? "bg-destructive" : macro.color
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
