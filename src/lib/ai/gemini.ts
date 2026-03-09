import type { AIAnalysisResult } from "../types";
import { getAnalysisPrompt, getTextAnalysisPrompt } from "./prompts";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

function extractBase64(imageStr: string): { mimeType: string; data: string } {
  if (imageStr.startsWith("data:")) {
    const match = imageStr.match(/data:(.*?);base64,(.*)/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  }
  return { mimeType: "image/jpeg", data: imageStr };
}

export async function analyzeWithGemini(
  apiKey: string,
  model: string,
  images: string[],
  textPrompt?: string,
): Promise<AIAnalysisResult> {
  const parts: GeminiPart[] = [];

  // Build the text prompt
  if (textPrompt && images.length === 0) {
    parts.push({ text: getTextAnalysisPrompt(textPrompt) });
  } else {
    parts.push({ text: getAnalysisPrompt(textPrompt) });
  }

  // Attach images
  for (const img of images) {
    const { mimeType, data } = extractBase64(img);
    parts.push({ inlineData: { mimeType, data } });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1500,
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("No response content from Gemini");
  }

  return parseAIResponse(content);
}

function parseAIResponse(content: string): AIAnalysisResult {
  const jsonMatch =
    content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    content.match(/(\{[\s\S]*\})/);

  if (!jsonMatch?.[1]) {
    throw new Error("Could not parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[1].trim());

  if (!parsed.foods || !Array.isArray(parsed.foods)) {
    throw new Error("Invalid AI response structure: missing foods array");
  }

  return {
    foods: parsed.foods.map((food: Record<string, unknown>) => ({
      name: String(food.name || "Unknown food"),
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      servingSize: String(food.servingSize || food.serving_size || "1 serving"),
    })),
    confidence: parsed.confidence || "medium",
    notes: parsed.notes,
  };
}
