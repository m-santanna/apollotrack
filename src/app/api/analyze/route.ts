import { NextRequest, NextResponse } from "next/server";
import { getAPIKey, refreshAPIKeyTTL } from "@/lib/redis";
import {
  getSessionFromRequest,
  createSessionToken,
  setSessionCookie,
} from "@/lib/session";
import { analyzeWithOpenAI } from "@/lib/ai/openai";
import { analyzeWithGemini } from "@/lib/ai/gemini";
import { MODEL_REGISTRY } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model: modelId, images, text } = body;

    // Validate: need a model and at least one input
    if (!modelId) {
      return NextResponse.json({ error: "model is required" }, { status: 400 });
    }

    const hasImages = Array.isArray(images) && images.length > 0;
    const hasText = typeof text === "string" && text.trim().length > 0;

    if (!hasImages && !hasText) {
      return NextResponse.json(
        { error: "At least one of images or text is required" },
        { status: 400 },
      );
    }

    // Look up model in registry to determine provider
    const modelEntry = MODEL_REGISTRY.find((m) => m.id === modelId);
    if (!modelEntry) {
      return NextResponse.json(
        { error: `Unknown model: ${modelId}` },
        { status: 400 },
      );
    }

    const { provider } = modelEntry;

    // Read the provider-specific session
    const sessionId = await getSessionFromRequest(provider);

    if (!sessionId) {
      return NextResponse.json(
        {
          error: `Unauthorized. Please add your ${provider === "openai" ? "OpenAI" : "Gemini"} API key in Settings first.`,
        },
        { status: 401 },
      );
    }

    // Retrieve API key from Redis using the provider-specific session
    const apiKey = await getAPIKey(sessionId, provider);
    if (!apiKey) {
      return NextResponse.json(
        {
          error: `No API key found for ${provider}. Please add your ${provider === "openai" ? "OpenAI" : "Gemini"} API key in Settings.`,
        },
        { status: 404 },
      );
    }

    // Call the appropriate AI provider
    const textStr = hasText ? text.trim() : undefined;
    const imageArr = hasImages ? images : [];

    let result;
    if (provider === "openai") {
      result = await analyzeWithOpenAI(apiKey, modelId, imageArr, textStr);
    } else {
      result = await analyzeWithGemini(apiKey, modelId, imageArr, textStr);
    }

    // Refresh TTL on successful analysis (Redis key + cookie)
    await refreshAPIKeyTTL(sessionId, provider);
    const token = await createSessionToken(sessionId, provider);
    const response = NextResponse.json(result);
    return setSessionCookie(response, token, provider);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("AI analysis error:", message);
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 },
    );
  }
}
