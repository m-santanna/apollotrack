"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportAllData, importAllData } from "@/lib/storage";
import { Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DataSettings() {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diet-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (importAllData(result)) {
          toast.success("Data imported successfully! Refreshing...");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Failed to import data. Invalid file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }

    // Clear all app data from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    toast.success("All data has been reset.");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={handleExport}>
          <Download className="w-5 h-5" />
          <span className="text-xs">Export Data</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1.5" onClick={handleImport}>
          <Upload className="w-5 h-5" />
          <span className="text-xs">Import Data</span>
        </Button>
      </div>

      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-destructive">Danger Zone</CardTitle>
          <CardDescription className="text-xs">
            This will permanently delete all your local data including profile, food logs, and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {confirmReset ? "Click again to confirm" : "Reset All Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
