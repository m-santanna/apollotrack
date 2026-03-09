"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { useDailyLog } from "@/hooks/use-daily-log";
import { formatDate } from "@/lib/storage";
import { CalorieRing, MacroBars } from "@/components/dashboard/daily-summary";
import { MealList } from "@/components/dashboard/meal-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCalorieAdjustment } from "@/lib/macros";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  History,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { profile, macroTargets, isLoading } = useProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { log, removeEntry, updateEntry } = useDailyLog(selectedDate);

  useEffect(() => {
    if (!isLoading && (!profile || !profile.onboardingComplete)) {
      router.push("/onboarding");
    }
  }, [isLoading, profile, router]);

  if (isLoading || !profile || !macroTargets) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isToday = formatDate(selectedDate) === formatDate(new Date());
  const dateStr = formatDate(selectedDate);

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const displayDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <h1 className="text-lg font-bold">ApolloTrack</h1>
            <Badge variant="secondary" className="text-xs">
              {profile.calorieAdjustment === 0 && "Maintain"}
              {profile.calorieAdjustment < 0 && "Cut"}
              {profile.calorieAdjustment > 0 && "Bulk"}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/history">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <History className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-4">
        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {isToday ? "Today" : displayDate}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate(1)}
            disabled={isToday}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calorie Ring + Macros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <CalorieRing
                consumed={Math.round(log.totals.calories)}
                target={macroTargets.calories}
              />
              <div className="w-full">
                <MacroBars consumed={log.totals} targets={macroTargets} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Meals
            </h2>
          </div>
          <MealList
            entries={log.entries}
            onRemove={removeEntry}
            onEdit={updateEntry}
          />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link href={`/log?date=${dateStr}`}>
          <Button size="lg" className="rounded-full shadow-lg h-14 w-14">
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
