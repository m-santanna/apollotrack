"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Key, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KeyStatus {
  exists: boolean;
  keyPreview: string | null;
}

export function APIKeySettings() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [openaiStatus, setOpenaiStatus] = useState<KeyStatus>({
    exists: false,
    keyPreview: null,
  });
  const [showOpenai, setShowOpenai] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchKeyStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      setOpenaiStatus(data.openai || { exists: false, keyPreview: null });
    } catch {
      // Keys endpoint might not be available if Redis isn't configured
    }
  }, []);

  useEffect(() => {
    fetchKeyStatus();
  }, [fetchKeyStatus]);

  const saveKey = async (key: string) => {
    if (!key.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "openai", apiKey: key.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save key");

      toast.success("OpenAI API key saved!");
      setOpenaiKey("");
      await fetchKeyStatus();
    } catch {
      toast.error("Failed to save API key. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteKey = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "openai" }),
      });

      if (!res.ok) throw new Error("Failed to delete key");

      toast.success("OpenAI API key deleted.");
      await fetchKeyStatus();
    } catch {
      toast.error("Failed to delete API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your API key is stored encrypted on our server and is never exposed to
        the browser. It is only used to make AI analysis requests on your
        behalf, and expires after 7 days of inactivity (meaning you will have
        to provide the key again later).
      </p>

      <div className="space-y-3 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Key className="w-4 h-4" />
            OpenAI
          </Label>
          {openaiStatus.exists && (
            <Badge variant="secondary" className="text-xs">
              Active {openaiStatus.keyPreview}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showOpenai ? "text" : "password"}
              placeholder={
                openaiStatus.exists
                  ? "Enter new key to replace..."
                  : "Enter your OpenAI key..."
              }
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="pr-9"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowOpenai(!showOpenai)}
            >
              {showOpenai ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <Button
            size="icon"
            onClick={() => saveKey(openaiKey)}
            disabled={!openaiKey.trim() || loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
          {openaiStatus.exists && (
            <Button
              size="icon"
              variant="outline"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={deleteKey}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Get your API key from platform.openai.com.
        </p>
      </div>
    </div>
  );
}
