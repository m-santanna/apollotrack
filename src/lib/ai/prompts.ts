const JSON_FORMAT = `{
  "foods": [
    {
      "name": "Food item name",
      "calories": <number>,
      "protein": <number in grams>,
      "carbs": <number in grams>,
      "fat": <number in grams>,
      "servingSize": "estimated portion size"
    }
  ],
  "confidence": "high" | "medium" | "low",
  "notes": "Any relevant notes"
}`;

const BASE_PROMPT = `You are a nutrition analysis expert. Analyze the provided food information and return accurate macronutrient estimates.

Rules:
- Identify each distinct food item separately
- Estimate portion sizes based on visual cues or description
- If you see a nutrition label, extract the per-serving values
- All numeric values must be numbers, not strings
- Calories in kcal, macros in grams
- Round to whole numbers
- Return ONLY valid JSON in this exact format:

${JSON_FORMAT}`;

/**
 * Unified prompt for image-based analysis (meal photos, nutrition labels, or both).
 * Handles single or multiple images.
 */
export function getAnalysisPrompt(context?: string): string {
  let prompt = BASE_PROMPT;
  if (context) {
    prompt += `\n\nAdditional context from the user: "${context}"`;
  }
  return prompt;
}

/**
 * Prompt for text-only analysis (no images).
 * The user describes what they ate and AI estimates macros.
 */
export function getTextAnalysisPrompt(description: string): string {
  let prompt = `${BASE_PROMPT}\n\nThe user describes what they ate:\n"${description}"`;
  return prompt;
}
