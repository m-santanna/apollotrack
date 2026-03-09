"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLoggedDates, getDailyLog } from "@/lib/storage";
import { useProfile } from "@/hooks/use-profile";
import type { DailyLog } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";

export default function HistoryPage() {
  const { macroTargets } = useProfile();
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    const dates = getLoggedDates();
    const allLogs = dates.map((date) => getDailyLog(date)).filter((log) => log.entries.length > 0);
    setLogs(allLogs);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Today";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">History</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No food logs yet.</p>
            <p className="text-sm mt-1">Start tracking your meals to see your history here.</p>
          </div>
        ) : (
          logs.map((log) => {
            const caloriePercent = macroTargets
              ? Math.min((log.totals.calories / macroTargets.calories) * 100, 100)
              : 0;

            return (
              <Link key={log.date} href={`/?date=${log.date}`}>
                <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{formatDisplayDate(log.date)}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.entries.length} item{log.entries.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {Math.round(log.totals.calories)} kcal
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    {macroTargets && (
                      <div className="space-y-1">
                        <Progress value={caloriePercent} className="h-1.5" />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>
                            P {Math.round(log.totals.protein)}g &middot;
                            C {Math.round(log.totals.carbs)}g &middot;
                            F {Math.round(log.totals.fat)}g
                          </span>
                          <span>{Math.round(caloriePercent)}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </main>
    </div>
  );
}
