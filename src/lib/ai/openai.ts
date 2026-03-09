import type { AIAnalysisResult } from "../types";
import { getAnalysisPrompt, getTextAnalysisPrompt } from "./prompts";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail: "high" } };

export async function analyzeWithOpenAI(
  apiKey: string,
  model: string,
  images: string[],
  textPrompt?: string,
): Promise<AIAnalysisResult> {
  const parts: ContentPart[] = [];

  // Build the text prompt
  if (textPrompt && images.length === 0) {
    // Text-only analysis
    parts.push({ type: "text", text: getTextAnalysisPrompt(textPrompt) });
  } else {
    parts.push({ type: "text", text: getAnalysisPrompt(textPrompt) });
  }

  // Attach images
  for (const img of images) {
    const url = img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
    parts.push({
      type: "image_url",
      image_url: { url, detail: "high" },
    });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: parts }],
      max_tokens: 1500,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from OpenAI");
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
