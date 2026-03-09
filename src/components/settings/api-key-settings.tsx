"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AIProvider } from "@/lib/types";
import { Eye, EyeOff, Key, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface KeyStatus {
  exists: boolean;
  keyPreview: string | null;
}

interface APIKeySettingsProps {
  onProviderChange?: (provider: AIProvider, action: "add" | "remove") => void;
}

export function APIKeySettings({ onProviderChange }: APIKeySettingsProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiStatus, setOpenaiStatus] = useState<KeyStatus>({
    exists: false,
    keyPreview: null,
  });
  const [geminiStatus, setGeminiStatus] = useState<KeyStatus>({
    exists: false,
    keyPreview: null,
  });
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchKeyStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      setOpenaiStatus(data.openai || { exists: false, keyPreview: null });
      setGeminiStatus(data.gemini || { exists: false, keyPreview: null });
    } catch {
      // Keys endpoint might not be available if Redis isn't configured
    }
  }, []);

  useEffect(() => {
    fetchKeyStatus();
  }, [fetchKeyStatus]);

  const saveKey = async (provider: AIProvider, key: string) => {
    if (!key.trim()) return;
    setLoading(provider);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: key.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save key");

      toast.success(
        `${provider === "openai" ? "OpenAI" : "Gemini"} API key saved!`,
      );

      if (provider === "openai") setOpenaiKey("");
      else setGeminiKey("");

      await fetchKeyStatus();
      onProviderChange?.(provider, "add");
    } catch {
      toast.error(
        "Failed to save API key. Check your connection and try again.",
      );
    } finally {
      setLoading(null);
    }
  };

  const deleteKey = async (provider: AIProvider) => {
    setLoading(provider);

    try {
      const res = await fetch("/api/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      if (!res.ok) throw new Error("Failed to delete key");

      toast.success(
        `${provider === "openai" ? "OpenAI" : "Gemini"} API key deleted.`,
      );
      await fetchKeyStatus();
      onProviderChange?.(provider, "remove");
    } catch {
      toast.error("Failed to delete API key.");
    } finally {
      setLoading(null);
    }
  };

  const renderKeySection = (
    provider: AIProvider,
    label: string,
    status: KeyStatus,
    value: string,
    setValue: (v: string) => void,
    showKey: boolean,
    setShowKey: (v: boolean) => void,
  ) => (
    <div className="space-y-3 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Key className="w-4 h-4" />
          {label}
        </Label>
        {status.exists && (
          <Badge variant="secondary" className="text-xs">
            Active {status.keyPreview}
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showKey ? "text" : "password"}
            placeholder={
              status.exists
                ? "Enter new key to replace..."
                : `Enter your ${label} key...`
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <Button
          size="icon"
          onClick={() => saveKey(provider, value)}
          disabled={!value.trim() || loading === provider}
        >
          {loading === provider ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </Button>
        {status.exists && (
          <Button
            size="icon"
            variant="outline"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => deleteKey(provider)}
            disabled={loading === provider}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {provider === "openai"
          ? "Get your API key from platform.openai.com."
          : "Get your API key from aistudio.google.com."}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your API keys are stored encrypted on our server and are never exposed
        to the browser. They are only used to make AI analysis requests on your
        behalf, and expire after 7 days of inactivity (meaning you will have to
        provide the key again later)
      </p>
      {renderKeySection(
        "openai",
        "OpenAI",
        openaiStatus,
        openaiKey,
        setOpenaiKey,
        showOpenai,
        setShowOpenai,
      )}
      {renderKeySection(
        "gemini",
        "Gemini",
        geminiStatus,
        geminiKey,
        setGeminiKey,
        showGemini,
        setShowGemini,
      )}
    </div>
  );
}
